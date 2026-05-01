#!/bin/bash
# Sourceable config + helpers for the bucket-as-DB-git workflow.
# Used by db-push.sh, db-pull.sh, db-status.sh, db-history.sh.
#
# Centralizes:
#   - OCI bucket coordinates
#   - OCI CLI binary autodetection (PC + VM)
#   - DBMS autodetection (pc-docker | vm-docker | vm-baremetal)
#   - pg_dump / pg_restore wrappers that handle MSYS path translation,
#     pg_dump v16 pinning (avoids Debian pg_wrapper picking v18 → format 1.16),
#     and Docker exec vs direct invocation
#   - read-only WD enforcement (WD #4 = ~/heuresys-evo on VM)
#   - oci_upload / oci_download / oci_promote_latest helpers

set -uo pipefail

# === OCI bucket coordinates ===
export OCI_BUCKET="${OCI_BUCKET:-heuresys-evo-backups}"
export OCI_NAMESPACE="${OCI_NAMESPACE:-axlkznzapaek}"

# === Autodetect OCI CLI binary ===
if [ -z "${OCI_CLI:-}" ]; then
  if [ -x "/home/ubuntu/.local/bin/oci" ]; then
    OCI_CLI="/home/ubuntu/.local/bin/oci"
  elif [ -x "/c/Users/enzospenuso/AppData/Roaming/Python/Python312/Scripts/oci" ]; then
    OCI_CLI="/c/Users/enzospenuso/AppData/Roaming/Python/Python312/Scripts/oci"
  elif command -v oci >/dev/null 2>&1; then
    OCI_CLI="$(command -v oci)"
  else
    OCI_CLI=""
  fi
fi
export OCI_CLI

# === Autodetect platform + DBMS local target ===
# Emits one of: pc-docker | vm-docker | vm-baremetal | unknown
detect_local_dbms() {
  local kernel
  kernel=$(uname -s 2>/dev/null || echo unknown)
  case "$kernel" in
    MINGW*|MSYS*|CYGWIN*)
      # PC Windows: target is the Docker container heuresys_evo_db
      echo "pc-docker"
      ;;
    Linux)
      # VM: detect by working directory and bare-metal Postgres presence
      local pwd_real
      pwd_real="$(pwd -P)"
      if [[ "$pwd_real" == /home/ubuntu/heuresys.com.evo* ]]; then
        echo "vm-docker"
      elif [[ "$pwd_real" == /home/ubuntu/heuresys-evo* ]]; then
        echo "vm-baremetal"
      elif compgen -G "/etc/postgresql/*" >/dev/null 2>&1; then
        # bare-metal Postgres present anywhere on Linux → assume bare-metal target
        echo "vm-baremetal"
      else
        echo "vm-docker"
      fi
      ;;
    *) echo "unknown" ;;
  esac
}

# === Read-only WD enforcement ===
# WD #4 (/home/ubuntu/heuresys-evo) is read-only by design: it can pull but
# never push. This protects against accidental push from the VM bare-metal repo.
is_readonly_wd() {
  local pwd_real
  pwd_real="$(pwd -P)"
  if [[ "$pwd_real" == /home/ubuntu/heuresys-evo* ]]; then
    return 0  # is read-only
  fi
  return 1  # not read-only
}

# === pg_dump / pg_restore / psql wrappers ===
# Each adapter takes a target DBMS string and the args to pass to the underlying
# command. They handle:
#   - MSYS_NO_PATHCONV=1 to disable Git Bash path rewriting
#   - pg_dump v16 pinning to match server version (avoid Debian wrapper v18)
#   - Docker exec vs direct invocation
#
# Example: pg_dump_target "pc-docker" -U heuresys_backup -d heuresys_platform --format=custom > out.dump

# Pin to pg16 binaries explicitly when available (works in both VM bare-metal and pgvector/pg16 containers)
PG_BIN_DIR_VM="${PG_BIN_DIR_VM:-/usr/lib/postgresql/16/bin}"
PG_BIN_DIR_DOCKER="${PG_BIN_DIR_DOCKER:-/usr/lib/postgresql/16/bin}"

CONTAINER_NAME_PC="${CONTAINER_NAME_PC:-heuresys_evo_db}"
CONTAINER_NAME_VM_DOCKER="${CONTAINER_NAME_VM_DOCKER:-heuresys_evo_platform_db}"
DB_USER_DEFAULT="${DB_USER_DEFAULT:-heuresys}"
DB_BACKUP_USER="${DB_BACKUP_USER:-heuresys_backup}"
DB_NAME_DEFAULT="${DB_NAME_DEFAULT:-heuresys_platform}"
DB_PASSWORD_DEFAULT="${DB_PASSWORD_DEFAULT:-heuresys}"
SSH_HOST_VM="${SSH_HOST_VM:-80.225.82.207}"
SSH_USER_VM="${SSH_USER_VM:-ubuntu}"
SSH_KEY_VM="${SSH_KEY_VM:-$HOME/.ssh/oci_recovery_ed25519}"

