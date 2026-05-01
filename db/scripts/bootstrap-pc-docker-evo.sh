#!/bin/bash
# LEGACY 2026-04-29 — superseded by db/scripts/db-pull.sh for refresh from bucket.
# This script remains as one-shot greenfield tool: use it ONLY when the
# heuresys_evo_db container does NOT yet exist (first-time install on a new PC).
# For any subsequent refresh of an existing container, prefer:
#   evo-db pull              (downloads latest.dump + restores)
# See db/README.md "Workflow OCI bucket-as-DB-git" for the new model.
#
# One-shot install of the .evo replica as a Docker container on the PC.
# Pulls the latest dump from the VM bare-metal leader and restores it into a
# pgvector/pgvector:pg16 container. After this script, the heuresys_evo_db
# container exists with a heuresys_platform DB pre-populated; subsequent
# weekly syncs run via sync-replicas-ephemeral.sh.
#
# Requires: Docker Desktop running, SSH key for VM, ~5GB free disk.
# Idempotent guard: refuses to overwrite an existing container without --recreate.
#
# Usage:
#   bash db/scripts/install-pc-docker-evo.sh
#   bash db/scripts/install-pc-docker-evo.sh --recreate    # drop existing container/volume and rebuild
#
# Override defaults via env (CONTAINER_NAME, IMAGE, VOLUME_NAME, HOST_PORT, etc.)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CONTAINER_NAME="${CONTAINER_NAME:-heuresys_evo_db}"
IMAGE="${IMAGE:-pgvector/pgvector:pg16}"
VOLUME_NAME="${VOLUME_NAME:-heuresys_evo_data}"
HOST_PORT="${HOST_PORT:-5432}"
DB_NAME="${DB_NAME:-heuresys_platform}"
DB_USER="${DB_USER:-heuresys}"
DB_PASSWORD="${DB_PASSWORD:-heuresys}"
BACKUP_USER="${BACKUP_USER:-heuresys_backup}"
BACKUP_PASSWORD="${BACKUP_PASSWORD:-heuresys}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/oci_recovery_ed25519}"
VM_HOST="${VM_HOST:-80.225.82.207}"
VM_USER="${VM_USER:-ubuntu}"
DOCKER_CONTEXT="${DOCKER_CONTEXT:-desktop-linux}"
MAINTENANCE_WORK_MEM="${MAINTENANCE_WORK_MEM:-256MB}"

RECREATE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --recreate) RECREATE=1; shift ;;
    -h|--help) sed -n '2,15p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

DOCKER="docker --context $DOCKER_CONTEXT"
log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
fail() { log "FAIL: $*"; exit 1; }

# === Pre-flight ===
log "pre-flight: Docker daemon"
$DOCKER info >/dev/null 2>&1 || fail "Docker daemon not reachable. Start Docker Desktop first."

log "pre-flight: container exists?"
if $DOCKER inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
  if [ "$RECREATE" = "1" ]; then
    log "  --recreate: dropping existing container + volume"
    $DOCKER rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    $DOCKER volume rm "$VOLUME_NAME" >/dev/null 2>&1 || true
  else
    fail "container '$CONTAINER_NAME' already exists. Use --recreate to drop and rebuild, or use sync-replicas-ephemeral.sh for incremental sync."
  fi
fi

# === Volume + container ===
log "step 1/8: creating volume $VOLUME_NAME"
$DOCKER volume create "$VOLUME_NAME" >/dev/null

log "step 2/8: creating container $CONTAINER_NAME (image $IMAGE, port $HOST_PORT, mwm=$MAINTENANCE_WORK_MEM)"
MSYS_NO_PATHCONV=1 $DOCKER run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "127.0.0.1:$HOST_PORT:5432" \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -v "$VOLUME_NAME:/var/lib/postgresql/data" \
  "$IMAGE" \
  -c "maintenance_work_mem=$MAINTENANCE_WORK_MEM" \
  >/dev/null || fail "docker run failed"

log "step 3/8: wait pg_isready (≤60s)"
for i in $(seq 1 60); do
  if $DOCKER exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" >/dev/null 2>&1; then
    log "  ready in ${i}s"; break
  fi
  sleep 1
done
$DOCKER exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" >/dev/null 2>&1 || fail "pg_isready timeout"

# === Roles ===
log "step 4/8: create $BACKUP_USER role + base GRANTs"
$DOCKER exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL || fail "role create failed"
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='$BACKUP_USER') THEN
    CREATE ROLE $BACKUP_USER WITH LOGIN PASSWORD '$BACKUP_PASSWORD' BYPASSRLS;
  END IF;
END \$\$;
GRANT CONNECT ON DATABASE $DB_NAME TO $BACKUP_USER;
SQL

# === Fetch latest dump from VM ===
log "step 5/8: fetch latest dump from VM"
LATEST_DUMP_BASENAME=$(ssh -n -i "$SSH_KEY" -o BatchMode=yes -o StrictHostKeyChecking=accept-new \
  "$VM_USER@$VM_HOST" 'ls -t ~/heuresys-evo/backups/local/heuresys_platform_*.dump 2>/dev/null | head -1 | xargs -n1 basename' \
  | tr -d '\r')
