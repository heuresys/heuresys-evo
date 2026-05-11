-- S35.3 M4 (OPOURSKA Layer 4 — Job/Position) RTL Bank — patch minimo
-- Fix 2 employees orfani (active senza position_id): HR Manager + Line Manager - Operations
-- Aggiunta 2 job_templates basici per coprire i ruoli.
--
-- CARRY-FORWARD: estensione completa a 32 ruoli canonical del profile JSON
-- (CEO, Director, AML Specialist, Cybersec Analyst, ecc.) → M4b sessione successiva.

BEGIN;

-- Aggiungi job_templates per HR Manager + Operations Manager
-- ck_job_has_parent CHECK: serve profile_id (BANKING-M) o org_unit_template_id
INSERT INTO job_templates (id, tenant_id, profile_id, job_code, title_it, title_en, employment_type, esco_occupation_code, is_active, created_at, updated_at)
SELECT gen_random_uuid(), t.id, ip.id, v.job_code, v.title_it, v.title_en, 'full_time', v.esco, true, now(), now()
FROM tenants t
CROSS JOIN industry_profiles ip
JOIN (VALUES
  ('RTL-HR-MGR', 'responsabile risorse umane', 'Human Resources Manager', '1212'),
  ('RTL-OPS-MGR', 'responsabile operations bancarie', 'Operations Manager (Banking)', '1219')
) AS v(job_code, title_it, title_en, esco) ON true
WHERE t.code = 'rtl-bank'
  AND ip.code = 'BANKING-M'
  AND NOT EXISTS (
    SELECT 1 FROM job_templates jt
    WHERE jt.tenant_id = t.id AND jt.job_code = v.job_code
  );

-- Link 2 orfani ai nuovi job_templates
UPDATE employees e
SET position_id = (
  SELECT jt.id FROM job_templates jt
  WHERE jt.tenant_id = e.tenant_id AND jt.job_code = 'RTL-HR-MGR'
  LIMIT 1
),
updated_at = now()
WHERE e.id = 'c550cecf-0a3d-4b06-9578-39594c3a7229'
  AND e.position_id IS NULL;

UPDATE employees e
SET position_id = (
  SELECT jt.id FROM job_templates jt
  WHERE jt.tenant_id = e.tenant_id AND jt.job_code = 'RTL-OPS-MGR'
  LIMIT 1
),
updated_at = now()
WHERE e.id = 'bff71948-22ba-4c44-a9ac-b340c5afa423'
  AND e.position_id IS NULL;

-- Schema migrations
INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M4_opourska_rtl_bank_position_fix', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT COUNT(*) FILTER (WHERE position_id IS NULL) AS orphans FROM employees
-- WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank') AND employment_status='active';
-- Expected: 0
