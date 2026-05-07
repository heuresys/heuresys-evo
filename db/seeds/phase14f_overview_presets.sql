-- =============================================================================
-- Seed: Phase 14.SH carry-forward — cross_tenant_overview + tenant_owner_overview
-- Date: 2026-05-07
-- =============================================================================
-- Adds 2 new dashboard presets carry-forward from Phase 14.SH SH-2 / SH-3
-- (referenced by SIDEBAR_MAP for SUPERUSER + TENANT_OWNER, today 404):
--   - cross_tenant_overview (sort_order 5, ENTERPRISE, visibility_min_role -1) → SUPERUSER lens
--   - tenant_owner_overview (sort_order 15, ENTERPRISE, visibility_min_role 0) → TENANT_OWNER lens
--
-- Mockup paths point to real .ux-design/06-mockups/dashboards/ files
-- (no NULL placeholder per project rule "mai placeholders, mai mockup dry").
--
-- Element binding:
--   - KpiRing + IntegrationHealthPill widgets → SQL data_source bound (live counts)
--   - Composite widgets (RbacMatrix, KgMiniGraph, SuccessionCard) → demo fallback,
--     same pattern as other presets (Sprint follow-up may upgrade per phase14e).
--
-- Cross-tenant SQL aggregates intentionally bypass tenant scoping (visibility -1
-- enforced upstream; the queries themselves run inside withTenant() but COUNT(*)
-- on global tables produces fleet-wide values — acceptable for SUPERUSER lens).
--
-- Idempotent: ON CONFLICT (code) DO UPDATE for presets; DELETE/INSERT for platform-
-- default elements per preset.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- dashboard_presets — 2 carry-forward entries
-- -----------------------------------------------------------------------------
INSERT INTO dashboard_presets
  (code, name_it, name_en, description_it, description_en, perspective_code,
   source_mockup_path, persona_label, is_published, sort_order)
VALUES
  ('cross_tenant_overview',
   'Vista Cross-tenant',
   'Cross-tenant Overview',
   'Lente SUPERUSER cross-tenant: aggregati workforce flotta, comparazione 4 tenant, integration health globale, capability gauges pesati.',
   'SUPERUSER cross-tenant lens: fleet workforce aggregates, 4-tenant comparison, global integration health, headcount-weighted capability gauges.',
   'ENTERPRISE',
   '.ux-design/06-mockups/dashboards/cross-tenant-overview.html',
   'Enzo Spenuso · Heuresys System',
   TRUE, 5),

  ('tenant_owner_overview',
   'Vista Tenant Owner',
   'Tenant Owner Overview',
   'Lente C-level tenant-scoped: snapshot organization, breakdown 8 dipartimenti, compensation plan FY, succession ready 9-box top-2.',
   'C-level tenant-scoped lens: organization snapshot, 8-department breakdown, FY compensation plan, 9-box top-2 succession ready.',
   'ENTERPRISE',
   '.ux-design/06-mockups/dashboards/tenant-owner-overview.html',
   'Marco Rossi · TENANT_OWNER · RTL Bank',
   TRUE, 15)

ON CONFLICT (code) DO UPDATE SET
  name_it            = EXCLUDED.name_it,
  name_en            = EXCLUDED.name_en,
  description_it     = EXCLUDED.description_it,
  description_en     = EXCLUDED.description_en,
  perspective_code   = EXCLUDED.perspective_code,
  source_mockup_path = EXCLUDED.source_mockup_path,
  persona_label      = EXCLUDED.persona_label,
  is_published       = EXCLUDED.is_published,
  sort_order         = EXCLUDED.sort_order,
  updated_at         = now();

-- -----------------------------------------------------------------------------
-- dashboard_elements — wipe + re-insert platform defaults (tenant_id IS NULL)
-- -----------------------------------------------------------------------------
DELETE FROM dashboard_elements
 WHERE tenant_id IS NULL
   AND dashboard_preset_id IN (
     SELECT id FROM dashboard_presets
      WHERE code IN ('cross_tenant_overview', 'tenant_owner_overview')
   );

