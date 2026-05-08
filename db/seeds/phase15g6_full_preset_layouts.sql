-- =============================================================================
-- Seed phase15g6 FULL — All 7 brand-fedele presets hierarchical (DB-driven)
-- Date: 2026-05-09 (S19 G6 full + adoption)
-- =============================================================================
-- Sostituisce il smoke seed precedente (phase15g6_preset_layouts_smoke.sql)
-- con la versione completa: 7 preset `*_v2` (org_systems_v2, hr_director_overview_v2,
-- cross_tenant_overview_v2, tenant_owner_overview_v2, skills_heatmap_v2,
-- capability_graph_v2, employee_journey_v2). Ognuno con layout hierarchical
-- via dashboard_elements.parent_element_id (post-G4 schema).
--
-- **Pattern config_overrides**: ogni element con dati ha
-- `{"data_source": {"type": "static", "value": {...}}}` (data_source_type='static'
-- supportato in data-fetcher.ts:95-97). Container layout receive metadata
-- via static value (es. {title, titleEm, meta} per Panel head).
--
-- **Adoption support**: in chiusura, UPDATE role_default_dashboards.preset_code
-- da `<original>` a `<original>_v2` per tutti gli 8 ruoli. Original 7 presets
-- restano in dashboard_presets (non eliminati) per /dashboard/[code] demo.
--
-- **Rollback**: revert role_default_dashboards UPDATE → ripristina view bespoke.
--
-- Idempotent via INSERT ON CONFLICT + DELETE re-seed pattern.
-- =============================================================================

BEGIN;

-- ============================================================================
-- Helper: macro-pattern via DO blocks (PL/pgSQL local variables per scope)
-- ============================================================================
-- Each preset is in its own DO block per local variable scope.

-- ============================================================================
-- Preset 1/7: org_systems_v2 — IT_ADMIN
-- Layout: kpi-ring(4) + double-split[panel-Integrations | panel-Audit]
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT;
  l_kpiring BIGINT;
  l_split BIGINT;
  l_panel_l BIGINT;
  l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (
    code, name_it, name_en, description_it, description_en,
    perspective_code, source_mockup_path, persona_label, is_published, sort_order
  ) VALUES (
    'org_systems_v2',
    'Organizzazione e Sistemi (G6)',
    'Org & Systems (G6)',
    'G6 hierarchical DB-driven version (post-G4)',
    'G6 hierarchical version (post-G4)',
    'ENTERPRISE', '.ux-design/06-mockups/dashboards/org-systems.html',
    'IT Admin · G6', false, 100
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL)
  RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"ACTIVE TENANTS","value":4,"sublabel":"1 platform + 3 customer"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"RBAC ROLES","value":8,"sublabel":"-1 SUPERUSER -> 6 EMPLOYEE"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"RLS POLICIES","value":605,"sublabel":"DB-level enforcement"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"SYSTEM UPTIME","value":99.97,"unit":"%","sublabel":"last 30 days"}}}'::jsonb);

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL)
  RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Integrations","titleEm":"health","meta":"7 active"}}}'::jsonb
  ) RETURNING id INTO l_panel_l;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'IntegrationHealthPill', 1, l_panel_l, 1, 12, 6, NULL,
    '{"data_source":{"type":"static","value":{"tone":"ok","label":"7 services nominal","pulse":true}}}'::jsonb
  );

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides
  ) VALUES (
    preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Audit","titleEm":"log","meta":"live stream"}}}'::jsonb
  ) RETURNING id INTO l_panel_r;

  INSERT INTO dashboard_elements (
    dashboard_preset_id, widget_code, position, parent_element_id,
    grid_col_start, grid_col_span, visibility_min_role, tenant_id
  ) VALUES (preset_id, 'ActivityFeed', 1, l_panel_r, 1, 12, 6, NULL);

  RAISE NOTICE 'org_systems_v2 seeded';
END $$;

