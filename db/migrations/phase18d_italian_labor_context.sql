-- Phase 18d (S35.1) — Italian labor context tables: sindacati + linkages
--
-- Context: ccnl_contracts (7 rows) + ccnl_levels (27 rows) + holidays (144 rows IT)
-- esistono già. Manca:
--   1. ccnl_levels per CCNL_COMM_2024 (Heuresys tenant) → 9 levels canonical
--   2. sindacati catalog (platform-default, no tenant_id)
--   3. tenant_ccnl_links junction (tenant → CCNL principale + storico)
--   4. sindacato_tenant_links junction (tenant ↔ sindacati locali)
--   5. RLS policies + indexes + FK
--
-- Lexicon: ITLAB (Italian Labor) — vedi docs/_meta/lexicon.md (creato S35.2)
-- Idempotent: ON CONFLICT DO NOTHING; safe re-run.
-- Rollback: phase18d_DOWN.sql

BEGIN;

-- ============================================================================
-- 1. SINDACATI catalog (platform-default, no tenant_id, no RLS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sindacati (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  VARCHAR(32) NOT NULL UNIQUE,
  name                  VARCHAR(255) NOT NULL,
  name_en               VARCHAR(255),
  full_name             VARCHAR(512),
  sector                VARCHAR(64),
  federation_parent_id  UUID REFERENCES sindacati(id) ON DELETE SET NULL,
  website               VARCHAR(255),
  is_confederation      BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sindacati_sector
  ON sindacati (sector) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sindacati_federation_parent
  ON sindacati (federation_parent_id) WHERE federation_parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sindacati_confederation
  ON sindacati (is_confederation) WHERE is_confederation = true;

COMMENT ON TABLE sindacati IS
  'ITLAB: catalogo nazionale italiano sindacati (confederazioni CGIL/CISL/UIL/UGL + federazioni di categoria).';

-- ============================================================================
-- 2. TENANT_CCNL_LINKS junction (tenant → CCNL, con storico)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_ccnl_links (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ccnl_code         VARCHAR(64) NOT NULL REFERENCES ccnl_contracts(code) ON DELETE RESTRICT,
  is_primary        BOOLEAN NOT NULL DEFAULT true,
  effective_from    DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to      DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, ccnl_code, effective_from)
);

CREATE INDEX IF NOT EXISTS idx_tenant_ccnl_links_tenant
  ON tenant_ccnl_links (tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_ccnl_links_primary
  ON tenant_ccnl_links (tenant_id) WHERE is_primary = true AND effective_to IS NULL;

-- RLS: tenant-scoped
ALTER TABLE tenant_ccnl_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_ccnl_links_isolation ON tenant_ccnl_links;
CREATE POLICY tenant_ccnl_links_isolation ON tenant_ccnl_links
  USING (tenant_id = (NULLIF(current_setting('app.current_tenant_id', true), '')::uuid));

COMMENT ON TABLE tenant_ccnl_links IS
  'ITLAB: associazione tenant ↔ CCNL applicato (storico via effective_from/to). is_primary flag per CCNL principale.';

-- ============================================================================
-- 3. SINDACATO_TENANT_LINKS junction (tenant ↔ sindacati attivi)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sindacato_tenant_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sindacato_id    UUID NOT NULL REFERENCES sindacati(id) ON DELETE CASCADE,
  signed_at       DATE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  rsu_count       INT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, sindacato_id)
);

CREATE INDEX IF NOT EXISTS idx_sindacato_tenant_links_tenant
  ON sindacato_tenant_links (tenant_id);
CREATE INDEX IF NOT EXISTS idx_sindacato_tenant_links_sindacato
  ON sindacato_tenant_links (sindacato_id);

-- RLS: tenant-scoped
ALTER TABLE sindacato_tenant_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sindacato_tenant_links_isolation ON sindacato_tenant_links;
CREATE POLICY sindacato_tenant_links_isolation ON sindacato_tenant_links
  USING (tenant_id = (NULLIF(current_setting('app.current_tenant_id', true), '')::uuid));

