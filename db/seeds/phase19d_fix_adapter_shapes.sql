-- =====================================================================
-- phase19d_fix_adapter_shapes.sql
-- =====================================================================
-- Cycle 2 hotfix — fix adapter shape contracts per Histogram + ActivityFeed.
--
-- Bug:
--   - BrandHistogram aspetta `{ id, label, value, tone? }` per item (uso key={it.id}).
--     phase19c emetteva `{ label, value }` senza id → React warning "unique key".
--   - BrandActivityFeed aspetta `{ id, when, what, who? }` per item.
--     phase19c emetteva `{ id, category, title, timestamp }` → widget render vuoto.
--
-- Fix: ri-emette ogni row con i field name corretti via row_to_json subquery.
--
-- Scope: 8 Histogram + 5 ActivityFeed = 13 element config_overrides update.
-- =====================================================================

BEGIN;

-- =====================================================================
-- HISTOGRAMS — aggiunge `id` = label come unique identifier
-- =====================================================================

-- 1. process_recruiting_funnel_v2 → Histogram "Candidates per stage"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Candidates per stage',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', stage, ''label'', stage, ''value'', cnt)) FROM (SELECT stage, COUNT(*)::int AS cnt FROM recruiting_candidates WHERE tenant_id = current_tenant_id() GROUP BY stage ORDER BY CASE stage WHEN ''applied'' THEN 1 WHEN ''screened'' THEN 2 WHEN ''interviewed'' THEN 3 WHEN ''offered'' THEN 4 WHEN ''offer_accepted'' THEN 5 WHEN ''hired'' THEN 6 ELSE 99 END) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_recruiting_funnel_v2')
  AND widget_code = 'Histogram';

-- 2. process_onboarding_flow_v2 → Histogram "Onboarding tasks by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Onboarding tasks by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT t.status, COUNT(t.*)::int AS cnt FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() GROUP BY t.status ORDER BY t.status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2')
  AND widget_code = 'Histogram';

-- 3. process_performance_cycle_v2 → Histogram "Reviews by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Reviews by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT status, COUNT(*)::int AS cnt FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_performance_cycle_v2')
  AND widget_code = 'Histogram';

-- 4. process_learning_paths_v2 → Histogram "Enrollments by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Enrollments by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT status, COUNT(*)::int AS cnt FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_learning_paths_v2')
  AND widget_code = 'Histogram';

-- 5. reviews_cycle_v2 → Histogram
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Reviews by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT status, COUNT(*)::int AS cnt FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'reviews_cycle_v2')
  AND widget_code = 'Histogram';

-- 6. goals_cascade_v2 → Histogram
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Goals by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT status, COUNT(*)::int AS cnt FROM goals WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'goals_cascade_v2')
  AND widget_code = 'Histogram';

-- 7. learning_paths_overview_v2 → Histogram
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Enrollments by status',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', status, ''label'', status, ''value'', cnt)) FROM (SELECT status, COUNT(*)::int AS cnt FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'learning_paths_overview_v2')
  AND widget_code = 'Histogram';

-- 8. compensation_overview_v2 → Histogram (salary buckets, id = bucket label)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Salary distribution (€10k buckets)',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', bucket_id::text, ''label'', label, ''value'', cnt)) FROM (SELECT FLOOR(current_salary / 10000) AS bucket_id, (FLOOR(current_salary / 10000) * 10000)::text || ''–'' || ((FLOOR(current_salary / 10000) + 1) * 10000)::text AS label, COUNT(*)::int AS cnt FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL GROUP BY FLOOR(current_salary / 10000) ORDER BY FLOOR(current_salary / 10000)) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'compensation_overview_v2')
  AND widget_code = 'Histogram';

-- 9. workforce_analytics_v2 → Histogram (employees by org_unit)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Employees by org_unit (top 15)',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', org_id, ''label'', label, ''value'', cnt)) FROM (SELECT COALESCE(ou.id::text, ''_none_'') AS org_id, COALESCE(ou.name_it, ou.name_en, ou.code, ''(no dept)'') AS label, COUNT(e.id)::int AS cnt FROM employees e LEFT JOIN org_units ou ON ou.id = e.org_unit_id WHERE e.tenant_id = current_tenant_id() AND e.is_active = true GROUP BY ou.id, ou.name_it, ou.name_en, ou.code ORDER BY cnt DESC LIMIT 15) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'workforce_analytics_v2')
  AND widget_code = 'Histogram';

