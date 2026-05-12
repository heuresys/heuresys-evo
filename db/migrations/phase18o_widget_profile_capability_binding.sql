-- Phase 18o (S41 W4-final) — Widget profile + capability API binding
--
-- Goal: bind ProfileHero + CapabilityRadar dashboard_elements to live endpoints
-- via {employeeId} template substitution (post-S40 fetchApi pipeline).
--
-- Endpoints created in S41:
--   - GET /api/employees/{employeeId}/profile   (ProfileHero shape)
--   - GET /api/capability/aggregate?employeeId={employeeId} (CapabilityRadar shape)
--
-- Lexicon: OPOURSKA (employee profile) + ESKAP (capability axes)
-- Idempotent: WHERE existing != 'api'
-- Rollback: phase18o_DOWN.sql restore static fallback
-- Carry-forward from S40: ProfileHero deferred in phase18n awaiting endpoint.

BEGIN;

-- ProfileHero → /api/employees/{employeeId}/profile
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
      COALESCE(config_overrides, '{}'::jsonb),
      '{data_source}',
      jsonb_build_object(
        'type', 'api',
        'endpoint', '/api/employees/{employeeId}/profile',
        'ttl', 600
      ),
      true
    ),
    updated_at = now()
WHERE widget_code = 'ProfileHero'
  AND COALESCE(config_overrides->'data_source'->>'type', '') <> 'api';

-- CapabilityRadar → /api/capability/aggregate?employeeId={employeeId}
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
      COALESCE(config_overrides, '{}'::jsonb),
      '{data_source}',
      jsonb_build_object(
        'type', 'api',
        'endpoint', '/api/capability/aggregate?employeeId={employeeId}',
        'ttl', 600
      ),
      true
    ),
    updated_at = now()
WHERE widget_code = 'CapabilityRadar'
  AND COALESCE(config_overrides->'data_source'->>'type', '') <> 'api';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18o_widget_profile_capability_binding', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_profile INTEGER; v_radar INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_profile FROM dashboard_elements
  WHERE widget_code='ProfileHero' AND config_overrides->'data_source'->>'type'='api';
  SELECT COUNT(*) INTO v_radar FROM dashboard_elements
  WHERE widget_code='CapabilityRadar' AND config_overrides->'data_source'->>'type'='api';
  RAISE NOTICE 'phase18o: ProfileHero api-bound = % (target 1) · CapabilityRadar api-bound = % (target 5)', v_profile, v_radar;
END$$;

COMMIT;
