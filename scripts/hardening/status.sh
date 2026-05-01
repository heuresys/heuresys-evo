#!/usr/bin/env bash
# RTGB status — dashboard HTML + console summary
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"
require_jq

cd "$REPO_ROOT"
out="${STATE_DIR}/dashboard.html"

current_phase="$(current_phase)"
current_task="$(current_task)"

c_blue "=== RTGB status (phase=$current_phase, task=$current_task) ==="

jq -r '.phases | to_entries[] | "[\(.key)] \(.value.status // "pending") — \(.value.title)"' "$STATE_FILE" | while read -r line; do
  case "$line" in
    *completed*) c_green "$line" ;;
    *in_progress*) c_amber "$line" ;;
    *) c_dim "$line" ;;
  esac
done

# Generate dashboard HTML
cat > "$out" <<HTML
<!doctype html><html><head><meta charset="utf-8">
<title>RTGB hardening — dashboard</title>
<style>
  body{font:14px/1.5 -apple-system,system-ui,sans-serif;max-width:980px;margin:2rem auto;padding:0 1rem;background:#0f172a;color:#e2e8f0}
  h1{margin-top:0;color:#60a5fa}
  table{width:100%;border-collapse:collapse;margin-top:1rem}
  th,td{padding:.5rem .75rem;border-bottom:1px solid #1e293b;text-align:left;vertical-align:top}
  th{background:#1e293b;color:#94a3b8;font-weight:600;font-size:.85rem}
  .completed{color:#22c55e;font-weight:600}
  .in_progress{color:#f59e0b;font-weight:600}
  .pending{color:#64748b}
  .meta{color:#64748b;font-size:.85rem}
  code{background:#1e293b;padding:.1rem .3rem;border-radius:.2rem}
  .pill{display:inline-block;padding:.1rem .5rem;border-radius:1rem;font-size:.75rem;background:#1e293b;color:#cbd5e1}
</style></head>
<body>
<h1>RTGB — Cantiere B Hardening</h1>
<p class="meta">Roadmap: <code>ROAD_TO_GLORY_EVO_HARDENING.md</code> &middot; Repo: <code>/home/ubuntu/heuresys-evo</code></p>
<p>Phase corrente: <span class="in_progress">${current_phase}</span> &middot; Task corrente: <span class="in_progress">${current_task}</span></p>
<table>
<thead><tr><th>Phase</th><th>Status</th><th>Title</th></tr></thead>
<tbody>
HTML

jq -r '.phases | to_entries[] | "<tr><td><code>\(.key)</code></td><td class=\"\(.value.status // "pending")\">\(.value.status // "pending")</td><td>\(.value.title)</td></tr>"' "$STATE_FILE" >> "$out"

cat >> "$out" <<HTML
</tbody></table>
<h2 style="margin-top:2rem">Phase ${current_phase} tasks</h2>
<table>
<thead><tr><th>ID</th><th>Status</th><th>Tier</th><th>Archetype</th><th>Title</th></tr></thead>
<tbody>
HTML

jq -r --arg ph "$current_phase" '.phases[$ph].tasks[]? | "<tr><td><code>\(.id)</code></td><td class=\"\(.status)\">\(.status)</td><td><span class=\"pill\">\(.tier)</span></td><td class=\"meta\">\(.archetype)</td><td>\(.title)</td></tr>"' "$STATE_FILE" >> "$out"

cat >> "$out" <<HTML
</tbody></table>
<p class="meta">Generated $(date -Iseconds)</p>
</body></html>
HTML

c_green "Dashboard: $out"
