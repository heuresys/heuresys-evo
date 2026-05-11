-- Phase 18d DOWN — rollback Italian labor context tables
-- Use ONLY if phase18d_italian_labor_context.sql apply was problematic.
-- Order: junction tables first, then catalog, then schema_migrations row.

BEGIN;

DROP TABLE IF EXISTS sindacato_tenant_links CASCADE;
DROP TABLE IF EXISTS tenant_ccnl_links CASCADE;
DROP TABLE IF EXISTS sindacati CASCADE;

-- Note: ccnl_levels rows for CCNL_COMM_2024 NOT removed automatically
-- (potrebbero essere riusati da altre migrazioni). Per rimuoverli:
-- DELETE FROM ccnl_levels WHERE ccnl_code = 'CCNL_COMM_2024' AND effective_date = '2024-04-01';

DELETE FROM schema_migrations WHERE version = 'phase18d_italian_labor_context';

COMMIT;
