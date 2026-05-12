-- Phase 18p (S42) — process_* dashboard presets v2 + secondary nav re-bind
--
-- Goal: align the 4 process_* dashboard presets (recruiting_funnel, onboarding_flow,
-- performance_cycle, learning_paths) to the post-Phase 15.A `_v2` naming convention
-- so HR_DIRECTOR + HR_MANAGER secondary nav uses the G6 brand-fedele renderer.
--
-- Strategy: CLONE — preserve the 4 legacy `process_*` presets (id 6-9) untouched;
-- INSERT new `_v2` rows with same name + description + perspective; clone their
-- existing dashboard_elements (3 per preset). Re-point role_default_dashboards
-- entries (priority 10-40) from old codes to the new `_v2` codes.
--
-- Lexicon: PROCESS perspective (PET) · OPOURSKA (process inventory)
-- Idempotent: ON CONFLICT DO NOTHING on presets + WHERE NOT EXISTS on elements
-- Rollback: phase18p_DOWN.sql

BEGIN;

-- 1. Clone presets with `_v2` suffix
INSERT INTO dashboard_presets (
  code, name_it, name_en, description_it, description_en,
  perspective_code, source_mockup_path, rbp_dashboard_code, persona_label,
  is_published, sort_order, theme_config, created_at, updated_at
)
SELECT
  code || '_v2',
  name_it || ' (G6)',
  name_en || ' (G6)',
  description_it,
  description_en,
  perspective_code,
  source_mockup_path,
  rbp_dashboard_code,
  persona_label,
  is_published,
  sort_order,
  theme_config,
  now(),
  now()
FROM dashboard_presets
WHERE code IN (
  'process_recruiting_funnel',
  'process_onboarding_flow',
  'process_performance_cycle',
  'process_learning_paths'
)
ON CONFLICT (code) DO NOTHING;

-- 2. Clone dashboard_elements from legacy preset → v2 preset
INSERT INTO dashboard_elements (
  dashboard_preset_id, widget_catalog_id, widget_code, position,
  grid_col_start, grid_col_span, grid_row_start, grid_row_span,
  perspective_code, visibility_min_role, config_overrides, tenant_id,
  parent_element_id, variant, created_at, updated_at
)
SELECT
  v2.id AS dashboard_preset_id,
  e.widget_catalog_id,
  e.widget_code,
  e.position,
  e.grid_col_start,
  e.grid_col_span,
  e.grid_row_start,
  e.grid_row_span,
  e.perspective_code,
  e.visibility_min_role,
  e.config_overrides,
  e.tenant_id,
  e.parent_element_id,
  e.variant,
  now(),
  now()
FROM dashboard_elements e
JOIN dashboard_presets old_p ON old_p.id = e.dashboard_preset_id
JOIN dashboard_presets v2 ON v2.code = old_p.code || '_v2'
WHERE old_p.code IN (
  'process_recruiting_funnel',
  'process_onboarding_flow',
  'process_performance_cycle',
  'process_learning_paths'
)
AND NOT EXISTS (
  SELECT 1 FROM dashboard_elements e2
  WHERE e2.dashboard_preset_id = v2.id
);

-- 3. Re-point role_default_dashboards from legacy → v2 (for HR_DIRECTOR + HR_MANAGER)
UPDATE role_default_dashboards
SET preset_code = preset_code || '_v2',
    updated_at = now()
WHERE role IN ('HR_DIRECTOR', 'HR_MANAGER')
  AND preset_code IN (
    'process_recruiting_funnel',
    'process_onboarding_flow',
    'process_performance_cycle',
    'process_learning_paths'
  );

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18p_process_presets_v2', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_presets INTEGER; v_elements INTEGER; v_nav INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_presets FROM dashboard_presets WHERE code LIKE 'process_%_v2';
  SELECT COUNT(*) INTO v_elements FROM dashboard_elements e
    JOIN dashboard_presets p ON p.id = e.dashboard_preset_id
    WHERE p.code LIKE 'process_%_v2';
  SELECT COUNT(*) INTO v_nav FROM role_default_dashboards
    WHERE role IN ('HR_DIRECTOR','HR_MANAGER') AND preset_code LIKE 'process_%_v2';
  RAISE NOTICE 'phase18p: process_*_v2 presets=% (target 4) · elements=% (target 12) · secondary_nav=% (target 8)',
    v_presets, v_elements, v_nav;
END$$;

COMMIT;
