#!/usr/bin/env bash
# RTGB hardening helpers — sourced by next/check/done/status/rollback
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATE_DIR="${REPO_ROOT}/.rtg-state-evo"
STATE_FILE="${STATE_DIR}/state.json"
ROADMAP_FILE="/home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md"

c_red()   { printf '\033[31m%s\033[0m\n' "$*"; }
c_green() { printf '\033[32m%s\033[0m\n' "$*"; }
c_amber() { printf '\033[33m%s\033[0m\n' "$*"; }
c_blue()  { printf '\033[34m%s\033[0m\n' "$*"; }
c_dim()   { printf '\033[2m%s\033[0m\n' "$*"; }

require_jq() {
  command -v jq >/dev/null 2>&1 || { c_red "jq required: sudo apt install jq"; exit 2; }
}

state_get() {
  jq -r "$1" "$STATE_FILE"
}

state_update() {
  local tmp
  tmp="$(mktemp)"
  jq "$1" "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

current_phase() { state_get '.current_phase'; }
current_task()  { state_get '.current_task'; }

next_pending_task() {
  local phase="$1"
  state_get ".phases[\"$phase\"].tasks[]? | select(.status == \"pending\" or .status == \"in_progress\") | .id" | head -1
}

task_field() {
  local phase="$1" task_id="$2" field="$3"
  state_get ".phases[\"$phase\"].tasks[]? | select(.id == \"$task_id\") | .$field // \"\""
}
