#!/bin/bash
# Migration Runner — Heuresys Platform
# Applies SQL migrations from db/migrations/ that aren't yet in schema_migrations.
# Usage: ./scripts/migrate.sh [--dry-run]
#
# Features:
# - Reads schema_migrations to skip already-applied migrations
# - Applies in numerical order
# - Records each applied migration with timestamp
# - Supports --dry-run to preview without applying
# - Exits non-zero on any failure (fail-fast)

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-heuresys}"
DB_NAME="${DB_NAME:-heuresys_platform}"
MIGRATIONS_DIR="${MIGRATIONS_DIR:-db/migrations}"

DRY_RUN=false
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
fi

export PGPASSWORD="${PGPASSWORD:-${PLATFORM_DB_PASSWORD:-heuresys}}"

PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1"

# Ensure schema_migrations table exists
$PSQL -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);" > /dev/null

# Get applied versions (basename used as version key — see note below)
APPLIED=$($PSQL -t -A -c "SELECT version FROM schema_migrations ORDER BY version;")

# Collect pending migrations
#
# Naming convention supported:
#   - Legacy 4-digit prefix: 0001_foo, 0002_bar, 0006a_baz  → group 0 (applied first)
#   - New 3-digit prefix:    001_qux, 002_quux, 221_foo     → group 1 (applied after legacy)
#
# Sort key composition: "<group>_<padNum><letterSuffix>_<basename>"
#   - group (0 or 1) forces legacy-before-new ordering when prefixes collide numerically
#   - padNum (6 digits) makes numeric prefix byte-wise sortable (001 < 002 < ... < 221)
#   - letterSuffix preserves e.g. "0006a" ordering right after "0006"
#   - basename as final tiebreak keeps deterministic order for same-prefix files
#
# Uniqueness key in schema_migrations: full basename (not numeric prefix), so
# 0001_merge_users_into_employees and 001_enable_rls never collide.
PENDING=()
for f in "$MIGRATIONS_DIR"/*.sql; do
  [ -f "$f" ] || continue
  bn=$(basename "$f" .sql)
  raw_num=$(echo "$bn" | grep -oE '^[0-9]+' || true)
  if [ -z "$raw_num" ]; then
    continue
  fi
  if [ "${#raw_num}" -ge 4 ]; then
    group=0
  else
    group=1
  fi
  full_prefix=$(echo "$bn" | grep -oE '^[0-9]+[a-z]*')
  letter_suffix="${full_prefix#$raw_num}"
  # Force base-10 interpretation to avoid "invalid octal" on prefixes like 008, 009, 080
  sort_key=$(printf "%d_%06d%s_%s" "$group" "$((10#$raw_num))" "$letter_suffix" "$bn")

  # Skip if already applied (basename-keyed)
  if echo "$APPLIED" | grep -qxF "$bn"; then
    continue
  fi
  PENDING+=("$sort_key|$bn|$f")
done

if [ ${#PENDING[@]} -eq 0 ]; then
  echo "[migrate] All migrations are up to date."
  exit 0
fi

# Sort by sort_key (byte-wise, C locale for determinism)
mapfile -t PENDING < <(printf '%s\n' "${PENDING[@]}" | LC_ALL=C sort -t'|' -k1)

echo "[migrate] ${#PENDING[@]} pending migration(s):"
for entry in "${PENDING[@]}"; do
  IFS='|' read -r _key name _file <<< "$entry"
  echo "  - $name"
done

if [ "$DRY_RUN" = true ]; then
  echo "[migrate] Dry run — no changes applied."
  exit 0
fi

# Apply each migration
APPLIED_COUNT=0
for entry in "${PENDING[@]}"; do
  IFS='|' read -r _key name file <<< "$entry"
  echo -n "[migrate] Applying $name... "

  # Check if file contains CONCURRENTLY (can't run in transaction)
  if grep -q 'CONCURRENTLY' "$file"; then
    # Run outside transaction
    $PSQL -f "$file" > /dev/null 2>&1
  else
    # Run in transaction
    $PSQL --single-transaction -f "$file" > /dev/null 2>&1
  fi

  # Record in schema_migrations (basename as unique key)
  $PSQL -c "INSERT INTO schema_migrations (version) VALUES ('$name') ON CONFLICT DO NOTHING;" > /dev/null
  echo "OK"
  APPLIED_COUNT=$((APPLIED_COUNT + 1))
done

echo "[migrate] Done. Applied $APPLIED_COUNT migration(s)."
