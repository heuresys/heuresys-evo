-- phase18p — tenant_owner_overview_v2 G6 widgets: static → live Prisma queries (P11).
-- Constraint P11 (CLAUDE.md §REGOLA NON NEGOZIABILE): all G6 widgets must source from DBMS live.
--
-- NOTA SICUREZZA: `employees` è VIEW senza RLS attivo (post S52 phase16o vertical-split,
-- relrowsecurity=false). Tutte le query DEVONO usare WHERE tenant_id = current_setting(...)
-- per evitare data leak cross-tenant. `withTenant()` setta il GUC `app.current_tenant_id`
-- prima dell'esecuzione query (vedi services/app/src/lib/db.ts).
--
-- Pattern: WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
-- (NULLIF gestisce caso GUC vuoto = platform context, dove la query ritorna 0 righe → unavailable)

BEGIN;

-- 101 — HEADCOUNT
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        'HEADCOUNT' AS label,
        'tenant employees' AS sublabel
      FROM employees
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
        AND deleted_at IS NULL
        AND is_active = true
    $$
  )
) WHERE id = 101;

-- 102 — REV/FTE: no revenue source in schema → unavailable
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        true AS unavailable,
        NULL::int AS value,
        'REV / FTE' AS label,
        'k €' AS unit,
        'no revenue source in schema' AS sublabel
    $$
  )
) WHERE id = 102;

-- 103 — RETENTION (12-month rolling = 1 - terminations_12m / headcount, in %)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH terminations AS (
        SELECT COUNT(*)::float AS n
        FROM employees
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND termination_date IS NOT NULL
          AND termination_date >= (CURRENT_DATE - INTERVAL '12 months')
      ),
      headcount AS (
        SELECT COUNT(*)::float AS n
        FROM employees
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND deleted_at IS NULL
      )
      SELECT
        CASE
          WHEN headcount.n = 0 THEN NULL
          ELSE ROUND((1 - terminations.n / headcount.n) * 100)::int
        END AS value,
        headcount.n = 0 AS unavailable,
        'RETENTION' AS label,
        '%' AS unit,
        '12-month rolling' AS sublabel
      FROM terminations, headcount
    $$
  )
) WHERE id = 103;

-- 104 — PERFORMANCE (avg overall_rating / 5 * 100, %)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        CASE
          WHEN AVG(overall_rating) IS NULL THEN NULL
          ELSE ROUND(AVG(overall_rating) / 5.0 * 100)::int
        END AS value,
        AVG(overall_rating) IS NULL AS unavailable,
        'PERFORMANCE' AS label,
        '%' AS unit,
        'avg meets+exceeds' AS sublabel
      FROM performance_reviews
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
        AND overall_rating IS NOT NULL
    $$
  )
) WHERE id = 104;

-- 109 — ActivityFeed (audit_logs last 5 for tenant)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $$
      SELECT
        COALESCE(json_agg(
          json_build_object(
            'id', a.id::text,
            'when', TO_CHAR(a.created_at, 'YYYY-MM-DD HH24:MI'),
            'what', COALESCE(a.action, '—') || ' · ' || COALESCE(a.resource_type, '—'),
            'who', COALESCE(a.user_email, '—')
          ) ORDER BY a.created_at DESC
        ) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS items,
        'Activity feed' AS title,
        true AS live
      FROM (
        SELECT id, created_at, action, resource_type, user_email
        FROM audit_logs
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
        ORDER BY created_at DESC
        LIMIT 5
      ) a
    $$
  )
) WHERE id = 109;

-- 110 — CompCard (AVG SALARY live, BONUS POOL live, EQUITY unavailable, TOTAL TC unavailable)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH avg_salary AS (
        SELECT AVG(sba.current_salary)::numeric AS amount
        FROM salary_band_assignments sba
        JOIN employees e ON e.id = sba.employee_id
        WHERE e.tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND e.deleted_at IS NULL
      ),
      bonus_pool AS (
        SELECT SUM(total_budget)::numeric AS amount
        FROM bonus_plans
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND status = 'active'
      )
      SELECT json_build_array(
        json_build_object(
          'id', 'salary',
          'label', 'AVG SALARY',
          'unit', 'k €',
          'value', CASE WHEN (SELECT amount FROM avg_salary) IS NULL
                        THEN NULL
                        ELSE ROUND((SELECT amount FROM avg_salary) / 1000)::int END,
          'unavailable', (SELECT amount FROM avg_salary) IS NULL
        ),
        json_build_object(
          'id', 'bonus',
          'label', 'BONUS POOL',
          'unit', 'k €',
          'value', CASE WHEN (SELECT amount FROM bonus_pool) IS NULL
                        THEN NULL
                        ELSE ROUND((SELECT amount FROM bonus_pool) / 1000)::int END,
          'unavailable', (SELECT amount FROM bonus_pool) IS NULL
        ),
        json_build_object(
          'id', 'equity',
          'label', 'EQUITY',
          'unit', '',
          'value', NULL,
          'unavailable', true
        ),
        json_build_object(
          'id', 'total',
          'label', 'TOTAL TC',
          'unit', '',
          'value', NULL,
          'unavailable', true
        )
      ) AS items
    $$
  )
) WHERE id = 110;

-- 111 — SuccessionCard (top succession_plan + best ranked candidate)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      WITH top_plan AS (
        SELECT sp.id, sp.position_name, sp.risk_level
        FROM succession_plans sp
        WHERE sp.tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND sp.status = 'active'
        ORDER BY
          CASE sp.criticality_level
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
          END,
          sp.target_date ASC
        LIMIT 1
      ),
      top_candidate AS (
        SELECT
          sc.readiness_level,
          COALESCE(e.first_name || ' ' || e.last_name, 'Top candidate') AS candidate_name,
          e.job_title AS current_role
        FROM succession_candidates sc
        LEFT JOIN employees e ON e.id = sc.employee_id
        WHERE sc.critical_role_id = (SELECT id FROM top_plan)
        ORDER BY sc.rank_order ASC NULLS LAST
        LIMIT 1
      )
      SELECT
        COALESCE(tc.candidate_name, '—') AS candidate_name,
        COALESCE(tc.current_role, '—') AS current_role,
        COALESCE(tp.position_name, '—') AS target_role,
        CASE tc.readiness_level
          WHEN 'ready_now' THEN 92
          WHEN 'ready_1_year' THEN 78
          WHEN 'ready_2_years' THEN 62
          WHEN 'ready_3_years' THEN 48
          WHEN 'ready_3_plus_years' THEN 35
          WHEN 'development_needed' THEN 25
          ELSE 0
        END AS readiness_percent,
        CASE tc.readiness_level
          WHEN 'ready_now' THEN 'ready-now'
          WHEN 'ready_1_year' THEN '1-2y'
          WHEN 'ready_2_years' THEN '1-2y'
          WHEN 'ready_3_years' THEN '3-5y'
          WHEN 'ready_3_plus_years' THEN '3-5y'
          ELSE 'not-ready'
        END AS readiness,
        CASE tp.risk_level
          WHEN 'high' THEN 'high'
          WHEN 'critical' THEN 'critical'
          WHEN 'low' THEN 'low'
          ELSE 'medium'
        END AS risk
      FROM top_plan tp
      LEFT JOIN top_candidate tc ON true
    $$
  )
) WHERE id = 111;

COMMIT;
