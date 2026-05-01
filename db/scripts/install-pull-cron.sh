#!/bin/bash
# Install or update the daily pull cron entry for the VM evo-db replica
# (RTG Phase 5 task 5.3).
#
# Pulls latest.dump from OCI bucket `heuresys-evo-backups` daily at 04:30 UTC
# (offset from legacy backup-and-rotate at 03:00 UTC and from PC source-of-truth
# push window). The VM bare-metal DBMS is a read-only mirror of the PC SoT.
#
# Usage:  bash db/scripts/install-pull-cron.sh
#
# Behavior:
#   - Adds (or updates) a cron entry that runs db-pull.sh daily at 04:30 UTC
#   - Idempotent: re-running replaces the existing entry instead of duplicating
#   - Log file: $HOME/heuresys-evo-pull.log (rotated by logrotate if configured)
#
# Override defaults via env:
#   CRON_SCHEDULE  (default: "30 4 * * *")  — daily 04:30 UTC
#   LOG_FILE       (default: $HOME/heuresys-evo-pull.log)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PULL_SCRIPT="$SCRIPT_DIR/db-pull.sh"

if [ ! -x "$PULL_SCRIPT" ]; then
  echo "ERROR: pull script not found or not executable: $PULL_SCRIPT" >&2
  exit 1
fi

CRON_SCHEDULE="${CRON_SCHEDULE:-30 4 * * *}"
LOG_FILE="${LOG_FILE:-$HOME/heuresys-evo-pull.log}"
MARKER="# heuresys-evo-pull"

CRON_LINE="$CRON_SCHEDULE $PULL_SCRIPT >> $LOG_FILE 2>&1 $MARKER"

# Read current crontab (may be empty), strip prior pull entry, append new.
current=$(crontab -l 2>/dev/null || true)
without_marker=$(printf '%s\n' "$current" | grep -v "$MARKER" || true)
new_crontab=$(printf '%s\n%s\n' "$without_marker" "$CRON_LINE")

# Apply
printf '%s\n' "$new_crontab" | crontab -

echo "Installed cron entry:"
echo "  $CRON_LINE"
echo ""
echo "Verify:"
echo "  crontab -l | grep heuresys-evo-pull"
echo "  tail -f $LOG_FILE"
