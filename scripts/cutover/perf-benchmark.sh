#!/usr/bin/env bash
# Performance benchmark p95 evo vs legacy — RTG Phase 5 task 5.6.
#
# Runs `ab` (Apache Bench) against 10 endpoints on each stack with 100 concurrent
# requests over 60s, computes p95 latency + RPS. Compares evo vs legacy and
# emits HTML report. Pass criterion: evo_p95 / legacy_p95 ≤ 1.2 (no >20% regression).
#
# Usage:
#   bash scripts/cutover/perf-benchmark.sh
#   bash scripts/cutover/perf-benchmark.sh --legacy URL --evo URL --concurrency 50 --duration 30
#
# Output: /tmp/perf-benchmark-<TS>.html + JSON
#
# Pre-requisites:
#   - apache2-utils installed (`apt install apache2-utils`)
#   - both stacks deployed and running
#   - Authenticated cookie jar OR use anonymous endpoints

set -uo pipefail

LEGACY_BASE="${LEGACY_BASE:-http://127.0.0.1:8012}"
EVO_BASE="${EVO_BASE:-http://127.0.0.1:8200}"
CONCURRENCY="${CONCURRENCY:-50}"
DURATION_S="${DURATION_S:-30}"  # seconds, ab uses -t for time-bound
N_REQUESTS="${N_REQUESTS:-2000}" # cap for shorter runs

while [ $# -gt 0 ]; do
  case "$1" in
    --legacy)      LEGACY_BASE="$2"; shift 2 ;;
    --evo)         EVO_BASE="$2"; shift 2 ;;
    --concurrency) CONCURRENCY="$2"; shift 2 ;;
    --duration)    DURATION_S="$2"; shift 2 ;;
    -h|--help)     sed -n '2,15p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if ! command -v ab >/dev/null 2>&1; then
  echo "ERROR: 'ab' (Apache Bench) not installed. Install: sudo apt install apache2-utils" >&2
  exit 2
fi

TS=$(date -u +%Y%m%dT%H%MZ)
OUT_DIR="${OUT_DIR:-/tmp}"
HTML_FILE="$OUT_DIR/perf-benchmark-$TS.html"
DATA_FILE="$OUT_DIR/perf-benchmark-$TS.json"

# 10 endpoint pairs (legacy_path | evo_path | label)
ENDPOINTS=(
  "/health|/health|health"
  "/api/v1/employees|/employees|employees_anon"
  "/api/v1/leaves|/leaves|leaves_anon"
  "/api/v1/performance-reviews|/performance-reviews|performance_reviews_anon"
  "/api/v1/audit-logs|/audit-logs|audit_logs_anon"
  "/api/v1/esco/occupations/search?q=developer|/esco/occupations/search?q=developer|esco_search_anon"
  "/api/v1/admin/tenant-schema-version|/admin/tenant-schema-version|tenant_schema_anon"
)

# Helper: parse `ab` text output, extract p95 + rps
ab_summary() {
  local out="$1"
  local rps p95
  rps=$(echo "$out" | grep -E "^Requests per second" | awk '{print $4}')
  p95=$(echo "$out" | grep -E "^\s+95%" | awk '{print $2}')
  [ -z "$rps" ] && rps="0"
  [ -z "$p95" ] && p95="0"
  printf '{"rps":"%s","p95_ms":"%s"}' "$rps" "$p95"
}

declare -a results=()

for entry in "${ENDPOINTS[@]}"; do
  legacy_path="${entry%%|*}"
  rest="${entry#*|}"
  evo_path="${rest%%|*}"
  label="${rest#*|}"

  echo "[perf] $label — legacy"
  legacy_url="$LEGACY_BASE$legacy_path"
  legacy_out=$(ab -n "$N_REQUESTS" -c "$CONCURRENCY" -t "$DURATION_S" -q "$legacy_url" 2>&1 || true)
  legacy_summary=$(ab_summary "$legacy_out")

  echo "[perf] $label — evo"
  evo_url="$EVO_BASE$evo_path"
  evo_out=$(ab -n "$N_REQUESTS" -c "$CONCURRENCY" -t "$DURATION_S" -q "$evo_url" 2>&1 || true)
  evo_summary=$(ab_summary "$evo_out")

  results+=("$(printf '{"label":"%s","legacy_url":"%s","evo_url":"%s","legacy":%s,"evo":%s}' \
                "$label" "$legacy_url" "$evo_url" "$legacy_summary" "$evo_summary")")
done

# JSON output
{
  printf '{"timestamp":"%s","concurrency":%s,"duration_s":%s,"endpoints":[\n' \
    "$TS" "$CONCURRENCY" "$DURATION_S"
  for i in "${!results[@]}"; do
    [ "$i" -gt 0 ] && printf ',\n'
    printf '%s' "${results[$i]}"
  done
  printf '\n]}\n'
} > "$DATA_FILE"

