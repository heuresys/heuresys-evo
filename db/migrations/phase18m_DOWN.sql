-- Phase 18m DOWN — revert BridgeCard data_source to static fallback
BEGIN;
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides, '{data_source}', '{"type":"static","value":null}'::jsonb, true
),
    updated_at = now()
WHERE widget_code = 'BridgeCard'
  AND config_overrides->'data_source'->>'type' = 'api';
DELETE FROM schema_migrations WHERE version='phase18m_widget_api_binding';
COMMIT;
