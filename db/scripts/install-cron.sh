#!/bin/bash
# Install or update the daily backup cron entry for the current user (ubuntu on VM).
#
# Usage:  bash db/scripts/install-cron.sh
#
# Behavior:
#   - Adds (or updates) a cron entry that runs backup-and-rotate.sh daily at 03:00 UTC
#   - Idempotent: re-running replaces the existing entry instead of duplicating
#   - Log file: $HOME/heuresys-evo-backup.log
#
# Override defaults via env:
#   CRON_SCHEDULE  (default: "0 3 * * *")  — daily 03:00 UTC
#   LOG_FILE       (default: $HOME/heuresys-evo-backup.log)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-and-rotate.sh"

if [ ! -x "$BACKUP_SCRIPT" ]; then
  echo "ERROR: backup script not found or not executable: $BACKUP_SCRIPT" >&2
  exit 1
fi

CRON_SCHEDULE="${CRON_SCHEDULE:-0 3 * * *}"
LOG_FILE="${LOG_FILE:-$HOME/heuresys-evo-backup.log}"
MARKER="# heuresys-evo-backup"

CRON_LINE="$CRON_SCHEDULE $BACKUP_SCRIPT >> $LOG_FILE 2>&1 $MARKER"

# Get current crontab (or empty if none), strip our marker line, append fresh
EXISTING="$(crontab -l 2>/dev/null || true)"
FILTERED="$(echo "$EXISTING" | grep -v -F "$MARKER" || true)"

# Combine and install (printf preserves final newline)
{
  if [ -n "$FILTERED" ]; then
    printf '%s\n' "$FILTERED"
  fi
  printf '%s\n' "$CRON_LINE"
} | crontab -

echo "[install-cron] Installed entry:"
echo "  $CRON_LINE"
echo ""
echo "[install-cron] Current crontab:"
crontab -l
echo ""
echo "[install-cron] Log file: $LOG_FILE"
echo "[install-cron] To test now: bash $BACKUP_SCRIPT"
echo "[install-cron] To remove:   crontab -l | grep -v '$MARKER' | crontab -"
