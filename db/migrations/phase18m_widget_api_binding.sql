-- Phase 18m (S37 W3) — Widget data_source.type='api' binding
--
-- Goal: passa BridgeCard widgets a consumare /api/succession/candidates via fetchApi().
-- KgMiniGraph/CapabilityRadar/ProfileHero richiedono employeeId user-context — carry-forward S37+.
--
-- Lexicon: GOKMER+TALPIPE+ESKAP (widget binding)
-- Idempotent: WHERE existing type != 'api' (no-op se già applicato)
-- Rollback: phase18m_DOWN.sql restore type='static'

BEGIN;

-- BridgeCard → /api/succession/candidates (TALPIPE)
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'api',
    'endpoint', '/api/succession/candidates',
    'ttl', 300
  ),
  true
),
    updated_at = now()
WHERE widget_code = 'BridgeCard'
  AND COALESCE(config_overrides->'data_source'->>'type', '') <> 'api';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18m_widget_api_binding', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM dashboard_elements
  WHERE widget_code='BridgeCard' AND config_overrides->'data_source'->>'type'='api';
  RAISE NOTICE 'phase18m: BridgeCard api-bound = % (target 1)', v_count;
END$$;

COMMIT;