-- ============================================================================
-- Preset 2/7: hr_director_overview_v2 — HR_DIRECTOR
-- Layout: kpi-ring(4) + main-split[panel-RbacMatrix | panel-ActivityFeed] + SuccessionCard
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_main BIGINT; l_panel_side BIGINT;
BEGIN
  INSERT INTO dashboard_presets (
    code, name_it, name_en, description_it, description_en,
    perspective_code, source_mockup_path, persona_label, is_published, sort_order
  ) VALUES (
    'hr_director_overview_v2', 'Direzione HR (G6)', 'HR Director (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'TALENT', '.ux-design/06-mockups/dashboards/hr-director-overview.html',
    'HR Director · G6', false, 101
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"HEADCOUNT","value":270,"sublabel":"active employees"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"REVIEW Q4","value":86,"unit":"%","sublabel":"completion rate"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"GOALS ACTIVE","value":1248,"sublabel":"OKR cascade"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"SUCCESSION","value":42,"sublabel":"ready-now candidates"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutMainSplit', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 8, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"RBAC","titleEm":"matrix","meta":"role x area"}}}'::jsonb)
  RETURNING id INTO l_panel_main;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'RbacMatrix', 1, l_panel_main, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 9, 4, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Activity","titleEm":"feed","meta":"live"}}}'::jsonb)
  RETURNING id INTO l_panel_side;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'ActivityFeed', 1, l_panel_side, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'SuccessionCard', 3, NULL, 1, 12, 6, NULL);

  RAISE NOTICE 'hr_director_overview_v2 seeded';
END $$;

-- ============================================================================
-- Preset 3/7: cross_tenant_overview_v2 — SUPERUSER
-- Layout: kpi-ring(4) + double-split[panel-IntegrationHealth | panel-ActivityFeed] + Histogram
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_l BIGINT; l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, source_mockup_path, persona_label, is_published, sort_order)
  VALUES (
    'cross_tenant_overview_v2', 'Cross-tenant Overview (G6)', 'Cross-tenant Overview (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'ENTERPRISE', '.ux-design/06-mockups/dashboards/cross-tenant-overview.html',
    'SUPERUSER · G6', false, 102
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"TOTAL TENANTS","value":4,"sublabel":"platform-wide"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"TOTAL EMPLOYEES","value":270,"sublabel":"across all tenants"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"INTEGRATIONS","value":7,"sublabel":"all healthy"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"PLATFORM UPTIME","value":99.97,"unit":"%","sublabel":"last 30 days"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Integration","titleEm":"health","meta":"all tenants"}}}'::jsonb)
  RETURNING id INTO l_panel_l;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'IntegrationHealthPill', 1, l_panel_l, 1, 12, 6, NULL,
    '{"data_source":{"type":"static","value":{"tone":"ok","label":"All systems healthy","pulse":true}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Activity","titleEm":"cross-tenant","meta":"live"}}}'::jsonb)
  RETURNING id INTO l_panel_r;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'ActivityFeed', 1, l_panel_r, 1, 12, 6, NULL);

  -- Histogram standalone (Capability distribution)
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'Histogram', 3, NULL, 1, 12, 6, NULL,
    '{"data_source":{"type":"static","value":{"items":[{"id":"1","label":"90-100","value":58,"tone":"ok"},{"id":"2","label":"70-89","value":112,"tone":"info"},{"id":"3","label":"50-69","value":74,"tone":"warn"},{"id":"4","label":"0-49","value":26,"tone":"critical"}]}}}'::jsonb);

  RAISE NOTICE 'cross_tenant_overview_v2 seeded';
END $$;

-- ============================================================================
-- Preset 4/7: tenant_owner_overview_v2 — TENANT_OWNER
-- Layout: kpi-ring(4) + double-split[panel-CapabilityRadar | panel-ActivityFeed] + CompCard + SuccessionCard
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_l BIGINT; l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, source_mockup_path, persona_label, is_published, sort_order)
  VALUES (
    'tenant_owner_overview_v2', 'Tenant Owner Overview (G6)', 'Tenant Owner Overview (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'ENTERPRISE', '.ux-design/06-mockups/dashboards/tenant-owner-overview.html',
    'TENANT_OWNER · G6', false, 103
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"HEADCOUNT","value":86,"sublabel":"tenant employees"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"REV / FTE","value":142,"unit":"k €","sublabel":"trailing 12 months"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"RETENTION","value":94,"unit":"%","sublabel":"12-month rolling"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"PERFORMANCE","value":82,"unit":"%","sublabel":"avg meets+exceeds"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Capability","titleEm":"radar","meta":"tenant aggregate"}}}'::jsonb)
  RETURNING id INTO l_panel_l;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'CapabilityRadar', 1, l_panel_l, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Activity","titleEm":"feed","meta":"live"}}}'::jsonb)
  RETURNING id INTO l_panel_r;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'ActivityFeed', 1, l_panel_r, 1, 12, 6, NULL);

  -- CompCard standalone (compensation breakdown)
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'CompCard', 3, NULL, 1, 12, 6, NULL,
    '{"data_source":{"type":"static","value":{"items":[{"id":"salary","label":"AVG SALARY","value":68,"unit":"k €"},{"id":"bonus","label":"BONUS POOL","value":420,"unit":"k €"},{"id":"equity","label":"EQUITY","value":1.2,"unit":"M €"},{"id":"total","label":"TOTAL TC","value":7.4,"unit":"M €"}]}}}'::jsonb);

  -- SuccessionCard standalone
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'SuccessionCard', 4, NULL, 1, 12, 6, NULL);

  RAISE NOTICE 'tenant_owner_overview_v2 seeded';
