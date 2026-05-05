#!/usr/bin/env bash
# restore.sh — ripristina produzione da un backup pre-promote.
# Crea un nuovo commit revert (NON modifica history).
#
# Usage:
#   restore.sh --dry-run <route> <backup-TS-with-suffix>
#       (es. backup-TS-with-suffix = "2026-05-05-2030-pre-promote")
#   restore.sh --confirmed <route> <backup-TS-with-suffix>
#
# Exit codes:
#   0   ok
#   1   args invalid (RESTORE_E401)
#   2   backup mancante (RESTORE_E402)
#   3   MANIFEST.json mancante/corrotto (RESTORE_E403)
#   4   MANIFEST.json schema invalid (RESTORE_E404)
#   5   repo dirty (RESTORE_E405)
#   12  filesystem fatale

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
BKP_TS=""

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)    MODE="dry-run"; shift ;;
    --confirmed)  MODE="confirmed"; shift ;;
    -h|--help)    sed -n '2,11p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *)
      if [ -z "$ROUTE" ]; then ROUTE="$1"
      elif [ -z "$BKP_TS" ]; then BKP_TS="$1"
      else echo "ERROR: unexpected arg '$1'" >&2; exit 1
      fi
      shift ;;
  esac
done

if [ -z "$MODE" ] || [ -z "$ROUTE" ] || [ -z "$BKP_TS" ]; then
  echo "ERROR RESTORE_E401: usage: $0 --dry-run|--confirmed <route> <backup-TS>" >&2
  echo "Hint: backup-TS deve includere suffisso '-pre-promote', es. 2026-05-05-2030-pre-promote" >&2
  exit 1
fi

# Normalize: aggiungi -pre-promote se utente l'ha omesso
case "$BKP_TS" in
  *-pre-promote) ;;
  *) BKP_TS="${BKP_TS}-pre-promote" ;;
esac

BKP_DIR=".ux-design/.backups/$ROUTE/$BKP_TS"
APP_BASE="services/app/src/app"
PROD_PATH="$APP_BASE/$ROUTE"

# Resolve PROD_PATH if route group form
if [ ! -d "$PROD_PATH" ]; then
  CAND=$(find "$APP_BASE" -mindepth 2 -maxdepth 4 -path "*/$ROUTE/page.tsx" 2>/dev/null | head -1 || true)
  if [ -n "$CAND" ]; then
    PROD_PATH=$(dirname "$CAND")
  fi
fi

if [ ! -d "$BKP_DIR" ]; then
  echo "ERROR RESTORE_E402: backup not found: $BKP_DIR" >&2
  echo "Hint: /studio:backup-list $ROUTE per TS validi" >&2
  exit 2
fi

MANIFEST="$BKP_DIR/MANIFEST.json"
if [ ! -f "$MANIFEST" ]; then
  echo "ERROR RESTORE_E403: MANIFEST.json mancante in $BKP_DIR" >&2
  echo "Backup compromesso, restore non sicuro." >&2
  exit 3
fi

if ! python3 -c "import json; json.load(open('$MANIFEST'))" 2>/dev/null; then
  echo "ERROR RESTORE_E403: MANIFEST.json malformato in $BKP_DIR" >&2
  exit 3
fi

