#!/usr/bin/env bash
# Cutover dry-run — RTG Phase 5 task 5.7.
#
# Simulates the cutover sequence without affecting real DNS:
#   1. Pre-cutover smoke: both stacks healthy
#   2. Stop legacy (5min downtime simulation) → verify connections drop
#   3. "DNS switch" simulated via /etc/hosts override on this machine only
#   4. 100% traffic → evo: run cross-system-transactions.sh
#   5. Rollback: re-enable legacy, revert /etc/hosts
#   6. Measure RTO actual + report
#
# This script does NOT modify production DNS. It exercises the procedure
# locally on the VM.
#
# Usage:
#   sudo bash scripts/cutover/dry-run-cutover.sh
#   (must be root for /etc/hosts modification + systemctl)
#
# Output: /tmp/dry-run-cutover-<TS>.log + /tmp/dry-run-cutover-<TS>.html

set -uo pipefail

if [ "$EUID" -ne 0 ] && [ "${ALLOW_NON_ROOT:-0}" != "1" ]; then
  echo "WARN: not running as root — /etc/hosts and systemctl operations will be skipped" >&2
  echo "      Re-run with: sudo bash $0  (or set ALLOW_NON_ROOT=1 for dry-er run)" >&2
fi

TS=$(date -u +%Y%m%dT%H%MZ)
OUT_DIR="${OUT_DIR:-/tmp}"
LOG_FILE="$OUT_DIR/dry-run-cutover-$TS.log"
HTML_FILE="$OUT_DIR/dry-run-cutover-$TS.html"
HOSTS_BACKUP="/etc/hosts.cutover-backup-$TS"

# Phase tracker
log_phase() {
  echo "[dry-run] $(date -u +%H:%M:%SZ) $*" | tee -a "$LOG_FILE"
}
log_phase "Cutover dry-run starting (timestamp: $TS)"

# -----------------------------------------------------------------------
# Step 1 — Pre-cutover smoke
# -----------------------------------------------------------------------
log_phase "Step 1 — Pre-cutover smoke (both stacks must be UP)"
LEGACY_HEALTH=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8012/health 2>/dev/null || echo 000)
EVO_HEALTH=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8200/health 2>/dev/null || echo 000)
log_phase "  legacy /health = $LEGACY_HEALTH"
log_phase "  evo    /health = $EVO_HEALTH"

if [ "$LEGACY_HEALTH" != "200" ] || [ "$EVO_HEALTH" != "200" ]; then
  log_phase "ABORT: pre-cutover smoke FAILED. Skipping rest of dry-run."
  log_phase "       Re-deploy + re-run when both stacks are 200."
  exit 1
fi

CUTOVER_START=$(date +%s)

# -----------------------------------------------------------------------
# Step 2 — "Stop legacy" (5min simulation: stop systemd unit + measure)
# -----------------------------------------------------------------------
log_phase "Step 2 — Stop legacy (RTO measurement starts)"
if [ "$EUID" -eq 0 ]; then
  # Try common legacy unit names; if none match, skip without abort
  LEGACY_UNIT=$(systemctl list-unit-files --type=service 2>/dev/null \
    | awk '/heuresys.*\.service/ && !/evo/ {print $1; exit}')
  if [ -n "$LEGACY_UNIT" ]; then
    log_phase "  stopping legacy unit: $LEGACY_UNIT"
    systemctl stop "$LEGACY_UNIT" || log_phase "  WARN: stop failed"
  else
    log_phase "  no legacy systemd unit found (likely Docker-based — sim-only stop)"
    log_phase "  (production cutover would docker-compose stop legacy stack here)"
  fi
else
  log_phase "  (skipped: not root, simulating stop=$LEGACY_UNIT)"
fi

# Wait 30s for connections to drain (production = 5min)
log_phase "  waiting 30s for connection drain (production cutover would wait 5min)"
sleep 30

# -----------------------------------------------------------------------
# Step 3 — DNS switch simulation via /etc/hosts override
# -----------------------------------------------------------------------
log_phase "Step 3 — Simulate DNS switch (write /etc/hosts override)"
if [ "$EUID" -eq 0 ]; then
  cp /etc/hosts "$HOSTS_BACKUP"
  # Append override (subsequent runs cleaned up via revert)
  if ! grep -q "# CUTOVER DRY-RUN" /etc/hosts; then
    printf '\n# CUTOVER DRY-RUN %s\n127.0.0.1 evo.heuresys.com\n' "$TS" >> /etc/hosts
  fi
  log_phase "  /etc/hosts updated; backup at $HOSTS_BACKUP"
else
  log_phase "  (skipped: not root)"
fi

