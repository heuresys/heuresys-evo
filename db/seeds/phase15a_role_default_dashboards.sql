-- Phase 15.A — Role → Preset assignment (P9 data-driven · P10 multi-tenant)
-- Stabilisce mapping role → dashboard preset_code di default, con override per tenant.
-- Idempotent via CREATE IF NOT EXISTS + INSERT ON CONFLICT DO NOTHING.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS role_default_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  preset_code TEXT NOT NULL REFERENCES dashboard_presets(code) ON DELETE CASCADE,
  tenant_id UUID NULL REFERENCES tenants(id) ON DELETE CASCADE,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE role_default_dashboards IS
  'Role → preset_code assignment. tenant_id NULL = platform default; non-null = tenant override. Resolver picks tenant override first, falls back to platform.';

-- ============================================================
-- UNIQUE INDEXES (partial, NULL-aware)
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS uniq_role_default_platform
  ON role_default_dashboards (role)
  WHERE tenant_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_role_default_tenant
  ON role_default_dashboards (role, tenant_id)
  WHERE tenant_id IS NOT NULL;

-- ============================================================
-- RLS (P5)
-- ============================================================
ALTER TABLE role_default_dashboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rdd_select ON role_default_dashboards;
CREATE POLICY rdd_select ON role_default_dashboards
  FOR SELECT
  USING (
    tenant_id IS NULL
    OR tenant_id::text = current_setting('app.current_tenant_id', true)
  );

DROP POLICY IF EXISTS rdd_admin_write ON role_default_dashboards;
CREATE POLICY rdd_admin_write ON role_default_dashboards
  FOR ALL
  USING (
    current_setting('app.current_role', true) IN ('SUPERUSER', 'TENANT_OWNER', 'IT_ADMIN')
  );

-- ============================================================
-- SEED — 8 platform default (tenant_id NULL)
-- ============================================================
INSERT INTO role_default_dashboards (role, preset_code, tenant_id, priority) VALUES
  ('SUPERUSER',    'cross_tenant_overview',  NULL, 0),
  ('TENANT_OWNER', 'tenant_owner_overview',  NULL, 0),
  ('IT_ADMIN',     'org_systems',            NULL, 0),
  ('HR_DIRECTOR',  'hr_director_overview',   NULL, 0),
  ('HR_MANAGER',   'skills_heatmap',         NULL, 0),
  ('DEPT_HEAD',    'capability_graph',       NULL, 0),
  ('LINE_MANAGER', 'employee_journey',       NULL, 0),
  ('EMPLOYEE',     'employee_journey',       NULL, 0)
ON CONFLICT DO NOTHING;
