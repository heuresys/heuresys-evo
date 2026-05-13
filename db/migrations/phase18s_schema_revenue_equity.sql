-- phase18s — Schema extension: tenant_revenue_periods + equity_grants + TOTAL TC view (S60 CF-4)
-- Constraint P11: sblocca REV/FTE, EQUITY, TOTAL TC dal stato unavailable=true.
--
-- Reference: docs/_audit/2026-05-13-schema-extension-proposal-revfte-equity-totaltc.md (Opzione A)

BEGIN;

-- ============================================================
-- A.1 — tenant_revenue_periods (monthly/quarterly revenue per tenant)
-- ============================================================
CREATE TABLE IF NOT EXISTS tenant_revenue_periods (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  currency          CHAR(3) NOT NULL DEFAULT 'EUR',
  revenue_amount    NUMERIC(18,2) NOT NULL,
  source            TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tenant_revenue_period_check CHECK (period_end >= period_start),
  CONSTRAINT tenant_revenue_period_unique UNIQUE (tenant_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_tenant_revenue_periods_tenant_period
  ON tenant_revenue_periods(tenant_id, period_end DESC);

ALTER TABLE tenant_revenue_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_revenue_periods FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON tenant_revenue_periods;
CREATE POLICY tenant_isolation ON tenant_revenue_periods
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());

-- ============================================================
-- A.2 — equity_grants (per-employee equity compensation)
-- ============================================================
CREATE TABLE IF NOT EXISTS equity_grants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id       UUID NOT NULL REFERENCES employees_core(id) ON DELETE CASCADE,
  grant_type        TEXT NOT NULL,
  shares_granted    NUMERIC(18,4) NOT NULL,
  strike_price      NUMERIC(12,4),
  fair_value        NUMERIC(18,2) NOT NULL,
  currency          CHAR(3) NOT NULL DEFAULT 'EUR',
  grant_date        DATE NOT NULL,
  vesting_schedule  JSONB,
  status            TEXT NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT equity_grants_status_check CHECK (status IN ('active','vested','expired','cancelled')),
  CONSTRAINT equity_grants_type_check CHECK (grant_type IN ('rsu','options','esop','phantom'))
);

CREATE INDEX IF NOT EXISTS idx_equity_grants_tenant_employee
  ON equity_grants(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_equity_grants_active
  ON equity_grants(tenant_id, status) WHERE status = 'active';

ALTER TABLE equity_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_grants FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON equity_grants;
CREATE POLICY tenant_isolation ON equity_grants
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());

-- ============================================================
-- A.3 — total_compensation_tenant_aggregated (view, derived)
-- ============================================================
DROP VIEW IF EXISTS total_compensation_tenant_aggregated;
CREATE VIEW total_compensation_tenant_aggregated AS
SELECT
  t.id AS tenant_id,
  COALESCE((
    SELECT SUM(sba.current_salary)
    FROM salary_band_assignments sba
    JOIN employees e ON e.id = sba.employee_id
    WHERE e.tenant_id = t.id AND e.deleted_at IS NULL AND e.is_active = true
  ), 0) AS base_payroll_eur,
  COALESCE((
    SELECT SUM(bp.total_budget)
    FROM bonus_plans bp
    WHERE bp.tenant_id = t.id AND bp.status = 'active'
  ), 0) AS bonus_pool_eur,
  COALESCE((
    SELECT SUM(eg.fair_value)
    FROM equity_grants eg
    WHERE eg.tenant_id = t.id AND eg.status = 'active'
  ), 0) AS equity_active_eur
FROM tenants t
WHERE t.status = 'active';

COMMIT;
