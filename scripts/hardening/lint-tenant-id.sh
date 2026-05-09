#!/bin/sh
# L57 (S23-quater) — Tenant_id lint rule (audit issue #9).
#
# Goal: catch Prisma queries on tenant-scoped tables that DON'T use
# withTenant() wrapper AND DON'T pass tenant_id explicitly. This is
# defense-in-depth: RLS catches it (fail-closed = zero rows), but it
# masks bugs (silent empty results vs explicit error).
#
# Heuristic (lightweight, no AST):
#   1. Find prisma.<table>.findMany|findFirst|findUnique|create|update|delete
#      calls in services/api-gateway/src/routes/ + services/app/src/.
#   2. Within ±20 lines, require ONE of:
#      - `withTenant(` wrapping
#      - `tenantId` or `tenant_id` argument literal
#      - `// SAFE:` comment annotation (explicit opt-out for platform-scope reads)
#   3. Report violations as exit-code 1 with file:line.
#
# Pre-commit invocation in .husky/pre-commit (separate gate, only on
# staged .ts/.tsx files in services/).
#
# Run manually:
#   bash scripts/hardening/lint-tenant-id.sh           # all files
#   bash scripts/hardening/lint-tenant-id.sh --staged  # staged only

set -e

STAGED_ONLY=0
if [ "${1:-}" = "--staged" ]; then
  STAGED_ONLY=1
fi

if [ "$STAGED_ONLY" = "1" ]; then
  TARGET_FILES="$(git diff --cached --name-only --diff-filter=ACM | grep -E '^services/(api-gateway|app)/src/.*\.(ts|tsx)$' | grep -v '__tests__' | grep -v '\.test\.' || true)"
else
  TARGET_FILES="$(find services/api-gateway/src services/app/src -type f \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null | grep -v '__tests__' | grep -v '\.test\.' | grep -v '/node_modules/' | grep -v '/generated/' || true)"
fi

if [ -z "$TARGET_FILES" ]; then
  exit 0
fi

# Tables flagged as tenant-scoped (subset; expand as needed).
# These are the high-risk tables where a missing tenant filter = privacy breach.
TENANT_TABLES='employees|users|audit_logs|dashboards|dashboard_presets|dashboard_elements|whistleblowing_messages|whistleblowing_attachments|whistleblowing_audit_log|employee_certifications|employee_skill_assessments|employee_pay_stubs|merit_recommendations|bonus_allocations|salary_band_assignments|interviews|interview_feedback|applications|succession_candidates|mentorship_sessions|survey_questions|survey_responses|course_modules|module_completions|learning_path_courses'

VIOLATIONS=0
TMP_REPORT="$(mktemp)"

for f in $TARGET_FILES; do
  [ ! -f "$f" ] && continue

  # Find prisma.<tenant_table>.<verb>( calls
  matches="$(grep -nE "(prisma|tx)\.(${TENANT_TABLES})\.(findMany|findFirst|findUnique|findUniqueOrThrow|create|update|updateMany|delete|deleteMany|upsert|count)\(" "$f" 2>/dev/null || true)"
  [ -z "$matches" ] && continue

  echo "$matches" | while IFS=: read -r line_num content; do
    [ -z "$line_num" ] && continue

    # Capture ±20 lines context
    start=$((line_num > 20 ? line_num - 20 : 1))
    end=$((line_num + 20))
    context="$(sed -n "${start},${end}p" "$f" 2>/dev/null)"

    # Check guards: withTenant() / tenantId arg / // SAFE: comment
    if echo "$context" | grep -qE 'withTenant\(' ; then
      continue
    fi
    if echo "$context" | grep -qE '(tenant_?[Ii]d:|tenant_?[Ii]d =)'; then
      continue
    fi
    # // SAFE: annotation in the line itself or in the 3 preceding lines
    safe_start=$((line_num > 3 ? line_num - 3 : 1))
    safe_block="$(sed -n "${safe_start},${line_num}p" "$f" 2>/dev/null)"
    if echo "$safe_block" | grep -q '// SAFE:'; then
      continue
    fi

    echo "  $f:$line_num: $content" >> "$TMP_REPORT"
  done
done

if [ -s "$TMP_REPORT" ]; then
  echo "[lint-tenant-id] Possible un-scoped tenant queries (audit issue #9):" >&2
  cat "$TMP_REPORT" >&2
  echo "" >&2
  echo "  Wrap calls in withTenant(tenantId, async (tx) => ...)," >&2
  echo "  pass tenantId in where clause," >&2
  echo "  or annotate the call line with '// SAFE: <reason>' for platform-scope reads." >&2
  VIOLATIONS=1
fi

rm -f "$TMP_REPORT"
exit $VIOLATIONS
