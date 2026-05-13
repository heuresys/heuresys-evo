-- phase18r — Unlock capability_graph_v2 + employee_journey_v2 KPI via {employeeId} placeholder
-- (S60 CF-1b · uses fetchSql {employeeId} substitution shipped in data-fetcher.ts S60 CF-1).
--
-- Replaces 8 unavailable=true KPI with live SQL queries scoped to current user's employee_id.
-- Pattern: WHERE employee_id = {employeeId} → safely substituted with $1 binding.

BEGIN;

-- ============================================================
-- capability_graph_v2 (DEPT_HEAD/manager team-scope)
-- ============================================================

-- 123 TEAM SIZE — direct reports under current manager
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'TEAM SIZE' AS label,
        'direct reports' AS sublabel
      FROM employees
      WHERE manager_id = {employeeId}
        AND deleted_at IS NULL AND is_active = true
    $$
  )
) WHERE id = 123;

-- 124 CAPABILITY AVG % — average skill coverage across team
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH team AS (
        SELECT id FROM employees
        WHERE manager_id = {employeeId} AND deleted_at IS NULL AND is_active = true
      )
      SELECT
        CASE WHEN COUNT(esa.id) = 0 THEN NULL
          ELSE ROUND(AVG(LEAST(esa.assessed_level::float / NULLIF(esa.required_level, 0)::float, 1.0)) * 100)::int
        END AS value,
        COUNT(esa.id) = 0 AS unavailable,
        'CAPABILITY AVG' AS label,
        '%' AS unit,
        'team aggregate' AS sublabel
      FROM team t
      LEFT JOIN employee_skill_assessments esa
        ON esa.employee_id = t.id
        AND esa.assessed_level IS NOT NULL
        AND esa.required_level IS NOT NULL
        AND esa.required_level > 0
    $$
  )
) WHERE id = 124;

-- 125 GAP COUNT — critical gaps in team
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH team AS (
        SELECT id FROM employees
        WHERE manager_id = {employeeId} AND deleted_at IS NULL AND is_active = true
      )
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'GAP COUNT' AS label,
        'critical gaps' AS sublabel
      FROM employee_skill_assessments esa
      JOIN team t ON t.id = esa.employee_id
      WHERE esa.assessed_level IS NOT NULL
        AND esa.required_level IS NOT NULL
        AND esa.required_level > 0
        AND esa.assessed_level < esa.required_level - 1
    $$
  )
) WHERE id = 125;

-- 126 ROLE COVERAGE % — % of team with current performance review
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH team AS (
        SELECT id FROM employees
        WHERE manager_id = {employeeId} AND deleted_at IS NULL AND is_active = true
      ),
      with_review AS (
        SELECT COUNT(DISTINCT employee_id)::float AS n
        FROM performance_reviews
        WHERE employee_id IN (SELECT id FROM team)
          AND overall_rating IS NOT NULL
      ),
      total AS (SELECT COUNT(*)::float AS n FROM team)
      SELECT
        CASE WHEN total.n = 0 THEN NULL
          ELSE ROUND(100 * with_review.n / total.n)::int
        END AS value,
        total.n = 0 AS unavailable,
        'ROLE COVERAGE' AS label,
        '%' AS unit,
        'reviewed team members' AS sublabel
      FROM with_review, total
    $$
  )
) WHERE id = 126;

-- ============================================================
-- employee_journey_v2 (EMPLOYEE personal-scope)
-- ============================================================

-- 135 CAPABILITY % — current employee skill coverage
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        CASE WHEN COUNT(*) = 0 THEN NULL
          ELSE ROUND(AVG(LEAST(assessed_level::float / NULLIF(required_level, 0)::float, 1.0)) * 100)::int
        END AS value,
        COUNT(*) = 0 AS unavailable,
        'CAPABILITY' AS label,
        '%' AS unit,
        'current' AS sublabel
      FROM employee_skill_assessments
      WHERE employee_id = {employeeId}
        AND assessed_level IS NOT NULL
        AND required_level IS NOT NULL
        AND required_level > 0
    $$
  )
) WHERE id = 135;

-- 136 GOALS Q4 (count of goals on_track for current employee, max 5)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      SELECT
        LEAST(COUNT(*)::int, 5) AS value,
        false AS unavailable,
        'GOALS Q4' AS label,
        '/5' AS unit,
        'on track' AS sublabel
      FROM goals
      WHERE employee_id = {employeeId}
        AND status IN ('on_track','in_progress','completed','active')
    $$
  )
) WHERE id = 136;

-- 137 TENURE yr (years since hire_date for current employee)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        CASE WHEN hire_date IS NULL THEN NULL
          ELSE ROUND(EXTRACT(EPOCH FROM AGE(CURRENT_DATE, hire_date)) / (365.25 * 86400) * 10) / 10.0
        END AS value,
        hire_date IS NULL AS unavailable,
        'TENURE' AS label,
        'yr' AS unit,
        'in company' AS sublabel
      FROM employees
      WHERE id = {employeeId}
    $$
  )
) WHERE id = 137;

-- 138 NEXT REVIEW d (days until next review_period_start for current employee)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH next_review AS (
        SELECT MIN(review_period_start) AS dt
        FROM performance_reviews
        WHERE employee_id = {employeeId}
          AND review_period_start IS NOT NULL
          AND review_period_start >= CURRENT_DATE
      )
      SELECT
        CASE WHEN dt IS NULL THEN NULL
          ELSE GREATEST((dt - CURRENT_DATE), 0)::int
        END AS value,
        dt IS NULL AS unavailable,
        'NEXT REVIEW' AS label,
        'd' AS unit,
        'upcoming cycle' AS sublabel
      FROM next_review
    $$
  )
) WHERE id = 138;

COMMIT;
