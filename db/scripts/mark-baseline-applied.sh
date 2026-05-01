#!/bin/bash
# Mark the baseline migration (0001_baseline) as applied in schema_migrations.
# Run AFTER db/scripts/restore-baseline.sh.
#
# Override defaults via env: DB_HOST, DB_PORT, DB_USER, DB_NAME, PGPASSWORD

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-heuresys}"
DB_NAME="${DB_NAME:-heuresys_platform}"

export PGPASSWORD="${PGPASSWORD:-heuresys}"
PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1"

# Defensive: ensure schema_migrations exists (the dump should have created it)
$PSQL -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);" > /dev/null

# Mark baseline as applied (idempotent — uses ON CONFLICT)
$PSQL -c "INSERT INTO schema_migrations (version) VALUES ('0001_baseline') ON CONFLICT DO NOTHING;" > /dev/null

echo "[mark-baseline-applied] '0001_baseline' marked as applied."
echo ""
echo "[mark-baseline-applied] schema_migrations contents (last 20):"
$PSQL -c "SELECT version, applied_at FROM schema_migrations ORDER BY version DESC LIMIT 20;"
echo ""
TOTAL=$($PSQL -t -A -c "SELECT count(*) FROM schema_migrations;")
echo "[mark-baseline-applied] Total applied migrations: $TOTAL"
echo "[mark-baseline-applied] (Includes 213 v1 migrations restored from baseline + '0001_baseline' marker.)"
