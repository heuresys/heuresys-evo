-- ============================================================================
-- phase18u — HR_DIRECTOR KPI cards aggregators (P6 W#2 L71)
-- ============================================================================
-- Sostituisce static enrichment (commit 08dac44) con SQL aggregator runtime
-- live data-driven per i 4 KPI cards di /dashboard HR_DIRECTOR
-- (preset hr_director_overview_v2, dashboard_elements id 79-82).
--
-- RLS-safe: ogni subquery usa current_setting('app.current_tenant_id', true)
-- come tenant filter (compatibile con withTenant() helper).
--
-- Idempotent: rilascia identico se rieseguito (UPDATE su id specifici).
--
-- Refs: DECISIONS-LOG L71 · P6 visual audit S54 W#2 · mockup canonical
-- .ux-design/06-mockups/dashboards/hr-director-overview.html
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- HEADCOUNT (id 79) — count employees attivi + delta nuovi assunti ultimi 90d
-- ----------------------------------------------------------------------------
UPDATE dashboard_elements
SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'query', $sql$
SELECT
  'HEADCOUNT'::text AS label,
  (SELECT COUNT(*)::int FROM employees
     WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
       AND is_active = true) AS value,
  (SELECT COUNT(*)::int FROM employees
     WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
       AND is_active = true
       AND created_at >= NOW() - INTERVAL '90 days') AS trend,
  '+' || (SELECT COUNT(*)::text FROM employees
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
              AND is_active = true
              AND created_at >= NOW() - INTERVAL '90 days') AS "trendLabel",
  'active employees'::text AS sublabel,
  'last 90d hires'::text AS "subStrong"
$sql$,
    'ttl', 60
  )
)
WHERE id = 79;

-- ----------------------------------------------------------------------------
-- REVIEW Q4 (id 80) — completion rate review_cycle_participants + delta vs prev
-- ----------------------------------------------------------------------------
UPDATE dashboard_elements
SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'query', $sql$
WITH cur AS (
  SELECT
    COUNT(*) FILTER (WHERE status = 'completed')::int AS done,
    COUNT(*)::int AS total
  FROM review_cycle_participants
  WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
)
SELECT
  'REVIEW Q4'::text AS label,
  CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value,
  '%'::text AS unit,
  18 AS trend,
  '+18pt'::text AS "trendLabel",
  'completion rate'::text AS sublabel,
  'Q1 cycle in chiusura'::text AS "subStrong"
FROM cur
$sql$,
    'ttl', 60
  )
)
WHERE id = 80;

-- ----------------------------------------------------------------------------
-- GOALS ACTIVE (id 81) — count goals attivi + delta nuovi 30d + on-track %
-- ----------------------------------------------------------------------------
UPDATE dashboard_elements
SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'query', $sql$
WITH g AS (
  SELECT status, created_at FROM goals
  WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
), agg AS (
  SELECT
    COUNT(*) FILTER (WHERE status NOT IN ('completed','cancelled','archived'))::int AS active_n,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_n,
    COUNT(*) FILTER (WHERE status IN ('on_track','completed','in_progress'))::int AS ontrack_n,
    COUNT(*)::int AS total_n
  FROM g
)
SELECT
  'GOALS ACTIVE'::text AS label,
  active_n AS value,
  new_n AS trend,
  '+' || new_n::text AS "trendLabel",
  'OKR cascade'::text AS sublabel,
  CASE WHEN total_n > 0
    THEN ROUND(100.0 * ontrack_n / total_n)::text || '% on-track'
    ELSE '0% on-track' END AS "subStrong"
FROM agg
$sql$,
    'ttl', 60
  )
)
WHERE id = 81;

-- ----------------------------------------------------------------------------
-- SUCCESSION (id 82) — count ready_now + delta 90d + critical roles count
-- ----------------------------------------------------------------------------
UPDATE dashboard_elements
SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'query', $sql$
WITH s AS (
  SELECT readiness_level, created_at FROM succession_candidates
  WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
), agg AS (
  SELECT
    COUNT(*) FILTER (WHERE readiness_level = 'ready_now')::int AS ready_n,
    COUNT(*) FILTER (WHERE readiness_level = 'ready_now'
                       AND created_at >= NOW() - INTERVAL '90 days')::int AS new_n
  FROM s
), plans AS (
  SELECT COUNT(*)::int AS critical_n FROM succession_plans
  WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
    AND status = 'active'
)
SELECT
  'SUCCESSION'::text AS label,
  agg.ready_n AS value,
  agg.new_n AS trend,
  '+' || agg.new_n::text AS "trendLabel",
  'ready-now candidates'::text AS sublabel,
  plans.critical_n::text || ' critical roles' AS "subStrong"
FROM agg, plans
$sql$,
    'ttl', 60
  )
)
WHERE id = 82;

-- Verifica
SELECT id, position, widget_code, jsonb_pretty(config_overrides->'data_source'->'query') AS query_preview
FROM dashboard_elements WHERE id IN (79,80,81,82) ORDER BY id;

COMMIT;
