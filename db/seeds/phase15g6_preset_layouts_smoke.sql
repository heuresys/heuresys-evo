-- =============================================================================
-- Seed phase15g6 — Preset layouts smoke (DashboardRenderer hierarchical PoC)
-- Date: 2026-05-09 (S19 G5-phase-2 + G6)
-- =============================================================================
-- Crea 2 preset NUOVI (suffix `_v2`) con layout DB-driven gerarchici via
-- `dashboard_elements.parent_element_id` (post-G4 schema). Validano end-to-end:
--
--   `role_default_dashboards.role` →
--   `role_preset_resolver` →
--   `dashboard_presets.code = '<preset>_v2'` →
--   loader fetch `dashboard_elements` con hierarchy →
--   `DashboardRenderer` consuma LAYOUT_REGISTRY + WIDGET_REGISTRY →
--   render gerarchico
--
-- **Adoption deferred (S21+)**: i preset originali (`org_systems`, ecc.) restano
-- attivi via `role_default_dashboards`. Il redirect del switch in
-- `dashboard/page.tsx` da view bespoke a `<DashboardRenderer/>` richiede
-- mappare role → `*_v2` preset (cambio di 1 riga in role_default_dashboards o
-- in role-preset-resolver). Pre-flight: verifica visiva browser.
--
-- **NON tocca i preset esistenti** né i 38 dashboard_elements del demo grid
-- renderer `/dashboard/[code]` (Phase 13.C). Coesistenza pulita.
--
-- Idempotent via INSERT ... ON CONFLICT (code) DO UPDATE su dashboard_presets +
-- DELETE elements per preset_id prima di re-INSERT.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Preset 1: org_systems_v2 — IT_ADMIN smoke
-- Layout: kpi-ring (4 KPI) + double-split [panel-Integrations | panel-Audit]
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT;
  l_kpiring BIGINT;
  l_split BIGINT;
  l_panel_l BIGINT;
  l_panel_r BIGINT;
BEGIN
  -- Upsert preset
  INSERT INTO dashboard_presets (
    code, name_it, name_en, description_it, description_en,
    perspective_code, source_mockup_path, persona_label, is_published, sort_order
  ) VALUES (
    'org_systems_v2',
    'Organizzazione e Sistemi (G6)',
    'Org & Systems (G6)',
    'Versione G6 con hierarchy DB-driven via dashboard_elements + parent_element_id (post-G4)',
    'G6 hierarchical version with DB-driven slot layout (post-G4 schema)',
    'ENTERPRISE',
    '.ux-design/06-mockups/dashboards/org-systems.html',
    'IT Admin · G6 smoke',
    false,
    100
  )
  ON CONFLICT (code) DO UPDATE SET
    name_it = EXCLUDED.name_it,
    name_en = EXCLUDED.name_en,
    description_it = EXCLUDED.description_it,
    updated_at = NOW()
  RETURNING id INTO preset_id;

  -- Clear existing elements (idempotency)
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  -- Top-level slot 1: LayoutKpiRing (4-col grid wrapper for KPIs)
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL
  ) RETURNING id INTO l_kpiring;

  -- 4 KpiRing children inside LayoutKpiRing (siblings via parent_element_id)
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"label":"ACTIVE TENANTS","value":4,"unit":"","sublabel":"1 platform + 3 customer"}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"label":"RBAC ROLES","value":8,"unit":"","sublabel":"-1 SUPERUSER -> 6 EMPLOYEE"}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"label":"RLS POLICIES","value":605,"unit":"","sublabel":"DB-level enforcement"}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"label":"SYSTEM UPTIME","value":99.97,"unit":"%","sublabel":"last 30 days"}'::jsonb);

  -- Top-level slot 2: LayoutDoubleSplit (2-col 1.4fr 1fr post-L42)
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL
  ) RETURNING id INTO l_split;

  -- Panel left: Integrations
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"title":"Integrations","titleEm":"health","meta":"7 active"}'::jsonb
  ) RETURNING id INTO l_panel_l;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'IntegrationHealthPill', 1, l_panel_l, 1, 12, 6, NULL
  );

  -- Panel right: Audit log
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"title":"Audit","titleEm":"log","meta":"live stream"}'::jsonb
  ) RETURNING id INTO l_panel_r;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'ActivityFeed', 1, l_panel_r, 1, 12, 6, NULL
  );

  RAISE NOTICE 'org_systems_v2 preset seeded: 10 elements (4 KPI + double-split with 2 panels containing IntegrationHealthPill + ActivityFeed)';