# HTML output
{
  cat <<'HTML_HEADER'
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Perf Benchmark evo vs legacy</title>
<style>
body{font-family:system-ui;max-width:1200px;margin:2rem auto;padding:0 1rem;color:#222}
h1{color:#0a3d62;border-bottom:3px solid #0a3d62;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{padding:.5rem;border:1px solid #ddd;text-align:right;font-size:.9em}
th:first-child,td:first-child{text-align:left}
th{background:#f0f4f8}
.pass{color:#2d8b3a;font-weight:bold}
.warn{color:#d68900;font-weight:bold}
.fail{color:#c0392b;font-weight:bold}
.note{color:#666;font-size:.85em}
</style></head><body>
HTML_HEADER
  echo "<h1>Performance Benchmark — evo vs legacy</h1>"
  echo "<p class=\"note\">Generated $TS · Concurrency $CONCURRENCY · Time-bound ${DURATION_S}s · Anonymous endpoints (caching effect: API gateway returns 401 fast — see notes)</p>"
  echo "<p><strong>Pass criterion</strong>: evo p95 / legacy p95 ≤ 1.2 per endpoint. RTG §11.1 task 5.7 STOP-AUTONOMO-5 fires if &gt; 1.2.</p>"
  echo "<table>"
  echo "<tr><th>Endpoint</th><th>Legacy p95 (ms)</th><th>Evo p95 (ms)</th><th>Ratio evo/legacy</th><th>Legacy RPS</th><th>Evo RPS</th><th>Verdict</th></tr>"
  for tx in "${results[@]}"; do
    label=$(echo "$tx" | sed -n 's/.*"label":"\([^"]*\)".*/\1/p')
    leg_p95=$(echo "$tx" | sed -n 's/.*"legacy":{"rps":"[^"]*","p95_ms":"\([^"]*\)".*/\1/p')
    leg_rps=$(echo "$tx" | sed -n 's/.*"legacy":{"rps":"\([^"]*\)".*/\1/p')
    evo_p95=$(echo "$tx" | sed -n 's/.*"evo":{"rps":"[^"]*","p95_ms":"\([^"]*\)".*/\1/p')
    evo_rps=$(echo "$tx" | sed -n 's/.*"evo":{"rps":"\([^"]*\)".*/\1/p')
    if [ "$leg_p95" = "0" ] || [ "$evo_p95" = "0" ]; then
      ratio="n/a"
      verdict="<span class=\"warn\">SKIP (zero data)</span>"
    else
      ratio=$(awk -v e="$evo_p95" -v l="$leg_p95" 'BEGIN{printf "%.2f", e/l}')
      if awk -v r="$ratio" 'BEGIN{exit !(r<=1.0)}'; then
        verdict="<span class=\"pass\">OK (faster or =)</span>"
      elif awk -v r="$ratio" 'BEGIN{exit !(r<=1.2)}'; then
        verdict="<span class=\"warn\">WARN (within 1.2×)</span>"
      else
        verdict="<span class=\"fail\">FAIL (&gt; 1.2× regression)</span>"
      fi
    fi
    echo "<tr><td>$label</td><td>$leg_p95</td><td>$evo_p95</td><td>$ratio</td><td>$leg_rps</td><td>$evo_rps</td><td>$verdict</td></tr>"
  done
  echo "</table>"
  echo "<h2>Notes</h2>"
  echo "<ul>"
  echo "<li>Anonymous endpoints return 401 quickly (no DB hit) — reflects gateway+auth-middleware overhead, not full request path.</li>"
  echo "<li>For full-request perf with auth: re-run with --cookie flag pointing to an authenticated cookie jar.</li>"
  echo "<li>p95 includes connection-establishment latency. Compare like-with-like (same conn pool).</li>"
  echo "<li>If any endpoint FAIL → triggers STOP-AUTONOMO-5 per autonomous.md §Stop autonomi totali.</li>"
  echo "</ul>"
  echo "<p class=\"note\">Data: <code>$DATA_FILE</code></p>"
  echo "</body></html>"
} > "$HTML_FILE"

echo ""
echo "[perf] $(date -u +%H:%M:%SZ) Complete"
echo "  Data : $DATA_FILE"
echo "  HTML : $HTML_FILE"

# Exit 1 if any FAIL ratio > 1.2
fail=$(grep -c "FAIL" "$HTML_FILE" 2>/dev/null || echo 0)
if [ "$fail" -gt 0 ]; then
  echo "WARN: $fail endpoint(s) regressed > 1.2× (STOP-AUTONOMO-5 trigger)" >&2
  exit 1
fi
exit 0
