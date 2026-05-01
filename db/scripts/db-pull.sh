#!/bin/bash
# db-pull.sh — bucket-as-DB-git: download latest.dump from OCI + restore into local DBMS
#
# Usage:
#   bash db/scripts/db-pull.sh                       # pull latest.dump + restore
#   bash db/scripts/db-pull.sh --object-name NAME    # pull specific object
#   bash db/scripts/db-pull.sh --dry-run             # download + verify, no restore
#   bash db/scripts/db-pull.sh --no-safety           # skip pre-restore safety dump (NOT recommended)
#
# Safety net: before restoring, the script takes a snapshot of the current local
# DBMS state in backups/local/safety_<source>_<TS>.dump (rotating, keep 3).

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
. "$SCRIPT_DIR/oci-config.sh"

OBJECT_NAME="latest.dump"
DRY_RUN=0
NO_SAFETY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --object-name)  OBJECT_NAME="$2"; shift 2 ;;
    --dry-run)      DRY_RUN=1; shift ;;
    --no-safety)    NO_SAFETY=1; shift ;;
    -h|--help)
      sed -n '2,15p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

TARGET="$(detect_local_dbms)"
[ "$TARGET" = "unknown" ] && fail "could not detect local DBMS target"
log "pull START — target=$TARGET object=$OBJECT_NAME"

# === Pre-flight: OCI CLI ===
[ -z "$OCI_CLI" ] && fail "OCI CLI not found. Install via 'pip install --user oci-cli' on this machine."

# === Download ===
TS="$(date -u +%Y%m%dT%H%M%SZ)"
PULL_DUMP="$REPO_ROOT/backups/local/pulled_${OBJECT_NAME%.dump}_${TS}.dump"
mkdir -p "$REPO_ROOT/backups/local"

log "  download oci://${OCI_NAMESPACE}/${OCI_BUCKET}/${OBJECT_NAME} → $PULL_DUMP"
oci_download "$OBJECT_NAME" "$PULL_DUMP" >/dev/null 2>&1 || fail "OCI download failed"

PULL_SIZE=$(du -h "$PULL_DUMP" | cut -f1)
PULL_BYTES=$(stat -c%s "$PULL_DUMP" 2>/dev/null || stat -f%z "$PULL_DUMP" 2>/dev/null)
log "  download OK ($PULL_SIZE)"

# Smoke check
[ "$PULL_BYTES" -lt 52428800 ] && fail "downloaded dump too small ($PULL_SIZE) — likely corrupted"
HEAD_MAGIC=$(head -c 5 "$PULL_DUMP")
[ "$HEAD_MAGIC" != "PGDMP" ] && fail "dump file does not start with PGDMP magic (found '$HEAD_MAGIC')"

# === Dry-run exit ===
if [ "$DRY_RUN" = "1" ]; then
  log "  --dry-run: skip restore"
  log "DONE (dry-run)"
  exit 0
fi

# === Pre-restore safety dump ===
if [ "$NO_SAFETY" != "1" ]; then
  SAFETY_DUMP="$REPO_ROOT/backups/local/safety_${TARGET}_${TS}.dump"
  log "  safety net: snapshotting current local DBMS → $SAFETY_DUMP"
  if pg_dump_target "$TARGET" --format=custom --compress=9 --no-owner --no-privileges > "$SAFETY_DUMP" 2>/dev/null; then
    SAFETY_BYTES=$(stat -c%s "$SAFETY_DUMP" 2>/dev/null || stat -f%z "$SAFETY_DUMP" 2>/dev/null)
    log "  safety dump: $(du -h "$SAFETY_DUMP" | cut -f1) ($SAFETY_BYTES bytes)"
  else
    log "  ⚠️  safety dump failed (DBMS may be empty or inaccessible — proceed anyway)"
    rm -f "$SAFETY_DUMP"
  fi
  # Rotate safety dumps: keep 3 most recent
  TOTAL=$(find "$REPO_ROOT/backups/local" -maxdepth 1 -name "safety_*.dump" -type f | wc -l)
  if [ "$TOTAL" -gt 3 ]; then
    TO_DELETE=$(find "$REPO_ROOT/backups/local" -maxdepth 1 -name "safety_*.dump" -type f -printf "%T@ %p\n" | sort -n | head -n -3 | cut -d' ' -f2-)
    while IFS= read -r f; do [ -z "$f" ] && continue; rm -f "$f"; done <<< "$TO_DELETE"
  fi
