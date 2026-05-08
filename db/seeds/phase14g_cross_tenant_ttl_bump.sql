-- Phase 14.G — Perf optimization: bump TTL on cross_tenant_overview widget
-- elements to align all 3 SQL queries on the platform-wide aggregation profile
-- (low write volume, can tolerate longer staleness).
--
-- Rationale: cross_tenant_overview was the perf benchmark outlier (P95 2385ms
-- vs 71-819ms on other views in views-prod-2026-05-08T00-33-42 baseline).
-- Cold-start cache miss on 4 concurrent SQL queries dominates the latency.
-- Bumping cache TTL absorbs subsequent traffic naturally; warm-steady-state
-- bench post-fix shows P95 → 675ms (-71%).
--
-- Idempotent: only updates elements still below the new ttl threshold.

UPDATE dashboard_elements
SET config_overrides = jsonb_set(config_overrides, '{data_source,ttl}', '600'::jsonb)
WHERE id IN (
  SELECT de.id FROM dashboard_elements de
  JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
  WHERE dp.code = 'cross_tenant_overview'
    AND (config_overrides->'data_source'->>'ttl')::int < 600
);
