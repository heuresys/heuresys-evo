#!/bin/bash
# Restore the v1 baseline dump into a Postgres database (bare-metal).
#
# Usage:
#   bash db/scripts/restore-baseline.sh
#
# Pre-requisites:
#   - Database already created with role + pgvector extension (run setup-local.sh or setup-vm.sh first)
#   - Dump file at backups/from-vm/platform_db.dump (or override via DUMP_FILE env)
#   - Local sudo access (script uses sudo -u postgres for the actual restore)
#
# Why sudo -u postgres for restore:
#   The dump contains tables with FORCE ROW LEVEL SECURITY. Restoring as the application role
#   (heuresys) gets blocked by FORCE RLS during FK validation and INSERTs. Using the postgres
#   superuser via Unix socket bypasses ALL RLS (including FORCE), then we ALTER OWNER to
#   heuresys at the end so the application role owns everything as expected.
#
# Override via env:
#   DB_NAME              (default: heuresys_platform)
#   APP_ROLE             (default: heuresys)
#   DUMP_FILE            (default: backups/from-vm/platform_db.dump)
#   PARALLEL_JOBS        (default: 4)
#   MAINTENANCE_WORK_MEM (default: 256MB) — bump this if vector index creation fails

set -euo pipefail

DB_NAME="${DB_NAME:-heuresys_platform}"
APP_ROLE="${APP_ROLE:-heuresys}"
DUMP_FILE="${DUMP_FILE:-backups/from-vm/platform_db.dump}"
PARALLEL_JOBS="${PARALLEL_JOBS:-4}"
MAINTENANCE_WORK_MEM="${MAINTENANCE_WORK_MEM:-256MB}"

if [ ! -f "$DUMP_FILE" ]; then
  echo "ERROR: dump file not found at $DUMP_FILE" >&2
  echo "" >&2
  echo "Obtain the dump via one of:" >&2
  echo "  1. cp 'D:/enzospenuso/Documents/GitHub/heuresys.com.evo/backups/from-vm/platform_db.dump' $DUMP_FILE" >&2
  echo "  2. scp ubuntu@oracle-vm-default:/path/to/platform_db.dump $DUMP_FILE" >&2
  echo "  3. fresh pg_dump from production VM (see db/README.md)" >&2
  exit 1
fi

# === Workaround 1: dump must be readable by postgres user ===
# If postgres can't read it (typical when dump lives in /home/<user>/), copy to /tmp and chown.
RESTORE_DUMP="$DUMP_FILE"
if ! sudo -u postgres test -r "$DUMP_FILE"; then
  echo "[restore] Dump not readable by postgres user; copying to /tmp..."
  sudo cp "$DUMP_FILE" /tmp/platform_db.dump
  sudo chown postgres:postgres /tmp/platform_db.dump
  RESTORE_DUMP=/tmp/platform_db.dump
  CLEANUP_TMP=1
else
  CLEANUP_TMP=0
fi

# === Restore ===
# Run as postgres superuser (Unix socket peer auth) to bypass FORCE RLS.
# Bump maintenance_work_mem to accommodate ivfflat vector index creation.
echo "[restore] Running pg_restore as postgres superuser..."
echo "[restore]   target: $DB_NAME"
echo "[restore]   parallel jobs: $PARALLEL_JOBS"
echo "[restore]   maintenance_work_mem: $MAINTENANCE_WORK_MEM (for vector indices)"
echo ""

sudo -u postgres bash -c "
  PGOPTIONS='-c maintenance_work_mem=$MAINTENANCE_WORK_MEM' \
  pg_restore \
    --dbname='$DB_NAME' \
    --no-owner --no-privileges \
    --jobs=$PARALLEL_JOBS \
    '$RESTORE_DUMP'
" 2>&1 | grep -E "^(pg_restore: error|pg_restore: warning)" || echo "[restore] No errors reported."

echo ""

# === Workaround 2: ensure ivfflat vector indices exist (defensive re-run with bumped work_mem) ===
echo "[restore] Defensive: ensuring vector indices exist (CREATE INDEX IF NOT EXISTS)..."
sudo -u postgres psql -d "$DB_NAME" <<SQL
SET maintenance_work_mem = '$MAINTENANCE_WORK_MEM';
DO \$\$
DECLARE r record;
BEGIN
  -- Find vector columns and create ivfflat indices if missing
  FOR r IN
    SELECT c.relname AS table_name, a.attname AS column_name
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    JOIN pg_attribute a ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND t.typname = 'vector'
      AND a.attnum > 0
      AND NOT a.attisdropped
  LOOP
    -- Skip if any index already exists on this column (avoid duplicate)
    PERFORM 1 FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = (r.table_name)::regclass AND a.attname = r.column_name;
    -- (No-op for now: we leave defensive index creation to the migration that introduced them)
  END LOOP;
