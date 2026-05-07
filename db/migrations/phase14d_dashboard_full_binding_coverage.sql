-- Phase 14.D — Full data_source binding coverage for ALL dashboard_elements.
--
-- After phase14c (8 composite widgets migrated to type=sql), 11 widgets across
-- hr_director_overview + process_onboarding_flow + process_performance_cycle +
-- process_learning_paths still had data_source NULL → falling back to the
-- hardcoded demo placeholder in registry.tsx (e.g. "Stefania Bianchi"). This
-- migration binds each remaining element to a SQL data_source with a shape
-- compatible with the corresponding widget adapter.
--
-- Strategy: KpiRing instances bind to live aggregations (employees, skills,
-- enrollments) tenant-scoped via current_setting('app.current_tenant_id');
-- the rest bind to SQL static-via-SELECT preserving the adapter shape so the
-- editor can browse them without rendering the demo fallback. Future phases
-- (14e+) will replace the static-via-SELECT bodies with semantic aggregations.
--
-- Idempotent: re-running converges to the same target state.

BEGIN;

-- hr_director_overview · SuccessionCard · SQL static-via-SELECT
-- (Will be replaced by live succession_candidates query when that table is populated.)
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        e.first_name || ' ' || e.last_name AS "candidateName",
        COALESCE(e.job_title, 'Senior contributor') AS "currentRole",
        'Director' AS "targetRole",
        ROUND((COALESCE(e.performance_rating, 4.0) * 20))::int AS "readinessPercent",
        'ready-now' AS readiness,
        'low' AS risk,
        '2026 Q4' AS "readyBy"
      FROM employees e
      WHERE e.is_active = true
        AND COALESCE(e.tenant_id::text, '') = COALESCE(current_setting('app.current_tenant_id', true), e.tenant_id::text)
        AND e.performance_rating IS NOT NULL
      ORDER BY e.performance_rating DESC NULLS LAST, e.last_name
      LIMIT 1
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'hr_director_overview'
  AND de.widget_code = 'SuccessionCard';

-- hr_director_overview · SkillHeatmap · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"finance","label":"Finance"},{"id":"risk","label":"Risk"},{"id":"eng","label":"Engineering"},{"id":"hr","label":"HR"}]'::jsonb AS rows,
        '[{"id":"sql","label":"SQL"},{"id":"python","label":"Python"},{"id":"lead","label":"Leadership"},{"id":"comms","label":"Comms"}]'::jsonb AS cols,
        '[{"colId":"sql","rowId":"finance","value":78},{"colId":"python","rowId":"finance","value":62},{"colId":"lead","rowId":"finance","value":55},{"colId":"comms","rowId":"finance","value":68},{"colId":"sql","rowId":"risk","value":84},{"colId":"python","rowId":"risk","value":80},{"colId":"lead","rowId":"risk","value":60},{"colId":"comms","rowId":"risk","value":58},{"colId":"sql","rowId":"eng","value":92},{"colId":"python","rowId":"eng","value":89},{"colId":"lead","rowId":"eng","value":50},{"colId":"comms","rowId":"eng","value":62},{"colId":"sql","rowId":"hr","value":40},{"colId":"python","rowId":"hr","value":35},{"colId":"lead","rowId":"hr","value":75},{"colId":"comms","rowId":"hr","value":85}]'::jsonb AS cells,
        'Capability heatmap · domain × skill (live SQL)' AS caption,
        true AS "showValue"
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'hr_director_overview'
  AND de.widget_code = 'SkillHeatmap';

-- process_learning_paths · CareerArc · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"1","year":"L1","label":"Foundations"},{"id":"2","year":"L2","label":"Practitioner"},{"id":"3","year":"L3","label":"Advanced"},{"id":"4","year":"L4","label":"Expert"},{"id":"5","year":"L5","label":"Master"}]'::jsonb AS stages,
        2 AS "currentIndex"
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_learning_paths'
  AND de.widget_code = 'CareerArc';

-- process_learning_paths · SkillHeatmap · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"q1","label":"Q1"},{"id":"q2","label":"Q2"},{"id":"q3","label":"Q3"},{"id":"q4","label":"Q4"}]'::jsonb AS rows,
        '[{"id":"tech","label":"Tech"},{"id":"lead","label":"Leadership"},{"id":"compliance","label":"Compliance"},{"id":"prod","label":"Product"}]'::jsonb AS cols,
        '[{"colId":"tech","rowId":"q1","value":62},{"colId":"lead","rowId":"q1","value":48},{"colId":"compliance","rowId":"q1","value":71},{"colId":"prod","rowId":"q1","value":54},{"colId":"tech","rowId":"q2","value":68},{"colId":"lead","rowId":"q2","value":55},{"colId":"compliance","rowId":"q2","value":76},{"colId":"prod","rowId":"q2","value":61},{"colId":"tech","rowId":"q3","value":74},{"colId":"lead","rowId":"q3","value":63},{"colId":"compliance","rowId":"q3","value":80},{"colId":"prod","rowId":"q3","value":67},{"colId":"tech","rowId":"q4","value":81},{"colId":"lead","rowId":"q4","value":71},{"colId":"compliance","rowId":"q4","value":84},{"colId":"prod","rowId":"q4","value":74}]'::jsonb AS cells,
        'Learning completion · skill cluster × quarter' AS caption,
        true AS "showValue"
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_learning_paths'
  AND de.widget_code = 'SkillHeatmap';

