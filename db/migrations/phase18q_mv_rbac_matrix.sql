-- Phase 18q (S45) — Materialized view RBAC matrix
--
-- Goal: precompute role × functional_area × permissions aggregate (179 rows pre-joined)
-- for dashboard org_systems + hr_director_overview routes (P95 1193ms → target ≤ 500ms).
--
-- Pattern: aligned with existing mv_* (mv_cross_tenant_rollup, mv_tenant_owner_rollup)
-- refresh strategy via systemd timer (every 4h UTC). RBAC matrix is platform-wide
-- (no tenant scoping) — data-driven via rbp_roles + rbp_functional_areas + rbp_role_permissions.
--
-- Idempotent: DROP IF EXISTS + CREATE
-- Rollback: phase18q_DOWN.sql

BEGIN;

DROP MATERIALIZED VIEW IF EXISTS mv_rbac_matrix CASCADE;

CREATE MATERIALIZED VIEW mv_rbac_matrix AS
SELECT
  r.id              AS role_id,
  r.code            AS role_code,
  r.name            AS role_name,
  r.hierarchy_level AS role_level,
  fa.id             AS area_id,
  fa.code           AS area_code,
  fa.name           AS area_name,
  rp.can_view,
  rp.can_create,
  rp.can_edit,
  rp.can_delete,
  rp.can_approve,
  rp.can_export,
  rp.scope_type,
  -- Aggregated grant pct (count truthy perms / 6 max)
  (
    (rp.can_view::int + rp.can_create::int + rp.can_edit::int +
     rp.can_delete::int + rp.can_approve::int + rp.can_export::int)
    * 100 / 6
  )::int AS grant_pct
FROM rbp_roles r
CROSS JOIN rbp_functional_areas fa
LEFT JOIN rbp_role_permissions rp ON rp.role_id = r.id AND rp.functional_area_id = fa.id
ORDER BY r.hierarchy_level ASC, fa.id ASC;

CREATE UNIQUE INDEX mv_rbac_matrix_pk ON mv_rbac_matrix (role_id, area_id);
CREATE INDEX mv_rbac_matrix_role ON mv_rbac_matrix (role_code);
CREATE INDEX mv_rbac_matrix_grant ON mv_rbac_matrix (grant_pct DESC) WHERE grant_pct > 0;

-- Initial populate (CREATE MATERIALIZED VIEW already populates by default; explicit refresh for safety)
REFRESH MATERIALIZED VIEW mv_rbac_matrix;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18q_mv_rbac_matrix', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows FROM mv_rbac_matrix;
  RAISE NOTICE 'phase18q: mv_rbac_matrix rows = % (target 272 = 8 roles × 34 areas)', v_rows;
END$$;

COMMIT;