fi

# === Drop+create + restore ===
log "  drop+create database (clean slate)"
db_drop_create_target "$TARGET"

log "  pg_restore (~2-3 min for ~370MB)"
START=$SECONDS
pg_restore_target "$TARGET" "$PULL_DUMP" 2>/tmp/pg_restore.log
RC=$?
ELAPSED=$((SECONDS - START))

ERR_COUNT=$(grep -cE "^pg_restore: error:" /tmp/pg_restore.log 2>/dev/null || echo 0)
IGNORE_COUNT=$(grep -cE "must be owner|already exists|transaction_timeout|duplicate key|multiple primary keys" /tmp/pg_restore.log 2>/dev/null || echo 0)
ERR_INT=$(echo "$ERR_COUNT" | tr -d '[:space:]')
IGN_INT=$(echo "$IGNORE_COUNT" | tr -d '[:space:]')
REAL_ERR=$(( ${ERR_INT:-0} - ${IGN_INT:-0} ))

if [ "$REAL_ERR" -le 0 ]; then
  log "  restore OK (${ELAPSED}s, $IGN_INT benign warnings)"
else
  log "  restore log tail:"; tail -10 /tmp/pg_restore.log | sed 's/^/    /'
  log "  ⚠️  $REAL_ERR potentially-real errors (often spurious from -j parallelism). Verifying via smoke checks below."
fi

# === Reapply grants ===
log "  reapply grants for $DB_BACKUP_USER"
db_reapply_grants "$TARGET"

# === Smoke checks post-restore ===
log "  smoke checks"
MIG=$(psql_target "$TARGET" "SELECT MAX(version) FROM schema_migrations;" 2>/dev/null | tr -d '[:space:]\r')
COUNT_TENANTS=$(psql_target "$TARGET" "SELECT COUNT(*) FROM tenants;" 2>/dev/null | tr -d '[:space:]\r')
COUNT_EMPLOYEES=$(psql_target "$TARGET" "SELECT COUNT(*) FROM employees;" 2>/dev/null | tr -d '[:space:]\r')
HAS_NEXTAUTH=$(psql_target "$TARGET" "SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='account') THEN 'yes' ELSE 'no' END;" 2>/dev/null | tr -d '[:space:]\r')

log "    schema_migrations.MAX(version) = $MIG"
log "    tenants count = $COUNT_TENANTS"
log "    employees count = $COUNT_EMPLOYEES"
log "    NextAuth account table = $HAS_NEXTAUTH"

PASS=1
[ "$MIG" != "222_nextauth_tables" ] && { log "    ❌ unexpected mig version"; PASS=0; }
[ -z "$COUNT_EMPLOYEES" ] || [ "$COUNT_EMPLOYEES" -lt 1 ] && { log "    ❌ employees empty"; PASS=0; }
[ "$HAS_NEXTAUTH" != "yes" ] && { log "    ❌ NextAuth missing"; PASS=0; }

# === Update stamp ===
NEW_STAMP="$(oci_object_modified "$OBJECT_NAME")"
STAMP_FILE="$REPO_ROOT/db/.last-pull-stamp"
echo "$NEW_STAMP" > "$STAMP_FILE"
log "  .last-pull-stamp updated to $NEW_STAMP"

if [ "$PASS" = "1" ]; then
  log "pull DONE — ✅ all smoke checks green"
  exit 0
else
  log "pull DONE — ❌ smoke checks failed (see above)"
  exit 1
fi
