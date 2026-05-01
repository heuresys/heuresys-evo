#!/usr/bin/env bash
# RTG Phase 4 task 4.9 — RLS coverage check.
#
# Wraps db/scripts/rls-coverage.sql (RTGB B2.3 from Cantiere B) and emits a
# pass/fail summary suitable for CI gating. Exits non-zero when any
# tenant-aware table FAILS RLS criteria (rls_enabled + force_rls + ≥1 policy
# referencing app.current_tenant_id).
#
# Usage:
#   ./services/api-gateway/scripts/check-rls-coverage.sh
#   DATABASE_URL=postgresql://... ./services/api-gateway/scripts/check-rls-coverage.sh
#
# Env:
#   DATABASE_URL       — full DSN, takes precedence over discrete vars
#   PGHOST/PGPORT/PGUSER/PGDATABASE/PGPASSWORD — fallback if DATABASE_URL unset

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
COVERAGE_SQL="$REPO_ROOT/db/scripts/rls-coverage.sql"

if [ ! -f "$COVERAGE_SQL" ]; then
  echo "ERROR: $COVERAGE_SQL not found" >&2
  exit 2
fi

PSQL_ARGS=(-X --quiet -P "format=unaligned" -P "fieldsep=|" -P "pager=off" -P "footer=off")
if [ -n "${DATABASE_URL:-}" ]; then
  PSQL_CMD=(psql "$DATABASE_URL" "${PSQL_ARGS[@]}")
else
  PSQL_CMD=(psql "${PSQL_ARGS[@]}")
fi

OUTPUT=$("${PSQL_CMD[@]}" -f "$COVERAGE_SQL")

TOTAL=$(echo "$OUTPUT" | grep -cE '^[a-z_]+\|' || true)
FAIL_COUNT=$(echo "$OUTPUT" | grep -cE '\|FAIL$' || true)
PASS_COUNT=$(echo "$OUTPUT" | grep -cE '\|PASS$' || true)

echo "RLS coverage: $PASS_COUNT pass / $FAIL_COUNT fail / $TOTAL total tenant-aware tables"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo ""
  echo "FAIL rows:"
  echo "$OUTPUT" | grep -E '\|FAIL$' || true
  exit 1
fi

exit 0