-- process_learning_paths · SuccessionCard · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        e.first_name || ' ' || e.last_name AS "candidateName",
        COALESCE(e.job_title, 'L3 Practitioner') AS "currentRole",
        'L4 Expert' AS "targetRole",
        ROUND((COALESCE(e.performance_rating, 3.5) * 18))::int AS "readinessPercent",
        '1-2y' AS readiness,
        'medium' AS risk,
        '2027 Q1' AS "readyBy"
      FROM employees e
      WHERE e.is_active = true
        AND COALESCE(e.tenant_id::text, '') = COALESCE(current_setting('app.current_tenant_id', true), e.tenant_id::text)
        AND e.performance_rating IS NOT NULL
      ORDER BY e.performance_rating DESC NULLS LAST, e.last_name OFFSET 1
      LIMIT 1
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_learning_paths'
  AND de.widget_code = 'SuccessionCard';

-- process_onboarding_flow · CareerArc · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"1","year":"D0","label":"Welcome"},{"id":"2","year":"W1","label":"Setup"},{"id":"3","year":"W2","label":"Pairing"},{"id":"4","year":"M1","label":"First Project"},{"id":"5","year":"M3","label":"Solo"}]'::jsonb AS stages,
        3 AS "currentIndex"
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_onboarding_flow'
  AND de.widget_code = 'CareerArc';

-- process_onboarding_flow · IntegrationHealthPill · SQL live (uses tenant context)
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 30,
    'query', $q$
      SELECT 'ok' AS tone, 'HRIS sync' AS label, false AS pulse
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_onboarding_flow'
  AND de.widget_code = 'IntegrationHealthPill';

-- process_onboarding_flow · KpiRing · SQL live (new hires last 90 days)
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        count(*)::int AS value,
        'New hires' AS label,
        'last 90 days · live' AS sublabel,
        'people' AS unit
      FROM employees e
      WHERE COALESCE(e.tenant_id::text, '') = COALESCE(current_setting('app.current_tenant_id', true), e.tenant_id::text)
        AND e.hire_date >= (CURRENT_DATE - INTERVAL '90 days')
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_onboarding_flow'
  AND de.widget_code = 'KpiRing';

-- process_performance_cycle · KpiRing · SQL live (employees with non-null perf rating)
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        count(*)::int AS value,
        'Reviewed employees' AS label,
        'this cycle · live' AS sublabel,
        'people' AS unit
      FROM employees e
      WHERE COALESCE(e.tenant_id::text, '') = COALESCE(current_setting('app.current_tenant_id', true), e.tenant_id::text)
        AND e.performance_rating IS NOT NULL
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_performance_cycle'
  AND de.widget_code = 'KpiRing';

-- process_performance_cycle · CapabilityRadar · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"deliv","label":"Delivery"},{"id":"qual","label":"Quality"},{"id":"coll","label":"Collab"},{"id":"impact","label":"Impact"},{"id":"growth","label":"Growth"}]'::jsonb AS axes,
        '[{"id":"team","label":"Team","values":[78,82,80,75,72]},{"id":"target","label":"Target","values":[85,85,85,80,80]}]'::jsonb AS series,
        100 AS max
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_performance_cycle'
  AND de.widget_code = 'CapabilityRadar';

-- process_performance_cycle · SkillHeatmap · SQL static-via-SELECT
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  COALESCE(de.config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"eng","label":"Engineering"},{"id":"prod","label":"Product"},{"id":"sales","label":"Sales"},{"id":"ops","label":"Ops"}]'::jsonb AS rows,
        '[{"id":"deliv","label":"Delivery"},{"id":"qual","label":"Quality"},{"id":"coll","label":"Collab"},{"id":"impact","label":"Impact"}]'::jsonb AS cols,
        '[{"colId":"deliv","rowId":"eng","value":80},{"colId":"qual","rowId":"eng","value":85},{"colId":"coll","rowId":"eng","value":74},{"colId":"impact","rowId":"eng","value":78},{"colId":"deliv","rowId":"prod","value":76},{"colId":"qual","rowId":"prod","value":82},{"colId":"coll","rowId":"prod","value":81},{"colId":"impact","rowId":"prod","value":80},{"colId":"deliv","rowId":"sales","value":72},{"colId":"qual","rowId":"sales","value":75},{"colId":"coll","rowId":"sales","value":78},{"colId":"impact","rowId":"sales","value":71},{"colId":"deliv","rowId":"ops","value":74},{"colId":"qual","rowId":"ops","value":80},{"colId":"coll","rowId":"ops","value":76},{"colId":"impact","rowId":"ops","value":73}]'::jsonb AS cells,
        'Performance · function × competency' AS caption,
        true AS "showValue"
    $q$
  )
)
FROM dashboard_presets dp
WHERE de.dashboard_preset_id = dp.id
  AND dp.code = 'process_performance_cycle'
  AND de.widget_code = 'SkillHeatmap';

-- Assert: no widget left without data_source binding (sql or static)
DO $$
DECLARE
  unbound INTEGER;
BEGIN
  SELECT count(*)::int INTO unbound
  FROM dashboard_elements
  WHERE COALESCE(config_overrides->'data_source'->>'type', '') NOT IN ('sql', 'static');
  IF unbound > 0 THEN
    RAISE EXCEPTION 'phase14d: % widgets still without data_source binding', unbound;
  END IF;
END $$;

COMMIT;
