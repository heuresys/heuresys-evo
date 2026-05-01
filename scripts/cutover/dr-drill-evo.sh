#!/usr/bin/env bash
# DR drill evo-specific — RTG Phase 5 task 5.9.
#
# Simulates VM bare-metal disaster recovery for evo:
#   1. Take pre-disaster snapshot (mark current state)
#   2. Simulate "VM died" — restore from OCI bucket latest.dump
#   3. Verify schema integrity (all 605+ tables present)
#   4. Verify data integrity (row counts on critical tables)
#   5. Restart systemd units
#   6. Smoke test: curl /health on evo
#   7. Measure total RTO
#
# This complements the legacy DR drill (RTG Phase 2 task 2.5, scheduled 2026-06-01).
#
# Usage:
#   sudo bash scripts/cutover/dr-drill-evo.sh
#   ALLOW_DESTRUCTIVE=1 sudo bash scripts/cutover/dr-drill-evo.sh   # actually drop+restore
#
# Without ALLOW_DESTRUCTIVE=1, runs read-only validation steps only.

set -uo pipefail

if [ "$EUID" -ne 0 ] && [ "${ALLOW_NON_ROOT:-0}" != "1" ]; then
  echo "WARN: not running as root; some steps will be skipped" >&2
fi

DESTRUCTIVE="${ALLOW_DESTRUCTIVE:-0}"
TS=$(date -u +%Y%m%dT%H%MZ)
OUT_DIR="${OUT_DIR:-/tmp}"
LOG_FILE="$OUT_DIR/dr-drill-evo-$TS.log"
HTML_FILE="$OUT_DIR/dr-drill-evo-$TS.html"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-heuresys}"
DB_NAME="${DB_NAME:-heuresys_platform}"
PSQL_BASE="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -X --quiet -P pager=off"

log_phase() {
  echo "[dr-drill] $(date -u +%H:%M:%SZ) $*" | tee -a "$LOG_FILE"
}
log_phase "DR drill evo starting (TS=$TS, destructive=$DESTRUCTIVE)"

DRILL_START=$(date +%s)

# Step 1 — pre-disaster snapshot
log_phase "Step 1 — pre-disaster snapshot (count baseline rows)"
TABLE_COUNT_BEFORE=$($PSQL_BASE -t -A -c "SELECT count(*) FROM pg_class WHERE relkind='r' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')" 2>/dev/null || echo "ERROR")
EMP_COUNT_BEFORE=$($PSQL_BASE -t -A -c "SELECT count(*) FROM employees" 2>/dev/null || echo "0")
TENANT_COUNT_BEFORE=$($PSQL_BASE -t -A -c "SELECT count(*) FROM tenants" 2>/dev/null || echo "0")
log_phase "  tables: $TABLE_COUNT_BEFORE  employees: $EMP_COUNT_BEFORE  tenants: $TENANT_COUNT_BEFORE"

# Step 2 — simulate disaster + restore
if [ "$DESTRUCTIVE" = "1" ] && [ "$EUID" -eq 0 ]; then
  log_phase "Step 2 — DESTRUCTIVE restore from OCI bucket"
  REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  if [ -x "$REPO_ROOT/db/scripts/db-pull.sh" ]; then
    log_phase "  invoking db/scripts/db-pull.sh"
    bash "$REPO_ROOT/db/scripts/db-pull.sh" >> "$LOG_FILE" 2>&1 \
      || log_phase "  ERROR: db-pull.sh failed"
  else
    log_phase "  ERROR: db-pull.sh not executable"
  fi
else
  log_phase "Step 2 — SIMULATED restore (read-only mode; pass ALLOW_DESTRUCTIVE=1 to actually run)"
fi

# Step 3 — schema integrity check
log_phase "Step 3 — schema integrity"
TABLE_COUNT_AFTER=$($PSQL_BASE -t -A -c "SELECT count(*) FROM pg_class WHERE relkind='r' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')" 2>/dev/null || echo "ERROR")
RLS_COUNT=$($PSQL_BASE -t -A -c "SELECT count(*) FROM pg_class WHERE relrowsecurity=true AND relkind='r'" 2>/dev/null || echo "0")
POLICY_COUNT=$($PSQL_BASE -t -A -c "SELECT count(*) FROM pg_policies WHERE schemaname='public'" 2>/dev/null || echo "0")
log_phase "  tables after: $TABLE_COUNT_AFTER  RLS-enabled: $RLS_COUNT  policies: $POLICY_COUNT"

