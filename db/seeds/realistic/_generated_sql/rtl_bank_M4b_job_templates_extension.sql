-- S35.3 M4b — Extensione job_templates RTL Bank a 32 ruoli canonical
-- 19 esistenti + 13 nuovi = 32. Coverage 32 ruoli del profile JSON.
-- ck_job_has_parent CHECK: profile_id = BANKING-M

BEGIN;

INSERT INTO job_templates (id, tenant_id, profile_id, job_code, title_it, title_en, employment_type, esco_occupation_code, is_active, is_management, created_at, updated_at)
SELECT gen_random_uuid(), t.id, ip.id, v.job_code, v.title_it, v.title_en, 'full_time', v.esco, true, v.is_mgmt, now(), now()
FROM tenants t
CROSS JOIN industry_profiles ip
JOIN (VALUES
  ('RTL-CEO',     'amministratore delegato',                'Chief Executive Officer',         '1112', true),
  ('RTL-CRO',     'chief risk officer',                     'Chief Risk Officer',              '2412', true),
  ('RTL-COMPL',   'compliance officer',                     'Compliance Officer',              '2422', true),
  ('RTL-AML',     'specialista antiriciclaggio',            'AML Specialist',                  '2422', false),
  ('RTL-IT-DEV',  'sviluppatore applicazioni IT',           'IT Application Developer',        '2512', false),
  ('RTL-CYBER',   'analista cybersecurity',                 'Cybersecurity Analyst',           '2529', false),
  ('RTL-CC',      'addetto customer care contact center',   'Customer Care Specialist',        '4222', false),
  ('RTL-MKT',     'specialista marketing bancario',         'Banking Marketing Specialist',    '2431', false),
  ('RTL-HRBP',    'business partner risorse umane',         'HR Business Partner',             '2423', false),
  ('RTL-FIN-RPT', 'analista financial reporting',           'Financial Reporting Analyst',     '2411', false),
  ('RTL-AUDIT',   'internal auditor',                       'Internal Auditor',                '2411', false),
  ('RTL-FX',      'trader FX e mercati monetari',           'FX Trader',                       '3311', false),
  ('RTL-BO-OPS',  'operatore back-office bancario',         'Back-Office Operations Specialist','4312', false)
) AS v(job_code, title_it, title_en, esco, is_mgmt) ON true
WHERE t.code = 'rtl-bank'
  AND ip.code = 'BANKING-M'
  AND NOT EXISTS (
    SELECT 1 FROM job_templates jt
    WHERE jt.tenant_id = t.id AND jt.job_code = v.job_code
  );

INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M4b_opourska_rtl_bank_jobs_extension', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT count(*) FROM job_templates WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank');
-- Expected: 32 (19 pre-M4 + 2 M4 + 13 M4b)
