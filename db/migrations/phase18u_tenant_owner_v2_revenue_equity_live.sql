-- phase18u — Activate REV/FTE + EQUITY + TOTAL TC live queries (S60 CF-4).
-- Replaces unavailable=true placeholders from phase18p with real SQL queries
-- backed by schema extension shipped in phase18s + seed phase18s/80_revenue_equity.

BEGIN;

-- 102 REV/FTE k€: SUM(last 12m revenue) / headcount / 1000
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      WITH r AS (
        SELECT SUM(revenue_amount)::float AS total
        FROM tenant_revenue_periods
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND period_end >= (CURRENT_DATE - INTERVAL '12 months')
      ),
      h AS (
        SELECT COUNT(*)::float AS n FROM employees
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND deleted_at IS NULL AND is_active = true
      )
      SELECT
        CASE WHEN h.n = 0 OR r.total IS NULL THEN NULL
          ELSE ROUND(r.total / h.n / 1000)::int
        END AS value,
        (h.n = 0 OR r.total IS NULL) AS unavailable,
        'REV / FTE' AS label,
        'k €' AS unit,
        'trailing 12 months' AS sublabel
      FROM r, h
    $$
  )
) WHERE id = 102;

-- 110 CompCard updated: AVG SALARY + BONUS POOL live (as before) + EQUITY live + TOTAL TC live
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
      ),
      equity AS (
        SELECT SUM(fair_value)::numeric AS amount
        FROM equity_grants
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND status = 'active'
      ),
      total_tc AS (
        SELECT
          (SELECT base_payroll_eur + bonus_pool_eur + equity_active_eur
             FROM total_compensation_tenant_aggregated
             WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
          AS amount
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
          'unit', 'k €',
          'value', CASE WHEN (SELECT amount FROM equity) IS NULL OR (SELECT amount FROM equity) = 0
                        THEN NULL
                        ELSE ROUND((SELECT amount FROM equity) / 1000)::int END,
          'unavailable', (SELECT amount FROM equity) IS NULL OR (SELECT amount FROM equity) = 0
        ),
        json_build_object(
          'id', 'total',
          'label', 'TOTAL TC',
          'unit', 'M €',
          'value', CASE WHEN (SELECT amount FROM total_tc) IS NULL OR (SELECT amount FROM total_tc) = 0
                        THEN NULL
                        ELSE ROUND((SELECT amount FROM total_tc) / 100000) / 10.0
                   END,
          'unavailable', (SELECT amount FROM total_tc) IS NULL OR (SELECT amount FROM total_tc) = 0
        )
      ) AS items
    $$
  )
) WHERE id = 110;

COMMIT;
