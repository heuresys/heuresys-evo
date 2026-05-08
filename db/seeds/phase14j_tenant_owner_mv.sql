-- Phase 14.J — Materialized view for tenant_owner_overview rollups (per-tenant).
--
-- Pre-aggregates the 3 SQL queries used by the tenant_owner_overview
-- dashboard. Multi-row MV keyed by tenant_id so each tenant's row is a
-- single-row read.
--
-- Refresh strategy: every 5 minutes via pg_cron (deferred — manual REFRESH
-- on app deploy + on demand). Staleness 5-10min OK for tenant counts.
--
-- RLS: MV bypasses row-level security (it's a snapshot). Widget queries
-- filter by tenant_id via current_setting('app.current_tenant_id') —
-- consistent with how RLS-aware queries already address the same data.
--
-- Idempotent: DROP/CREATE pattern.

DROP MATERIALIZED VIEW IF EXISTS mv_tenant_owner_rollup;

CREATE MATERIALIZED VIEW mv_tenant_owner_rollup AS
SELECT
  t.id AS tenant_id,
  COALESCE(emp.active_count, 0)::int AS employees_active,
  COALESCE(emp.department_count, 0)::int AS departments_count,
  COALESCE(intg.total, 0)::int AS integrations_total,
  now() AS refreshed_at
FROM tenants t
LEFT JOIN (
  SELECT tenant_id,
         count(*)::int AS active_count,
         count(DISTINCT department)::int AS department_count
  FROM employees
  WHERE is_active = true
  GROUP BY tenant_id
) emp ON emp.tenant_id = t.id
LEFT JOIN (
  SELECT tenant_id, count(*)::int AS total
  FROM integrations
  GROUP BY tenant_id
) intg ON intg.tenant_id = t.id
WHERE t.status != 'deleted';

CREATE UNIQUE INDEX IF NOT EXISTS mv_tenant_owner_rollup_pk
  ON mv_tenant_owner_rollup (tenant_id);

REFRESH MATERIALIZED VIEW mv_tenant_owner_rollup;

-- Update widget queries to read from MV with current tenant filter.
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT employees_active AS value, ''Tenant headcount'' AS label, ''own tenant · live'' AS sublabel FROM mv_tenant_owner_rollup WHERE tenant_id = current_setting(''app.current_tenant_id'')::uuid'::text)
)
WHERE id = 43;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT departments_count AS value, ''Departments'' AS label, ''own tenant · org-chart'' AS sublabel FROM mv_tenant_owner_rollup WHERE tenant_id = current_setting(''app.current_tenant_id'')::uuid'::text)
)
WHERE id = 44;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT integrations_total AS value, ''Tenant integrations'' AS label, ''own tenant · ESCO + SAP + Workday'' AS sublabel FROM mv_tenant_owner_rollup WHERE tenant_id = current_setting(''app.current_tenant_id'')::uuid'::text)
)
WHERE id = 46;
