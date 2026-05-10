#!/bin/bash
# Phase 16o execution pipeline (S28-bis Wave 11 C1 — generated 2026-05-10)
# RICHIEDE supervisione Enzo per gates verify post-apply.
#
# Pre-requisites verified by audit:
# - backup pre-phase16o existing: /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T043706Z.dump
# - 65 dependent views/matviews saved: /tmp/employees-{views,matviews}-defs.sql
# - phase16o draft file: /home/ubuntu/heuresys-evo/db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql
#
# Usage: sudo -u postgres bash /tmp/phase16o-execute-pipeline.sh
# Each step requires manual confirmation [y/N].

set -euo pipefail

DB="heuresys_platform"
BACKUP="/var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T043706Z.dump"
PHASE16O="/home/ubuntu/heuresys-evo/db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql"
VIEWS_SAVE="/tmp/employees-views-defs.sql"
MATVIEWS_SAVE="/tmp/employees-matviews-defs.sql"

echo "Phase 16o execution pipeline ready."
echo "STEP 1 — Pre-flight verify"
[ -f "$BACKUP" ] || { echo "FAIL: backup missing"; exit 1; }
[ -f "$PHASE16O" ] || { echo "FAIL: phase16o file missing"; exit 1; }
[ -f "$VIEWS_SAVE" ] || { echo "FAIL: views defs missing"; exit 1; }
echo "  backup OK ($(stat -c%s $BACKUP) bytes)"
echo "  phase16o OK ($(wc -l <$PHASE16O) lines)"
echo "  views OK ($(wc -l <$VIEWS_SAVE) lines)"
read -p "Proceed STEP 2 — DROP 65 dependent views? [y/N] " ans
[ "$ans" = "y" ] || exit 0

# STEP 2 — DROP 65 views
psql -d $DB -c "DO \$\$ DECLARE v text; BEGIN
  FOR v IN SELECT DISTINCT dependent_view.relname FROM pg_depend dep JOIN pg_rewrite rwr ON rwr.oid = dep.objid JOIN pg_class dependent_view ON dependent_view.oid = rwr.ev_class JOIN pg_class source_table ON source_table.oid = dep.refobjid WHERE source_table.relname = employees AND dep.deptype = n AND dependent_view.relname != employees AND dependent_view.relkind = v LOOP
    EXECUTE format(DROP VIEW IF EXISTS %I CASCADE, v);
  END LOOP;
  FOR v IN SELECT DISTINCT dependent_view.relname FROM pg_depend dep JOIN pg_rewrite rwr ON rwr.oid = dep.objid JOIN pg_class dependent_view ON dependent_view.oid = rwr.ev_class JOIN pg_class source_table ON source_table.oid = dep.refobjid WHERE source_table.relname = employees AND dep.deptype = n AND dependent_view.relkind = m LOOP
    EXECUTE format(DROP MATERIALIZED VIEW IF EXISTS %I CASCADE, v);
  END LOOP;
END \$\$;"
echo "STEP 2 done. Proceed STEP 3 — apply phase16o? [y/N]"
read ans
[ "$ans" = "y" ] || exit 0

# STEP 3 — Apply phase16o
psql -d $DB -v ON_ERROR_STOP=1 -f "$PHASE16O"
echo "STEP 3 done. Proceed STEP 4 — recreate views? [y/N]"
read ans
[ "$ans" = "y" ] || exit 0

# STEP 4 — Recreate 65 views (matviews + views)
psql -d $DB -v ON_ERROR_STOP=1 -f "$MATVIEWS_SAVE"
psql -d $DB -v ON_ERROR_STOP=1 -f "$VIEWS_SAVE"
echo "STEP 4 done. Refresh matviews ON DEMAND."
echo "  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_*"
echo ""
echo "STEP 5 — Verify (manual)"
echo "  - npm run test --workspace=services/api-gateway (RLS + integration)"
echo "  - curl https://evo.heuresys.com/api/health (smoke)"
echo "  - sudo systemctl status mat-views-refresh.timer"