# Run pg_dump against a target DBMS, write to stdout.
# Args: <target> <pg_dump-args...>
# Note: on PC uses heuresys_backup (BYPASSRLS), but on VM 5433 pg_hba.conf only
# allows heuresys → forced to heuresys for vm-docker.
pg_dump_target() {
  local target="$1"; shift
  case "$target" in
    pc-docker)
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        "$PG_BIN_DIR_DOCKER/pg_dump" -U "$DB_BACKUP_USER" -d "$DB_NAME_DEFAULT" "$@"
      ;;
    vm-docker)
      ssh -n -i "$SSH_KEY_VM" -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$SSH_USER_VM@$SSH_HOST_VM" \
        "docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER pg_dump -U $DB_USER_DEFAULT -d $DB_NAME_DEFAULT $*"
      ;;
    vm-baremetal)
      "$PG_BIN_DIR_VM/pg_dump" \
        -h localhost -p 5432 -U "$DB_BACKUP_USER" -d "$DB_NAME_DEFAULT" "$@"
      ;;
    *) echo "ERROR: unknown target '$target'" >&2; return 2 ;;
  esac
}

# Run psql query against a target DBMS, return stdout.
# Args: <target> <sql>
psql_target() {
  local target="$1"; shift
  local sql="$1"; shift || true
  case "$target" in
    pc-docker)
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        psql -U "$DB_USER_DEFAULT" -d "$DB_NAME_DEFAULT" -tAc "$sql"
      ;;
    vm-docker)
      ssh -n -i "$SSH_KEY_VM" -o BatchMode=yes "$SSH_USER_VM@$SSH_HOST_VM" \
        "docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER psql -U $DB_USER_DEFAULT -d $DB_NAME_DEFAULT -tAc \"$sql\""
      ;;
    vm-baremetal)
      PGPASSWORD="$DB_PASSWORD_DEFAULT" psql \
        -h localhost -p 5432 -U "$DB_USER_DEFAULT" -d "$DB_NAME_DEFAULT" -tAc "$sql"
      ;;
    *) echo "ERROR: unknown target '$target'" >&2; return 2 ;;
  esac
}

# Run pg_restore on a target DBMS.
# Args: <target> <local-dump-file> [extra pg_restore args...]
pg_restore_target() {
  local target="$1"; shift
  local local_dump="$1"; shift
  case "$target" in
    pc-docker)
      local dump_win
      dump_win="$(cygpath -w "$local_dump" 2>/dev/null || echo "$local_dump")"
      MSYS_NO_PATHCONV=1 docker cp "$dump_win" "$CONTAINER_NAME_PC:/tmp/restore.dump"
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        pg_restore -U "$DB_USER_DEFAULT" -d "$DB_NAME_DEFAULT" --no-owner --no-privileges -j 2 "$@" /tmp/restore.dump
      ;;
    vm-docker)
      scp -i "$SSH_KEY_VM" -o BatchMode=yes "$local_dump" "$SSH_USER_VM@$SSH_HOST_VM:/tmp/restore.dump"
      ssh -n -i "$SSH_KEY_VM" -o BatchMode=yes "$SSH_USER_VM@$SSH_HOST_VM" \
        "docker cp /tmp/restore.dump $CONTAINER_NAME_VM_DOCKER:/tmp/restore.dump && \
         docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER pg_restore -U $DB_USER_DEFAULT -d $DB_NAME_DEFAULT --no-owner --no-privileges -j 2 $* /tmp/restore.dump"
      ;;
    vm-baremetal)
      sudo -u postgres "$PG_BIN_DIR_VM/pg_restore" \
        -d "$DB_NAME_DEFAULT" --no-owner --no-privileges -j 2 "$@" "$local_dump"
      ;;
    *) echo "ERROR: unknown target '$target'" >&2; return 2 ;;
  esac
}

