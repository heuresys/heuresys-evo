-- =============================================================================
-- Migration 0002: Phase 13.B — Dashboard engine schema (additive)
-- Date: 2026-05-06
-- =============================================================================
-- Adds two NEW tables for the data-driven dashboard preset system (Phase 13):
--
-- 1. dashboard_presets — registry of mockup-derived dashboard preset templates
--    (the 9 Tier 1 dashboards: 5 existing TALENT/ENTERPRISE Phase 9 mockup +
--    4 PROCESS placeholder for Phase 13.D). Platform-wide (no tenant_id).
--
-- 2. dashboard_elements — binding (preset × widget × grid position × visibility).
--    Supports tenant_id NULL for platform default (P10 multi-level) +
--    tenant_id <uuid> for tenant-specific override. RLS enforced.
--
-- Boundary vs existing tables (DO NOT touch):
--   - rbp_dashboards (11)      : role-default dashboard registry (system)
--   - dashboards (20)          : user workspace (UUID, owner-based, runtime)
--   - dashboard_widgets (160)  : widget instances in user dashboards (runtime)
--   - widget_catalog (27)      : reusable widget type catalog (referenced)
--   - rbp_perspectives (3)     : PROCESS / ENTERPRISE / TALENT (referenced)
--
-- Plan ref: ~/.claude/plans/credo-che-se-tu-jazzy-key.md § Phase 13.B
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- dashboard_presets
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dashboard_presets (
  id                  BIGSERIAL    PRIMARY KEY,
  code                VARCHAR(64)  NOT NULL UNIQUE,
  name_it             VARCHAR(255) NOT NULL,
  name_en             VARCHAR(255) NOT NULL,
  description_it      TEXT,
  description_en      TEXT,
  perspective_code    VARCHAR(32)  NOT NULL
                                   REFERENCES rbp_perspectives(code)
                                   ON UPDATE CASCADE ON DELETE RESTRICT,
  source_mockup_path  TEXT,
  rbp_dashboard_code  VARCHAR(64),
  persona_label       VARCHAR(255),
  is_published        BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order          INT          NOT NULL DEFAULT 0,
  theme_config        JSONB,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_presets_perspective
  ON dashboard_presets (perspective_code);

CREATE INDEX IF NOT EXISTS idx_dashboard_presets_published
  ON dashboard_presets (is_published)
  WHERE is_published = TRUE;

COMMENT ON TABLE dashboard_presets IS
  'Phase 13.B — registry of mockup-derived dashboard preset templates (Tier 1 9 dashboard preset). Platform-wide; no tenant_id.';

-- -----------------------------------------------------------------------------
-- dashboard_elements
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dashboard_elements (
  id                   BIGSERIAL    PRIMARY KEY,
  dashboard_preset_id  BIGINT       NOT NULL
                                    REFERENCES dashboard_presets(id)
                                    ON DELETE CASCADE,
  widget_catalog_id    INT          REFERENCES widget_catalog(id)
                                    ON UPDATE CASCADE ON DELETE RESTRICT,
  widget_code          VARCHAR(64)  NOT NULL,
  position             INT          NOT NULL,
  grid_col_start       INT          NOT NULL DEFAULT 1,
  grid_col_span        INT          NOT NULL DEFAULT 12,
  grid_row_start       INT          NOT NULL DEFAULT 1,
  grid_row_span        INT          NOT NULL DEFAULT 1,
  perspective_code     VARCHAR(32)  REFERENCES rbp_perspectives(code)
                                    ON UPDATE CASCADE ON DELETE RESTRICT,
  visibility_min_role  INT          NOT NULL DEFAULT 6,
  config_overrides     JSONB,
  tenant_id            UUID         REFERENCES tenants(id)
                                    ON DELETE CASCADE,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Partial unique indexes (PG cannot use COALESCE() in UNIQUE constraint directly)
CREATE UNIQUE INDEX IF NOT EXISTS dashboard_elements_unique_platform
  ON dashboard_elements (dashboard_preset_id, position)
  WHERE tenant_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS dashboard_elements_unique_tenant
  ON dashboard_elements (dashboard_preset_id, position, tenant_id)
  WHERE tenant_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dashboard_elements_preset
  ON dashboard_elements (dashboard_preset_id);

CREATE INDEX IF NOT EXISTS idx_dashboard_elements_tenant
  ON dashboard_elements (tenant_id)
  WHERE tenant_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dashboard_elements_perspective
  ON dashboard_elements (perspective_code)
  WHERE perspective_code IS NOT NULL;

COMMENT ON TABLE dashboard_elements IS
  'Phase 13.B — binding (dashboard_preset × widget × grid position × visibility). tenant_id NULL = platform default; tenant_id <uuid> = tenant override (P10).';
COMMENT ON COLUMN dashboard_elements.tenant_id IS
  'NULL = platform default seeded; non-NULL = tenant-specific override. RLS enforces P1 isolation on non-NULL rows.';
COMMENT ON COLUMN dashboard_elements.visibility_min_role IS
  'RBP role level required to render (-1 SUPERUSER ... 6 EMPLOYEE). Default 6 = visible to everyone.';
COMMENT ON COLUMN dashboard_elements.widget_code IS
  'Stable widget identifier. Either matches widget_catalog.widget_code OR points to a packages/ui atomic component (Phase 13.A): KpiRing, IntegrationHealthPill, SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix.';

-- -----------------------------------------------------------------------------
-- updated_at trigger function (idempotent: reuse existing if present)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION dashboard_engine_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dashboard_presets_updated_at ON dashboard_presets;
CREATE TRIGGER trg_dashboard_presets_updated_at
  BEFORE UPDATE ON dashboard_presets
  FOR EACH ROW EXECUTE FUNCTION dashboard_engine_set_updated_at();

DROP TRIGGER IF EXISTS trg_dashboard_elements_updated_at ON dashboard_elements;
CREATE TRIGGER trg_dashboard_elements_updated_at
  BEFORE UPDATE ON dashboard_elements
  FOR EACH ROW EXECUTE FUNCTION dashboard_engine_set_updated_at();

-- -----------------------------------------------------------------------------
-- RLS — only on dashboard_elements (presets are platform-public read)
-- -----------------------------------------------------------------------------
ALTER TABLE dashboard_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_elements FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dashboard_elements_tenant_isolation ON dashboard_elements;
CREATE POLICY dashboard_elements_tenant_isolation ON dashboard_elements
  USING (
    tenant_id IS NULL
    OR tenant_id = current_setting('app.current_tenant_id', true)::uuid
  )
  WITH CHECK (
    tenant_id IS NULL
    OR tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

COMMENT ON POLICY dashboard_elements_tenant_isolation ON dashboard_elements IS
  'P1+P5 — tenant isolation. NULL rows are platform defaults, visible to all tenants. Non-NULL rows visible only to matching tenant.';

-- -----------------------------------------------------------------------------
-- Migration tracking
-- -----------------------------------------------------------------------------
INSERT INTO schema_migrations (version, applied_at)
VALUES ('0002_phase13_dashboard_engine', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;
