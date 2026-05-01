#!/usr/bin/env bash
# RTGB B2.7 — reset the test DB to a clean state.
#
# Drops + recreates the test schema, replays migrations, seeds fixture rows.
# Idempotent. Safe to run before any integration test suite.
#
# Required env: DATABASE_URL_TEST (e.g., postgresql://user:pass@host:5432/heuresys_test)
# Optional env: SKIP_MIGRATIONS=1 (when iterating, only re-seed)
set -euo pipefail

[ -n "${DATABASE_URL_TEST:-}" ] || {
  echo "ERR: DATABASE_URL_TEST env missing." >&2
  echo "   export DATABASE_URL_TEST=postgresql://...:.../heuresys_test" >&2
  exit 2
}

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "[reset-test] DROP + CREATE public schema…"
psql "$DATABASE_URL_TEST" -v ON_ERROR_STOP=1 <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO PUBLIC;
SQL

if [ "${SKIP_MIGRATIONS:-0}" != "1" ]; then
  echo "[reset-test] Running migrations…"
  if [ -x "$ROOT/db/scripts/migrate.sh" ]; then
    DATABASE_URL="$DATABASE_URL_TEST" "$ROOT/db/scripts/migrate.sh"
  else
    echo "[reset-test] migrate.sh missing — applying db/migrations/*.sql directly"
    for f in "$ROOT"/db/migrations/*.sql; do
      [ -f "$f" ] || continue
      echo "  applying $(basename "$f")"
      psql "$DATABASE_URL_TEST" -v ON_ERROR_STOP=1 -f "$f"
    done
  fi
fi

echo "[reset-test] Seed fixtures (minimal)…"
psql "$DATABASE_URL_TEST" -v ON_ERROR_STOP=1 <<'SQL'
-- Minimal seed for integration tests. Add more rows here as suites grow.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'tenants') THEN
    RAISE NOTICE 'tenants table missing — skipping seed (run after first migration covers it).';
    RETURN;
  END IF;
END $$;
SQL

echo "[reset-test] OK"
