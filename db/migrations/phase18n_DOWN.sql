-- Phase 18n DOWN — revert KgMiniGraph data_source to static fallback
BEGIN;
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides, '{data_source}', '{"type":"static","value":null}'::jsonb, true
),
    updated_at = now()
WHERE widget_code = 'KgMiniGraph'
  AND config_overrides->'data_source'->>'type' = 'api';
DELETE FROM schema_migrations WHERE version='phase18n_widget_employee_context_binding';
COMMIT;