COMMENT ON TABLE sindacato_tenant_links IS
  'ITLAB: sindacati attivi presso il tenant (RSU/RSA presenti). is_active flag per stato corrente.';

-- ============================================================================
-- 4. updated_at triggers (idempotent reuse)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname='set_updated_at_now') THEN
    CREATE FUNCTION set_updated_at_now() RETURNS TRIGGER AS $f$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $f$ LANGUAGE plpgsql;
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_sindacati_updated_at ON sindacati;
CREATE TRIGGER trg_sindacati_updated_at
  BEFORE UPDATE ON sindacati
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

DROP TRIGGER IF EXISTS trg_tenant_ccnl_links_updated_at ON tenant_ccnl_links;
CREATE TRIGGER trg_tenant_ccnl_links_updated_at
  BEFORE UPDATE ON tenant_ccnl_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

DROP TRIGGER IF EXISTS trg_sindacato_tenant_links_updated_at ON sindacato_tenant_links;
CREATE TRIGGER trg_sindacato_tenant_links_updated_at
  BEFORE UPDATE ON sindacato_tenant_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- ============================================================================
-- 5. SEED: ccnl_levels per CCNL_COMM_2024 (Heuresys tenant)
-- ============================================================================
-- 9 livelli canonical Confcommercio Terziario 2024 (salari mensili realistici)

INSERT INTO ccnl_levels (ccnl_code, level_code, level_name, level_order, category, monthly_salary, num_monthly_payments, effective_date, is_current)
VALUES
  ('CCNL_COMM_2024', 'QUADRO', 'Quadro',                       1, 'quadro_direttivo', 3050.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L1',     '1° Livello',                   2, 'impiegato',  2500.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L2',     '2° Livello',                   3, 'impiegato',  2200.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L3',     '3° Livello',                   4, 'impiegato',  1980.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L4',     '4° Livello',                   5, 'impiegato',  1850.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L5',     '5° Livello',                   6, 'operaio',    1700.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L6',     '6° Livello',                   7, 'operaio',    1580.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'L7',     '7° Livello',                   8, 'operaio',    1440.00, 14, '2024-04-01', true),
  ('CCNL_COMM_2024', 'OPV',    'Operatore di vendita',         9, 'operaio',    1350.00, 14, '2024-04-01', true)
ON CONFLICT (ccnl_code, level_code, effective_date) DO NOTHING;

-- ============================================================================
-- 6. SEED: sindacati canonical italiani
-- ============================================================================

-- Confederazioni nazionali
INSERT INTO sindacati (code, name, name_en, full_name, sector, is_confederation, is_active, website)
VALUES
  ('CGIL', 'CGIL', 'CGIL', 'Confederazione Generale Italiana del Lavoro', NULL, true, true, 'https://www.cgil.it'),
  ('CISL', 'CISL', 'CISL', 'Confederazione Italiana Sindacati Lavoratori', NULL, true, true, 'https://www.cisl.it'),
  ('UIL',  'UIL',  'UIL',  'Unione Italiana del Lavoro', NULL, true, true, 'https://www.uil.it'),
  ('UGL',  'UGL',  'UGL',  'Unione Generale del Lavoro', NULL, true, true, 'https://www.ugl.it')
ON CONFLICT (code) DO NOTHING;

-- Federazioni banking (sector: credito)
INSERT INTO sindacati (code, name, full_name, sector, federation_parent_id, is_active)
SELECT v.code, v.name, v.full_name, v.sector, p.id, true
FROM (VALUES
  ('FISAC_CGIL',   'FISAC CGIL',  'Federazione Italiana Sindacale Assicurazioni Credito (CGIL)', 'credito', 'CGIL'),
  ('FIRST_CISL',   'FIRST CISL',  'Federazione Italiana Reti Servizi Terziario (CISL)',          'credito', 'CISL'),
  ('UILCA',        'UILCA',       'Unione Italiana Lavoratori Credito Esattorie Assicurazioni (UIL)', 'credito', 'UIL'),
  ('FABI',         'FABI',        'Federazione Autonoma Bancari Italiani',                       'credito', NULL),
  ('SINFUB',       'SINFUB',      'Sindacato Nazionale Funzioni Direttive Bancarie',             'credito', NULL),
  ('UGL_CREDITO',  'UGL Credito', 'UGL Credito',                                                 'credito', 'UGL')
) AS v(code, name, full_name, sector, parent_code)
LEFT JOIN sindacati p ON p.code = v.parent_code
ON CONFLICT (code) DO NOTHING;

