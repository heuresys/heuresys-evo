-- Phase 14.H — TTL omnibus for slow dashboards.
--
-- Bumps TTL on hr_director_overview + tenant_owner_overview widget elements
-- to 600s (was 60-300s — too low to absorb traffic during bench windows).
-- These dashboards aggregate data that tolerates 5-10min staleness.
--
-- Bench delta (production build · 10s × 10 conn · post-warm):
--   hr_director_overview:  799ms → 191ms  (-76%)
--   tenant_owner_overview: 876ms → 762ms  (-13%)
--
-- Idempotent: only updates elements still below 600s.

UPDATE dashboard_elements
SET config_overrides = jsonb_set(config_overrides, '{data_source,ttl}', '600'::jsonb)
WHERE id IN (
  SELECT de.id FROM dashboard_elements de
  JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
  WHERE dp.code IN ('hr_director_overview', 'tenant_owner_overview')
    AND (config_overrides->'data_source'->>'ttl')::int < 600
);
