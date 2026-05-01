#!/usr/bin/env bash
# Parallel run validation script — RTG Phase 5 task 5.4 (STOP AUTONOMO 4).
#
# Compares the same business-logic surface across legacy `.com.evo` and evo
# `heuresys-evo` running side-by-side on the same VM (different ports +
# different DB schemas). Produces an HTML report for human (Enzo) review.
#
# Usage:
#   bash scripts/parallel-run-validate.sh
#   bash scripts/parallel-run-validate.sh --legacy http://127.0.0.1:8012 --evo http://127.0.0.1:8200
#
# Output:
#   /tmp/parallel-run-report-<TS>.html
#   /tmp/parallel-run-data-<TS>.json
#
# Exit codes:
#   0 — all critical comparisons OK (still requires human visual review)
#   1 — at least one critical comparison FAILED
#   2 — script error (e.g. legacy or evo unreachable)

set -uo pipefail

LEGACY_BASE="${LEGACY_BASE:-http://127.0.0.1:8012}"
EVO_BASE="${EVO_BASE:-http://127.0.0.1:8200}"
LEGACY_FE="${LEGACY_FE:-http://127.0.0.1:3012}"
EVO_FE="${EVO_FE:-http://127.0.0.1:3200}"

while [ $# -gt 0 ]; do
  case "$1" in
    --legacy)    LEGACY_BASE="$2"; shift 2 ;;
    --evo)       EVO_BASE="$2"; shift 2 ;;
    --legacy-fe) LEGACY_FE="$2"; shift 2 ;;
    --evo-fe)    EVO_FE="$2"; shift 2 ;;
    -h|--help)   sed -n '2,16p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

TS=$(date -u +%Y%m%dT%H%MZ)
OUT_DIR="${OUT_DIR:-/tmp}"
DATA_FILE="$OUT_DIR/parallel-run-data-$TS.json"
HTML_FILE="$OUT_DIR/parallel-run-report-$TS.html"

echo "[parallel-run] $(date -u +%H:%M:%SZ) Starting validation"
echo "  legacy api : $LEGACY_BASE"
echo "  evo api    : $EVO_BASE"
echo "  legacy fe  : $LEGACY_FE"
echo "  evo fe     : $EVO_FE"
echo ""