-- Federazioni alimentare (sector: alimentare)
INSERT INTO sindacati (code, name, full_name, sector, federation_parent_id, is_active)
SELECT v.code, v.name, v.full_name, v.sector, p.id, true
FROM (VALUES
  ('FLAI_CGIL',    'FLAI CGIL', 'Federazione Lavoratori Agroindustria (CGIL)',  'alimentare', 'CGIL'),
  ('FAI_CISL',     'FAI CISL',  'Federazione Agricola Alimentare Ambientale (CISL)', 'alimentare', 'CISL'),
  ('UILA_UIL',     'UILA UIL',  'Unione Italiana Lavoratori Agroalimentari (UIL)',  'alimentare', 'UIL'),
  ('UGL_AGROALIM', 'UGL Agroalimentare', 'UGL Agroalimentare',                  'alimentare', 'UGL')
) AS v(code, name, full_name, sector, parent_code)
LEFT JOIN sindacati p ON p.code = v.parent_code
ON CONFLICT (code) DO NOTHING;

-- Federazioni energia/elettrico (sector: energia)
INSERT INTO sindacati (code, name, full_name, sector, federation_parent_id, is_active)
SELECT v.code, v.name, v.full_name, v.sector, p.id, true
FROM (VALUES
  ('FILCTEM_CGIL', 'FILCTEM CGIL', 'Federazione Italiana Lavoratori Chimica Tessile Energia Manifatturiero (CGIL)', 'energia', 'CGIL'),
  ('FLAEI_CISL',   'FLAEI CISL',   'Federazione Lavoratori Aziende Elettriche Italiane (CISL)', 'energia', 'CISL'),
  ('UILTEC_UIL',   'UILTEC UIL',   'Unione Italiana Lavoratori Tessile Energia Chimica (UIL)',  'energia', 'UIL'),
  ('UGL_CHIM_EN',  'UGL Chimici Energia', 'UGL Chimici Energia',                                'energia', 'UGL')
) AS v(code, name, full_name, sector, parent_code)
LEFT JOIN sindacati p ON p.code = v.parent_code
ON CONFLICT (code) DO NOTHING;

-- Federazioni commercio/terziario (sector: commercio)
INSERT INTO sindacati (code, name, full_name, sector, federation_parent_id, is_active)
SELECT v.code, v.name, v.full_name, v.sector, p.id, true
FROM (VALUES
  ('FILCAMS_CGIL', 'FILCAMS CGIL', 'Federazione Italiana Lavoratori Commercio Albergo Mensa Servizi (CGIL)', 'commercio', 'CGIL'),
  ('FISASCAT_CISL','FISASCAT CISL','Federazione Italiana Sindacati Addetti Servizi Commerciali Affini Turismo (CISL)', 'commercio', 'CISL'),
  ('UILTUCS_UIL',  'UILTUCS UIL',  'Unione Italiana Lavoratori Turismo Commercio e Servizi (UIL)',          'commercio', 'UIL'),
  ('UGL_TERZIARIO','UGL Terziario', 'UGL Terziario',                                                       'commercio', 'UGL')
) AS v(code, name, full_name, sector, parent_code)
LEFT JOIN sindacati p ON p.code = v.parent_code
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 7. SEED: tenant_ccnl_links per i 4 tenant canonical
-- ============================================================================

