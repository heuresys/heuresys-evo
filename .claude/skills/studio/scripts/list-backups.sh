#!/usr/bin/env bash
# list-backups.sh — enumera i backup disponibili filtrando per route opzionale
#
# Usage: list-backups.sh [<route>]
#
# Exit codes: 0 sempre (read-only)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

ROUTE="${1:-}"
BACKUP_BASE=".ux-design/.backups"

if [ ! -d "$BACKUP_BASE" ]; then
  echo "WARNING BACKUP_E501: $BACKUP_BASE non esiste"
  echo "(nessun backup esistente)"
  exit 0
fi

if [ -n "$ROUTE" ]; then
  echo "Backup per route: $ROUTE"
  SEARCH_BASE="$BACKUP_BASE/$ROUTE"
  if [ ! -d "$SEARCH_BASE" ]; then
    echo "WARNING BACKUP_E502: nessun backup per route '$ROUTE'"
    exit 0
  fi
else
  echo "Backup disponibili (tutti)"
  SEARCH_BASE="$BACKUP_BASE"
fi

echo "═════════════════════════════════════════════════════════════════════════════"
printf "%-20s %-25s %-15s %s\n" "Route" "Backup-TS" "Author" "Reason"
echo "─────────────────────────────────────────────────────────────────────────────"

FOUND=0
while IFS= read -r -d '' BKP_DIR; do
  REL="${BKP_DIR#$BACKUP_BASE/}"
  ROUTE_PART=$(dirname "$REL")
  BKP_TS_PART=$(basename "$REL")
  AUTHOR="-"
  REASON="-"
  COMMIT="-"
  if [ -f "$BKP_DIR/MANIFEST.json" ]; then
    AUTHOR=$(python3 -c "import json; m=json.load(open('$BKP_DIR/MANIFEST.json')); print(m.get('author',{}).get('name','-')[:13])" 2>/dev/null || echo "-")
    REASON=$(python3 -c "import json; m=json.load(open('$BKP_DIR/MANIFEST.json')); print(m.get('reason','-')[:60])" 2>/dev/null || echo "-")
    COMMIT=$(python3 -c "import json; m=json.load(open('$BKP_DIR/MANIFEST.json')); print((m.get('git',{}) or {}).get('pre_promote_commit','-')[:7])" 2>/dev/null || echo "-")
  else
    REASON="(MANIFEST.json mancante o corrotto)"
  fi
  printf "%-20s %-25s %-15s %s\n" "$ROUTE_PART" "$BKP_TS_PART" "$AUTHOR" "$REASON"
  FOUND=$((FOUND + 1))
done < <(find "$SEARCH_BASE" -mindepth 1 -maxdepth 5 -type d -name '*-pre-promote' -print0 2>/dev/null | sort -rz)

echo "─────────────────────────────────────────────────────────────────────────────"
echo "Totale: $FOUND backup"

if [ "$FOUND" -eq 0 ]; then
  echo "(nessun backup trovato)"
fi