# Drop + create the target database (used before pg_restore for clean replace).
# Caller is responsible for stopping any sessions on the target first.
db_drop_create_target() {
  local target="$1"
  case "$target" in
    pc-docker)
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        psql -U "$DB_USER_DEFAULT" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME_DEFAULT' AND pid<>pg_backend_pid();" >/dev/null 2>&1 || true
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        psql -U "$DB_USER_DEFAULT" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME_DEFAULT;"
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        psql -U "$DB_USER_DEFAULT" -d postgres -c "CREATE DATABASE $DB_NAME_DEFAULT;"
      MSYS_NO_PATHCONV=1 docker exec -e PGPASSWORD="$DB_PASSWORD_DEFAULT" "$CONTAINER_NAME_PC" \
        psql -U "$DB_USER_DEFAULT" -d "$DB_NAME_DEFAULT" -c "ALTER DATABASE $DB_NAME_DEFAULT SET maintenance_work_mem='256MB'; CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null
      ;;
    vm-docker)
      ssh -n -i "$SSH_KEY_VM" -o BatchMode=yes "$SSH_USER_VM@$SSH_HOST_VM" "
        docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER psql -U $DB_USER_DEFAULT -d postgres -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME_DEFAULT' AND pid<>pg_backend_pid();\" >/dev/null 2>&1 || true
        docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER psql -U $DB_USER_DEFAULT -d postgres -c \"DROP DATABASE IF EXISTS $DB_NAME_DEFAULT;\"
        docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER psql -U $DB_USER_DEFAULT -d postgres -c \"CREATE DATABASE $DB_NAME_DEFAULT;\"
        docker exec -e PGPASSWORD=$DB_PASSWORD_DEFAULT $CONTAINER_NAME_VM_DOCKER psql -U $DB_USER_DEFAULT -d $DB_NAME_DEFAULT -c \"ALTER DATABASE $DB_NAME_DEFAULT SET maintenance_work_mem='256MB'; CREATE EXTENSION IF NOT EXISTS vector;\" >/dev/null
      "
      ;;
    vm-baremetal)
      sudo -u postgres psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME_DEFAULT' AND pid<>pg_backend_pid();" >/dev/null 2>&1 || true
      sudo -u postgres psql -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME_DEFAULT;"
      sudo -u postgres psql -d postgres -c "CREATE DATABASE $DB_NAME_DEFAULT OWNER $DB_USER_DEFAULT;"
      sudo -u postgres psql -d "$DB_NAME_DEFAULT" -c "ALTER DATABASE $DB_NAME_DEFAULT SET maintenance_work_mem='256MB'; CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null
      ;;
    *) echo "ERROR: unknown target '$target'" >&2; return 2 ;;
  esac
}

# Reapply grants on a freshly restored DBMS (heuresys_backup, optionally heuresys_app).
# Args: <target>
db_reapply_grants() {
  local target="$1"
  local sql="
    DO \$\$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='$DB_BACKUP_USER') THEN
        CREATE ROLE $DB_BACKUP_USER WITH LOGIN PASSWORD '$DB_PASSWORD_DEFAULT' BYPASSRLS;
      END IF;
    END \$\$;
    GRANT CONNECT ON DATABASE $DB_NAME_DEFAULT TO $DB_BACKUP_USER;
  "
  for SCHEMA in public analytics learning; do
    sql="$sql
      GRANT USAGE ON SCHEMA $SCHEMA TO $DB_BACKUP_USER;
      GRANT SELECT ON ALL TABLES IN SCHEMA $SCHEMA TO $DB_BACKUP_USER;
      GRANT SELECT ON ALL SEQUENCES IN SCHEMA $SCHEMA TO $DB_BACKUP_USER;
      ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER_DEFAULT IN SCHEMA $SCHEMA GRANT SELECT ON TABLES TO $DB_BACKUP_USER;
      ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER_DEFAULT IN SCHEMA $SCHEMA GRANT SELECT ON SEQUENCES TO $DB_BACKUP_USER;
    "
  done
  psql_target "$target" "$sql" >/dev/null
}

# === OCI helpers ===
oci_upload() {
  local local_file="$1"; local object_name="$2"
  [ -z "$OCI_CLI" ] && { echo "ERROR: OCI CLI not found" >&2; return 2; }
  "$OCI_CLI" os object put \
    --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" \
    --file "$local_file" --name "$object_name" --force
}

oci_download() {
  local object_name="$1"; local local_file="$2"
  [ -z "$OCI_CLI" ] && { echo "ERROR: OCI CLI not found" >&2; return 2; }
  "$OCI_CLI" os object get \
    --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" \
    --name "$object_name" --file "$local_file"
}

# Returns the time-modified ISO8601 string of an object.
oci_object_modified() {
  local object_name="$1"
  [ -z "$OCI_CLI" ] && return 2
  "$OCI_CLI" os object head \
    --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" \
    --name "$object_name" 2>/dev/null \
    | python -c "import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('last-modified',''))
except Exception:
    pass"
}

# Promote a timestamped object as latest.dump by re-upload (object copy has CLI bug).
oci_promote_latest() {
  local source_object="$1"; local local_file="$2"
  [ -z "$OCI_CLI" ] && return 2
  "$OCI_CLI" os object put \
    --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" \
    --file "$local_file" --name "latest.dump" --force >/dev/null
}

# === Logging ===
log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
fail() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] FAIL: $*" >&2; exit 1; }
