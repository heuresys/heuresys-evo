-- Phase 14.I — Materialized view for cross_tenant_overview rollups.
--
-- Pre-aggregates the 3 platform-wide COUNT queries used by the
-- cross_tenant_overview dashboard (employees · tenants · integrations).
-- Each widget query becomes a single-row read against the MV, eliminating
-- the 3 heavy SELECT count(*) round-trips that drove P95 variance even
-- with TTL=600 in-process cache (cold cache miss x 3 in concurrent burst).
--
-- Refresh strategy: every 5 minutes via pg_cron (deferred — for now,
-- manual REFRESH on app deploy + on demand from admin panel).
-- Staleness budget: 5-10 minutes (cross-tenant counts change slowly).
--
-- RLS: MV is platform-wide, no tenant filter. App reads via withTenant()
-- but the MV itself bypasses RLS (it's a snapshot).
--
-- Idempotent: DROP/CREATE pattern.

DROP MATERIALIZED VIEW IF EXISTS mv_cross_tenant_rollup;

CREATE MATERIALIZED VIEW mv_cross_tenant_rollup AS
SELECT
  (SELECT count(*)::int FROM employees WHERE is_active = true) AS employees_active,
  (SELECT count(*)::int FROM tenants WHERE status != 'deleted') AS tenants_active,
  (SELECT count(*)::int FROM integrations) AS integrations_total,
  now() AS refreshed_at;

CREATE UNIQUE INDEX IF NOT EXISTS mv_cross_tenant_rollup_singleton
  ON mv_cross_tenant_rollup ((1));

REFRESH MATERIALIZED VIEW mv_cross_tenant_rollup;

-- Update widget queries to read from MV.
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT employees_active AS value, ''Fleet headcount'' AS label, ''cross-tenant · all 4 tenants'' AS sublabel FROM mv_cross_tenant_rollup'::text)
)
WHERE id = 39;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT tenants_active AS value, ''Active tenants'' AS label, ''platform-wide · prod + test'' AS sublabel FROM mv_cross_tenant_rollup'::text)
)
WHERE id = 40;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb('SELECT integrations_total AS value, ''Fleet integrations'' AS label, ''cross-tenant · ESCO + SAP + Slack + AAD'' AS sublabel FROM mv_cross_tenant_rollup'::text)
)
WHERE id = 41;
