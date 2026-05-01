#!/bin/bash
# Mark migrations embedded in db/schema/000_base_schema.sql as applied.
#
# Context: db/schema/000_base_schema.sql is a pg_dump snapshot. It contains
# the effects of migrations UP TO a certain point in history, but does NOT
# populate schema_migrations. Migrations added AFTER the snapshot must still
# be applied by migrate.sh after base_schema is restored.
#
# The list of embedded migrations lives in
# db/schema/000_base_schema.manifest.txt (one basename per line, # comments
# allowed). Regenerate with scripts/regenerate-base-schema-manifest.sh
# whenever base_schema is regenerated from a new pg_dump.
#
# Usage:
#   DB_HOST=localhost DB_PORT=5432 DB_USER=heuresys DB_NAME=heuresys_platform \
#     PGPASSWORD=heuresys bash scripts/mark-migrations-applied.sh
#
# Safe to re-run (INSERT ... ON CONFLICT DO NOTHING).

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-heuresys}"
DB_NAME="${DB_NAME:-heuresys_platform}"
MANIFEST="${BASE_SCHEMA_MANIFEST:-db/schema/000_base_schema.manifest.txt}"

export PGPASSWORD="${PGPASSWORD:-${PLATFORM_DB_PASSWORD:-heuresys}}"
PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1"

if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: manifest not found at $MANIFEST" >&2
  echo "Run scripts/regenerate-base-schema-manifest.sh to create it." >&2
  exit 1
fi

# Ensure schema_migrations exists (idempotent — base_schema already creates it)
$PSQL -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);" > /dev/null

COUNT=0
while IFS= read -r bn || [ -n "$bn" ]; do
  # Skip blank lines and comments
  [ -z "$bn" ] && continue
  case "$bn" in \#*) continue ;; esac
  # Defensive trim (leading/trailing whitespace and CR for CRLF files)
  bn="${bn%$'\r'}"
  bn="${bn#"${bn%%[![:space:]]*}"}"
  bn="${bn%"${bn##*[![:space:]]}"}"
  [ -z "$bn" ] && continue

  $PSQL -c "INSERT INTO schema_migrations (version) VALUES ('$bn') ON CONFLICT DO NOTHING;" > /dev/null
  COUNT=$((COUNT + 1))
done < "$MANIFEST"

echo "[mark-applied] Marked $COUNT embedded migrations as applied (source: $MANIFEST)."
