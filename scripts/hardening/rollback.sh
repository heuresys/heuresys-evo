#!/usr/bin/env bash
# RTGB rollback — revert last task commit + reset state
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"
require_jq

cd "$REPO_ROOT"

# Find last RTGB commit
last_sha="$(git log --grep='^\[RTGB\]' -n1 --format=%H || true)"
[[ -n "$last_sha" ]] || { c_red "No RTGB commit to rollback"; exit 1; }

last_msg="$(git log -n1 --format=%s "$last_sha")"
c_amber "Last RTGB commit: $last_sha"
c_amber "Message: $last_msg"
echo
read -r -p "Revert this commit? [y/N] " ans
[[ "$ans" =~ ^[Yy] ]] || { c_dim "Aborted."; exit 0; }

git revert --no-edit "$last_sha" -m1 2>/dev/null || git revert --no-edit "$last_sha"

# Note: state.json must be manually re-aligned if needed.
c_amber "State.json NOT auto-rewound. Edit manually if task should be re-opened."
c_green "Rollback commit created."
