#!/usr/bin/env bash
# RTGB check — run tier-appropriate gate
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"
require_jq

phase="$(current_phase)"
task="$(current_task)"
tier="$(task_field "$phase" "$task" 'tier')"

cd "$REPO_ROOT"

c_blue "=== RTGB check (tier=$tier, task=$task) ==="

run_t1() {
  c_blue "[T1] lint + typecheck (best-effort across workspaces)"
  npm run lint --if-present 2>&1 | tail -20 || c_amber "lint: no-op or errors (T1 reports only)"
  npm run typecheck --if-present 2>&1 | tail -20 || c_amber "typecheck: errors (T1 reports only)"
  c_green "[T1] done"
}

run_t2() {
  run_t1
  c_blue "[T2] test:unit + npm audit"
  npm run test --if-present 2>&1 | tail -20 || c_amber "test: errors (T2 reports only)"
  npm audit --omit=dev 2>&1 | tail -10 || c_amber "audit: prod vulnerabilities (T2 reports only)"
  c_green "[T2] done"
}

run_t3() {
  run_t2
  c_blue "[T3] full test + integration + coverage check"
  npm run test:integration --if-present 2>&1 | tail -20 || c_amber "test:integration: missing or errors"
  c_green "[T3] done (manual coverage check needed: run scripts/hardening/coverage)"
}

run_t4() {
  run_t3
  c_blue "[T4] end-of-phase: storybook + bundle size + a11y (manual go/no-go)"
  c_amber "[T4] manual checklist: see ROAD_TO_GLORY_EVO_HARDENING.md §19"
}

case "$tier" in
  T1) run_t1 ;;
  T2) run_t2 ;;
  T3) run_t3 ;;
  T4) run_t4 ;;
  *)  c_red "Unknown tier: $tier"; exit 2 ;;
esac
