-- Phase 18p DOWN — Revert process_*_v2 presets + restore legacy secondary nav
--
-- WARNING: destructive on cloned content. Only use if the v2 presets haven't
-- been edited post-clone. Restores role_default_dashboards.preset_code to the
-- legacy `process_*` (no `_v2` suffix) and deletes the cloned v2 presets +
-- their elements (FK CASCADE).

BEGIN;

-- 1. Re-point role_default_dashboards back to legacy
UPDATE role_default_dashboards
SET preset_code = REGEXP_REPLACE(preset_code, '_v2$', ''),
    updated_at = now()
WHERE role IN ('HR_DIRECTOR', 'HR_MANAGER')
  AND preset_code IN (
    'process_recruiting_funnel_v2',
    'process_onboarding_flow_v2',
    'process_performance_cycle_v2',
    'process_learning_paths_v2'
  );

-- 2. Delete v2 presets (FK cascade should drop elements; explicit delete for safety)
DELETE FROM dashboard_elements
WHERE dashboard_preset_id IN (
  SELECT id FROM dashboard_presets WHERE code IN (
    'process_recruiting_funnel_v2',
    'process_onboarding_flow_v2',
    'process_performance_cycle_v2',
    'process_learning_paths_v2'
  )
);

DELETE FROM dashboard_presets
WHERE code IN (
  'process_recruiting_funnel_v2',
  'process_onboarding_flow_v2',
  'process_performance_cycle_v2',
  'process_learning_paths_v2'
);

DELETE FROM schema_migrations
WHERE version = 'phase18p_process_presets_v2';

COMMIT;