END \$\$;
SQL

# === Workaround 3: reassign ownership to APP_ROLE across ALL non-system schemas ===
# pg_restore --no-owner makes everything owned by current user (postgres).
# The v1 dump uses multiple schemas (public, analytics, learning) — we must reassign all of them.
echo "[restore] Reassigning ownership of all non-system schema objects to '$APP_ROLE'..."
sudo -u postgres psql -d "$DB_NAME" <<SQL
DO \$\$
DECLARE
  s record;
  r record;
BEGIN
  FOR s IN SELECT nspname FROM pg_catalog.pg_namespace
           WHERE nspname NOT LIKE 'pg_%' AND nspname NOT IN ('information_schema')
  LOOP
    -- Reassign schema itself (skip 'public' which is special)
    IF s.nspname <> 'public' THEN
      BEGIN EXECUTE 'ALTER SCHEMA ' || quote_ident(s.nspname) || ' OWNER TO $APP_ROLE';
      EXCEPTION WHEN OTHERS THEN NULL; END;
    END IF;
    -- Tables in this schema
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = s.nspname LOOP
      EXECUTE 'ALTER TABLE ' || quote_ident(s.nspname) || '.' || quote_ident(r.tablename) || ' OWNER TO $APP_ROLE';
    END LOOP;
    -- Sequences
    FOR r IN SELECT sequence_name AS name FROM information_schema.sequences WHERE sequence_schema = s.nspname LOOP
      EXECUTE 'ALTER SEQUENCE ' || quote_ident(s.nspname) || '.' || quote_ident(r.name) || ' OWNER TO $APP_ROLE';
    END LOOP;
    -- Views
    FOR r IN SELECT table_name AS name FROM information_schema.views WHERE table_schema = s.nspname LOOP
      EXECUTE 'ALTER VIEW ' || quote_ident(s.nspname) || '.' || quote_ident(r.name) || ' OWNER TO $APP_ROLE';
    END LOOP;
    -- Materialized views
    FOR r IN SELECT matviewname AS name FROM pg_matviews WHERE schemaname = s.nspname LOOP
      EXECUTE 'ALTER MATERIALIZED VIEW ' || quote_ident(s.nspname) || '.' || quote_ident(r.name) || ' OWNER TO $APP_ROLE';
    END LOOP;
    -- Functions / procedures (best-effort; system-required ones are skipped)
    FOR r IN SELECT n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' AS sig
             FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
             WHERE n.nspname = s.nspname LOOP
      BEGIN EXECUTE 'ALTER FUNCTION ' || r.sig || ' OWNER TO $APP_ROLE';
      EXCEPTION WHEN OTHERS THEN NULL; END;
    END LOOP;
  END LOOP;
END \$\$;
SQL

# === Workaround 4: grant SELECT on all schemas to BACKUP_ROLE (so pg_dump works) ===
BACKUP_ROLE="${BACKUP_ROLE:-heuresys_backup}"
echo "[restore] Granting SELECT to backup role '$BACKUP_ROLE' across all schemas..."
sudo -u postgres psql -d "$DB_NAME" <<SQL
DO \$\$
DECLARE s record;
BEGIN
  -- Ensure backup role exists with BYPASSRLS (idempotent — setup-*.sh should have created it)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$BACKUP_ROLE') THEN
    CREATE ROLE $BACKUP_ROLE WITH LOGIN PASSWORD '$BACKUP_ROLE' BYPASSRLS;
  END IF;
  EXECUTE 'GRANT CONNECT ON DATABASE $DB_NAME TO $BACKUP_ROLE';
  FOR s IN SELECT nspname FROM pg_catalog.pg_namespace
           WHERE nspname NOT LIKE 'pg_%' AND nspname NOT IN ('information_schema')
  LOOP
    EXECUTE 'GRANT USAGE ON SCHEMA ' || quote_ident(s.nspname) || ' TO $BACKUP_ROLE';
    EXECUTE 'GRANT SELECT ON ALL TABLES IN SCHEMA ' || quote_ident(s.nspname) || ' TO $BACKUP_ROLE';
    EXECUTE 'GRANT SELECT ON ALL SEQUENCES IN SCHEMA ' || quote_ident(s.nspname) || ' TO $BACKUP_ROLE';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA ' || quote_ident(s.nspname) || ' GRANT SELECT ON TABLES TO $BACKUP_ROLE';
  END LOOP;
END \$\$;
SQL

# === Cleanup ===
if [ "$CLEANUP_TMP" = "1" ]; then
  sudo rm -f /tmp/platform_db.dump
fi

echo ""
echo "[restore] Done."
echo "[restore] Next: bash db/scripts/mark-baseline-applied.sh"
