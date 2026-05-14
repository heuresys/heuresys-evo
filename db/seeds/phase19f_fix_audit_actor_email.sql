-- =====================================================================
-- phase19f_fix_audit_actor_email.sql
-- =====================================================================
-- Cycle 2 hotfix — audit_logs ha `user_email` non `actor_email`.
-- phase19d ActivityFeed query usava `actor_email` → ERROR → null items.
-- =====================================================================

BEGIN;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Audit log live',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 30,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(created_at, ''DD Mon HH24:MI''), ''what'', what, ''who'', user_email)) FROM (SELECT id, created_at, user_email, action || COALESCE('' '' || resource_type, '''') AS what FROM audit_logs WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 50) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_audit_v2')
  AND widget_code = 'ActivityFeed';

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recent employee activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(created_at, ''DD Mon HH24:MI''), ''what'', what, ''who'', user_email)) FROM (SELECT id, created_at, user_email, action || '' '' || COALESCE(resource_type, '''') AS what FROM audit_logs WHERE tenant_id = current_tenant_id() AND resource_type IN (''employee'',''employees'',''user'') ORDER BY created_at DESC LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employees_directory_v2')
  AND widget_code = 'ActivityFeed';

COMMIT;