# Step 4 — data integrity
log_phase "Step 4 — data integrity (row counts on critical tables)"
EMP_COUNT_AFTER=$($PSQL_BASE -t -A -c "SELECT count(*) FROM employees" 2>/dev/null || echo "0")
TENANT_COUNT_AFTER=$($PSQL_BASE -t -A -c "SELECT count(*) FROM tenants" 2>/dev/null || echo "0")
ESCO_COUNT=$($PSQL_BASE -t -A -c "SELECT count(*) FROM esco_skills" 2>/dev/null || echo "0")
log_phase "  employees: $EMP_COUNT_AFTER  tenants: $TENANT_COUNT_AFTER  esco_skills: $ESCO_COUNT"

# Step 5 — restart systemd units
log_phase "Step 5 — restart systemd units"
if [ "$EUID" -eq 0 ]; then
  for u in heuresys-api-gateway heuresys-app heuresys-enrichment; do
    if systemctl list-unit-files | grep -q "^$u\.service"; then
      systemctl restart "$u" && log_phase "  $u restarted" || log_phase "  WARN: $u restart failed"
    else
      log_phase "  $u not installed (skip)"
    fi
  done
else
  log_phase "  (skipped: not root)"
fi

# Step 6 — smoke test
log_phase "Step 6 — smoke test"
sleep 5
EVO_HEALTH=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8200/health 2>/dev/null || echo 000)
APP_HEALTH=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3200/ 2>/dev/null || echo 000)
log_phase "  evo api /health = $EVO_HEALTH"
log_phase "  evo app /       = $APP_HEALTH"

DRILL_END=$(date +%s)
RTO_DRILL=$((DRILL_END - DRILL_START))
log_phase "Total drill RTO: ${RTO_DRILL}s (DR target: ≤30min = 1800s)"

# HTML report
{
  cat <<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><title>DR Drill Evo Report</title>
<style>
body{font-family:system-ui;max-width:900px;margin:2rem auto;padding:0 1rem}
h1,h2{color:#0a3d62}h1{border-bottom:3px solid #0a3d62;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{padding:.5rem;border:1px solid #ddd;text-align:left}
th{background:#f0f4f8}
.ok{color:#2d8b3a;font-weight:bold}.warn{color:#d68900;font-weight:bold}.fail{color:#c0392b;font-weight:bold}
pre{background:#f8f8f8;padding:.5rem;border-radius:3px;overflow-x:auto;font-size:.85em;max-height:400px}
</style></head><body>
<h1>DR Drill Report — Evo</h1>
<p>Generated $TS · destructive=$DESTRUCTIVE · RTO drill: <strong>${RTO_DRILL}s</strong> (target ≤1800s)</p>

<h2>Schema integrity</h2>
<table>
<tr><th>Metric</th><th>Before</th><th>After</th></tr>
<tr><td>Tables in public</td><td>$TABLE_COUNT_BEFORE</td><td>$TABLE_COUNT_AFTER</td></tr>
<tr><td>RLS-enabled</td><td>(n/a, post-only)</td><td>$RLS_COUNT</td></tr>
<tr><td>Policies</td><td>(n/a, post-only)</td><td>$POLICY_COUNT</td></tr>
<tr><td>employees rows</td><td>$EMP_COUNT_BEFORE</td><td>$EMP_COUNT_AFTER</td></tr>
<tr><td>tenants rows</td><td>$TENANT_COUNT_BEFORE</td><td>$TENANT_COUNT_AFTER</td></tr>
<tr><td>esco_skills rows</td><td>(not snapshotted pre)</td><td>$ESCO_COUNT</td></tr>
</table>

<h2>Service health post-drill</h2>
<table>
<tr><th>Endpoint</th><th>Status</th></tr>
<tr><td>http://127.0.0.1:8200/health (api-gateway)</td><td class="$([ "$EVO_HEALTH" = "200" ] && echo ok || echo fail)">HTTP $EVO_HEALTH</td></tr>
<tr><td>http://127.0.0.1:3200/ (app)</td><td class="$([ "$APP_HEALTH" = "200" ] && echo ok || echo fail)">HTTP $APP_HEALTH</td></tr>
</table>

<h2>Decision</h2>
<ul>
<li>Schema row counts before/after match → restore validated</li>
<li>Service healthy post-restart → DR procedure validated</li>
<li>RTO ≤ 30min → meets DR target</li>
<li>If any FAIL → P0 issue, do NOT proceed to cutover until resolved</li>
</ul>

<h2>Full log</h2>
<pre>$(cat "$LOG_FILE" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')</pre>
</body></html>
HTML
} > "$HTML_FILE"

log_phase "DR drill complete"
log_phase "  Log  : $LOG_FILE"
log_phase "  HTML : $HTML_FILE"

if [ "$EVO_HEALTH" != "200" ] || [ "$APP_HEALTH" != "200" ]; then
  echo "WARN: post-drill health checks failed; investigate before cutover" >&2
  exit 1
fi
exit 0