# -------------------------------------------------------------------------
# Helper: hit endpoint, capture status + duration + body sample
# -------------------------------------------------------------------------
fetch_summary() {
  local label="$1"
  local url="$2"
  local body status http_code duration response_file
  response_file=$(mktemp)
  status=$(curl -sS -o "$response_file" -w "%{http_code}|%{time_total}" "$url" 2>/dev/null) || status=""
  if [ -z "$status" ] || [ "${status%|*}" = "000" ]; then
    http_code="000"
    duration="0.000"
  else
    http_code=${status%|*}
    duration=${status#*|}
  fi
  body=$(head -c 500 "$response_file" 2>/dev/null | tr '\n' ' ' | sed 's/"/\\"/g')
  rm -f "$response_file"
  printf '{"label":"%s","url":"%s","http_code":"%s","duration_s":"%s","body_sample":"%s"}' \
    "$label" "$url" "$http_code" "$duration" "$body"
}

# -------------------------------------------------------------------------
# Reachability checks (both stacks must be up)
# -------------------------------------------------------------------------
echo "[reachability]"
probe_code() {
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$1" 2>/dev/null) || code=""
  [ -z "$code" ] && code="000"
  printf '%s' "$code"
}
LEGACY_HEALTH=$(probe_code "$LEGACY_BASE/health")
EVO_HEALTH=$(probe_code "$EVO_BASE/health")
LEGACY_FE_OK=$(probe_code "$LEGACY_FE/")
EVO_FE_OK=$(probe_code "$EVO_FE/")
echo "  legacy /health   : HTTP $LEGACY_HEALTH"
echo "  evo /health      : HTTP $EVO_HEALTH"
echo "  legacy /         : HTTP $LEGACY_FE_OK"
echo "  evo /            : HTTP $EVO_FE_OK"
echo ""

# -------------------------------------------------------------------------
# Endpoint probes (anonymous — both should reject with 401, validate
# rejection format symmetry)
# -------------------------------------------------------------------------
echo "[endpoint probes — anonymous]"
PROBE_LEG_EMP=$(fetch_summary "legacy_employees_anon" "$LEGACY_BASE/api/v1/employees")
PROBE_EVO_EMP=$(fetch_summary "evo_employees_anon" "$EVO_BASE/employees")
PROBE_LEG_LEAVES=$(fetch_summary "legacy_leaves_anon" "$LEGACY_BASE/api/v1/leaves")
PROBE_EVO_LEAVES=$(fetch_summary "evo_leaves_anon" "$EVO_BASE/leaves")
PROBE_LEG_REVIEWS=$(fetch_summary "legacy_reviews_anon" "$LEGACY_BASE/api/v1/performance-reviews")
PROBE_EVO_REVIEWS=$(fetch_summary "evo_reviews_anon" "$EVO_BASE/performance-reviews")
PROBE_LEG_AUDIT=$(fetch_summary "legacy_audit_anon" "$LEGACY_BASE/api/v1/audit-logs")
PROBE_EVO_AUDIT=$(fetch_summary "evo_audit_anon" "$EVO_BASE/audit-logs")

# -------------------------------------------------------------------------
# Compose JSON data
# -------------------------------------------------------------------------
cat > "$DATA_FILE" <<JSON
{
  "timestamp": "$TS",
  "config": {
    "legacy_base": "$LEGACY_BASE",
    "evo_base": "$EVO_BASE",
    "legacy_fe": "$LEGACY_FE",
    "evo_fe": "$EVO_FE"
  },
  "reachability": {
    "legacy_api_health": "$LEGACY_HEALTH",
    "evo_api_health": "$EVO_HEALTH",
    "legacy_fe_root": "$LEGACY_FE_OK",
    "evo_fe_root": "$EVO_FE_OK"
  },
  "probes_anonymous": [
    $PROBE_LEG_EMP, $PROBE_EVO_EMP,
    $PROBE_LEG_LEAVES, $PROBE_EVO_LEAVES,
    $PROBE_LEG_REVIEWS, $PROBE_EVO_REVIEWS,
    $PROBE_LEG_AUDIT, $PROBE_EVO_AUDIT
  ],
  "manual_checklist": [
    "Login as employee.test (econova-employee/Heuresys2026!) on both stacks → both should reach /portal or /dashboard",
    "Submit a leave request on evo /portal/leaves and observe legacy /admin/leaves does NOT show it (cross-system isolation)",
    "Approve a leave on evo as manager and observe employee's view updates",
    "Search ESCO occupation 'developer' on evo and observe results returned",
    "Open audit log on evo /admin/audit and confirm it shows recent mutations",
    "Test logout on both stacks; both must clear cookie",
    "Pages: /dashboard, /portal/leaves, /admin/employees, /admin/audit — visual diff legacy vs evo (H Hybrid expected: P0 identici, MVP redesigned different design)"
  ]
}
JSON

# -------------------------------------------------------------------------
# Render HTML report
# -------------------------------------------------------------------------
cat > "$HTML_FILE" <<'HTML_HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Heuresys evo — Parallel Run Validation Report</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 1200px; margin: 2rem auto; padding: 0 1rem; color: #222; }
  h1, h2, h3 { color: #0a3d62; }
  h1 { border-bottom: 3px solid #0a3d62; padding-bottom: .3rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { padding: .5rem .75rem; border: 1px solid #ddd; text-align: left; vertical-align: top; }
  th { background: #f0f4f8; }
  .status-ok { color: #2d8b3a; font-weight: bold; }
  .status-fail { color: #c0392b; font-weight: bold; }
  .status-warn { color: #d68900; font-weight: bold; }
  pre { background: #f8f8f8; padding: .5rem; border-radius: 4px; overflow-x: auto; font-size: .85em; }
  ul.checklist li { margin-bottom: .4rem; }
  .meta { color: #666; font-size: .9em; margin-bottom: 1.5rem; }
</style>
</head>
<body>
HTML_HEADER

cat >> "$HTML_FILE" <<HTML_BODY
<h1>Heuresys evo — Parallel Run Validation Report</h1>
<p class="meta">Generated $TS · Legacy <code>$LEGACY_BASE</code> + <code>$LEGACY_FE</code> · Evo <code>$EVO_BASE</code> + <code>$EVO_FE</code></p>

<h2>1. Reachability</h2>
<table>
  <tr><th>Target</th><th>Endpoint</th><th>Status</th></tr>
  <tr><td>Legacy API</td><td><code>$LEGACY_BASE/health</code></td><td class="$([[ $LEGACY_HEALTH == 2* ]] && echo status-ok || echo status-fail)">HTTP $LEGACY_HEALTH</td></tr>
  <tr><td>Evo API</td><td><code>$EVO_BASE/health</code></td><td class="$([[ $EVO_HEALTH == 2* ]] && echo status-ok || echo status-fail)">HTTP $EVO_HEALTH</td></tr>
  <tr><td>Legacy FE</td><td><code>$LEGACY_FE/</code></td><td class="$([[ $LEGACY_FE_OK == 2* || $LEGACY_FE_OK == 30* ]] && echo status-ok || echo status-fail)">HTTP $LEGACY_FE_OK</td></tr>
  <tr><td>Evo FE</td><td><code>$EVO_FE/</code></td><td class="$([[ $EVO_FE_OK == 2* || $EVO_FE_OK == 30* ]] && echo status-ok || echo status-fail)">HTTP $EVO_FE_OK</td></tr>
</table>

<h2>2. Endpoint probes (anonymous — both must reject)</h2>
<p>Anonymous probes verify that both stacks correctly reject unauthenticated calls.
Legacy returns its own format; evo returns <code>{"error":"unauthorized"}</code>.
Both must be 401.</p>
<table>
  <tr><th>Domain</th><th>Legacy URL</th><th>Status</th><th>Evo URL</th><th>Status</th></tr>
HTML_BODY

# Quick helper for probe row class
status_class() {
  local code="$1"
  if [ "$code" = "401" ]; then echo "status-ok"
  elif [[ "$code" == 2* ]]; then echo "status-warn"  # 200 anon → security issue
  elif [[ "$code" == 4* ]]; then echo "status-warn"  # 4xx other than 401
  else echo "status-fail"
  fi
}
LEG_EMP_CODE=$(echo "$PROBE_LEG_EMP" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
EVO_EMP_CODE=$(echo "$PROBE_EVO_EMP" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
LEG_LEAV_CODE=$(echo "$PROBE_LEG_LEAVES" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
EVO_LEAV_CODE=$(echo "$PROBE_EVO_LEAVES" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
LEG_REV_CODE=$(echo "$PROBE_LEG_REVIEWS" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
EVO_REV_CODE=$(echo "$PROBE_EVO_REVIEWS" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
LEG_AUD_CODE=$(echo "$PROBE_LEG_AUDIT" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')
EVO_AUD_CODE=$(echo "$PROBE_EVO_AUDIT" | sed -n 's/.*"http_code":"\([^"]*\)".*/\1/p')

cat >> "$HTML_FILE" <<HTML_PROBES
  <tr>
    <td>Employees</td>
    <td><code>$LEGACY_BASE/api/v1/employees</code></td><td class="$(status_class "$LEG_EMP_CODE")">$LEG_EMP_CODE</td>
    <td><code>$EVO_BASE/employees</code></td><td class="$(status_class "$EVO_EMP_CODE")">$EVO_EMP_CODE</td>
  </tr>
  <tr>
    <td>Leaves</td>
    <td><code>$LEGACY_BASE/api/v1/leaves</code></td><td class="$(status_class "$LEG_LEAV_CODE")">$LEG_LEAV_CODE</td>
    <td><code>$EVO_BASE/leaves</code></td><td class="$(status_class "$EVO_LEAV_CODE")">$EVO_LEAV_CODE</td>
  </tr>
  <tr>
    <td>Performance reviews</td>
    <td><code>$LEGACY_BASE/api/v1/performance-reviews</code></td><td class="$(status_class "$LEG_REV_CODE")">$LEG_REV_CODE</td>
    <td><code>$EVO_BASE/performance-reviews</code></td><td class="$(status_class "$EVO_REV_CODE")">$EVO_REV_CODE</td>
  </tr>
  <tr>
    <td>Audit logs</td>
    <td><code>$LEGACY_BASE/api/v1/audit-logs</code></td><td class="$(status_class "$LEG_AUD_CODE")">$LEG_AUD_CODE</td>
    <td><code>$EVO_BASE/audit-logs</code></td><td class="$(status_class "$EVO_AUD_CODE")">$EVO_AUD_CODE</td>
  </tr>
</table>

<h2>3. Manual UX validation checklist (Enzo)</h2>
<p>The script can't replace human visual review. Walk through these one by one
on both stacks. Mark each pass/fail and note any divergence.</p>
<ul class="checklist">
  <li>[ ] Login as <code>econova-admin/Heuresys2026!</code> on both stacks — both should reach the dashboard</li>
  <li>[ ] Submit a leave request on evo <code>/portal/leaves</code> and observe legacy <code>/admin/leaves</code> does NOT show it (cross-system isolation expected)</li>
  <li>[ ] Approve a leave on evo as manager and observe employee's view updates (live data flow within evo)</li>
  <li>[ ] Search ESCO occupation 'developer' on evo (<code>/admin/skill-search</code> or via API <code>/esco/occupations/search?q=developer</code>) and observe results</li>
  <li>[ ] Open audit log on evo <code>/admin/audit</code> and confirm it shows recent mutations (post Phase 4 task 4.10)</li>
  <li>[ ] Test logout on both stacks; both must clear cookie + redirect to /login</li>
  <li>[ ] Pages visual diff (H Hybrid scope expected):
    <ul>
      <li><code>/dashboard</code> — P0 preserved, both stacks should look near-identical</li>
      <li><code>/portal/leaves</code> — P0 preserved</li>
      <li><code>/admin/employees</code> — P0 preserved</li>
      <li><code>/admin/audit</code> — P0 preserved</li>
      <li><code>/admin/recruiting/*</code> — MVP redesigned (NEW design from Cantiere B UI library, expect different visual)</li>
    </ul>
  </li>
  <li>[ ] Multi-tenant: log in as both EcoNova and RTL Bank employees; verify each sees only own tenant data on evo (RLS check)</li>
  <li>[ ] Browser console clean (no 4xx/5xx errors) on landing of /dashboard and /portal pages</li>
  <li>[ ] Mobile responsive: open evo on phone viewport (375px); verify navigation + tables don't break</li>
</ul>

<h2>4. Performance baseline (manual)</h2>
<p>Run on each stack and compare. Use Chrome DevTools Network tab "Disable cache + Slow 3G".
Goal post-cutover (Phase 5 task 5.6): evo p95 ≤ legacy p95 × 1.0 (no regression).
Phase 6 task 5.7 will run automated <code>autocannon</code> for repeatable measurements.</p>

<h2>5. Operator decision</h2>
<p>After completing the manual checklist:</p>
<ul>
  <li><strong>UX OK, procedi</strong> → Phase 5 task 5.5 cross-system transactions can begin</li>
  <li><strong>UX issues found</strong> → list issues, classify P0/P1/P2, decide whether each blocks cutover</li>
  <li><strong>Regression critica</strong> → STOP AUTONOMO 5 (Phase 5 task 5.7), remediation discussion with team</li>
</ul>

<p class="meta">Data file: <code>$DATA_FILE</code></p>
</body>
</html>
HTML_PROBES

echo "[parallel-run] $(date -u +%H:%M:%SZ) Validation complete"
echo ""
echo "Artifacts:"
echo "  Data : $DATA_FILE"
echo "  HTML : $HTML_FILE"
echo ""
echo "Next: open the HTML report in a browser to walk through the manual checklist."

# Exit code: 1 if any reachability is FAIL, else 0 (pending human checklist)
if [[ "$LEGACY_HEALTH" == 2* ]] && [[ "$EVO_HEALTH" == 2* ]]; then
  exit 0
else
  echo ""
  echo "WARN: at least one stack is unreachable (see Reachability section in report)" >&2
  exit 1
fi