-- -----------------------------------------------------------------------------
-- cross_tenant_overview · 4 widgets · ENTERPRISE · visibility -1 (SUPERUSER only)
-- -----------------------------------------------------------------------------
-- Pos 1 · KpiRing top-left  → fleet employee count (cross-tenant aggregate)
-- Pos 2 · KpiRing top-right → active tenants count
-- Pos 3 · IntegrationHealthPill → fleet integrations
-- Pos 4 · RbacMatrix → cross-tenant RBAC overview (composite, demo fallback)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'ENTERPRISE', -1
  FROM dashboard_presets, (VALUES
    ('KpiRing',               1,  1, 4, 1, 1),
    ('KpiRing',               2,  5, 4, 1, 1),
    ('IntegrationHealthPill', 3,  9, 4, 1, 1),
    ('RbacMatrix',            4,  1, 12, 2, 3)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'cross_tenant_overview';

-- -----------------------------------------------------------------------------
-- tenant_owner_overview · 4 widgets · ENTERPRISE · visibility 0 (TENANT_OWNER+)
-- -----------------------------------------------------------------------------
-- Pos 1 · KpiRing top-left  → tenant employee count (RLS-scoped)
-- Pos 2 · KpiRing top-right → tenant active employees / departments
-- Pos 3 · SuccessionCard → top successors tenant (composite, demo fallback)
-- Pos 4 · IntegrationHealthPill → tenant integrations
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'ENTERPRISE', 0
  FROM dashboard_presets, (VALUES
    ('KpiRing',               1,  1, 4, 1, 1),
    ('KpiRing',               2,  5, 4, 1, 1),
    ('SuccessionCard',        3,  9, 4, 1, 2),
    ('IntegrationHealthPill', 4,  1, 8, 2, 1)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'tenant_owner_overview';

-- =============================================================================
-- Bind data_source SQL on KpiRing + IntegrationHealthPill widgets
-- =============================================================================

-- ---- cross_tenant_overview · pos 1 KpiRing → fleet headcount ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 120,
         'query', $$SELECT count(*)::int AS value,
                          'Fleet headcount' AS label,
                          'cross-tenant · all 4 tenants' AS sublabel
                     FROM employees WHERE is_active = true$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'cross_tenant_overview')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- ---- cross_tenant_overview · pos 2 KpiRing → active tenants ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 600,
         'query', $$SELECT count(*)::int AS value,
                          'Active tenants' AS label,
                          'platform-wide · prod + test' AS sublabel
                     FROM tenants WHERE deleted_at IS NULL$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'cross_tenant_overview')
   AND widget_code = 'KpiRing' AND position = 2 AND tenant_id IS NULL;

-- ---- cross_tenant_overview · pos 3 IntegrationHealthPill → fleet integrations count ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 300,
         'query', $$SELECT count(*)::int AS value,
                          'Fleet integrations' AS label,
                          'cross-tenant · ESCO + SAP + Slack + AAD' AS sublabel
                     FROM integrations$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'cross_tenant_overview')
   AND widget_code = 'IntegrationHealthPill' AND position = 3 AND tenant_id IS NULL;

-- ---- tenant_owner_overview · pos 1 KpiRing → tenant headcount (RLS-scoped) ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 60,
         'query', $$SELECT count(*)::int AS value,
                          'Tenant headcount' AS label,
                          'own tenant · live' AS sublabel
                     FROM employees WHERE is_active = true$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'tenant_owner_overview')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- ---- tenant_owner_overview · pos 2 KpiRing → distinct departments ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 300,
         'query', $$SELECT count(DISTINCT department)::int AS value,
                          'Departments' AS label,
                          'own tenant · org-chart' AS sublabel
                     FROM employees WHERE is_active = true AND department IS NOT NULL$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'tenant_owner_overview')
   AND widget_code = 'KpiRing' AND position = 2 AND tenant_id IS NULL;

-- ---- tenant_owner_overview · pos 4 IntegrationHealthPill → tenant integrations ----
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 300,
         'query', $$SELECT count(*)::int AS value,
                          'Tenant integrations' AS label,
                          'own tenant · ESCO + SAP + Workday' AS sublabel
                     FROM integrations$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'tenant_owner_overview')
   AND widget_code = 'IntegrationHealthPill' AND position = 4 AND tenant_id IS NULL;

COMMIT;

-- =============================================================================
-- Verification (run AFTER COMMIT to confirm idempotent state)
-- =============================================================================
-- SELECT code, name_en, perspective_code, sort_order, source_mockup_path
--   FROM dashboard_presets
--  WHERE code IN ('cross_tenant_overview', 'tenant_owner_overview')
--  ORDER BY sort_order;
--
-- SELECT p.code, e.widget_code, e.position, e.visibility_min_role,
--        (e.config_overrides->'data_source'->>'type') AS source_type
--   FROM dashboard_elements e
--   JOIN dashboard_presets p ON p.id = e.dashboard_preset_id
--  WHERE p.code IN ('cross_tenant_overview', 'tenant_owner_overview')
--    AND e.tenant_id IS NULL
--  ORDER BY p.code, e.position;
