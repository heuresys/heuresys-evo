-- =====================================================================
-- phase19g_fix_rbac_table_name.sql
-- =====================================================================
-- Cycle 2 hotfix — rbp_role_area_permissions non esiste; usa
-- rbp_role_permissions con can_view / can_create / can_edit / can_delete
-- / can_approve / can_export boolean columns.
-- =====================================================================

BEGIN;

-- 1. admin_rbac_v2 → Histogram Permissions allowed per role (uses can_view = true count)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Permissions allowed per role',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', code, ''label'', code, ''value'', cnt)) FROM (SELECT r.code, COUNT(*) FILTER (WHERE rp.can_view = true)::int AS cnt FROM rbp_roles r LEFT JOIN rbp_role_permissions rp ON rp.role_id = r.id GROUP BY r.code, r.level ORDER BY r.level) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 2;

-- 2. admin_rbac_v2 → Histogram Active areas
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Active areas (functional)',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', code, ''label'', code, ''value'', cnt)) FROM (SELECT a.code, COUNT(*) FILTER (WHERE rp.can_view = true)::int AS cnt FROM rbp_functional_areas a LEFT JOIN rbp_role_permissions rp ON rp.functional_area_id = a.id GROUP BY a.code ORDER BY cnt DESC LIMIT 15) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 3;

COMMIT;
