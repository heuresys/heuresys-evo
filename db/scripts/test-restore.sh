#!/bin/bash
# Disaster recovery rehearsal: take a backup dump and restore it to a temporary
# scratch database, run smoke checks, then drop the scratch DB.
#
# Purpose: validate that backups produced by backup-and-rotate.sh are actually
# restorable, end-to-end, including pgvector indices and FORCE RLS objects.
# Non-destructive: never touches the live DB.
#
# Usage:
#   bash db/scripts/test-restore.sh                    # use latest dump in BACKUP_DIR
#   bash db/scripts/test-restore.sh /path/to/file.dump # use a specific dump
#
# Override defaults via env:
#   DB_HOST, DB_PORT (default: localhost:5432)
#   BACKUP_DIR       (default: <repo-root>/backups/local)
#   SCRATCH_DB_NAME  (default: heuresys_dr_test_<UTC-timestamp>)
#   PGPASSWORD       (postgres superuser password; default uses peer auth via sudo -u postgres)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-$REPO_ROOT/backups/local}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
SCRATCH_DB_NAME="${SCRATCH_DB_NAME:-heuresys_dr_test_$TIMESTAMP}"

# pgvector ivfflat indices on esco_skills.embedding_{en,it} need ≥66MB during
# rebuild. Postgres default maintenance_work_mem is 64MB → indices fail. Bump
# scratch DB to 256MB for safety (only affects this DB, not the whole cluster).
MAINTENANCE_WORK_MEM="${MAINTENANCE_WORK_MEM:-256MB}"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
fail() { log "FAIL: $*"; cleanup; exit 1; }

# Pick the pg_restore with highest version available locally. The custom-format
# dump file header is version-coupled to the pg_dump that produced it — a v16
# pg_restore cannot read a v18-produced 1.16 file. Highest pg_restore is forward
# compatible (reads any older dump version) → we always pick the highest.
find_best_pg_restore() {
  local best="" v latest=0
  for d in /usr/lib/postgresql/*/bin; do
    [ -x "$d/pg_restore" ] || continue
    v=$(echo "$d" | sed -n 's|.*/postgresql/\([0-9]*\)/bin|\1|p')
    [ -z "$v" ] && continue
    if [ "$v" -gt "$latest" ]; then latest=$v; best="$d/pg_restore"; fi
  done
  echo "$best"
}
PG_RESTORE_BIN="$(find_best_pg_restore)"
[ -z "$PG_RESTORE_BIN" ] && PG_RESTORE_BIN="$(command -v pg_restore)"

# pg_restore + admin DB ops need superuser. On VM/Linux use peer auth via sudo.
if [ "$(uname -s)" = "Linux" ] && command -v sudo >/dev/null 2>&1; then
  PSQL_SUPER="sudo -u postgres psql"
  PG_RESTORE_SUPER="sudo -u postgres $PG_RESTORE_BIN"
else
  # macOS / non-sudo: rely on libpq env (PGPASSWORD, PGUSER=postgres)
  PSQL_SUPER="psql -h $DB_HOST -p $DB_PORT -U postgres"
  PG_RESTORE_SUPER="$PG_RESTORE_BIN -h $DB_HOST -p $DB_PORT -U postgres"
fi

