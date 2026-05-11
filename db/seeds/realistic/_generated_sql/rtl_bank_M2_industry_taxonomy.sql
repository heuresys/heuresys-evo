-- S35.3 M2 (INDOOR taxonomy seed) — RTL Bank
-- Enrich industry_profiles BANKING-M con dati dal rtl_bank_industry_profile.json
-- (industry_classifications 64.19 + occupation_industry_classifications 4565 + tenant link già presenti pre-S35.3)
--
-- Idempotent: UPDATE conditional (WHERE column IS NULL OR DISTINCT)
-- Rollback: tools/rollback_rtl_bank_M2.sql

BEGIN;

-- Enrichment BANKING-M: aggiungi typical_hierarchy + arricchisci roles + departments + ESCO codes
-- ⚠️ BANKING-M è profilo catalog condiviso. Se altro tenant banking lo userà, eredita questi valori.
-- Per profile RTL-specifico distinct, creare profile separato (es. RTL-BANK-RETAIL).

UPDATE industry_profiles
SET
  typical_hierarchy = jsonb_build_object(
    'depth', 4,
    'span_of_control_max', 8,
    'span_of_control_typical', 5,
    'root', jsonb_build_object(
      'role_code', 'CEO',
      'title', 'Amministratore Delegato'
    ),
    'depth_1', jsonb_build_array(
      jsonb_build_object('code', 'RETAIL', 'name', 'Direzione Retail Banking', 'fte_share', 0.40),
      jsonb_build_object('code', 'CORPORATE', 'name', 'Direzione Corporate Banking', 'fte_share', 0.20),
      jsonb_build_object('code', 'TREASURY', 'name', 'Direzione Treasury & Investment', 'fte_share', 0.08),
      jsonb_build_object('code', 'RISK_COMPL', 'name', 'Direzione Risk & Compliance', 'fte_share', 0.12),
      jsonb_build_object('code', 'OPS', 'name', 'Direzione Operations & Back-Office', 'fte_share', 0.10),
      jsonb_build_object('code', 'IT', 'name', 'Direzione IT & Security', 'fte_share', 0.06),
      jsonb_build_object('code', 'STAFF', 'name', 'Direzioni Staff (HR+Finance+Legal)', 'fte_share', 0.04)
    ),
    'depth_2_sample_units', jsonb_build_array(
      'Filiale Milano Centro', 'Filiale Milano Nord', 'Filiale Roma EUR',
      'Filiale Bologna', 'Filiale Torino', 'Direct Banking Online Channel',
      'Contact Center Multilingua'
    )
  ),
  typical_roles = ARRAY[
    'Direttore Generale (CEO)',
    'Direttore Divisione',
    'Responsabile Filiale (Branch Manager)',
    'Responsabile Crediti',
    'Chief Risk Officer',
    'Compliance Officer',
    'AML Specialist',
    'Credit Analyst',
    'Loan Officer (Consulente Crediti)',
    'Cassiere/Operatore di Sportello',
    'Corporate Relationship Manager',
    'Wealth Advisor / Private Banker',
    'Treasury Specialist',
    'FX Trader',
    'Operations Specialist (Back-Office)',
    'IT Application Developer',
    'Cybersecurity Analyst',
    'Customer Care Specialist (Contact Center)',
    'Marketing Specialist',
    'HR Business Partner',
    'Financial Reporting Analyst',
    'Internal Auditor'
  ]::text[],
  typical_departments = ARRAY[
    'Retail Banking',
    'Corporate Banking',
    'Treasury & Investment',
    'Risk & Compliance',
    'Operations & Back-Office',
    'IT & Security',
    'HR / Finance / Legal',
    'Branch Network',
    'Wealth Management',
    'AML / Compliance Unit',
    'Internal Audit'
  ]::text[],
  esco_occupation_codes = ARRAY[
    '1112',   -- Senior officials (CEO)
    '1346',   -- Financial and insurance services branch managers
    '2411',   -- Accountants and auditors
    '2412',   -- Financial and investment advisers
    '2422',   -- Policy administration professionals (Compliance/AML)
    '2423',   -- Personnel and careers professionals (HR)
    '2431',   -- Advertising and marketing professionals
    '2512',   -- Software developers
    '2529',   -- ICT security/database/network professionals (Cybersecurity)
    '3311',   -- Securities and finance dealers and brokers (FX)
    '3411',   -- Legal, social, religious associate professionals (Relationship)
    '4211',   -- Bank tellers and related clerks
    '4222',   -- Contact centre information clerks
    '4312'    -- Statistical, finance and insurance clerks (Back-Office)
  ]::text[],
  updated_at = now()
WHERE code = 'BANKING-M'
  AND (
    typical_hierarchy IS NULL
    OR esco_occupation_codes IS NULL
    OR array_length(typical_roles, 1) < 20
    OR array_length(typical_departments, 1) < 10
  );

-- Update tenants.industry_type for RTL Bank (cosmetic, drift fix)
UPDATE tenants
SET industry_type = 'Commercial Banking (Retail + Corporate + Treasury)'
WHERE code = 'rtl-bank'
  AND industry_type IS DISTINCT FROM 'Commercial Banking (Retail + Corporate + Treasury)';

-- schema_migrations
INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M2_indoor_rtl_bank_taxonomy', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification queries:
-- SELECT code, array_length(typical_roles,1) as roles, array_length(typical_departments,1) as depts,
--        array_length(esco_occupation_codes,1) as esco, typical_hierarchy IS NOT NULL as has_hier
-- FROM industry_profiles WHERE code='BANKING-M';
-- Expected: roles ≥22, depts ≥11, esco ≥14, has_hier=true
