#!/bin/bash
# Daily backup + rotation script for cron.
#
# Usage (manual):    bash db/scripts/backup-and-rotate.sh
# Usage (cron):      0 3 * * * /home/ubuntu/heuresys-evo/db/scripts/backup-and-rotate.sh >> /home/ubuntu/heuresys-evo-backup.log 2>&1
#
# Behavior:
#   - Sources <repo-root>/.env if present (for PGPASSWORD)
#   - Creates a pg_dump custom-format compressed backup with UTC timestamp
#   - Rotates: keeps the most recent N backups (default 7), deletes older ones
#   - Prints timestamped log lines (compatible with cron logging)
#
# Override defaults via env:
#   DB_HOST              (default: localhost)
#   DB_PORT              (default: 5432)
#   DB_USER              (default: heuresys)
#   DB_NAME              (default: heuresys_platform)
#   BACKUP_DIR           (default: <repo-root>/backups/local)
#   RETENTION_COUNT      (default: 7)

set -euo pipefail

# Resolve repo root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source .env if present (provides PGPASSWORD etc.)
if [ -f "$REPO_ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$REPO_ROOT/.env"
  set +a
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
# IMPORTANT: pg_dump must run as a role with BYPASSRLS to read tables protected
# by FORCE ROW LEVEL SECURITY. Use the dedicated 'heuresys_backup' role
# (created by setup-local.sh / setup-vm.sh / restore-baseline.sh).
DB_USER="${DB_USER:-heuresys_backup}"
DB_NAME="${DB_NAME:-heuresys_platform}"
BACKUP_DIR="${BACKUP_DIR:-$REPO_ROOT/backups/local}"
RETENTION_COUNT="${RETENTION_COUNT:-7}"

# IMPORTANT: pin pg_dump to the version matching the server (16). On Debian/Ubuntu
# /usr/bin/pg_dump is a `pg_wrapper` symlink that auto-selects the highest version
# installed. If both v16 and v18 are present, the wrapper picks v18 → produces a
# custom-format dump v1.16 which pg_restore v16 refuses with "unsupported version
# (1.16) in file header". Pinning to /usr/lib/postgresql/16/bin/pg_dump produces
# v1.15 dumps that any pg_restore >= 16 can read (forward compatible).
PG_DUMP="${PG_DUMP:-/usr/lib/postgresql/16/bin/pg_dump}"
[ ! -x "$PG_DUMP" ] && PG_DUMP="$(command -v pg_dump)"

export PGPASSWORD="${PGPASSWORD:-heuresys}"

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

log "backup-and-rotate START"
log "  target: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
log "  output: $OUT_FILE"
log "  retention: $RETENTION_COUNT most recent"

# === Backup ===
log "  pg_dump: $PG_DUMP ($($PG_DUMP --version 2>&1 | head -1))"
"$PG_DUMP" \
  --host="$DB_HOST" --port="$DB_PORT" --username="$DB_USER" --dbname="$DB_NAME" \
  --format=custom --compress=9 --no-owner --no-privileges \
  --file="$OUT_FILE"

SIZE=$(du -h "$OUT_FILE" | cut -f1)
log "backup OK — size: $SIZE"

# === Rotation: keep most recent N, delete older ===
TOTAL=$(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*.dump" -type f | wc -l)
log "rotation: $TOTAL backups present"

if [ "$TOTAL" -gt "$RETENTION_COUNT" ]; then
  TO_DELETE=$(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*.dump" -type f -printf "%T@ %p\n" \
              | sort -n \
              | head -n -"$RETENTION_COUNT" \
              | cut -d' ' -f2-)
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    log "  delete (rotated out): $(basename "$f")"
    rm -f "$f"
  done <<< "$TO_DELETE"
fi

# === OCI Object Storage upload (opt-in) ===
# Off-VM redundancy. Local rotation handles short-term retention; bucket lifecycle
# policy (30-day delete) handles long-term retention OCI-side.
# Disable per-run via OCI_UPLOAD_ENABLED=0 (e.g., manual test runs).

OCI_UPLOAD_ENABLED="${OCI_UPLOAD_ENABLED:-1}"
OCI_BUCKET="${OCI_BUCKET:-heuresys-evo-backups}"
OCI_NAMESPACE="${OCI_NAMESPACE:-axlkznzapaek}"
OCI_CLI="${OCI_CLI:-/home/ubuntu/.local/bin/oci}"

if [ "$OCI_UPLOAD_ENABLED" = "1" ]; then
  if [ ! -x "$OCI_CLI" ]; then
    log "WARN: OCI CLI not found at $OCI_CLI — skipping upload"
  else
    # Naming explicit to distinguish nightly safety snapshots from interactive
    # `evo-db push` objects in the bucket. NEVER promotes to latest.dump:
    # the SoT is the PC, this snapshot is just an off-site safety net.
    OBJECT_NAME="dump_vm_baremetal_cron_${TIMESTAMP}.dump"
    log "uploading to oci://${OCI_NAMESPACE}/${OCI_BUCKET}/${OBJECT_NAME} ..."
    if "$OCI_CLI" os object put \
        --namespace-name "$OCI_NAMESPACE" \
        --bucket-name "$OCI_BUCKET" \
        --file "$OUT_FILE" \
        --name "$OBJECT_NAME" \
        --force \
        > /tmp/oci-upload.log 2>&1; then
      log "upload OK (NOT promoted to latest.dump — interactive evo-db push owns SoT)"
    else
      log "WARN: OCI upload FAILED (see /tmp/oci-upload.log) — local backup still good"
      tail -5 /tmp/oci-upload.log | sed 's/^/  /' | while IFS= read -r line; do log "$line"; done
    fi
  fi

  # === OCI bucket rotation (client-side fallback, OFF by default) ===
  # Bucket rotation is normally handled by the native OCI lifecycle policy
  # `delete-after-30-days` (set up 2026-04-28 along with the IAM grant policy
  # `heuresys-evo-backups-lifecycle`). The block below is kept as an emergency
  # fallback that can be re-enabled with OCI_RETENTION_ENABLED=1 if the native
  # policy is ever disabled or revoked.
  OCI_RETENTION_DAYS="${OCI_RETENTION_DAYS:-30}"
  if [ -x "$OCI_CLI" ] && [ "${OCI_RETENTION_ENABLED:-0}" = "1" ]; then
    log "OCI rotation: pruning objects older than $OCI_RETENTION_DAYS days from bucket"
    CUTOFF_EPOCH=$(date -u -d "-${OCI_RETENTION_DAYS} days" +%s)
    PRUNED=0
    while IFS=$'\t' read -r OBJ_NAME OBJ_TIME; do
      [ -z "$OBJ_NAME" ] && continue
      # OBJ_TIME ISO8601 → epoch
      OBJ_EPOCH=$(date -u -d "$OBJ_TIME" +%s 2>/dev/null) || continue
      if [ "$OBJ_EPOCH" -lt "$CUTOFF_EPOCH" ]; then
        log "  delete (rotated out >$OCI_RETENTION_DAYS days): $OBJ_NAME"
        "$OCI_CLI" os object delete \
            --namespace-name "$OCI_NAMESPACE" \
            --bucket-name "$OCI_BUCKET" \
            --object-name "$OBJ_NAME" \
            --force >/dev/null 2>&1 && PRUNED=$((PRUNED+1)) || log "  WARN: delete failed for $OBJ_NAME"
      fi
    done < <("$OCI_CLI" os object list \
                --namespace-name "$OCI_NAMESPACE" \
                --bucket-name "$OCI_BUCKET" \
                --output json 2>/dev/null \
              | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
for o in d.get('data', []):
    print(f\"{o['name']}\t{o['time-created']}\")")
    log "OCI rotation: pruned $PRUNED object(s)"
  fi
else
  log "OCI upload disabled (OCI_UPLOAD_ENABLED=0)"
fi

log "backup-and-rotate DONE"