END $$;

-- ============================================================================
-- Preset 2: hr_director_overview_v2 — HR_DIRECTOR smoke
-- Layout: kpi-ring (4 KPI) + main-split [panel-RbacMatrix | panel-ActivityFeed] + SuccessionCard top-level
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT;
  l_kpiring BIGINT;
  l_split BIGINT;
  l_panel_main BIGINT;
  l_panel_side BIGINT;
BEGIN
  INSERT INTO dashboard_presets (
    code, name_it, name_en, description_it, description_en,
    perspective_code, source_mockup_path, persona_label, is_published, sort_order
  ) VALUES (
    'hr_director_overview_v2',
    'Direzione HR (G6)',
    'HR Director Overview (G6)',
    'Versione G6 con hierarchy DB-driven (post-G4) per HR Director',
    'G6 hierarchical version for HR Director',
    'TALENT',
    '.ux-design/06-mockups/dashboards/hr-director-overview.html',
    'HR Director · G6 smoke',
    false,
    101
  )
  ON CONFLICT (code) DO UPDATE SET
    name_it = EXCLUDED.name_it,
    name_en = EXCLUDED.name_en,
    description_it = EXCLUDED.description_it,
    updated_at = NOW()
  RETURNING id INTO preset_id;

  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  -- Top-level slot 1: LayoutKpiRing
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL
  ) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"label":"HEADCOUNT","value":270,"unit":"","sublabel":"active employees"}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"label":"REVIEW Q4","value":86,"unit":"%","sublabel":"completion rate"}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"label":"GOALS ACTIVE","value":1248,"unit":"","sublabel":"OKR cascade"}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"label":"SUCCESSION","value":42,"unit":"","sublabel":"ready-now candidates"}'::jsonb);

  -- Top-level slot 2: LayoutMainSplit (2fr 1fr)
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'LayoutMainSplit', 2, NULL, 1, 12, 6, NULL
  ) RETURNING id INTO l_split;

  -- Main panel: RBAC matrix
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 1, l_split, 1, 8, 6, NULL,
    '{"title":"RBAC","titleEm":"matrix","meta":"role x area permission"}'::jsonb
  ) RETURNING id INTO l_panel_main;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'RbacMatrix', 1, l_panel_main, 1, 12, 6, NULL
  );

  -- Side panel: Activity feed
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 2, l_split, 9, 4, 6, NULL,
    '{"title":"Activity","titleEm":"feed","meta":"live"}'::jsonb
  ) RETURNING id INTO l_panel_side;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'ActivityFeed', 1, l_panel_side, 1, 12, 6, NULL
  );

  -- Top-level slot 3: SuccessionCard (no container, direct top-level)
  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (
    preset_id, 'SuccessionCard', 3, NULL, 1, 12, 6, NULL
  );

  RAISE NOTICE 'hr_director_overview_v2 preset seeded: 11 elements (4 KPI + main-split with RbacMatrix + ActivityFeed + standalone SuccessionCard)';
END $$;

COMMIT;

-- =============================================================================
-- Verification queries (manual run post-seed)
-- =============================================================================
-- Top-level slots per new preset:
-- SELECT widget_code, position FROM dashboard_elements de
--   JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
--   WHERE dp.code IN ('org_systems_v2', 'hr_director_overview_v2')
--     AND de.parent_element_id IS NULL
--   ORDER BY dp.code, de.position;
--
-- Child slots count per preset:
-- SELECT dp.code, COUNT(*) FILTER (WHERE de.parent_element_id IS NOT NULL) AS n_children
--   FROM dashboard_elements de
--   JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
--   WHERE dp.code IN ('org_systems_v2', 'hr_director_overview_v2')
--   GROUP BY dp.code;
