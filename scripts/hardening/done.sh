#!/usr/bin/env bash
# RTGB done — mark task complete + commit + advance state
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"
require_jq

phase="$(current_phase)"
task="$(current_task)"
title="$(task_field "$phase" "$task" 'title')"
arch="$(task_field "$phase" "$task" 'archetype')"
arch_kind="${arch#B-}"

# Map archetype kind to commit prefix
case "$arch" in
  B-A1)  prefix="deps" ;;
  B-A2)  prefix="config" ;;
  B-A3)  prefix="security" ;;
  B-A4)  prefix="adr" ;;
  B-A5|B-A6) prefix="test" ;;
  B-A7)  prefix="schema" ;;
  B-A8|B-A9) prefix="ui" ;;
  B-A10) prefix="story" ;;
  B-A11) prefix="tokens" ;;
  B-A12) prefix="doc" ;;
  B-A13) prefix="ci" ;;
  B-A14) prefix="obs" ;;
  B-A15) prefix="migration" ;;
  B-A16) prefix="a11y" ;;
  B-A17) prefix="perf" ;;
  B-A18) prefix="refactor" ;;
  *)     prefix="chore" ;;
esac

cd "$REPO_ROOT"

# Commit if there are staged or unstaged changes
if [[ -n "$(git status --porcelain)" ]]; then
  c_blue "Staging all changes…"
  git add -A
  msg="[RTGB][PH${phase#B}-T${task#*.}] ${prefix}: ${title}"
  c_green "Commit: $msg"
  git commit -m "$(printf '%s\n\nCo-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>' "$msg")"
else
  c_amber "No changes to commit (already committed?)"
fi

# Mark task completed in state.json
state_update ".phases[\"$phase\"].tasks |= map(if .id == \"$task\" then .status = \"completed\" else . end)"

# Advance current_task to next pending in phase
nxt="$(next_pending_task "$phase" || true)"
if [[ -n "${nxt}" ]]; then
  state_update ".current_task = \"$nxt\""
  c_green "Advanced current_task → $nxt"
else
  # phase done — close gate
  state_update ".phases[\"$phase\"].status = \"completed\""
  tag_name="rtgb/phase${phase#B}/done"
  if ! git rev-parse "$tag_name" >/dev/null 2>&1; then
    git tag "$tag_name"
    c_green "Phase $phase closed. Tag $tag_name created."
  fi
fi
