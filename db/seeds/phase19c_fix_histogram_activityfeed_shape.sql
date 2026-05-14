-- =====================================================================
-- phase19c_fix_histogram_activityfeed_shape.sql
-- =====================================================================
-- Cycle 2 hotfix Phase 1+4 SQL data_source shape mismatch.
--
-- Bug root cause: histogramAdapter + activityFeedAdapter consumano
-- `firstRow(raw)` poi cercano `row.items` come array. Le SQL query
-- shippate in phase19a + phase19b ritornavano array piatto di rows con
-- shape `[{label, value}, ...]` invece di un singolo row con shape
-- `{items: [{label, value}, ...]}`. Adapter ritornava null → renderer
-- crashava in RSC → Jest worker child exception.
--
-- Fix: wrap ogni query Histogram + ActivityFeed in subquery aggregata
-- con `json_agg(json_build_object(...))` → ritorna 1 row con `items`.
--
-- Scope: 8 Histogram + 5 ActivityFeed = 13 element config_overrides update.
-- =====================================================================

BEGIN;

-- =====================================================================
-- HISTOGRAMS (8 elements)
-- =====================================================================

-- 1. process_recruiting_funnel_v2 → Histogram "Candidates per stage"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Candidates per stage',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT stage AS label, COUNT(*)::int AS value FROM recruiting_candidates WHERE tenant_id = current_tenant_id() GROUP BY stage ORDER BY CASE stage WHEN ''applied'' THEN 1 WHEN ''screened'' THEN 2 WHEN ''interviewed'' THEN 3 WHEN ''offered'' THEN 4 WHEN ''offer_accepted'' THEN 5 WHEN ''hired'' THEN 6 ELSE 99 END) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_recruiting_funnel_v2')
  AND widget_code = 'Histogram';

-- 2. process_onboarding_flow_v2 → Histogram "Onboarding tasks by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Onboarding tasks by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT t.status AS label, COUNT(t.*)::int AS value FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() GROUP BY t.status ORDER BY t.status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2')
  AND widget_code = 'Histogram';

-- 3. process_performance_cycle_v2 → Histogram "Reviews by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Reviews by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT status AS label, COUNT(*)::int AS value FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_performance_cycle_v2')
  AND widget_code = 'Histogram';

-- 4. process_learning_paths_v2 → Histogram "Enrollments by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Enrollments by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT status AS label, COUNT(*)::int AS value FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_learning_paths_v2')
  AND widget_code = 'Histogram';

-- 5. reviews_cycle_v2 → Histogram "Reviews by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Reviews by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT status AS label, COUNT(*)::int AS value FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'reviews_cycle_v2')
  AND widget_code = 'Histogram';

-- 6. goals_cascade_v2 → Histogram "Goals by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Goals by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT status AS label, COUNT(*)::int AS value FROM goals WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'goals_cascade_v2')
  AND widget_code = 'Histogram';

-- 7. learning_paths_overview_v2 → Histogram "Enrollments by status"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Enrollments by status',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT status AS label, COUNT(*)::int AS value FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'learning_paths_overview_v2')
  AND widget_code = 'Histogram';

-- 8. compensation_overview_v2 → Histogram "Salary distribution"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Salary distribution (€10k buckets)',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT (FLOOR(current_salary / 10000) * 10000)::text || ''–'' || ((FLOOR(current_salary / 10000) + 1) * 10000)::text AS label, COUNT(*)::int AS value FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL GROUP BY FLOOR(current_salary / 10000) ORDER BY FLOOR(current_salary / 10000)) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'compensation_overview_v2')
  AND widget_code = 'Histogram';

-- 9. workforce_analytics_v2 → Histogram "Employees by org_unit"
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Employees by org_unit (top 15)',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT COALESCE(ou.name_it, ou.name_en, ou.code, ''(no dept)'') AS label, COUNT(e.id)::int AS value FROM employees e LEFT JOIN org_units ou ON ou.id = e.org_unit_id WHERE e.tenant_id = current_tenant_id() AND e.is_active = true GROUP BY ou.name_it, ou.name_en, ou.code ORDER BY value DESC LIMIT 15) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'workforce_analytics_v2')
  AND widget_code = 'Histogram';

