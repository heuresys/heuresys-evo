#!/usr/bin/env bash
# status.sh — stato consolidato studio workstream
# Per ogni route: staging count, ultimo backup TS, drift produzione vs ultimo backup
#
# Usage: status.sh
#
# Exit codes: 0 sempre (read-only)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

STAGING_BASE=".ux-design/10-staging"
BACKUP_BASE=".ux-design/.backups"
APP_BASE="services/app/src/app"

if command -v sha256sum >/dev/null 2>&1; then
  sha256_of() { sha256sum "$1" | awk '{print $1}'; }
elif command -v shasum >/dev/null 2>&1; then
  sha256_of() { shasum -a 256 "$1" | awk '{print $1}'; }
else
  sha256_of() { echo "no-sha256-tool"; }
fi

echo "Studio workstream — stato consolidato"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# ─── Staging attivi ────────────────────────────────────────────────────────
echo "## Staging attivi"
echo ""
if [ ! -d "$STAGING_BASE" ]; then
  echo "  (nessuno — cartella $STAGING_BASE non esiste)"
else
  printf "  %-30s %-20s %s\n" "Route" "TS" "Status"
  printf "  %-30s %-20s %s\n" "──────────────────────────────" "────────────────────" "──────────"
  FOUND=0
  while IFS= read -r -d '' STAGE_DIR; do
    REL="${STAGE_DIR#$STAGING_BASE/}"
    ROUTE_PART=$(dirname "$REL")
    TS_PART=$(basename "$REL")
    STATUS="draft"
    if [ -f "$STAGE_DIR/README.md" ]; then
      STATUS_LINE=$(grep -E '^\*\*Status\*\*:' "$STAGE_DIR/README.md" 2>/dev/null | head -1 || true)
      if [ -n "$STATUS_LINE" ]; then
        STATUS=$(echo "$STATUS_LINE" | sed -E 's/.*`([^`]+)`.*/\1/')
      fi
    fi
    printf "  %-30s %-20s %s\n" "$ROUTE_PART" "$TS_PART" "$STATUS"
    FOUND=1
  done < <(find "$STAGING_BASE" -mindepth 2 -maxdepth 5 -type d -name '20*-*-*-*' -print0 2>/dev/null | sort -z)
  if [ "$FOUND" -eq 0 ]; then
    echo "  (nessuno staging attivo)"
  fi
fi
echo ""

# ─── Backup disponibili (ultimi 10) ────────────────────────────────────────
echo "## Backup disponibili (ultimi 10 piu' recenti)"
echo ""
if [ ! -d "$BACKUP_BASE" ]; then
  echo "  (nessuno — cartella $BACKUP_BASE non esiste)"
else
  printf "  %-30s %-30s %s\n" "Route" "Backup-TS" "Reason"
  printf "  %-30s %-30s %s\n" "──────────────────────────────" "──────────────────────────────" "──────"
  FOUND=0
  while IFS= read -r -d '' BKP_DIR; do
    REL="${BKP_DIR#$BACKUP_BASE/}"
    ROUTE_PART=$(dirname "$REL")
    BKP_TS_PART=$(basename "$REL")
    REASON="-"
    if [ -f "$BKP_DIR/MANIFEST.json" ]; then
      REASON=$(python3 -c "import json,sys; print(json.load(open('$BKP_DIR/MANIFEST.json')).get('reason','-')[:50])" 2>/dev/null || echo "-")
    fi
    printf "  %-30s %-30s %s\n" "$ROUTE_PART" "$BKP_TS_PART" "$REASON"
    FOUND=$((FOUND + 1))
    [ "$FOUND" -ge 10 ] && break
  done < <(find "$BACKUP_BASE" -mindepth 2 -maxdepth 5 -type d -name '*-pre-promote' -print0 2>/dev/null | sort -rz)
  if [ "$FOUND" -eq 0 ]; then
    echo "  (nessun backup)"
  fi
fi
echo ""

# ─── Drift detection per route con backup ─────────────────────────────────
echo "## Drift produzione vs ultimo backup (per route)"
echo ""
if [ ! -d "$BACKUP_BASE" ]; then
  echo "  (nessun backup esistente)"
else
  printf "  %-30s %s\n" "Route" "Drift status"
  printf "  %-30s %s\n" "──────────────────────────────" "─────────────────"
  for ROUTE_DIR in "$BACKUP_BASE"/*/; do
    [ -d "$ROUTE_DIR" ] || continue
    ROUTE_NAME=$(basename "$ROUTE_DIR")
    LATEST=$(ls -1 "$ROUTE_DIR" 2>/dev/null | grep -E '^[0-9]{4}-' | sort -r | head -1)
    [ -z "$LATEST" ] && continue
    LATEST_PATH="$ROUTE_DIR$LATEST"
    if [ ! -f "$LATEST_PATH/MANIFEST.json" ]; then
      printf "  %-30s %s\n" "$ROUTE_NAME" "MANIFEST mancante"
      continue
    fi
    PROD_PATH="$APP_BASE/$ROUTE_NAME"
    if [ ! -d "$PROD_PATH" ]; then
      printf "  %-30s %s\n" "$ROUTE_NAME" "produzione path mancante"
      continue
    fi
    DRIFT_COUNT=0
    while IFS=$'\t' read -r FPATH FHASH || [ -n "$FPATH" ]; do
      [ -z "$FPATH" ] && continue
      FPATH="${FPATH%$'\r'}"
      FHASH="${FHASH%$'\r'}"
      FULL="$PROD_PATH/$FPATH"
      if [ -f "$FULL" ]; then
        ACTUAL=$(sha256_of "$FULL")
        if [ "$ACTUAL" != "$FHASH" ]; then
          DRIFT_COUNT=$((DRIFT_COUNT + 1))
        fi
      else
        DRIFT_COUNT=$((DRIFT_COUNT + 1))
      fi
    done < <(python3 -c "
import sys, json
m = json.load(open('$LATEST_PATH/MANIFEST.json'))
for f in m.get('files', []):
    sys.stdout.write(f['path'] + chr(9) + f['sha256'] + chr(10))
" 2>/dev/null || true)
    if [ "$DRIFT_COUNT" -eq 0 ]; then
      printf "  %-30s %s\n" "$ROUTE_NAME" "✓ in sync ($LATEST)"
    else
      printf "  %-30s %s\n" "$ROUTE_NAME" "⚠ $DRIFT_COUNT file diff vs $LATEST"
    fi
  done
fi
echo ""
echo "═════════════════════════════════════════════════════════════════"