[ -z "$LATEST_DUMP_BASENAME" ] && fail "no dump found on VM ~/heuresys-evo/backups/local/"
log "  source: $LATEST_DUMP_BASENAME"

LOCAL_TMP="${TMPDIR:-/tmp}/$LATEST_DUMP_BASENAME"
log "  scp to $LOCAL_TMP"
scp -i "$SSH_KEY" -o BatchMode=yes -o StrictHostKeyChecking=accept-new \
  "$VM_USER@$VM_HOST:/home/$VM_USER/heuresys-evo/backups/local/$LATEST_DUMP_BASENAME" \
  "$LOCAL_TMP" || fail "scp failed"

DUMP_SIZE=$(du -h "$LOCAL_TMP" 2>/dev/null | cut -f1)
log "  fetched: $DUMP_SIZE"

# === Restore ===
# IMPORTANT (Git Bash on Windows): MSYS path translation rewrites "/tmp/..."
# to "C:/Users/.../Temp/..." when calling Win32 binaries (docker.exe). This
# breaks both the source (host path → wrong absolute) and the destination
# (container internal path → translated to host path). Two fixes needed:
#   1. cygpath -w on the host source (deterministic Windows path)
#   2. MSYS_NO_PATHCONV=1 to leave the in-container "/tmp/..." path alone
log "step 6/8: copy dump into container"
if command -v cygpath >/dev/null 2>&1; then
  LOCAL_TMP_HOSTSPEC="$(cygpath -w "$LOCAL_TMP")"
else
  LOCAL_TMP_HOSTSPEC="$LOCAL_TMP"
fi
MSYS_NO_PATHCONV=1 $DOCKER cp "$LOCAL_TMP_HOSTSPEC" "$CONTAINER_NAME:/tmp/dump.dump" \
  || fail "docker cp failed"

log "step 7/8: pg_restore (~2-3 min)"
START=$SECONDS
MSYS_NO_PATHCONV=1 $DOCKER exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
  pg_restore -U "$DB_USER" -d "$DB_NAME" --no-owner --no-privileges -j 2 /tmp/dump.dump >/tmp/pg_restore.log 2>&1
RC=$?
ELAPSED=$((SECONDS - START))

# pg_restore can return non-zero on benign warnings (extension already exists, etc.)
ERR_COUNT=$(grep -cE "^pg_restore: error:" /tmp/pg_restore.log 2>/dev/null || true)
IGNORE_COUNT=$(grep -cE "must be owner of extension|already exists|unrecognized configuration parameter \"transaction_timeout\"" /tmp/pg_restore.log 2>/dev/null || true)
REAL_ERR=$((ERR_COUNT - IGNORE_COUNT))
if [ "$REAL_ERR" -le 0 ]; then
  log "  restore OK (${ELAPSED}s, $IGNORE_COUNT benign warnings)"
else
  log "  restore log tail:"; tail -10 /tmp/pg_restore.log | sed 's/^/    /'
  fail "$REAL_ERR real error(s) during restore"
fi

# === Apply grants on all schemas (FOR ROLE clause = future-migration safe) ===
log "step 8/8: schema GRANTs (current + ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER)"
SCHEMAS=$($DOCKER exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -tAc \
  "SELECT nspname FROM pg_namespace WHERE nspname NOT IN ('pg_catalog','information_schema','pg_toast') AND nspname NOT LIKE 'pg_temp%' AND nspname NOT LIKE 'pg_toast_temp%';")
for SCHEMA in $SCHEMAS; do
  log "  GRANT on schema $SCHEMA"
  $DOCKER exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL >/dev/null
GRANT USAGE ON SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA "$SCHEMA" TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON TABLES TO $BACKUP_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA "$SCHEMA" GRANT SELECT ON SEQUENCES TO $BACKUP_USER;
SQL
done

# === Smoke checks ===
log "smoke: count key tables"
$DOCKER exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -tAc "
SELECT 'mig='||COUNT(*)||', max_v='||MAX(version)::text FROM schema_migrations
UNION ALL SELECT 'tenants='||COUNT(*) FROM tenants
UNION ALL SELECT 'employees='||COUNT(*) FROM employees
UNION ALL SELECT 'users='||COUNT(*) FROM users
UNION ALL SELECT 'esco_skills='||COUNT(*) FROM esco_skills;" 2>&1 | sed 's/^/  /'

# Cleanup local tmp
rm -f "$LOCAL_TMP"

log "DONE — replica .evo installed"
log "  container:      $CONTAINER_NAME (port localhost:$HOST_PORT)"
log "  volume:         $VOLUME_NAME"
log "  app role:       $DB_USER"
log "  backup role:    $BACKUP_USER"
log ""
log "Next steps:"
log "  1) registered as 'pc-docker-evo' replica in db/scripts/replicas.config.sh"
log "  2) weekly sync via Task Scheduler (Heuresys-Evo-Sync) → sync-replicas-ephemeral.sh"
log "  3) services/api-gateway and services/app .env DATABASE_URL already point to localhost:5432"
