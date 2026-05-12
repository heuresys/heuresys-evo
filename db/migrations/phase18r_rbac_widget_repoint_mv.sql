-- Phase 18r (S46) — RbacMatrix widget repoint to mv_rbac_matrix
--
-- Goal: replace the 3-JOIN live query (rbp_role_permissions × rbp_roles × rbp_functional_areas)
-- on dashboard_elements id=16 (RbacMatrix widget) with a single SELECT from mv_rbac_matrix
-- materialized view (created in phase18q · 272 rows · 4h refresh).
--
-- Target perf: /dashboard/org_systems P95 1185ms → ≤ 500ms (estimated -400-600ms).
--
-- Idempotent: WHERE config_overrides->'data_source'->>'query' LIKE '%rbp_role_permissions%'
-- Rollback: phase18r_DOWN.sql restores original 3-JOIN query.

BEGIN;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
      config_overrides,
      '{data_source,query}',
      to_jsonb($q$
      WITH areas_top AS (
        SELECT id, code, name, name_en, sort_order
        FROM rbp_functional_areas
        WHERE is_active = true
        ORDER BY sort_order, code
        LIMIT 8
      ),
      mv_filtered AS (
        SELECT mv.role_code, mv.role_name, mv.role_level, mv.area_code, mv.area_name,
               mv.can_delete, mv.can_edit, mv.can_view
        FROM mv_rbac_matrix mv
        JOIN areas_top a ON a.code = mv.area_code
        WHERE mv.role_level BETWEEN -1 AND 6
      )
      SELECT
        (SELECT jsonb_agg(jsonb_build_object('id', role_code, 'label', role_name, 'level', role_level) ORDER BY role_level)
         FROM (SELECT DISTINCT role_code, role_name, role_level FROM mv_filtered) r) AS roles,
        (SELECT jsonb_agg(jsonb_build_object('id', code, 'label', COALESCE(name_en, name)))
         FROM areas_top) AS areas,
        (SELECT jsonb_agg(jsonb_build_object(
                  'roleId', role_code,
                  'areaId', area_code,
                  'permission', CASE
                    WHEN can_delete THEN 'admin'
                    WHEN can_edit THEN 'edit'
                    WHEN can_view THEN 'read'
                    ELSE 'none' END))
         FROM mv_filtered) AS assignments,
        true AS readonly
      $q$::text),
      true
    ),
    updated_at = now()
WHERE widget_code = 'RbacMatrix'
  AND config_overrides->'data_source'->>'query' LIKE '%rbp_role_permissions%';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18r_rbac_widget_repoint_mv', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM dashboard_elements
  WHERE widget_code='RbacMatrix' AND config_overrides->'data_source'->>'query' LIKE '%mv_rbac_matrix%';
  RAISE NOTICE 'phase18r: RbacMatrix widgets repointed to mv_rbac_matrix = %', v_count;
END$$;

COMMIT;