END $$;

-- ============================================================================
-- Preset 5/7: skills_heatmap_v2 — HR_MANAGER
-- Layout: kpi-ring(4) + double-split[panel-SkillHeatmap | panel-Histogram]
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_l BIGINT; l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, source_mockup_path, persona_label, is_published, sort_order)
  VALUES (
    'skills_heatmap_v2', 'Skills Heatmap (G6)', 'Skills Heatmap (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'TALENT', '.ux-design/06-mockups/dashboards/skills-heatmap.html',
    'HR_MANAGER · G6', false, 104
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"SKILL COVERAGE","value":73,"unit":"%","sublabel":"company-wide"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"GAP CRITICAL","value":12,"sublabel":"red cells"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"LEARNING ENROLL","value":62,"unit":"%","sublabel":"active"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"CERTIFICATIONS","value":1.4,"unit":"k","sublabel":"earned YTD"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Skill","titleEm":"matrix","meta":"functions x skills"}}}'::jsonb)
  RETURNING id INTO l_panel_l;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'SkillHeatmap', 1, l_panel_l, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Coverage","titleEm":"distribution","meta":"cells per bucket"}}}'::jsonb)
  RETURNING id INTO l_panel_r;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'Histogram', 1, l_panel_r, 1, 12, 6, NULL,
    '{"data_source":{"type":"static","value":{"items":[{"id":"1","label":"90-100","value":18,"tone":"ok"},{"id":"2","label":"70-89","value":42,"tone":"info"},{"id":"3","label":"50-69","value":31,"tone":"warn"},{"id":"4","label":"0-49","value":9,"tone":"critical"}]}}}'::jsonb);

  RAISE NOTICE 'skills_heatmap_v2 seeded';
END $$;

-- ============================================================================
-- Preset 6/7: capability_graph_v2 — DEPT_HEAD
-- Layout: kpi-ring(4) + double-split[panel-KgGraph | panel-ActivityFeed] + CapabilityRadar
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_l BIGINT; l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, source_mockup_path, persona_label, is_published, sort_order)
  VALUES (
    'capability_graph_v2', 'Capability Graph (G6)', 'Capability Graph (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'TALENT', '.ux-design/06-mockups/dashboards/capability-graph.html',
    'DEPT_HEAD · G6', false, 105
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 1, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"TEAM SIZE","value":24,"sublabel":"direct reports"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"CAPABILITY AVG","value":78,"unit":"%","sublabel":"team aggregate"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"GAP COUNT","value":7,"sublabel":"critical gaps"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"ROLE COVERAGE","value":92,"unit":"%","sublabel":"all positions filled"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutDoubleSplit', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 8, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Knowledge Graph","titleEm":"topology","meta":"5 clusters"}}}'::jsonb)
  RETURNING id INTO l_panel_l;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'KgMiniGraph', 1, l_panel_l, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 9, 4, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Activity","titleEm":"feed","meta":"team"}}}'::jsonb)
  RETURNING id INTO l_panel_r;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'ActivityFeed', 1, l_panel_r, 1, 12, 6, NULL);

  -- CapabilityRadar standalone
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'CapabilityRadar', 3, NULL, 1, 12, 6, NULL);

  RAISE NOTICE 'capability_graph_v2 seeded';
END $$;

-- ============================================================================
-- Preset 7/7: employee_journey_v2 — LINE_MANAGER + EMPLOYEE
-- Layout: ProfileHero + kpi-ring(4) + CareerArc + double-split[panel-CapabilityRadar | panel-BridgeCard]
-- ============================================================================
DO $$
DECLARE
  preset_id BIGINT; l_kpiring BIGINT; l_split BIGINT;
  l_panel_l BIGINT; l_panel_r BIGINT;
