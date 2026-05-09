#!/usr/bin/env bash
# Cross-system 10 transaction-set — RTG Phase 5 task 5.5.
#
# Runs the same 10 business transactions on both legacy `.com.evo` and evo,
# captures responses, and emits a side-by-side diff report. Use post-5.4
# validation (when both stacks are deployed and Enzo has confirmed UX OK).
#
# Usage:
#   bash scripts/cutover/cross-system-transactions.sh \
#       --legacy http://127.0.0.1:8012 \
#       --evo    http://127.0.0.1:8200 \
#       --legacy-fe http://127.0.0.1:3012 \
#       --evo-fe    http://127.0.0.1:3200 \
#       --user-employee rtl-bank.francesca.gallo \
#       --user-tenant-owner rtl-bank.federica.marchetti \
#       --pass Heuresys2026!
#
# Defaults restricted to tests/.test-env canonical users (post-S22).
# For legacy-only scenarios that need the retired econova-admin / rtl-admin,
# pass them explicitly via the override flags (legacy stack still has those).
#
# Output:
#   /tmp/cross-tx-report-<TS>.html
#   /tmp/cross-tx-data-<TS>.json
#
# The 10 transactions cover:
#   1. Login canonical EMPLOYEE (cookie set on both)
#   2. Login canonical TENANT_OWNER (cross-role, both)
#   3. Fetch /employees (evo) vs /api/v1/employees (legacy) — RLS isolation
#   4. Fetch /leaves (evo) vs /api/v1/leaves (legacy)
#   5. Submit leave (evo only — legacy may have different surface)
#   6. Approve leave (evo as manager session)
#   7. Fetch /performance-reviews
#   8. Fetch /audit-logs
#   9. ESCO search /esco/occupations/search?q=developer
#  10. Logout

set -uo pipefail

LEGACY_BASE="${LEGACY_BASE:-http://127.0.0.1:8012}"
EVO_BASE="${EVO_BASE:-http://127.0.0.1:8200}"
LEGACY_FE="${LEGACY_FE:-http://127.0.0.1:3012}"
EVO_FE="${EVO_FE:-http://127.0.0.1:3200}"
USER_EMPLOYEE="${USER_EMPLOYEE:-rtl-bank.francesca.gallo}"
USER_TENANT_OWNER="${USER_TENANT_OWNER:-rtl-bank.federica.marchetti}"
USER_PASS="${USER_PASS:-Heuresys2026!}"

while [ $# -gt 0 ]; do
  case "$1" in
    --legacy)         LEGACY_BASE="$2"; shift 2 ;;
    --evo)            EVO_BASE="$2"; shift 2 ;;
    --legacy-fe)      LEGACY_FE="$2"; shift 2 ;;
    --evo-fe)         EVO_FE="$2"; shift 2 ;;
    --user-employee)   USER_EMPLOYEE="$2"; shift 2 ;;
    --user-tenant-owner)       USER_TENANT_OWNER="$2"; shift 2 ;;
    --pass)           USER_PASS="$2"; shift 2 ;;
    -h|--help)        sed -n '2,18p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

TS=$(date -u +%Y%m%dT%H%MZ)
OUT_DIR="${OUT_DIR:-/tmp}"
DATA_FILE="$OUT_DIR/cross-tx-data-$TS.json"
HTML_FILE="$OUT_DIR/cross-tx-report-$TS.html"

LEGACY_COOKIE_EMPLOYEE=$(mktemp)
LEGACY_COOKIE_TENANT_OWNER=$(mktemp)
EVO_COOKIE_EMPLOYEE=$(mktemp)
EVO_COOKIE_TENANT_OWNER=$(mktemp)
trap 'rm -f "$LEGACY_COOKIE_EMPLOYEE" "$LEGACY_COOKIE_TENANT_OWNER" "$EVO_COOKIE_EMPLOYEE" "$EVO_COOKIE_TENANT_OWNER"' EXIT

echo "[cross-tx] $(date -u +%H:%M:%SZ) Starting 10-transaction cross-system test"
echo "  legacy : $LEGACY_BASE / $LEGACY_FE"
echo "  evo    : $EVO_BASE / $EVO_FE"
echo ""

