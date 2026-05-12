-- Phase 18r DOWN — Restore RbacMatrix widget query to live 3-JOIN
--
-- WARNING: applies original query verbatim. If you modified RbacMatrix widget
-- elsewhere post-phase18r, that change will be lost.

BEGIN;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
      config_overrides,
      '{data_source,query}',
      to_jsonb($q$
      SELECT
        (SELECT jsonb_agg(jsonb_build_object('id', code, 'label', name, 'level', hierarchy_level) ORDER BY hierarchy_level)
         FROM rbp_roles
         WHERE hierarchy_level BETWEEN -1 AND 6) AS roles,
        (SELECT jsonb_agg(jsonb_build_object('id', code, 'label', COALESCE(name_en, name)))
         FROM (SELECT code, name, name_en, sort_order FROM rbp_functional_areas WHERE is_active = true ORDER BY sort_order, code LIMIT 8) a) AS areas,
        (SELECT jsonb_agg(jsonb_build_object(
                  'roleId', r.code,
                  'areaId', fa.code,
                  'permission', CASE
                    WHEN rp.can_delete THEN 'admin'
                    WHEN rp.can_edit THEN 'edit'
                    WHEN rp.can_view THEN 'read'
                    ELSE 'none' END))
         FROM rbp_role_permissions rp
         JOIN rbp_roles r ON r.id = rp.role_id
         JOIN rbp_functional_areas fa ON fa.id = rp.functional_area_id
         WHERE r.hierarchy_level BETWEEN -1 AND 6
           AND fa.is_active = true
           AND fa.id IN (SELECT id FROM rbp_functional_areas WHERE is_active = true ORDER BY sort_order, code LIMIT 8)) AS assignments,
        true AS readonly
      $q$::text),
      true
    ),
    updated_at = now()
WHERE widget_code = 'RbacMatrix'
  AND config_overrides->'data_source'->>'query' LIKE '%mv_rbac_matrix%';

DELETE FROM schema_migrations
WHERE version = 'phase18r_rbac_widget_repoint_mv';

COMMIT;