BEGIN
  INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, source_mockup_path, persona_label, is_published, sort_order)
  VALUES (
    'employee_journey_v2', 'Employee Journey (G6)', 'Employee Journey (G6)',
    'G6 hierarchical', 'G6 hierarchical',
    'TALENT', '.ux-design/06-mockups/dashboards/employee-journey.html',
    'LINE_MANAGER + EMPLOYEE · G6', false, 106
  )
  ON CONFLICT (code) DO UPDATE SET name_it = EXCLUDED.name_it, updated_at = NOW()
  RETURNING id INTO preset_id;
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = preset_id;

  -- ProfileHero top
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'ProfileHero', 1, NULL, 1, 12, 6, NULL);

  -- KPI ring
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutKpiRing', 2, NULL, 1, 12, 6, NULL) RETURNING id INTO l_kpiring;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides) VALUES
    (preset_id, 'KpiRing', 1, l_kpiring, 1, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"CAPABILITY","value":78,"unit":"%","sublabel":"current"}}}'::jsonb),
    (preset_id, 'KpiRing', 2, l_kpiring, 4, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"GOALS Q4","value":4,"unit":"/5","sublabel":"on track"}}}'::jsonb),
    (preset_id, 'KpiRing', 3, l_kpiring, 7, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"TENURE","value":4.2,"unit":"yr","sublabel":"current role"}}}'::jsonb),
    (preset_id, 'KpiRing', 4, l_kpiring, 10, 3, 6, NULL,
     '{"data_source":{"type":"static","value":{"label":"NEXT REVIEW","value":12,"unit":"d","sublabel":"Q4 cycle"}}}'::jsonb);

  -- CareerArc standalone
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'CareerArc', 3, NULL, 1, 12, 6, NULL);

  -- DoubleSplit with CapabilityRadar + BridgeCard
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'LayoutDoubleSplit', 4, NULL, 1, 12, 6, NULL) RETURNING id INTO l_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 1, l_split, 1, 7, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Capability","titleEm":"radar","meta":"current vs target"}}}'::jsonb)
  RETURNING id INTO l_panel_l;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'CapabilityRadar', 1, l_panel_l, 1, 12, 6, NULL);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id, config_overrides)
  VALUES (preset_id, 'LayoutPanel', 2, l_split, 8, 5, 6, NULL,
    '{"data_source":{"type":"static","value":{"title":"Bridge","titleEm":"to next","meta":"3 paths"}}}'::jsonb)
  RETURNING id INTO l_panel_r;
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, parent_element_id, grid_col_start, grid_col_span, visibility_min_role, tenant_id)
  VALUES (preset_id, 'BridgeCard', 1, l_panel_r, 1, 12, 6, NULL);

  RAISE NOTICE 'employee_journey_v2 seeded';
END $$;

-- ============================================================================
-- Adoption: UPDATE role_default_dashboards mapping → *_v2 presets
-- ============================================================================
UPDATE role_default_dashboards SET preset_code = 'cross_tenant_overview_v2', updated_at = NOW()
  WHERE role = 'SUPERUSER' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'tenant_owner_overview_v2', updated_at = NOW()
  WHERE role = 'TENANT_OWNER' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'org_systems_v2', updated_at = NOW()
  WHERE role = 'IT_ADMIN' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'hr_director_overview_v2', updated_at = NOW()
  WHERE role = 'HR_DIRECTOR' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'skills_heatmap_v2', updated_at = NOW()
  WHERE role = 'HR_MANAGER' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'capability_graph_v2', updated_at = NOW()
  WHERE role = 'DEPT_HEAD' AND tenant_id IS NULL;
UPDATE role_default_dashboards SET preset_code = 'employee_journey_v2', updated_at = NOW()
  WHERE role IN ('LINE_MANAGER', 'EMPLOYEE') AND tenant_id IS NULL;

COMMIT;

-- =============================================================================
-- Rollback (manual): restore original preset_code mapping
-- =============================================================================
-- BEGIN;
-- UPDATE role_default_dashboards SET preset_code = 'cross_tenant_overview' WHERE role = 'SUPERUSER' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'tenant_owner_overview' WHERE role = 'TENANT_OWNER' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'org_systems' WHERE role = 'IT_ADMIN' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'hr_director_overview' WHERE role = 'HR_DIRECTOR' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'skills_heatmap' WHERE role = 'HR_MANAGER' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'capability_graph' WHERE role = 'DEPT_HEAD' AND tenant_id IS NULL;
-- UPDATE role_default_dashboards SET preset_code = 'employee_journey' WHERE role IN ('LINE_MANAGER', 'EMPLOYEE') AND tenant_id IS NULL;
-- COMMIT;
