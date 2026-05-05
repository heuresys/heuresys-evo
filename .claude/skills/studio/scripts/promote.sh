#!/usr/bin/env bash
# promote.sh — backup atomico + overwrite produzione + git commit (no push).
#
# Usage:
#   promote.sh --dry-run <route> <TS>           preview MANIFEST + diff
#   promote.sh --confirmed <route> <TS> [--accept-drift]
#                                              esegue (richiede dry-run pulito)
#
# Exit codes:
#   0   ok
#   1   args invalid (PROMOTE_E301)
#   2   repo dirty (PROMOTE_E302)
#   3   drift detect senza --accept-drift (PROMOTE_E303)
#   4   gate fail brand:audit/anti-slop (deferito al command md, non qui)
#   8   husky pre-commit fail (PROMOTE_E308)
#   12  filesystem fatale (PROMOTE_E312)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

if command -v sha256sum >/dev/null 2>&1; then
  sha256_of() { sha256sum "$1" | awk '{print $1}'; }
elif command -v shasum >/dev/null 2>&1; then
  sha256_of() { shasum -a 256 "$1" | awk '{print $1}'; }
else
  echo "ERROR: no sha256 tool found" >&2; exit 90
fi

# ─── Args parsing ──────────────────────────────────────────────────────────
MODE=""
ROUTE=""
TS=""
ACCEPT_DRIFT=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)        MODE="dry-run"; shift ;;
    --confirmed)      MODE="confirmed"; shift ;;
    --accept-drift)   ACCEPT_DRIFT=1; shift ;;
    -h|--help)        sed -n '2,12p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *)
      if [ -z "$ROUTE" ]; then ROUTE="$1"
      elif [ -z "$TS" ]; then TS="$1"
      else echo "ERROR: unexpected arg '$1'" >&2; exit 1
      fi
      shift ;;
  esac
done

if [ -z "$MODE" ] || [ -z "$ROUTE" ] || [ -z "$TS" ]; then
  echo "ERROR PROMOTE_E301: usage: $0 --dry-run|--confirmed <route> <TS>" >&2
  exit 1
fi

STAGING_PATH=".ux-design/10-staging/$ROUTE/$TS"
APP_BASE="services/app/src/app"
PROD_PATH="$APP_BASE/$ROUTE"

# Resolve PROD_PATH if route group form
if [ ! -d "$PROD_PATH" ]; then
  CAND=$(find "$APP_BASE" -mindepth 2 -maxdepth 4 -path "*/$ROUTE/page.tsx" 2>/dev/null | head -1 || true)
  if [ -n "$CAND" ]; then
    PROD_PATH=$(dirname "$CAND")
  fi
fi

if [ ! -d "$STAGING_PATH" ]; then
  echo "ERROR: staging path not found: $STAGING_PATH" >&2
  exit 1
fi

# ─── Repo clean check on PROD_PATH ─────────────────────────────────────────
if ! git diff --quiet -- "$PROD_PATH" 2>/dev/null || \
   ! git diff --cached --quiet -- "$PROD_PATH" 2>/dev/null; then
  echo "ERROR PROMOTE_E302: repo dirty on $PROD_PATH" >&2
  echo "Hint: 'git status' to see changes; commit/stash before promoting" >&2
  exit 2
fi