# -----------------------------------------------------------------------
# Step 4 — 100% traffic to evo: run cross-system-transactions.sh
# -----------------------------------------------------------------------
log_phase "Step 4 — Smoke transactions on evo (100% routed)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -x "$SCRIPT_DIR/cross-system-transactions.sh" ]; then
  log_phase "  invoking cross-system-transactions.sh"
  bash "$SCRIPT_DIR/cross-system-transactions.sh" --legacy http://127.0.0.1:8012 --evo http://127.0.0.1:8200 \
    >> "$LOG_FILE" 2>&1 || log_phase "  WARN: cross-system-transactions exit non-zero"
else
  log_phase "  cross-system-transactions.sh not executable; falling back to inline smoke"
  for path in /employees /leaves /performance-reviews /audit-logs; do
    code=$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:8200$path" 2>/dev/null || echo 000)
    log_phase "  evo $path → HTTP $code"
  done
fi

CUTOVER_END=$(date +%s)
RTO_ACTUAL=$((CUTOVER_END - CUTOVER_START))
log_phase "Step 4 done — RTO actual: ${RTO_ACTUAL}s (production target: ≤300s = 5min)"

# -----------------------------------------------------------------------
# Step 5 — Rollback
# -----------------------------------------------------------------------
log_phase "Step 5 — Rollback (re-enable legacy + revert /etc/hosts)"
if [ "$EUID" -eq 0 ]; then
  if [ -n "${LEGACY_UNIT:-}" ]; then
    systemctl start "$LEGACY_UNIT" 2>>"$LOG_FILE" || log_phase "  WARN: legacy restart failed"
    log_phase "  legacy restarted"
  fi
  if [ -f "$HOSTS_BACKUP" ]; then
    cp "$HOSTS_BACKUP" /etc/hosts
    log_phase "  /etc/hosts restored from $HOSTS_BACKUP"
  fi
fi

# Verify both stacks back to OK
sleep 5
LEGACY_FINAL=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8012/health 2>/dev/null || echo 000)
EVO_FINAL=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8200/health 2>/dev/null || echo 000)
log_phase "  post-rollback: legacy=$LEGACY_FINAL evo=$EVO_FINAL"

# -----------------------------------------------------------------------
# Step 6 — HTML report
# -----------------------------------------------------------------------
{
  cat <<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cutover Dry-Run Report</title>
<style>
body{font-family:system-ui;max-width:900px;margin:2rem auto;padding:0 1rem;color:#222}
h1,h2{color:#0a3d62}h1{border-bottom:3px solid #0a3d62;padding-bottom:.3rem}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{padding:.5rem;border:1px solid #ddd;text-align:left}
th{background:#f0f4f8}
.ok{color:#2d8b3a;font-weight:bold}
.warn{color:#d68900;font-weight:bold}
.fail{color:#c0392b;font-weight:bold}
pre{background:#f8f8f8;padding:.5rem;border-radius:3px;overflow-x:auto;font-size:.85em;max-height:400px}
</style></head><body>
<h1>Cutover Dry-Run Report</h1>
<p>Generated $TS · RTO actual: <strong>${RTO_ACTUAL}s</strong> (target: ≤300s = 5min)</p>

<h2>Summary</h2>
<table>
<tr><th>Phase</th><th>Status</th></tr>
<tr><td>Pre-cutover smoke</td><td class="ok">PASS (legacy=200, evo=200)</td></tr>
<tr><td>Stop legacy</td><td>$([ -n "${LEGACY_UNIT:-}" ] && echo 'systemctl stop' || echo '(unit not found, sim-only)')</td></tr>
<tr><td>DNS switch sim</td><td>$([ "$EUID" -eq 0 ] && echo "/etc/hosts updated" || echo "(skipped, not root)")</td></tr>
<tr><td>Smoke 100% evo</td><td>see log file</td></tr>
<tr><td>RTO actual</td><td class="$([ "$RTO_ACTUAL" -le 300 ] && echo ok || echo warn)">${RTO_ACTUAL}s</td></tr>
<tr><td>Rollback</td><td>$([ "$LEGACY_FINAL" = "200" ] && echo "legacy back UP (200)" || echo "<span class='fail'>legacy still DOWN ($LEGACY_FINAL) — investigate!</span>")</td></tr>
</table>

<h2>Full log</h2>
<pre>$(cat "$LOG_FILE" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')</pre>

<h2>Decision gate</h2>
<ul>
<li>RTO ≤ 300s → cutover procedure validated</li>
<li>Both stacks healthy post-rollback → rollback procedure validated</li>
<li>Smoke transactions all 2xx → traffic routing validated</li>
<li>If any FAIL → STOP-AUTONOMO-5 trigger; analyze before go/no-go decision (5.12)</li>
</ul>
</body></html>
HTML
} > "$HTML_FILE"

log_phase "Cutover dry-run complete"
log_phase "  Log  : $LOG_FILE"
log_phase "  HTML : $HTML_FILE"

if [ "$RTO_ACTUAL" -gt 300 ] || [ "$LEGACY_FINAL" != "200" ]; then
  echo "WARN: dry-run shows issues — review HTML and consider STOP-AUTONOMO-5" >&2
  exit 1
fi
exit 0
