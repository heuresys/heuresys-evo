#!/usr/bin/env bash
# clone-route.sh — copia atomica di una route Next.js dal path produzione
# verso .ux-design/10-staging/<route>/<TS>/, registrando hash sha256 di ogni
# file copiato per drift detection successiva (vedi promote.sh).
#
# Usage: clone-route.sh <route>
#   <route>    es. "dashboard", "login", "admin/users", "(authenticated)/dashboard"
#
# Exit codes:
#   0   ok
#   1   argomento mancante (CLONE_E101)
#   2   route inesistente (CLONE_E102)
#   3   route ambigua (CLONE_E103)
#   4   TS collision irrisolvibile (CLONE_E104)
#   5   permessi FS (CLONE_E105)
#   90  dipendenza mancante (sha256 tool, etc.)

set -euo pipefail

# ─── Project root discovery ─────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

# ─── sha256 portable ────────────────────────────────────────────────────────
if command -v sha256sum >/dev/null 2>&1; then
  sha256_of() { sha256sum "$1" | awk '{print $1}'; }
elif command -v shasum >/dev/null 2>&1; then
  sha256_of() { shasum -a 256 "$1" | awk '{print $1}'; }
else
  echo "ERROR: no sha256 tool found (install coreutils on Mac: brew install coreutils)" >&2
  exit 90
fi