# Schema check (campi obbligatori)
SCHEMA_OK=$(python3 -c "
import json
m = json.load(open('$MANIFEST'))
req = ['version','route','backup_timestamp','staging_timestamp','operation','author','git','reason','files','iso_timestamp']
missing = [k for k in req if k not in m]
if missing or 'pre_promote_commit' not in m['git']: print('NO')
else: print('OK')
" 2>/dev/null || echo "NO")

if [ "$SCHEMA_OK" != "OK" ]; then
  echo "ERROR RESTORE_E404: MANIFEST.json schema invalid (campi obbligatori mancanti)" >&2
  exit 4
fi

# ─── Repo clean check ──────────────────────────────────────────────────────
if ! git diff --quiet -- "$PROD_PATH" 2>/dev/null || \
   ! git diff --cached --quiet -- "$PROD_PATH" 2>/dev/null; then
  echo "ERROR RESTORE_E405: repo dirty su $PROD_PATH" >&2
  echo "Hint: 'git status'; commit/stash modifiche pendenti prima" >&2
  exit 5
fi

# ─── Drift check vs MANIFEST.files (warning only) ──────────────────────────
DRIFT_COUNT=0
while IFS=$'\t' read -r FPATH FHASH || [ -n "$FPATH" ]; do
  [ -z "$FPATH" ] && continue
  FPATH="${FPATH%$'\r'}"
  FHASH="${FHASH%$'\r'}"
  FULL="$PROD_PATH/$FPATH"
  if [ -f "$FULL" ]; then
    ACTUAL=$(sha256_of "$FULL")
    [ "$ACTUAL" != "$FHASH" ] && DRIFT_COUNT=$((DRIFT_COUNT + 1))
  else
    DRIFT_COUNT=$((DRIFT_COUNT + 1))
  fi
done < <(python3 -c "
import sys, json
m = json.load(open('$MANIFEST'))
for f in m.get('files', []):
    sys.stdout.write(f['path'] + chr(9) + f['sha256'] + chr(10))
" 2>/dev/null || true)

# ─── DRY-RUN ───────────────────────────────────────────────────────────────
if [ "$MODE" = "dry-run" ]; then
  REASON=$(python3 -c "import json; print(json.load(open('$MANIFEST')).get('reason','-')[:200])" 2>/dev/null || echo "-")
  PRE_COMMIT=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['git']['pre_promote_commit'])" 2>/dev/null || echo "?")
  POST_COMMIT=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['git'].get('post_promote_commit','?'))" 2>/dev/null || echo "?")
  AUTHOR=$(python3 -c "import json; m=json.load(open('$MANIFEST')); print(m['author']['name'])" 2>/dev/null || echo "?")
  TS_ORIG=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['iso_timestamp'])" 2>/dev/null || echo "?")
  FILE_COUNT=$(python3 -c "import json; print(len(json.load(open('$MANIFEST'))['files']))" 2>/dev/null || echo "?")

  echo "═══════════════════ RESTORE DRY-RUN preview ═══════════════════"
  echo "  Route:                $ROUTE"
  echo "  Backup source:        $BKP_DIR"
  echo "  Backup created:       $TS_ORIG (by $AUTHOR)"
  echo "  Pre-promote commit:   $PRE_COMMIT"
  echo "  Post-promote commit:  $POST_COMMIT (commit che sarà revertito)"
  echo "  Target prod:          $PROD_PATH"
  echo "  Files to restore:     $FILE_COUNT"
  echo "  Drift produzione:     $DRIFT_COUNT file diff vs MANIFEST.files (warning)"
  echo ""
  echo "  Reason originale (motivazione del promote):"
  echo "    $REASON"
  echo ""
  echo "  Commit message preview:"
  echo "    revert(app): restore $ROUTE from backup $BKP_TS"
  echo ""
  echo "  Push: NO (manuale post-commit)"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "Per procedere: $0 --confirmed $ROUTE $BKP_TS"
  exit 0
fi

# ─── CONFIRMED ─────────────────────────────────────────────────────────────
echo "Restoring $ROUTE from backup $BKP_TS..."
echo ""

# Copy backup files → production (excluding MANIFEST.json)
TMP_BKP=$(mktemp -d); trap 'rm -rf "$TMP_BKP"' EXIT
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude='MANIFEST.json' "$BKP_DIR/" "$TMP_BKP/"
  rsync -a --delete "$TMP_BKP/" "$PROD_PATH/"
else
  cp -R "$BKP_DIR/." "$TMP_BKP/"
  rm -f "$TMP_BKP/MANIFEST.json"
  rm -rf "$PROD_PATH"
  cp -R "$TMP_BKP" "$PROD_PATH"
fi

# git add + commit
git add "$PROD_PATH"

PRE_RESTORE_COMMIT="$(git rev-parse HEAD)"
COMMIT_MSG="revert(app): restore $ROUTE from backup $BKP_TS

Restore via /studio:restore.

Backup source: $BKP_DIR
Pre-restore commit: $PRE_RESTORE_COMMIT
MANIFEST.iso_timestamp: $(python3 -c "import json; print(json.load(open('$MANIFEST'))['iso_timestamp'])" 2>/dev/null || echo unknown)

Plan: ~/.claude/plans/voglio-creare-una-skill-magical-castle.md"

if ! git commit -m "$COMMIT_MSG"; then
  echo "ERROR: git commit fallito (husky pre-commit?)" >&2
  echo "Backup intatto. Risolvi violazioni e committa manualmente." >&2
  exit 8
fi

POST_COMMIT="$(git rev-parse HEAD)"

echo ""
echo "✓ Restore complete"
echo "  Pre-restore commit:  $PRE_RESTORE_COMMIT"
echo "  Post-restore commit: $POST_COMMIT"
echo "  Backup source:       $BKP_DIR (intatto, immutabile)"
echo ""
echo "Per pushare: git push origin $(git rev-parse --abbrev-ref HEAD)"
