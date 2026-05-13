# Schema Extension Proposal — REV/FTE + EQUITY + TOTAL TC

> Author: S59 closure (P11 enforcement) · 2026-05-13
> Status: **DRAFT — richiede decisione brand-prodotto prima dell'implementazione**

## Contesto

Dopo l'enforcement del constraint P11 (NO MOCK in UI/mockup/test/studio · CLAUDE.md §REGOLA NON NEGOZIABILE), 3 KPI esposti nel preset `tenant_owner_overview_v2` non hanno source nel DBMS e attualmente renderizzano letteralmente "Dati Non Disponibili":

| KPI       | Widget        | Element ID | Stato corrente                       |
| --------- | ------------- | ---------: | ------------------------------------ |
| REV / FTE | KpiRing       |        102 | unavailable=true (no revenue source) |
| EQUITY    | CompCard item | 110.equity | unavailable=true                     |
| TOTAL TC  | CompCard item |  110.total | unavailable=true (derived)           |

Per popolarli con dati live serve **schema extension** (nuove tabelle/colonne/migration). Decisione brand-prodotto richiesta prima dello sviluppo: queste KPI fanno parte del **brand promise** della piattaforma case study? Se sì, qual è il modello dati canonical?

## Opzione A — Extension minima per case study (RTL Bank pilot)

### A.1 — Revenue per tenant (per REV/FTE)

```sql
CREATE TABLE tenant_revenue_periods (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  currency          CHAR(3) NOT NULL DEFAULT 'EUR',
  revenue_amount    NUMERIC(18,2) NOT NULL,
  source            TEXT,  -- 'erp_sync' | 'manual' | 'imported'
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tenant_revenue_period_check CHECK (period_end >= period_start)
);

CREATE INDEX idx_tenant_revenue_periods_tenant ON tenant_revenue_periods(tenant_id, period_end DESC);

ALTER TABLE tenant_revenue_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_revenue_periods FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON tenant_revenue_periods
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());
```

Query REV/FTE post-extension:

```sql
WITH last12m AS (
  SELECT SUM(revenue_amount) AS total
  FROM tenant_revenue_periods
  WHERE tenant_id = current_tenant_id()
    AND period_end >= (CURRENT_DATE - INTERVAL '12 months')
), headcount AS (
  SELECT COUNT(*)::float AS n FROM employees
  WHERE tenant_id = current_tenant_id() AND deleted_at IS NULL AND is_active = true
)
SELECT ROUND(last12m.total / headcount.n / 1000)::int AS rev_per_fte_k_eur
FROM last12m, headcount
WHERE headcount.n > 0;
```

**Effort**: 1h migration + 1h seed CASCADIA (popolare 12 mesi × 4 tenant). **Decisione richiesta**: chi alimenta in produzione? ERP sync automatico o data entry manuale?

### A.2 — Equity grants (per EQUITY)

```sql
CREATE TABLE equity_grants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id       UUID NOT NULL REFERENCES employees_core(id) ON DELETE CASCADE,
  grant_type        TEXT NOT NULL, -- 'rsu' | 'options' | 'esop' | 'phantom'
  shares_granted    NUMERIC(18,4) NOT NULL,
  strike_price      NUMERIC(12,4),
  fair_value        NUMERIC(18,2) NOT NULL,
  currency          CHAR(3) NOT NULL DEFAULT 'EUR',
  grant_date        DATE NOT NULL,
  vesting_schedule  JSONB,
  status            TEXT NOT NULL DEFAULT 'active', -- 'active' | 'vested' | 'expired' | 'cancelled'
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equity_grants_tenant_employee ON equity_grants(tenant_id, employee_id);
CREATE INDEX idx_equity_grants_active ON equity_grants(tenant_id, status) WHERE status = 'active';

ALTER TABLE equity_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_grants FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON equity_grants
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());
```

Query EQUITY post-extension:

```sql
SELECT ROUND(SUM(fair_value) / 1000000, 1) AS equity_m_eur
FROM equity_grants
WHERE tenant_id = current_tenant_id() AND status = 'active';
```

**Effort**: 1h migration + 2h seed CASCADIA. **Decisione richiesta**: tutti i tenant usano equity compensation o solo SaaS/scale-up?

### A.3 — TOTAL TC (derived view, no new table)

```sql
CREATE OR REPLACE VIEW total_compensation_tenant_aggregated AS
SELECT
  e.tenant_id,
  COALESCE(SUM(sba.current_salary), 0) +
  COALESCE((SELECT SUM(total_budget) FROM bonus_plans bp WHERE bp.tenant_id = e.tenant_id AND bp.status = 'active'), 0) +
  COALESCE((SELECT SUM(fair_value) FROM equity_grants eg WHERE eg.tenant_id = e.tenant_id AND eg.status = 'active'), 0)
  AS total_tc_eur
FROM employees e
LEFT JOIN salary_band_assignments sba ON sba.employee_id = e.id
WHERE e.deleted_at IS NULL AND e.is_active = true
GROUP BY e.tenant_id;
```

**Effort**: 30 min view + permissions. Dipende da A.2 (equity_grants) per essere completo.

## Opzione B — Skip schema extension (mantieni unavailable)

Lascia i 3 KPI `unavailable=true` permanentemente nel preset, sostituendoli con altri KPI live nella stessa posizione (es. AVG TENURE, ACTIVE BONUS PLANS, OPEN ROLES, ecc.). **Effort**: 30 min update preset config_overrides.

**Trade-off**: brand-fedele al mockup originale `tenant-owner-overview.html` viene rotto (mockup mostra REV/FTE/EQUITY/TOTAL TC come parte della narrative). Compromette case study production-grade.

## Opzione C — Schema extension + sync mock (NON RACCOMANDATO)

Aggiungi tabelle (A.1-A.3) ma popolale con dati synthetic via CASCADIA seeding. Soluzione tecnica equivalente ad A ma post-INSERT i dati sarebbero "live" tecnicamente ma synthetic in pratica.

**Argomento contro**: viola lo spirito di P11. Anche se tecnicamente legittimo (CASCADIA seeding è il tool per popolare DBMS), i dati synthetic su REV/FTE potrebbero generare false claim brand. Richiede transparency esplicita: "questi numeri sono case study seed, non real-world".

## Raccomandazione

**A** con timeline 1 sessione (S60-S61):

1. S60 — Implementare A.1 (revenue) + popolare CASCADIA RTL Bank realistic (banking annual revenue benchmark Italia)
2. S61 — Implementare A.2 (equity) + A.3 (TOTAL TC view) + popolare CASCADIA per tenant SaaS (Heuresys)
3. Resta `unavailable` per tenant non equity-driven (SmartFood food, EcoNova green-tech early stage)

Effort totale stimato: 6-8h cumulativo. Decisione brand-prodotto:

| Domanda                                        | Default risposta                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| REV/FTE è un brand promise core?               | Probabilmente sì (HR analytics standard KPI)                     |
| Equity granular per-employee o aggregate-only? | Granular abilita roadmap "total rewards statement" futuro        |
| Source revenue in prod: ERP sync o manual?     | Probabilmente ERP webhook + manual override (carry-forward S70+) |

## Decisione richiesta

Da Enzo — tre check:

1. **Opzione A | B | C**?
2. Se **A**: include equity (A.2) o solo revenue (A.1)?
3. Timeline: S60-S61 dedicate o fold in altro roadmap (es. brand v1.0 promotion)?

Note: il constraint P11 attuale è **soddisfatto in tutti gli scenari** — `unavailable=true` è una risposta legittima al constraint, non una violation. La schema extension è un'estensione di feature, non un fix di compliance.