# ─── Args ───────────────────────────────────────────────────────────────────
if [ $# -lt 1 ]; then
  echo "ERROR CLONE_E101: route argument missing" >&2
  echo "Usage: $0 <route>" >&2
  exit 1
fi

ROUTE="$1"
APP_BASE="services/app/src/app"

# ─── Resolve route path (with route group discovery) ────────────────────────
PROD_PATH=""
if [ -f "$APP_BASE/$ROUTE/page.tsx" ]; then
  PROD_PATH="$APP_BASE/$ROUTE"
else
  # Search for route group form: (group)/<route>/page.tsx
  CANDIDATES=$(find "$APP_BASE" -mindepth 2 -maxdepth 4 -path "*/$ROUTE/page.tsx" 2>/dev/null || true)
  CAND_COUNT=$(echo "$CANDIDATES" | grep -c '^.' || true)
  if [ "$CAND_COUNT" -eq 0 ]; then
    echo "ERROR CLONE_E102: route '$ROUTE' not found under $APP_BASE/" >&2
    echo "Hint: ls $APP_BASE/ to list available routes" >&2
    exit 2
  elif [ "$CAND_COUNT" -gt 1 ]; then
    echo "ERROR CLONE_E103: route '$ROUTE' is ambiguous, multiple matches:" >&2
    echo "$CANDIDATES" >&2
    echo "Hint: use explicit form like '(group)/$ROUTE'" >&2
    exit 3
  fi
  PROD_PATH=$(dirname "$CANDIDATES")
fi

# Compute relative route name (strip APP_BASE prefix)
ROUTE_REL="${PROD_PATH#$APP_BASE/}"

# ─── Generate TS (with collision suffix) ────────────────────────────────────
TS_BASE="$(date '+%Y-%m-%d-%H%M')"
TS="$TS_BASE"
STAGING_DIR=".ux-design/10-staging/$ROUTE_REL/$TS"
SUFFIX=2
while [ -d "$STAGING_DIR" ]; do
  if [ "$SUFFIX" -gt 10 ]; then
    echo "ERROR CLONE_E104: TS collision unresolvable (>10 suffix in same minute), wait 1 min" >&2
    exit 4
  fi
  TS="${TS_BASE}-${SUFFIX}"
  STAGING_DIR=".ux-design/10-staging/$ROUTE_REL/$TS"
  SUFFIX=$((SUFFIX + 1))
done

# ─── Create staging dir + copy ──────────────────────────────────────────────
mkdir -p "$STAGING_DIR" || { echo "ERROR CLONE_E105: cannot create $STAGING_DIR (permissions?)" >&2; exit 5; }

# Copy ALL files from PROD_PATH to STAGING_DIR (preserving subdirectories)
# rsync preferred; cp -R fallback
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude='.source-hashes.json' "$PROD_PATH/" "$STAGING_DIR/"
else
  cp -R "$PROD_PATH/." "$STAGING_DIR/"
fi

# ─── Generate .source-hashes.json ───────────────────────────────────────────
HASHES_FILE="$STAGING_DIR/.source-hashes.json"
{
  echo "{"
  echo "  \"route\": \"$ROUTE_REL\","
  echo "  \"prod_path\": \"$PROD_PATH\","
  echo "  \"clone_timestamp\": \"$TS\","
  echo "  \"clone_iso\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"git_commit\": \"$(git rev-parse HEAD 2>/dev/null || echo unknown)\","
  echo "  \"files\": {"
  FIRST=1
  while IFS= read -r -d '' f; do
    REL="${f#$PROD_PATH/}"
    H=$(sha256_of "$f")
    if [ "$FIRST" -eq 1 ]; then
      FIRST=0
    else
      echo ","
    fi
    printf '    "%s": "%s"' "$REL" "$H"
  done < <(find "$PROD_PATH" -type f -print0 | sort -z)
  echo ""
  echo "  }"
  echo "}"
} > "$HASHES_FILE"

# ─── Discover external dependencies (best-effort) ───────────────────────────
DEPS_FILE="$STAGING_DIR/.external-deps.txt"
{
  echo "# External imports detected in clone (best-effort grep)"
  echo "# Lines starting with: from path NOT under <route>/"
  echo ""
  grep -rhE "^import .* from ['\"](@/lib|@/packages|next/|react|@heuresys/ui)" "$STAGING_DIR" 2>/dev/null | sort -u || true
} > "$DEPS_FILE"

# ─── Generate README.md from template ───────────────────────────────────────
TEMPLATE_README="$SCRIPT_DIR/../templates/README-staging.template.md"
README="$STAGING_DIR/README.md"

if [ ! -f "$TEMPLATE_README" ]; then
  echo "WARNING: template README not found at $TEMPLATE_README, generating minimal" >&2
  cat > "$README" <<EOF
# Staging — $ROUTE_REL @ $TS

Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Source: $PROD_PATH
Status: draft

(template README missing — fallback minimal)
EOF
else
  GIT_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
  GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
  AUTHOR_NAME="$(git config user.name 2>/dev/null || echo unknown)"
  AUTHOR_EMAIL="$(git config user.email 2>/dev/null || echo unknown)"
  ISO_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  FILE_LIST=$(find "$STAGING_DIR" -type f \
    -not -name '.source-hashes.json' \
    -not -name '.external-deps.txt' \
    -not -name 'README.md' \
    | sed "s|$STAGING_DIR/||" | sort)

  DEPS_LIST=$(cat "$DEPS_FILE" | grep -v '^#' | grep -v '^$' || echo '(none detected)')

  # Substitute placeholders
  sed \
    -e "s|<ROUTE>|$ROUTE_REL|g" \
    -e "s|<TS>|$TS|g" \
    -e "s|<ISO_TIMESTAMP>|$ISO_TS|g" \
    -e "s|<AUTHOR_NAME>|$AUTHOR_NAME|g" \
    -e "s|<AUTHOR_EMAIL>|$AUTHOR_EMAIL|g" \
    -e "s|<PRE_CLONE_COMMIT_SHA>|$GIT_COMMIT|g" \
    -e "s|<BRANCH>|$GIT_BRANCH|g" \
    "$TEMPLATE_README" > "$README"

  # File list and deps require multi-line replacement (separate step)
  python3 -c "
import sys
with open('$README','r',encoding='utf-8') as f:
    content = f.read()
content = content.replace('<FILE_LIST_PLACEHOLDER>', '''$FILE_LIST''')
content = content.replace('<DEPS_EXTERNAL_PLACEHOLDER>', '''$DEPS_LIST''')
with open('$README','w',encoding='utf-8') as f:
    f.write(content)
" 2>/dev/null || true
fi

# ─── Output summary ─────────────────────────────────────────────────────────
FILE_COUNT=$(find "$STAGING_DIR" -type f | wc -l | tr -d ' ')
echo ""
echo "✓ Clone complete"
echo "  Route:       $ROUTE_REL"
echo "  TS:          $TS"
echo "  From:        $PROD_PATH"
echo "  To:          $STAGING_DIR"
echo "  Files:       $FILE_COUNT"
echo "  Hashes:      $HASHES_FILE"
echo "  Deps:        $DEPS_FILE"
echo "  README:      $README"
echo ""
echo "Next: invoke superpowers:brainstorming to compile README § Motivazione (gate A)"
