#!/bin/bash
# DEPRECATED 2026-04-29 — superseded by db/scripts/db-push.sh + db-pull.sh
# Kept for historical reference until 2026-05-31 (then remove). See db/README.md
# Read-only freshness check across all configured DBMS instances.
#
# Usage: bash db/scripts/check-freshness.sh
#
# Reports a comparison table + identifies stale replicas per tribe.
# Exit code: 0 if all replicas aligned to leaders, 1 if any stale, 2 on error.
#
# Configuration: db/scripts/replicas.config.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
. "$SCRIPT_DIR/replicas.config.sh"

# Collect freshness metrics from one DBMS, return pipe-separated row
# Output: name|tribe|role|migrations|max_ver|last_audit|employees|tenants|users|reachable
get_metrics() {
  local name="$1"
  if ! lookup_dbms "$name"; then return 1; fi
  local tribe="$REPLY_TRIBE" role="$REPLY_ROLE"

  local migrations max_ver last_audit employees tenants users reachable="yes"

  migrations=$(run_query "$name" "SELECT count(*) FROM schema_migrations" 2>/dev/null | tr -d '[:space:]')
  if [ -z "$migrations" ]; then
    reachable="NO"
    migrations="?"; max_ver="?"; last_audit="?"; employees="?"; tenants="?"; users="?"
  else
    max_ver=$(run_query "$name" "SELECT max(version) FROM schema_migrations" 2>/dev/null | tr -d '[:space:]')
    last_audit=$(run_query "$name" "SELECT max(created_at) FROM audit_logs" 2>/dev/null | tr -d '[:space:]')
    employees=$(run_query "$name" "SELECT count(*) FROM employees" 2>/dev/null | tr -d '[:space:]')
    tenants=$(run_query "$name" "SELECT count(*) FROM tenants" 2>/dev/null | tr -d '[:space:]')
    users=$(run_query "$name" "SELECT count(*) FROM users" 2>/dev/null | tr -d '[:space:]')
  fi

  echo "$name|$tribe|$role|${migrations:-?}|${max_ver:-?}|${last_audit:-?}|${employees:-?}|${tenants:-?}|${users:-?}|$reachable"
}

# === Main ===
echo "═══════════════════════════════════════════════════════════════════════════════════════════"
echo "DBMS Freshness Report — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "═══════════════════════════════════════════════════════════════════════════════════════════"
echo ""

# Collect metrics for all DBMS
RESULTS=()
while IFS= read -r name; do
  echo "  Probing $name ..." >&2
  metrics=$(get_metrics "$name")
  RESULTS+=("$metrics")
done < <(list_all_names)

echo "" >&2

# Print table header
printf "%-22s  %-5s  %-8s  %-9s  %-5s  %-5s  %-25s  %5s  %5s  %5s\n" \
  "DBMS" "Tribe" "Role" "Reachable" "Migs" "MaxV" "Last_audit" "Emp" "Ten" "Usr"
echo "──────────────────────────────────────────────────────────────────────────────────────────────────────"

# Print one row per DBMS
for row in "${RESULTS[@]}"; do
  IFS='|' read -r name tribe role mig max_v last_audit emp ten usr reachable <<< "$row"
  printf "%-22s  %-5s  %-8s  %-9s  %-5s  %-5s  %-25s  %5s  %5s  %5s\n" \
    "$name" "$tribe" "$role" "$reachable" "$mig" "$max_v" "${last_audit:0:25}" "$emp" "$ten" "$usr"
done

# === Identify stale replicas per tribe ===
echo ""
echo "Alignment per tribe:"
echo "──────────────────────────────────────────────────"

EXIT_CODE=0
while IFS= read -r tribe; do
  echo ""
  echo "Tribe: $tribe"

  # Find leader's metrics
  leader_max_ver=""; leader_audit=""; leader_name=""
  for row in "${RESULTS[@]}"; do
    IFS='|' read -r name t role _ max_v last_audit _ <<< "$row"
    if [ "$t" = "$tribe" ] && [ "$role" = "leader" ]; then
      leader_max_ver="$max_v"
      leader_audit="$last_audit"
      leader_name="$name"
      break
    fi
  done

  if [ -z "$leader_name" ]; then
    echo "  (no leader defined for tribe '$tribe')"
    continue
  fi
  echo "  Leader:  $leader_name (max_ver=$leader_max_ver, last_audit=$leader_audit)"

  # Check replicas
  any_replica=0
  for row in "${RESULTS[@]}"; do
    IFS='|' read -r name t role _ max_v last_audit _ <<< "$row"
    if [ "$t" = "$tribe" ] && [ "$role" = "replica" ]; then
      any_replica=1
      if [ "$max_v" = "$leader_max_ver" ] && [ "$last_audit" = "$leader_audit" ]; then
        echo "  Replica: $name ✅ aligned"
      else
        echo "  Replica: $name ⚠️  STALE (max_v=$max_v vs $leader_max_ver, last_audit=$last_audit vs $leader_audit)"
        EXIT_CODE=1
      fi
    fi
  done
  [ $any_replica -eq 0 ] && echo "  (no replicas defined)"
done < <(list_tribes)

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════════════════"
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Overall: all replicas aligned with their leaders"
else
  echo "⚠️  Overall: at least one replica is stale"
  echo "   Run: bash db/scripts/align-replicas.sh --align-all   (will prompt before each align)"
fi
echo "═══════════════════════════════════════════════════════════════════════════════════════════"
exit $EXIT_CODE
