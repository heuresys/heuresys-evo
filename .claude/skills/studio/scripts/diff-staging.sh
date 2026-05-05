#!/usr/bin/env bash
# diff-staging.sh — diff fra staging e produzione per una route data.
# Default TS = ultimo (mtime piu' recente).
#
# Usage: diff-staging.sh <route> [<TS>]
#   <route>    es. "dashboard"
#   <TS>       opzionale, es. "2026-05-05-2030"
#
# Exit codes:
#   0   ok (anche se diff non vuoto)
#   1   args invalid (DIFF_E201)
#   2   staging inesistente (DIFF_E202)
#   3   TS non trovato (DIFF_E203)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

if [ $# -lt 1 ]; then
  echo "ERROR DIFF_E201: route argument missing" >&2
  echo "Usage: $0 <route> [<TS>]" >&2
  exit 1
fi

ROUTE="$1"
TS="${2:-}"

STAGING_BASE=".ux-design/10-staging/$ROUTE"
PROD_PATH="services/app/src/app/$ROUTE"

# Resolve PROD_PATH if route group form
if [ ! -d "$PROD_PATH" ]; then
  CAND=$(find services/app/src/app -mindepth 2 -maxdepth 4 -path "*/$ROUTE/page.tsx" 2>/dev/null | head -1 || true)
  if [ -n "$CAND" ]; then
    PROD_PATH=$(dirname "$CAND")
  fi
fi

if [ ! -d "$STAGING_BASE" ]; then
  echo "ERROR DIFF_E202: no staging found for route '$ROUTE' at $STAGING_BASE" >&2
  echo "Hint: run /studio:clone $ROUTE first" >&2
  exit 2
fi

# Resolve TS (default = latest)
if [ -z "$TS" ]; then
  TS=$(ls -1 "$STAGING_BASE" 2>/dev/null | grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{4}' | sort -r | head -1)
  if [ -z "$TS" ]; then
    echo "ERROR DIFF_E202: $STAGING_BASE has no valid TS subdirs" >&2
    exit 2
  fi
fi

STAGING_PATH="$STAGING_BASE/$TS"

if [ ! -d "$STAGING_PATH" ]; then
  echo "ERROR DIFF_E203: staging $STAGING_PATH not found" >&2
  echo "Hint: ls $STAGING_BASE/ to list valid TS" >&2
  exit 3
fi

echo "Diff: $PROD_PATH  vs  $STAGING_PATH"
echo "─────────────────────────────────────────────────────────────"

# Build a temp dir of staging excluding skill metadata files
TMP_STAGING=$(mktemp -d)
trap 'rm -rf "$TMP_STAGING"' EXIT
if command -v rsync >/dev/null 2>&1; then
  rsync -a \
    --exclude='README.md' \
    --exclude='.source-hashes.json' \
    --exclude='.external-deps.txt' \
    "$STAGING_PATH/" "$TMP_STAGING/"
else
  cp -R "$STAGING_PATH/." "$TMP_STAGING/"
  rm -f "$TMP_STAGING/README.md" "$TMP_STAGING/.source-hashes.json" "$TMP_STAGING/.external-deps.txt"
fi

# Stat summary
echo ""
echo "[Stat]"
git diff --no-index --stat -- "$PROD_PATH" "$TMP_STAGING" 2>/dev/null || true

echo ""
echo "[Per-file diff]"
git diff --no-index -- "$PROD_PATH" "$TMP_STAGING" 2>/dev/null || true

DIFF_EMPTY=$(git diff --no-index --quiet -- "$PROD_PATH" "$TMP_STAGING" 2>/dev/null && echo yes || echo no)
echo ""
if [ "$DIFF_EMPTY" = "yes" ]; then
  echo "✓ DIFF_E205: staging identico a produzione (no changes)"
else
  echo "Diff non vuoto. Per promote: /studio:promote $ROUTE $TS"
fi
