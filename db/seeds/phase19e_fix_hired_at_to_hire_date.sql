-- =====================================================================
-- phase19e_fix_hired_at_to_hire_date.sql
-- =====================================================================
-- Cycle 2 hotfix — schema mismatch. employees usa `hire_date` non `hired_at`.
-- phase19a + phase19b avevano `hired_at` in 5 query KPI → ritornavano error
-- "column hired_at does not exist" → caught by data-fetcher → null data →
-- KpiRing rendered con "no data yet" placeholder (label generic "KPI").
--
-- Scope: 5 KPI elements affected.
-- =====================================================================

BEGIN;

-- 1. process_onboarding_flow_v2 → KPI 1 NEW HIRES 90d
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT ''NEW HIRES 90d''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND hire_date > NOW() - INTERVAL ''90 days''), 0) AS value, ''last 90 days''::text AS sublabel'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2')
  AND widget_code = 'KpiRing'
  AND position = 1;

-- 2. employees_directory_v2 → KPI 2 NEW HIRES 90d
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'SELECT ''NEW HIRES 90d''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true AND hire_date > NOW() - INTERVAL ''90 days''), 0) AS value, ''last 90 days''::text AS sublabel'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employees_directory_v2')
  AND widget_code = 'KpiRing'
  AND position = 2;

-- 3. employees_directory_v2 → KPI 3 AVG TENURE
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 60,
    'query', 'WITH t AS (SELECT EXTRACT(EPOCH FROM (NOW() - hire_date)) / (30.44 * 86400) AS months FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true AND hire_date IS NOT NULL) SELECT ''AVG TENURE''::text AS label, COALESCE(ROUND(AVG(months))::int, 0) AS value, ''months''::text AS unit, ''avg active''::text AS sublabel FROM t'
  )
)
WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employees_directory_v2')
  AND widget_code = 'KpiRing'
  AND position = 3;

-- 4. workforce_analytics_v2 → KPI 1 HEADCOUNT (uses hire_date no, only is_active; skip)
-- 5. workforce_analytics_v2 → KPI 2 ATTRITION 12m (uses deleted_at, no hire_date; skip)
-- Conferma: workforce_analytics_v2 in phase19b non usa hire_date. Skip.

COMMIT;
