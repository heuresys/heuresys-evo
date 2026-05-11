-- Phase 18e (S35.3 M7) — Regulatory frameworks master + tenant compliance junction
--
-- Goal: master catalog of regulatory frameworks (platform-default, no tenant_id)
-- + tenant junction per tracciare compliance status + certification + review cycle.
--
-- Lexicon: PROGOV — vedi docs/_meta/lexicon.md
-- Idempotent: CREATE IF NOT EXISTS + ON CONFLICT DO NOTHING
-- Rollback: phase18e_DOWN.sql

BEGIN;

-- ============================================================================
-- 1. REGULATORY_FRAMEWORKS catalog (platform-default, no tenant_id)
-- ============================================================================

CREATE TABLE IF NOT EXISTS regulatory_frameworks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(64) NOT NULL UNIQUE,
  name              VARCHAR(255) NOT NULL,
  name_en           VARCHAR(255),
  full_reference    VARCHAR(512),
  scope             TEXT,
  regulator         VARCHAR(255),
  jurisdiction      VARCHAR(64),
  category          VARCHAR(64),
  effective_from    DATE,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  reference_url     VARCHAR(512),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_regulatory_frameworks_category
  ON regulatory_frameworks (category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_regulatory_frameworks_jurisdiction
  ON regulatory_frameworks (jurisdiction) WHERE is_active = true;

COMMENT ON TABLE regulatory_frameworks IS
  'PROGOV: catalog regulatory frameworks (PSD2/MiFID II/AML5/Basel III/GDPR/...). Platform-default catalog.';

-- ============================================================================
-- 2. TENANT_REGULATORY_COMPLIANCE junction (tenant-scoped)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_regulatory_compliance (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  framework_code        VARCHAR(64) NOT NULL REFERENCES regulatory_frameworks(code) ON DELETE RESTRICT,
  compliance_status     VARCHAR(32) NOT NULL DEFAULT 'in_scope'
    CHECK (compliance_status IN ('in_scope','partial','compliant','non_compliant','out_of_scope')),
  applicable_from       DATE NOT NULL DEFAULT CURRENT_DATE,
  certification_date    DATE,
  next_review_date      DATE,
  responsible_role      VARCHAR(64),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, framework_code)
);