cleanup() {
  if [ -n "${SCRATCH_DB_NAME:-}" ]; then
    log "cleanup: dropping scratch DB '$SCRATCH_DB_NAME' (if it exists)"
    $PSQL_SUPER -c "DROP DATABASE IF EXISTS \"$SCRATCH_DB_NAME\";" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# === Resolve dump file ===
if [ "$#" -ge 1 ] && [ -n "$1" ]; then
  DUMP_FILE="$1"
else
  DUMP_FILE=$(find "$BACKUP_DIR" -maxdepth 1 -name "heuresys_platform_*.dump" -type f -size +0 -printf "%T@ %p\n" 2>/dev/null \
              | sort -n | tail -1 | cut -d' ' -f2-)
fi

[ -z "$DUMP_FILE" ] && fail "no dump file found (BACKUP_DIR=$BACKUP_DIR)"
[ ! -f "$DUMP_FILE" ] && fail "dump file does not exist: $DUMP_FILE"
[ ! -s "$DUMP_FILE" ] && fail "dump file is empty (0 bytes): $DUMP_FILE"

DUMP_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
DUMP_BASE=$(basename "$DUMP_FILE")
log "DR rehearsal START"
log "  dump:        $DUMP_FILE ($DUMP_SIZE)"
log "  scratch DB:  $SCRATCH_DB_NAME"
log "  pg_restore:  $PG_RESTORE_BIN ($($PG_RESTORE_BIN --version 2>&1 | head -1))"

# === Stage dump for postgres user (if needed) ===
# pg_restore as postgres needs read access. If dump is in /home/$USER/, copy to /tmp.
STAGED_DUMP="$DUMP_FILE"
if [ "$(uname -s)" = "Linux" ] && command -v sudo >/dev/null 2>&1; then
  if ! sudo -u postgres test -r "$DUMP_FILE" 2>/dev/null; then
    STAGED_DUMP="/tmp/dr-rehearsal-$TIMESTAMP.dump"
    log "  staging: copying dump to $STAGED_DUMP for postgres user readability"
    cp "$DUMP_FILE" "$STAGED_DUMP"
    sudo chown postgres:postgres "$STAGED_DUMP"
    # Cleanup must use sudo because the file is owned by postgres now.
    trap "cleanup; sudo rm -f '$STAGED_DUMP'" EXIT
  fi
fi

# === Create scratch DB ===
log "create: scratch DB '$SCRATCH_DB_NAME'"
$PSQL_SUPER -c "CREATE DATABASE \"$SCRATCH_DB_NAME\";" >/dev/null || fail "could not create scratch DB"

# Bump maintenance_work_mem on the scratch DB so ivfflat index rebuilds succeed.
log "tune: maintenance_work_mem = $MAINTENANCE_WORK_MEM (for ivfflat index rebuild)"
$PSQL_SUPER -c "ALTER DATABASE \"$SCRATCH_DB_NAME\" SET maintenance_work_mem = '$MAINTENANCE_WORK_MEM';" >/dev/null

# pgvector: enable as superuser before restore (dump tries to re-create extension, harmless warning)
log "extension: enabling pgvector in scratch DB"
$PSQL_SUPER -d "$SCRATCH_DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null

# === pg_restore ===
log "restore: pg_restore (this can take 1-2 minutes for ~370MB) ..."
RESTORE_LOG="/tmp/dr-restore-$TIMESTAMP.log"
START=$SECONDS
if $PG_RESTORE_SUPER \
    -d "$SCRATCH_DB_NAME" \
    --no-owner --no-privileges \
    -j 2 \
    "$STAGED_DUMP" >"$RESTORE_LOG" 2>&1; then
  ELAPSED=$((SECONDS - START))
  log "restore: OK (${ELAPSED}s)"
else
  ELAPSED=$((SECONDS - START))
  # pg_restore exits non-zero on warnings (e.g., "must be owner of extension vector")
  # which are benign. Differentiate by checking ERROR vs WARNING vs harmless.
  ERR_COUNT=$(grep -cE "^(pg_restore: )?error:" "$RESTORE_LOG" || true)
  IGNORE_COUNT=$(grep -cE "must be owner of extension|unrecognized configuration parameter \"transaction_timeout\"|already exists" "$RESTORE_LOG" || true)
  REAL_ERR=$((ERR_COUNT - IGNORE_COUNT))
  if [ "$REAL_ERR" -le 0 ]; then
    log "restore: OK with $IGNORE_COUNT benign warnings (${ELAPSED}s)"
  else
    log "restore log tail:"
    tail -20 "$RESTORE_LOG" | sed 's/^/  /'
    fail "pg_restore reported $REAL_ERR errors (see $RESTORE_LOG)"
  fi
fi

# === Smoke checks ===
log "smoke: validating restored DB"

run_check() {
  local label="$1"
  local sql="$2"
  local expected="$3"
  local actual
  actual=$($PSQL_SUPER -d "$SCRATCH_DB_NAME" -tAc "$sql" 2>/dev/null | tr -d '[:space:]')
  if [ "$expected" = "ANY_NONEMPTY" ]; then
    if [ -n "$actual" ] && [ "$actual" != "0" ]; then
      log "  ✓ $label: $actual"
      return 0
    else
      log "  ✗ $label: empty/zero (got '$actual')"
      return 1
    fi
  else
    if [ "$actual" = "$expected" ]; then
      log "  ✓ $label: $actual"
      return 0
    else
      log "  ✗ $label: expected '$expected' got '$actual'"
      return 1
    fi
  fi
}

FAILED=0
run_check "schema_migrations row count > 200"   "SELECT CASE WHEN COUNT(*) > 200 THEN 'ok' ELSE 'low:'||COUNT(*)::text END FROM schema_migrations;" "ok"        || FAILED=$((FAILED+1))
run_check "tenants table populated"             "SELECT COUNT(*) FROM tenants;"                                                                       "ANY_NONEMPTY" || FAILED=$((FAILED+1))
run_check "employees table populated"           "SELECT COUNT(*) FROM employees;"                                                                     "ANY_NONEMPTY" || FAILED=$((FAILED+1))
run_check "users table populated"               "SELECT COUNT(*) FROM users;"                                                                         "ANY_NONEMPTY" || FAILED=$((FAILED+1))
run_check "esco_skills table populated"         "SELECT COUNT(*) FROM esco_skills;"                                                                   "ANY_NONEMPTY" || FAILED=$((FAILED+1))
run_check "pgvector extension installed"        "SELECT extname FROM pg_extension WHERE extname='vector';"                                            "vector"    || FAILED=$((FAILED+1))
run_check "vector indices restored (esco)"      "SELECT CASE WHEN COUNT(*) > 0 THEN 'ok' ELSE 'none' END FROM pg_indexes WHERE tablename='esco_skills' AND indexdef ILIKE '%vector%';" "ok" || FAILED=$((FAILED+1))
run_check "RLS policies present (employees)"    "SELECT CASE WHEN COUNT(*) > 0 THEN 'ok' ELSE 'none' END FROM pg_policies WHERE tablename='employees';" "ok"      || FAILED=$((FAILED+1))
run_check "NextAuth tables present (account)"   "SELECT CASE WHEN COUNT(*) = 1 THEN 'ok' ELSE 'missing' END FROM pg_tables WHERE schemaname='public' AND tablename='account';" "ok" || FAILED=$((FAILED+1))

if [ "$FAILED" -eq 0 ]; then
  log ""
  log "✅ DR rehearsal PASS — backup is restorable, all smoke checks green"
  log "  dump:    $DUMP_BASE"
  log "  duration: ${ELAPSED}s"
  exit 0
else
  log ""
  log "❌ DR rehearsal FAIL — $FAILED smoke check(s) failed"
  log "  dump:    $DUMP_BASE"
  exit 2
fi
