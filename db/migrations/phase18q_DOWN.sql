-- Phase 18q DOWN — Drop mv_rbac_matrix
--
-- Removes the materialized view + its indexes. Source tables rbp_* untouched.
-- Application code falling back to live JOINs after drop.

BEGIN;

DROP MATERIALIZED VIEW IF EXISTS mv_rbac_matrix CASCADE;

DELETE FROM schema_migrations
WHERE version = 'phase18q_mv_rbac_matrix';

COMMIT;
