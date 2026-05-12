-- Phase 18o DOWN — Revert ProfileHero + CapabilityRadar API binding to demo fallback
--
-- Restores config_overrides.data_source to type='demo' for the 2 widget kinds.
-- Use only if the new /api/employees/{id}/profile or /api/capability/aggregate
-- endpoint regresses in production.

BEGIN;

UPDATE dashboard_elements
SET config_overrides = jsonb_set(
      COALESCE(config_overrides, '{}'::jsonb),
      '{data_source}',
      jsonb_build_object('type', 'demo'),
      true
    ),
    updated_at = now()
WHERE widget_code IN ('ProfileHero', 'CapabilityRadar')
  AND COALESCE(config_overrides->'data_source'->>'type', '') = 'api';

DELETE FROM schema_migrations
WHERE version = 'phase18o_widget_profile_capability_binding';

COMMIT;
