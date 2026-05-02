#!/usr/bin/env bash
# Parity test — 20 query SELECT eseguite su evo bare-metal (5432) vs legacy container (5433)
# Output: tabella comparativa con md5sum + summary pass/fail
# Usage: bash scripts/migration/parity-test-20-queries.sh

set -uo pipefail

# Connection helpers
EVO_PSQL="sudo -nu postgres psql -d heuresys_platform -tA"
LEG_PSQL="env PGPASSWORD=heuresys psql -h 127.0.0.1 -p 5433 -U heuresys -d heuresys_platform -tA"

PRE="SET row_security = off;"

# UUID di tenant noti (dal pre-check 2026-05-02)
TENANT_RTL='0c54b84a-db6e-4da4-bc91-af5d480d524e'
TENANT_HEURESYS='d5855519-3ed1-4427-865f-fe75f1e42c4c'
TENANT_ECONOVA='fb1e866c-e90a-4e25-a146-f68d660a0be8'
TENANT_SMARTFOOD='1d7bf448-ceac-4215-917d-45ff13678104'

# 20 query reali (selezione mix Talent/Enterprise/Process + cross-cutting)
declare -a QUERIES=(
"SELECT count(*) FROM employees"
"SELECT count(*) FROM users WHERE deleted_at IS NULL"
"SELECT json_agg(code ORDER BY code) FROM tenants"
"SELECT count(*) FROM employees WHERE tenant_id = '${TENANT_RTL}'"
"SELECT count(*) FROM employees WHERE tenant_id = '${TENANT_SMARTFOOD}'"
"SELECT count(*) FROM esco_skills"
"SELECT count(*) FROM esco_occupations"
"SELECT count(*) FROM esco_occupation_skills"
"SELECT count(*) FROM industry_classifications WHERE level = 4"
"SELECT count(*) FROM rbp_role_permissions"
"SELECT count(*) FROM rbp_area_perspectives WHERE relevance = 'PRIMARY'"
"SELECT count(*) FROM rbp_pages"
"SELECT count(*) FROM platform_pages"
"SELECT count(*) FROM rbp_dashboards"
"SELECT count(*) FROM org_units"
"SELECT count(*) FROM performance_reviews"
"SELECT count(*) FROM goals"
"SELECT count(*) FROM courses"
"SELECT json_agg(code ORDER BY code) FROM rbp_perspectives"
"SELECT count(*) FROM audit_logs WHERE action IN ('CREATE','UPDATE','EXPORT','LOGIN','LOGOUT')"
)

declare -a LABELS=(
"01_employees_total"
"02_users_active"
"03_tenants_codes"
"04_employees_rtl_bank"
"05_employees_smartfood"
"06_esco_skills_total"
"07_esco_occupations_total"
"08_esco_occupation_skills_total"
"09_industry_l4_total"
"10_rbp_role_permissions"
"11_pet_primary_mappings"
"12_rbp_pages_total"
"13_platform_pages_total"
"14_rbp_dashboards_total"
"15_org_units_total"
"16_performance_reviews_total"
"17_goals_total"
"18_courses_total"
"19_pet_perspectives_codes"
"20_audit_logs_actions"
)

# Header
printf "%-3s %-32s %-15s %-15s %-7s\n" "#" "label" "evo (5432)" "legacy (5433)" "match"
printf "%s\n" "$(printf '─%.0s' {1..80})"

PASS=0
FAIL=0
ERR=0

for i in "${!QUERIES[@]}"; do
  Q="${QUERIES[$i]}"
  L="${LABELS[$i]}"

  # Esegui su entrambi, normalizza output (trim, sort se necessario)
  EVO_OUT=$($EVO_PSQL -c "$PRE $Q" 2>/dev/null | tr -d '[:space:]' || echo "ERR")
  LEG_OUT=$($LEG_PSQL -c "$PRE $Q" 2>/dev/null | tr -d '[:space:]' || echo "ERR")

  # Confronto
  if [ "$EVO_OUT" = "ERR" ] || [ "$LEG_OUT" = "ERR" ]; then
    STATUS="ERR"
    ERR=$((ERR + 1))
  elif [ "$EVO_OUT" = "$LEG_OUT" ]; then
    STATUS="✓"
    PASS=$((PASS + 1))
  else
    STATUS="✗ DIFF"
    FAIL=$((FAIL + 1))
  fi

  # Tronca per display compatto se output JSON lungo
  EVO_DISP="${EVO_OUT:0:14}"
  LEG_DISP="${LEG_OUT:0:14}"
  [ "${#EVO_OUT}" -gt 14 ] && EVO_DISP="${EVO_DISP}…"
  [ "${#LEG_OUT}" -gt 14 ] && LEG_DISP="${LEG_DISP}…"

  printf "%-3s %-32s %-15s %-15s %-7s\n" "$((i+1))" "$L" "$EVO_DISP" "$LEG_DISP" "$STATUS"
done

printf "%s\n" "$(printf '─%.0s' {1..80})"
TOTAL=$((PASS + FAIL + ERR))
echo "Summary: ${PASS}/${TOTAL} ✓ match  |  ${FAIL} ✗ diff  |  ${ERR} errori"

if [ "$FAIL" -gt 0 ] || [ "$ERR" -gt 0 ]; then
  echo ""
  echo "WARNING: parità non completa. Investigare query con DIFF/ERR."
  exit 1
fi

echo ""
echo "✓ PARITY 100% — DBMS evo bare-metal (5432) e legacy container (5433) sincronizzati su tutte le 20 query."