INSERT INTO tenant_ccnl_links (tenant_id, ccnl_code, is_primary, effective_from)
SELECT t.id, v.ccnl_code, true, '2024-04-01'::date
FROM tenants t
JOIN (VALUES
  ('rtl-bank',  'CCNL_CRED_2024'),
  ('smartfood', 'CCNL_ALIM_2024'),
  ('econova',   'CCNL_ENERGIA_2024'),
  ('heuresys',  'CCNL_COMM_2024')
) AS v(tenant_code, ccnl_code) ON v.tenant_code = t.code
ON CONFLICT (tenant_id, ccnl_code, effective_from) DO NOTHING;

-- ============================================================================
-- 8. SEED: sindacato_tenant_links (RSU/RSA per i 4 tenant)
-- ============================================================================

-- RTL Bank → 3 sindacati banking + 1 autonomo FABI
INSERT INTO sindacato_tenant_links (tenant_id, sindacato_id, signed_at, is_active, rsu_count)
SELECT t.id, s.id, '2023-06-01'::date, true, v.rsu_count
FROM tenants t
JOIN (VALUES
  ('rtl-bank', 'FISAC_CGIL', 3),
  ('rtl-bank', 'FIRST_CISL', 3),
  ('rtl-bank', 'UILCA',      2),
  ('rtl-bank', 'FABI',       3)
) AS v(tenant_code, sindacato_code, rsu_count) ON v.tenant_code = t.code
JOIN sindacati s ON s.code = v.sindacato_code
ON CONFLICT (tenant_id, sindacato_id) DO NOTHING;

-- SmartFood → 3 federazioni alimentare
INSERT INTO sindacato_tenant_links (tenant_id, sindacato_id, signed_at, is_active, rsu_count)
SELECT t.id, s.id, '2023-09-15'::date, true, v.rsu_count
FROM tenants t
JOIN (VALUES
  ('smartfood', 'FLAI_CGIL', 2),
  ('smartfood', 'FAI_CISL',  2),
  ('smartfood', 'UILA_UIL',  1)
) AS v(tenant_code, sindacato_code, rsu_count) ON v.tenant_code = t.code
JOIN sindacati s ON s.code = v.sindacato_code
ON CONFLICT (tenant_id, sindacato_id) DO NOTHING;

-- EcoNova → 3 federazioni energia
INSERT INTO sindacato_tenant_links (tenant_id, sindacato_id, signed_at, is_active, rsu_count)
SELECT t.id, s.id, '2024-01-10'::date, true, v.rsu_count
FROM tenants t
JOIN (VALUES
  ('econova', 'FILCTEM_CGIL', 1),
  ('econova', 'FLAEI_CISL',   1),
  ('econova', 'UILTEC_UIL',   1)
) AS v(tenant_code, sindacato_code, rsu_count) ON v.tenant_code = t.code
JOIN sindacati s ON s.code = v.sindacato_code
ON CONFLICT (tenant_id, sindacato_id) DO NOTHING;

-- Heuresys → 2 federazioni commercio (small team, RSU minimo)
INSERT INTO sindacato_tenant_links (tenant_id, sindacato_id, signed_at, is_active, rsu_count)
SELECT t.id, s.id, '2024-05-01'::date, true, v.rsu_count
FROM tenants t
JOIN (VALUES
  ('heuresys', 'FILCAMS_CGIL',  1),
  ('heuresys', 'FISASCAT_CISL', 1)
) AS v(tenant_code, sindacato_code, rsu_count) ON v.tenant_code = t.code
JOIN sindacati s ON s.code = v.sindacato_code
ON CONFLICT (tenant_id, sindacato_id) DO NOTHING;

-- ============================================================================
-- 9. schema_migrations row
-- ============================================================================

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18d_italian_labor_context', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================
-- SELECT count(*) FROM sindacati;                  -- expected: 22 (4 conf + 6 banking + 4 alim + 4 energia + 4 commercio)
-- SELECT count(*) FROM tenant_ccnl_links;          -- expected: 4 (1 per tenant)
-- SELECT count(*) FROM sindacato_tenant_links;     -- expected: 12 (4+3+3+2)
-- SELECT ccnl_code, count(*) FROM ccnl_levels GROUP BY 1 ORDER BY 1;  -- expected: 4 CCNL × 9 levels each