-- 10. admin_rbac_v2 → Histogram Permissions allowed per role (position 2)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Permissions allowed per role',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', code, ''label'', code, ''value'', cnt)) FROM (SELECT r.code, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS cnt FROM rbp_roles r LEFT JOIN rbp_role_area_permissions rap ON rap.role_id = r.id GROUP BY r.code, r.level ORDER BY r.level) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 2;

-- 11. admin_rbac_v2 → Histogram Active areas (position 3)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Active areas (functional)',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', code, ''label'', code, ''value'', cnt)) FROM (SELECT a.code, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS cnt FROM rbp_functional_areas a LEFT JOIN rbp_role_area_permissions rap ON rap.functional_area_id = a.id GROUP BY a.code ORDER BY cnt DESC LIMIT 15) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 3;

-- =====================================================================
-- ACTIVITY FEEDS — rename `title→what`, `timestamp→when`, add `who?`
-- =====================================================================

-- 12. process_recruiting_funnel_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recruiting activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(created_at, ''DD Mon HH24:MI''), ''what'', ''Candidate '' || first_name || '' '' || last_name || '' → '' || stage, ''who'', NULL)) FROM (SELECT id, first_name, last_name, stage, created_at FROM recruiting_candidates WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_recruiting_funnel_v2')
  AND widget_code = 'ActivityFeed';

-- 13. process_onboarding_flow_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recent onboarding activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(ts, ''DD Mon HH24:MI''), ''what'', what, ''who'', NULL)) FROM (SELECT t.id, COALESCE(t.completed_at, t.updated_at, t.created_at) AS ts, ''Task '' || COALESCE(t.title, ''(no title)'') || '' '' || t.status AS what FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() ORDER BY COALESCE(t.completed_at, t.updated_at, t.created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2')
  AND widget_code = 'ActivityFeed';

-- 14. process_performance_cycle_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Performance activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(ts, ''DD Mon HH24:MI''), ''what'', what, ''who'', NULL)) FROM (SELECT id, COALESCE(updated_at, created_at) AS ts, ''Review status: '' || status AS what FROM review_cycle_participants WHERE tenant_id = current_tenant_id() ORDER BY COALESCE(updated_at, created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_performance_cycle_v2')
  AND widget_code = 'ActivityFeed';

-- 15. process_learning_paths_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Learning activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(ts, ''DD Mon HH24:MI''), ''what'', what, ''who'', NULL)) FROM (SELECT lpe.id, COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) AS ts, ''Enrollment '' || COALESCE(lp.title_it, lp.title, lp.code, ''(no title)'') || '': '' || lpe.status AS what FROM learning_path_enrollments lpe LEFT JOIN learning_paths lp ON lp.id = lpe.learning_path_id WHERE lpe.tenant_id = current_tenant_id() ORDER BY COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_learning_paths_v2')
  AND widget_code = 'ActivityFeed';

-- 16. employees_directory_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recent employee activity',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(created_at, ''DD Mon HH24:MI''), ''what'', what, ''who'', actor_email)) FROM (SELECT id, created_at, actor_email, action || '' '' || COALESCE(resource_type, '''') AS what FROM audit_logs WHERE tenant_id = current_tenant_id() AND resource_type IN (''employee'',''employees'',''user'') ORDER BY created_at DESC LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employees_directory_v2')
  AND widget_code = 'ActivityFeed';

-- 17. admin_audit_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Audit log live',
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 30,
    'query', 'SELECT (SELECT json_agg(json_build_object(''id'', id::text, ''when'', to_char(created_at, ''DD Mon HH24:MI''), ''what'', what, ''who'', actor_email)) FROM (SELECT id, created_at, actor_email, action || COALESCE('' '' || resource_type, '''') AS what FROM audit_logs WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 50) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_audit_v2')
  AND widget_code = 'ActivityFeed';

COMMIT;
