-- Phase 18n (S40 Item3) — Widget employee-context API binding (KG + ProfileHero)
--
-- Goal: bind KgMiniGraph + ProfileHero dashboard_elements to employee-context-aware
-- endpoints via {employeeId} template substitution in data-fetcher fetchApi().
--
-- Template resolution: fetchApi() replaces {employeeId} with ctx.employeeId
-- (resolved server-side from session). Validation post-substitution.
--
-- Lexicon: ESKAP (kg edges) + OPOURSKA (employee profile)
-- Idempotent: WHERE existing != 'api'
-- Rollback: phase18n_DOWN.sql restore static fallback

BEGIN;

-- KgMiniGraph → /api/explorer/kg/edges?employeeId={employeeId}
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'api',
    'endpoint', '/api/explorer/kg/edges?employeeId={employeeId}',
    'ttl', 600
  ),
  true
),
    updated_at = now()
WHERE widget_code = 'KgMiniGraph'
  AND COALESCE(config_overrides->'data_source'->>'type', '') <> 'api';

-- ProfileHero defer: requires /api/employees/{employeeId}/profile endpoint which doesn't exist yet.
-- Carry-forward S41+ — create the endpoint first.

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18n_widget_employee_context_binding', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM dashboard_elements
  WHERE widget_code='KgMiniGraph' AND config_overrides->'data_source'->>'type'='api';
  RAISE NOTICE 'phase18n: KgMiniGraph api-bound = % (target 3)', v_count;
END$$;

COMMIT;
