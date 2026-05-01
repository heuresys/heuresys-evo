#!/usr/bin/env bash
# RTGB B2.1 — verify schema.prisma is in sync with the live DB.
#
# Workflow: db pull → diff against committed schema.prisma → fail if drift.
# Intended use:
#   - manual on-demand: scripts/hardening/prisma-verify.sh services/api-gateway
#   - pre-commit hook (B2.2): only when schema.prisma is staged
#   - CI (B10): every PR
set -euo pipefail

WS="${1:-services/api-gateway}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
target="$ROOT/$WS"

[ -d "$target" ] || { echo "ERR: workspace not found: $target" >&2; exit 2; }
[ -f "$target/prisma/schema.prisma" ] || { echo "ERR: no prisma/schema.prisma in $target" >&2; exit 2; }
[ -n "${DATABASE_URL:-}" ] || { echo "ERR: DATABASE_URL env missing" >&2; exit 2; }

cd "$target"

# Pull current DB schema into a temp file
tmp_pulled="$(mktemp --suffix=.prisma)"
trap 'rm -f "$tmp_pulled"' EXIT

cp prisma/schema.prisma "$tmp_pulled"
npx prisma db pull --schema=prisma/schema.prisma >/dev/null 2>&1

if diff -q "$tmp_pulled" prisma/schema.prisma >/dev/null 2>&1; then
  echo "OK: schema.prisma in sync with DB ($WS)"
  exit 0
else
  echo "DRIFT: schema.prisma differs from db pull output ($WS)" >&2
  diff -u "$tmp_pulled" prisma/schema.prisma | head -60 >&2
  # Restore the committed schema (we don't want db pull to overwrite it without intent)
  cp "$tmp_pulled" prisma/schema.prisma
  exit 1
fi