CREATE INDEX IF NOT EXISTS idx_tenant_regulatory_compliance_tenant
  ON tenant_regulatory_compliance (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_regulatory_compliance_status
  ON tenant_regulatory_compliance (compliance_status);

ALTER TABLE tenant_regulatory_compliance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_regulatory_compliance_isolation ON tenant_regulatory_compliance;
CREATE POLICY tenant_regulatory_compliance_isolation ON tenant_regulatory_compliance
  USING (tenant_id = (NULLIF(current_setting('app.current_tenant_id', true), '')::uuid));

COMMENT ON TABLE tenant_regulatory_compliance IS
  'PROGOV: tenant ↔ regulatory framework applicability + compliance status + certification cycle.';

-- ============================================================================
-- 3. updated_at triggers (reuse set_updated_at_now from phase18d)
-- ============================================================================

DROP TRIGGER IF EXISTS trg_regulatory_frameworks_updated_at ON regulatory_frameworks;
CREATE TRIGGER trg_regulatory_frameworks_updated_at
  BEFORE UPDATE ON regulatory_frameworks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

DROP TRIGGER IF EXISTS trg_tenant_regulatory_compliance_updated_at ON tenant_regulatory_compliance;
CREATE TRIGGER trg_tenant_regulatory_compliance_updated_at
  BEFORE UPDATE ON tenant_regulatory_compliance
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- ============================================================================
-- 4. SEED: 10 regulatory frameworks canonical
-- ============================================================================

INSERT INTO regulatory_frameworks (code, name, name_en, full_reference, scope, regulator, jurisdiction, category, effective_from, reference_url)
VALUES
  ('PSD2',         'PSD2 (Direttiva sui Servizi di Pagamento 2)', 'Payment Services Directive 2', 'Direttiva (UE) 2015/2366',
   'Pagamenti, Open Banking, Strong Customer Authentication (SCA), TPP (AISP/PISP)',
   'Banca d''Italia + EBA + Consob', 'EU + IT', 'payments', '2018-01-13',
   'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32015L2366'),

  ('MIFID_II',     'MiFID II (Markets in Financial Instruments Directive II)', 'Markets in Financial Instruments Directive II', 'Direttiva (UE) 2014/65',
   'Servizi investimento, valutazione adeguatezza/appropriatezza, product governance, transaction reporting',
   'Consob + ESMA', 'EU + IT', 'investment', '2018-01-03',
   'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=celex%3A32014L0065'),

  ('AML5',         'AML5 (5a Direttiva Antiriciclaggio)', '5th Anti-Money Laundering Directive', 'Direttiva (UE) 2018/843',
   'KYC, titolare effettivo, segnalazioni operazioni sospette (STR), virtual assets',
   'UIF Banca d''Italia + Guardia di Finanza', 'EU + IT', 'aml', '2020-01-10',
   'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32018L0843'),

  ('BASEL_III',    'Basel III Framework', 'Basel III Framework', 'BCBS d424',
   'Adeguatezza patrimoniale, leverage ratio, liquidity LCR/NSFR, IRB modeling',
   'Banca d''Italia + ECB SSM + BCBS', 'EU + IT', 'capital_liquidity', '2013-01-01',
   'https://www.bis.org/bcbs/basel3.htm'),

  ('IFRS_9',       'IFRS 9 Financial Instruments', 'IFRS 9 Financial Instruments', 'IFRS 9',
   'Classification & measurement, expected credit loss (ECL) model, hedge accounting',
   'IASB + EFRAG endorsed', 'EU + IT', 'accounting', '2018-01-01',
   'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/'),

  ('GDPR',         'GDPR (Regolamento generale sulla protezione dei dati)', 'General Data Protection Regulation', 'Regolamento (UE) 2016/679',
   'Protezione dati personali, breach notification 72h, DPO, DPIA, right to erasure',
   'Garante per la Protezione dei Dati Personali', 'EU + IT', 'privacy', '2018-05-25',
   'https://gdpr-info.eu/'),

  ('BDI_CIRC_285', 'Banca d''Italia Circolare 285/2013', 'Bank of Italy Circular 285', 'Circolare 285 del 17/12/2013',
   'Disposizioni di vigilanza per le banche (governance, controlli interni, ICAAP/ILAAP, remunerazioni)',
   'Banca d''Italia', 'IT', 'supervision', '2014-01-01',
   'https://www.bancaditalia.it/compiti/vigilanza/normativa/archivio-norme/circolari/c285/'),

  ('BDI_CIRC_295', 'Banca d''Italia Circolare 295/2014', 'Bank of Italy Circular 295', 'Circolare 295 del 26/11/2014',
   'Segnalazioni di vigilanza prudenziale (FINREP/COREP harmonized + IT-specific schedules)',
   'Banca d''Italia', 'IT', 'reporting', '2015-01-01',
   'https://www.bancaditalia.it/compiti/vigilanza/normativa/archivio-norme/circolari/c295/'),

  ('TUB',          'Testo Unico Bancario (D.Lgs. 385/1993)', 'Italian Banking Law', 'Decreto Legislativo 1° settembre 1993, n. 385',
   'Legge quadro attività bancaria italiana, autorizzazione banche, trasparenza, vigilanza, crisi',
   'Banca d''Italia + Ministero Economia', 'IT', 'banking_law', '1993-09-01',
   'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1993-09-01;385'),

  ('DORA',         'DORA (Digital Operational Resilience Act)', 'Digital Operational Resilience Act', 'Regolamento (UE) 2022/2554',
   'ICT risk management, incident reporting 24h, third-party ICT risk (CTPP register), threat-led penetration testing',
   'Banca d''Italia + ENISA + ESAs', 'EU + IT', 'operational_resilience', '2025-01-17',
   'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32022R2554')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 5. SEED: tenant_regulatory_compliance RTL Bank → 10 framework banking
-- ============================================================================

INSERT INTO tenant_regulatory_compliance (tenant_id, framework_code, compliance_status, applicable_from, next_review_date, responsible_role)
SELECT t.id, v.fcode, v.status, v.app_from, v.review, v.role
FROM tenants t
JOIN (VALUES
  ('PSD2',         'compliant',     '2018-01-13'::date, '2026-12-31'::date, 'CRO + IT Director'),
  ('MIFID_II',     'compliant',     '2018-01-03'::date, '2026-12-31'::date, 'CRO + Investment Director'),
  ('AML5',         'compliant',     '2020-01-10'::date, '2026-06-30'::date, 'AML Compliance Officer'),
  ('BASEL_III',    'compliant',     '2013-01-01'::date, '2027-03-31'::date, 'CRO'),
  ('IFRS_9',       'compliant',     '2018-01-01'::date, '2026-12-31'::date, 'CFO + Risk'),
  ('GDPR',         'compliant',     '2018-05-25'::date, '2026-09-30'::date, 'DPO + Legal Director'),
  ('BDI_CIRC_285', 'compliant',     '2014-01-01'::date, '2027-06-30'::date, 'CRO + Governance'),
  ('BDI_CIRC_295', 'compliant',     '2015-01-01'::date, '2026-12-31'::date, 'CFO + Risk Reporting'),
  ('TUB',          'compliant',     '1993-09-01'::date, '2030-12-31'::date, 'Legal Director'),
  ('DORA',         'partial',       '2025-01-17'::date, '2026-12-31'::date, 'CTO + CRO')
) AS v(fcode, status, app_from, review, role) ON true
WHERE t.code = 'rtl-bank'
  AND EXISTS (SELECT 1 FROM regulatory_frameworks rf WHERE rf.code = v.fcode)
ON CONFLICT (tenant_id, framework_code) DO NOTHING;

-- ============================================================================
-- 6. schema_migrations
-- ============================================================================

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18e_regulatory_frameworks', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT count(*) FROM regulatory_frameworks;                              -- expected: 10
-- SELECT count(*) FROM tenant_regulatory_compliance
--   WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank');        -- expected: 10
