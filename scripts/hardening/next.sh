#!/usr/bin/env bash
# RTGB next — what should I do now?
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"
require_jq

phase="$(current_phase)"
task="$(current_task)"
title="$(task_field "$phase" "$task" 'title')"
tier="$(task_field "$phase" "$task" 'tier')"
arch="$(task_field "$phase" "$task" 'archetype')"
status="$(task_field "$phase" "$task" 'status')"

c_blue "=== RTGB next ==="
c_dim  "Roadmap: $ROADMAP_FILE"
echo
c_green "Phase:    $phase"
c_green "Task:     $task ($status)"
c_green "Title:    $title"
c_green "Tier:     $tier"
c_green "Archetype: $arch"
echo

# next pending task suggestion
nxt="$(next_pending_task "$phase" || true)"
if [[ -n "${nxt}" && "${nxt}" != "${task}" ]]; then
  c_amber "Next pending in same phase: $nxt"
fi

c_dim "Use:  scripts/hardening/check    # run tier gate"
c_dim "Use:  scripts/hardening/done     # mark task complete + commit"
c_dim "Use:  scripts/hardening/status   # dashboard"