# ─── Drift detection vs .source-hashes.json ────────────────────────────────
HASHES="$STAGING_PATH/.source-hashes.json"
DRIFT_FILES=()
if [ -f "$HASHES" ]; then
  while IFS=$'\t' read -r FPATH FHASH; do
    [ -z "$FPATH" ] && continue
    FULL="$PROD_PATH/$FPATH"
    if [ -f "$FULL" ]; then
      ACTUAL=$(sha256_of "$FULL")
      if [ "$ACTUAL" != "$FHASH" ]; then
        DRIFT_FILES+=("$FPATH")
      fi
    else
      DRIFT_FILES+=("$FPATH (missing in prod)")
    fi
  done < <(python3 -c "
import json,sys
h = json.load(open('$HASHES'))
for k,v in h.get('files',{}).items():
    print(k + chr(9) + v)
" 2>/dev/null || true)
fi

if [ "${#DRIFT_FILES[@]}" -gt 0 ] && [ "$ACCEPT_DRIFT" -eq 0 ]; then
  echo "ERROR PROMOTE_E303: drift rilevato, ${#DRIFT_FILES[@]} file modificati in produzione dopo il clone:" >&2
  for f in "${DRIFT_FILES[@]}"; do echo "  - $f" >&2; done
  echo "Hint: fai nuovo /studio:clone $ROUTE oppure --accept-drift (sconsigliato)" >&2
  exit 3
fi

# ─── Compute backup TS + paths ─────────────────────────────────────────────
BKP_TS="$(date '+%Y-%m-%d-%H%M')"
BKP_DIR=".ux-design/.backups/$ROUTE/$BKP_TS-pre-promote"
SUFFIX=2
while [ -d "$BKP_DIR" ]; do
  BKP_TS_BASE="$(date '+%Y-%m-%d-%H%M')"
  BKP_TS="${BKP_TS_BASE}-${SUFFIX}"
  BKP_DIR=".ux-design/.backups/$ROUTE/$BKP_TS-pre-promote"
  SUFFIX=$((SUFFIX + 1))
  [ "$SUFFIX" -gt 10 ] && { echo "ERROR: backup TS collision unresolvable" >&2; exit 12; }
done

# ─── Compute MANIFEST.json contents ────────────────────────────────────────
PRE_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
PRE_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
AUTHOR_NAME="$(git config user.name 2>/dev/null || echo unknown)"
AUTHOR_EMAIL="$(git config user.email 2>/dev/null || echo unknown)"
ISO_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
REASON_FILE="$STAGING_PATH/README.md"
REASON="(no README found)"
if [ -f "$REASON_FILE" ]; then
  # Estraggo blocco § Motivazione (testo fra '## Motivazione' e prossima '##')
  REASON=$(awk '/^## Motivazione$/{flag=1;next} /^##/{flag=0} flag' "$REASON_FILE" \
    | sed '/^_(.*da compilare.*)_$/d; /^<!--/d; /^$/d' \
    | head -10 \
    | tr '\n' ' ' \
    | sed 's/  */ /g; s/^ //; s/ $//')
  [ -z "$REASON" ] && REASON="(README § Motivazione vuota — gate A non completato)"
fi

# Build files list (excluding staging metadata)
FILES_JSON=""
FIRST=1
while IFS= read -r -d '' f; do
  REL="${f#$STAGING_PATH/}"
  case "$REL" in
    README.md|.source-hashes.json|.external-deps.txt) continue ;;
  esac
  H=$(sha256_of "$f")
  SIZE=$(wc -c < "$f" | tr -d ' ')
  if [ "$FIRST" -eq 1 ]; then FIRST=0; else FILES_JSON="$FILES_JSON,"; fi
  FILES_JSON="$FILES_JSON
    {\"path\": \"$REL\", \"size\": $SIZE, \"sha256\": \"$H\"}"
done < <(find "$STAGING_PATH" -type f -print0 | sort -z)

# ─── DRY-RUN mode ──────────────────────────────────────────────────────────
if [ "$MODE" = "dry-run" ]; then
  echo "═══════════════════ DRY-RUN preview ═══════════════════"
  echo "  Route:           $ROUTE"
  echo "  Source staging:  $STAGING_PATH"
  echo "  Target prod:     $PROD_PATH"
  echo "  Backup will go:  $BKP_DIR"
  echo "  Backup TS:       $BKP_TS"
  echo "  Pre-commit SHA:  $PRE_COMMIT"
  echo "  Pre-branch:      $PRE_BRANCH"
  echo "  Author:          $AUTHOR_NAME <$AUTHOR_EMAIL>"
  echo "  Drift detected:  ${#DRIFT_FILES[@]} file(s)$([ "$ACCEPT_DRIFT" -eq 1 ] && echo ' (accepted)' || echo '')"
  echo ""
  echo "  Reason (from README § Motivazione):"
  echo "    $REASON"
  echo ""
  echo "  Files staging → prod (esclusi metadata):"
  python3 -c "
import json
data = '''[$FILES_JSON
  ]'''
items = json.loads(data)
for x in items:
    print(f\"    {x['path']:<55s} {x['size']:>8d}b  {x['sha256'][:12]}...\")
" 2>/dev/null || echo "    (impossibile listare — python3 mancante o JSON malformato)"
  echo ""
  echo "  Diff staging vs prod (stat):"
  TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude='README.md' --exclude='.source-hashes.json' --exclude='.external-deps.txt' \
      "$STAGING_PATH/" "$TMP/"
  else
    cp -R "$STAGING_PATH/." "$TMP/"
    rm -f "$TMP/README.md" "$TMP/.source-hashes.json" "$TMP/.external-deps.txt"
  fi
  git diff --no-index --stat -- "$PROD_PATH" "$TMP" 2>/dev/null | sed 's/^/    /' || true
  echo ""
  echo "  Commit message preview:"
  echo "    feat(app): promote $ROUTE design from staging $TS"
  echo ""
  echo "  Push: NO (manuale post-commit)"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "Per procedere: $0 --confirmed $ROUTE $TS$([ "$ACCEPT_DRIFT" -eq 1 ] && echo ' --accept-drift' || echo '')"
  exit 0
fi

# ─── CONFIRMED mode ────────────────────────────────────────────────────────
echo "Promoting $ROUTE staging $TS to production..."
echo ""

# 1. Create backup dir + copy production files
mkdir -p "$BKP_DIR" || { echo "ERROR PROMOTE_E312: cannot mkdir $BKP_DIR" >&2; exit 12; }
if command -v rsync >/dev/null 2>&1; then
  rsync -a "$PROD_PATH/" "$BKP_DIR/"
else
  cp -R "$PROD_PATH/." "$BKP_DIR/"
fi

# 2. Write MANIFEST.json
MANIFEST="$BKP_DIR/MANIFEST.json"
# Escape REASON for JSON (basic)
REASON_ESC=$(printf '%s' "$REASON" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read())[1:-1])" 2>/dev/null || printf '%s' "$REASON" | sed 's/\\/\\\\/g; s/"/\\"/g')

cat > "$MANIFEST" <<EOF
{
  "\$schema": "studio.manifest.v1",
  "version": "1.0.0",
  "route": "$ROUTE",
  "route_source": "$PROD_PATH/",
  "backup_timestamp": "$BKP_TS",
  "backup_path": "$BKP_DIR/",
  "staging_source": "$STAGING_PATH/",
  "staging_timestamp": "$TS",
  "operation": "promote",
  "author": {
    "name": "$AUTHOR_NAME",
    "email": "$AUTHOR_EMAIL"
  },
  "git": {
    "pre_promote_commit": "$PRE_COMMIT",
    "pre_promote_branch": "$PRE_BRANCH",
    "post_promote_commit": null,
    "remote": "origin",
    "pushed": false
  },
  "reason": "$REASON_ESC",
  "files": [$FILES_JSON
  ],
  "checks_passed": {
    "brand_audit": null,
    "anti_slop": null,
    "verification": null
  },
  "iso_timestamp": "$ISO_TS"
}
EOF

# 3. Validate JSON
python3 -c "import json; json.load(open('$MANIFEST'))" 2>/dev/null || {
  echo "ERROR PROMOTE_E312: MANIFEST.json malformed, aborting before overwrite" >&2
  rm -rf "$BKP_DIR"
  exit 12
}

# 4. Overwrite production from staging (excluding metadata)
TMP_STG=$(mktemp -d); trap 'rm -rf "$TMP_STG"' EXIT
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude='README.md' --exclude='.source-hashes.json' --exclude='.external-deps.txt' \
    "$STAGING_PATH/" "$TMP_STG/"
  rsync -a --delete "$TMP_STG/" "$PROD_PATH/"
else
  cp -R "$STAGING_PATH/." "$TMP_STG/"
  rm -f "$TMP_STG/README.md" "$TMP_STG/.source-hashes.json" "$TMP_STG/.external-deps.txt"
  rm -rf "$PROD_PATH"
  cp -R "$TMP_STG" "$PROD_PATH"
fi

# 5. Git add + commit
git add "$PROD_PATH"

COMMIT_MSG="feat(app): promote $ROUTE design from staging $TS

Promotion via /studio:promote.

Source staging: $STAGING_PATH
Backup created: $BKP_DIR
Pre-promote commit: $PRE_COMMIT
Reason: $(echo "$REASON" | head -c 200)

Plan: ~/.claude/plans/voglio-creare-una-skill-magical-castle.md"

# Commit (lascia che husky run, NO --no-verify)
if ! git commit -m "$COMMIT_MSG"; then
  echo "ERROR PROMOTE_E308: git commit fallito (husky pre-commit?)." >&2
  echo "Backup creato in $BKP_DIR ma produzione modificata e non committata." >&2
  echo "Risolvi le violazioni e committa manualmente, oppure ripristina con /studio:restore $ROUTE $BKP_TS-pre-promote" >&2
  exit 8
fi

POST_COMMIT="$(git rev-parse HEAD)"

# 6. Update MANIFEST with post_promote_commit
python3 -c "
import json
m = json.load(open('$MANIFEST'))
m['git']['post_promote_commit'] = '$POST_COMMIT'
json.dump(m, open('$MANIFEST','w'), indent=2)
" 2>/dev/null || true

# Re-add MANIFEST.json (now with post_commit) — committable as separate commit if needed
# Per evitare un secondo commit, lasciamo MANIFEST.json con post_commit aggiornato senza committarlo:
# il file vive in .ux-design/.backups/ che è tracked, sarà nel prossimo commit dell'utente.

echo ""
echo "✓ Promote complete"
echo "  Pre-promote commit:  $PRE_COMMIT"
echo "  Post-promote commit: $POST_COMMIT"
echo "  Backup:              $BKP_DIR"
echo "  MANIFEST:            $MANIFEST"
echo ""
echo "Per pushare: git push origin $PRE_BRANCH"
echo "Per restore: /studio:restore $ROUTE $BKP_TS-pre-promote"