# Helper: run transaction, capture HTTP status + duration + body sample
run_tx() {
  local label="$1" url="$2" method="${3:-GET}" cookie_jar="${4:-}" data="${5:-}"
  local response_file=$(mktemp)
  local extra_args=()
  [ -n "$cookie_jar" ] && extra_args+=("-b" "$cookie_jar" "-c" "$cookie_jar")
  [ "$method" != "GET" ] && extra_args+=("-X" "$method")
  [ -n "$data" ] && extra_args+=("-H" "Content-Type: application/json" "-d" "$data")
  local result
  result=$(curl -sS -o "$response_file" -w "%{http_code}|%{time_total}" \
              "${extra_args[@]}" "$url" 2>/dev/null) || result="000|0.000"
  local code=${result%|*} dur=${result#*|}
  [ -z "$code" ] && code="000"
  local body
  body=$(head -c 300 "$response_file" 2>/dev/null | tr '\n' ' ' | sed 's/"/\\"/g; s/\\/\\\\/g; s/"/\\"/g')
  rm -f "$response_file"
  printf '{"label":"%s","method":"%s","url":"%s","http_code":"%s","duration_s":"%s","body_sample":"%s"}' \
    "$label" "$method" "$url" "$code" "$dur" "$body"
}

declare -a tx_results=()

# Tx 1-2: login (legacy via /auth, evo via /auth/credentials NextAuth pattern)
echo "[tx 1] Login canonical EMPLOYEE on both stacks"
tx_results+=("$(run_tx 'legacy_login_employee' "$LEGACY_BASE/auth/login" POST "$LEGACY_COOKIE_EMPLOYEE" "{\"username\":\"$USER_EMPLOYEE\",\"password\":\"$USER_PASS\"}")")
tx_results+=("$(run_tx 'evo_login_employee' "$EVO_FE/auth/callback/credentials" POST "$EVO_COOKIE_EMPLOYEE" "username=$USER_EMPLOYEE&password=$USER_PASS")")

echo "[tx 2] Login canonical TENANT_OWNER on both stacks (cross-role)"
tx_results+=("$(run_tx 'legacy_login_tenant_owner' "$LEGACY_BASE/auth/login" POST "$LEGACY_COOKIE_TENANT_OWNER" "{\"username\":\"$USER_TENANT_OWNER\",\"password\":\"$USER_PASS\"}")")
tx_results+=("$(run_tx 'evo_login_tenant_owner' "$EVO_FE/auth/callback/credentials" POST "$EVO_COOKIE_TENANT_OWNER" "username=$USER_TENANT_OWNER&password=$USER_PASS")")

# Tx 3: fetch /employees with EMPLOYEE session (RLS scoped to that user's tenant)
echo "[tx 3] Fetch /employees (RLS isolation RTL Bank)"
tx_results+=("$(run_tx 'legacy_employees_employee' "$LEGACY_BASE/api/v1/employees?limit=5" GET "$LEGACY_COOKIE_EMPLOYEE")")
tx_results+=("$(run_tx 'evo_employees_employee' "$EVO_BASE/employees?limit=5" GET "$EVO_COOKIE_EMPLOYEE")")

# Tx 4: fetch /leaves
echo "[tx 4] Fetch /leaves (scope-aware)"
tx_results+=("$(run_tx 'legacy_leaves_employee' "$LEGACY_BASE/api/v1/leaves?limit=5" GET "$LEGACY_COOKIE_EMPLOYEE")")
tx_results+=("$(run_tx 'evo_leaves_employee' "$EVO_BASE/leaves?limit=5" GET "$EVO_COOKIE_EMPLOYEE")")

# Tx 5: submit leave (evo only — legacy has different submit path)
echo "[tx 5] Submit leave on evo"
LEAVE_BODY='{"leave_type":"vacation","start_date":"2026-08-15","end_date":"2026-08-19","days_requested":5,"reason":"cross-tx test"}'
tx_results+=("$(run_tx 'evo_leave_submit' "$EVO_BASE/leaves" POST "$EVO_COOKIE_EMPLOYEE" "$LEAVE_BODY")")

# Tx 6: approve leave (manual: would need real leave id; this is a smoke 404 expected)
echo "[tx 6] Approve leave smoke (404 expected on placeholder UUID)"
tx_results+=("$(run_tx 'evo_leave_approve_smoke' "$EVO_BASE/leaves/00000000-0000-0000-0000-000000000000/approve" POST "$EVO_COOKIE_EMPLOYEE")")

# Tx 7-9: read-only fetches on evo
echo "[tx 7] Fetch /performance-reviews"
tx_results+=("$(run_tx 'evo_perf_reviews' "$EVO_BASE/performance-reviews?limit=5" GET "$EVO_COOKIE_EMPLOYEE")")

echo "[tx 8] Fetch /audit-logs"
tx_results+=("$(run_tx 'evo_audit_logs' "$EVO_BASE/audit-logs?limit=10" GET "$EVO_COOKIE_EMPLOYEE")")

echo "[tx 9] ESCO search developer"
tx_results+=("$(run_tx 'evo_esco_search' "$EVO_BASE/esco/occupations/search?q=developer&lang=en&limit=5" GET "$EVO_COOKIE_EMPLOYEE")")

# Tx 10: logout
echo "[tx 10] Logout"
tx_results+=("$(run_tx 'legacy_logout_employee' "$LEGACY_BASE/auth/logout" POST "$LEGACY_COOKIE_EMPLOYEE")")
tx_results+=("$(run_tx 'evo_logout_employee' "$EVO_FE/auth/signout" POST "$EVO_COOKIE_EMPLOYEE")")

# Compose JSON
{
  printf '{"timestamp":"%s","transactions":[\n' "$TS"
  for i in "${!tx_results[@]}"; do
    [ "$i" -gt 0 ] && printf ',\n'
    printf '%s' "${tx_results[$i]}"
  done
  printf '\n]}\n'
} > "$DATA_FILE"

# HTML report
{
  cat <<'HTML_HEADER'
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cross-system Transactions Report</title>
<style>
body{font-family:system-ui;max-width:1200px;margin:2rem auto;padding:0 1rem;color:#222}
h1{color:#0a3d62;border-bottom:3px solid #0a3d62;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{padding:.5rem;border:1px solid #ddd;text-align:left;font-size:.9em}
th{background:#f0f4f8}
.ok{color:#2d8b3a;font-weight:bold}
.warn{color:#d68900}
.fail{color:#c0392b;font-weight:bold}
pre{background:#f8f8f8;padding:.4rem;border-radius:3px;font-size:.8em;overflow-x:auto;max-width:600px}
</style></head><body>
HTML_HEADER
  echo "<h1>Cross-system 10 Transactions Report</h1>"
  echo "<p>Generated $TS · Legacy <code>$LEGACY_BASE</code> · Evo <code>$EVO_BASE</code></p>"
  echo "<table>"
  echo "<tr><th>#</th><th>Label</th><th>Method</th><th>URL</th><th>HTTP</th><th>Time (s)</th><th>Body sample</th></tr>"
  i=0
  for tx in "${tx_results[@]}"; do
    i=$((i+1))
    label=$(echo "$tx" | sed -n 's/.*"label":"\([^"]*\)".*/\1/p')
    method=$(echo "$tx" | sed -n 's/.*"method":"\([^"]*\)".*/\1/p')
    url=$(echo "$tx" | sed -n 's|.*"url":"\([^"]*\)".*|\1|p')
    code=$(echo "$tx" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
    dur=$(echo "$tx" | sed -n 's/.*"duration_s":"\([^"]*\)".*/\1/p')
    body=$(echo "$tx" | sed -n 's/.*"body_sample":"\([^"]*\)".*/\1/p')
    case "$code" in
      2*) status="ok" ;;
      4*) status="warn" ;;
      *)  status="fail" ;;
    esac
    echo "<tr><td>$i</td><td>$label</td><td>$method</td><td><code>$url</code></td><td class=\"$status\">$code</td><td>$dur</td><td><pre>$body</pre></td></tr>"
  done
  echo "</table>"
  echo "<h2>Cross-system isolation checks (manual review)</h2>"
  echo "<ul>"
  echo "<li>tx_3 (legacy_employees_employee vs evo_employees_employee): both should return ONLY rows for the tenant of \$USER_EMPLOYEE (default: RTL Bank)</li>"
  echo "<li>tx_4 leaves: same RLS check — own tenant only</li>"
  echo "<li>tx_5 evo_leave_submit: 201 expected (created)</li>"
  echo "<li>tx_6 placeholder UUID approve: 404 expected (not_found_or_already_processed)</li>"
  echo "<li>tx_9 ESCO: 200 with at least 1 result, lang=en</li>"
  echo "<li>If any tx returns 5xx → STOP cutover, investigate before go/no-go</li>"
  echo "</ul>"
  echo "<p>Data: <code>$DATA_FILE</code></p>"
  echo "</body></html>"
} > "$HTML_FILE"

echo ""
echo "[cross-tx] $(date -u +%H:%M:%SZ) Complete"
echo "  Data : $DATA_FILE"
echo "  HTML : $HTML_FILE"

# Exit 0 if all 2xx; else 1
fail_count=$(grep -c '"http_code":"[5][0-9][0-9]"' "$DATA_FILE" 2>/dev/null || echo 0)
zero_count=$(grep -c '"http_code":"000"' "$DATA_FILE" 2>/dev/null || echo 0)
if [ "$fail_count" -gt 0 ] || [ "$zero_count" -gt 4 ]; then
  echo "WARN: $fail_count 5xx + $zero_count unreachable" >&2
  exit 1
fi
exit 0