-- 10. admin_rbac_v2 → 2 Histogram (Permissions allowed per role + Active areas)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Permissions allowed per role',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT r.code AS label, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS value FROM rbp_roles r LEFT JOIN rbp_role_area_permissions rap ON rap.role_id = r.id GROUP BY r.code, r.level ORDER BY r.level) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 2;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Active areas (functional)',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT a.code AS label, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS value FROM rbp_functional_areas a LEFT JOIN rbp_role_area_permissions rap ON rap.functional_area_id = a.id GROUP BY a.code ORDER BY value DESC LIMIT 15) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_rbac_v2')
  AND widget_code = 'Histogram'
  AND position = 3;

-- =====================================================================
-- ACTIVITY FEEDS (5 elements)
-- =====================================================================

-- 11. process_recruiting_funnel_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recruiting activity',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT id::text AS id, ''recruiting''::text AS category, ''Candidate ''|| first_name || '' '' || last_name || '' moved to '' || stage AS title, created_at AS "timestamp" FROM recruiting_candidates WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_recruiting_funnel_v2')
  AND widget_code = 'ActivityFeed';

-- 12. process_onboarding_flow_v2 → ActivityFeed (position 3 standalone)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recent onboarding activity',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT t.id::text AS id, ''onboarding''::text AS category, ''Task '' || COALESCE(t.title, ''(no title)'') || '' '' || t.status AS title, COALESCE(t.completed_at, t.updated_at, t.created_at) AS "timestamp" FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() ORDER BY COALESCE(t.completed_at, t.updated_at, t.created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2')
  AND widget_code = 'ActivityFeed';

-- 13. process_performance_cycle_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Performance activity',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT id::text AS id, ''performance''::text AS category, ''Review status: '' || status AS title, COALESCE(updated_at, created_at) AS "timestamp" FROM review_cycle_participants WHERE tenant_id = current_tenant_id() ORDER BY COALESCE(updated_at, created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_performance_cycle_v2')
  AND widget_code = 'ActivityFeed';

-- 14. process_learning_paths_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Learning activity',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT lpe.id::text AS id, ''learning''::text AS category, ''Enrollment '' || COALESCE(lp.title_it, lp.title, lp.code, ''(no title)'') || '': '' || lpe.status AS title, COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) AS "timestamp" FROM learning_path_enrollments lpe LEFT JOIN learning_paths lp ON lp.id = lpe.learning_path_id WHERE lpe.tenant_id = current_tenant_id() ORDER BY COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) DESC NULLS LAST LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_learning_paths_v2')
  AND widget_code = 'ActivityFeed';

-- 15. employees_directory_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Recent employee activity',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT id::text AS id, ''talent''::text AS category, action || '' '' || COALESCE(resource_type, '''') AS title, created_at AS "timestamp" FROM audit_logs WHERE tenant_id = current_tenant_id() AND resource_type IN (''employee'',''employees'',''user'') ORDER BY created_at DESC LIMIT 10) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employees_directory_v2')
  AND widget_code = 'ActivityFeed';

-- 16. admin_audit_v2 → ActivityFeed
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'title', 'Audit log live',
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 30,
    'query', 'SELECT (SELECT json_agg(row_to_json(s)) FROM (SELECT id::text AS id, COALESCE(category, ''(uncategorized)'')::text AS category, action || COALESCE('' '' || resource_type, '''') AS title, created_at AS "timestamp" FROM audit_logs WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 50) s) AS items'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'admin_audit_v2')
  AND widget_code = 'ActivityFeed';

-- =====================================================================
-- Verification
-- =====================================================================

DO $$
DECLARE
  _bad_count INTEGER;
BEGIN
  -- Tutte le Histogram + ActivityFeed devono ora avere config con 'items' final field
  SELECT COUNT(*) INTO _bad_count
  FROM dashboard_elements
  WHERE widget_code IN ('Histogram', 'ActivityFeed')
    AND dashboard_preset_id IN (
      SELECT id FROM dashboard_presets WHERE code IN (
        'process_recruiting_funnel_v2','process_onboarding_flow_v2',
        'process_performance_cycle_v2','process_learning_paths_v2',
        'employees_directory_v2','reviews_cycle_v2','goals_cascade_v2',
        'learning_paths_overview_v2','compensation_overview_v2',
        'workforce_analytics_v2','admin_audit_v2','admin_rbac_v2'
      )
    )
    AND (config_overrides->'data_source'->>'query') NOT LIKE '%json_agg%';

  RAISE NOTICE 'phase19c verification: % elements still without json_agg wrap (expected 0)', _bad_count;
  IF _bad_count > 0 THEN
    RAISE EXCEPTION 'phase19c verification failed: % elements still without json_agg wrap', _bad_count;
  END IF;
END $$;

COMMIT;
