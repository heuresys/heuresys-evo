-- Phase 18k (S36 Heuresys micro-tenant succession) — TALPIPE scaffolding
--
-- Goal: scaffold 3 succession_plans + ~6 succession_candidates per Heuresys micro-tenant (4 emp).
-- Pattern minimal: completa la cascade TALPIPE anche per il self-tenant Heuresys.
--
-- Plans:
--   1. FOUNDER_CEO (critical, incumbent=Spen Zosky) → candidates: Chiara, Andrea
--   2. CTO (high, incumbent=Chiara) → candidates: Andrea, Platform Admin
--   3. COO (medium, incumbent=Andrea) → candidates: Chiara, Platform Admin
--
-- Lexicon: TALPIPE
-- Idempotent: ON CONFLICT DO NOTHING tramite NOT EXISTS WHERE
-- Rollback: phase18k_DOWN.sql

BEGIN;

WITH
  hs AS (SELECT id FROM tenants WHERE code='heuresys'),
  emp_lookup AS (
    SELECT id, first_name||' '||last_name AS full_name
    FROM employees
    WHERE tenant_id=(SELECT id FROM hs) AND employment_status='active'
  )
INSERT INTO succession_plans (
  id, tenant_id, position_name, incumbent_employee_id, criticality_level, risk_level, notes, target_date, status, created_at, updated_at
)
SELECT * FROM (VALUES
  (gen_random_uuid(),
    (SELECT id FROM hs),
    'CEO & Founder',
    (SELECT id FROM emp_lookup WHERE full_name='Spen Zosky'),
    'critical'::varchar, 'medium'::varchar,
    'Founder succession — critical for company continuity. Develop next-generation leader from internal pool.',
    (CURRENT_DATE + INTERVAL '3 years')::date, 'active'::varchar, now(), now()),
  (gen_random_uuid(),
    (SELECT id FROM hs),
    'CTO / Head of Product',
    (SELECT id FROM emp_lookup WHERE full_name='Chiara Spenuso'),
    'high'::varchar, 'low'::varchar,
    'Technology + product leadership succession plan.',
    (CURRENT_DATE + INTERVAL '2 years')::date, 'active'::varchar, now(), now()),
  (gen_random_uuid(),
    (SELECT id FROM hs),
    'COO',
    (SELECT id FROM emp_lookup WHERE full_name='Andrea Spenuso'),
    'medium'::varchar, 'low'::varchar,
    'Operations leadership succession.',
    (CURRENT_DATE + INTERVAL '2 years')::date, 'active'::varchar, now(), now())
) v(id, tenant_id, position_name, incumbent_employee_id, criticality_level, risk_level, notes, target_date, status, created_at, updated_at)
WHERE NOT EXISTS (
  SELECT 1 FROM succession_plans sp
  WHERE sp.tenant_id=v.tenant_id AND sp.position_name=v.position_name
);

-- Now populate candidates for each newly-created plan
WITH
  hs AS (SELECT id FROM tenants WHERE code='heuresys'),
  emp_lookup AS (
    SELECT id, first_name||' '||last_name AS full_name
    FROM employees WHERE tenant_id=(SELECT id FROM hs) AND employment_status='active'
  ),
  plans AS (
    SELECT id, position_name, incumbent_employee_id
    FROM succession_plans WHERE tenant_id=(SELECT id FROM hs)
  ),
  candidate_map AS (
    SELECT * FROM (VALUES
      ('CEO & Founder', 'Chiara Spenuso', 'ready_2_years', 1),
      ('CEO & Founder', 'Andrea Spenuso', 'ready_2_years', 2),
      ('CTO / Head of Product', 'Andrea Spenuso', 'development_needed', 1),
      ('CTO / Head of Product', 'Platform Admin', 'development_needed', 2),
      ('COO', 'Chiara Spenuso', 'ready_1_year', 1),
      ('COO', 'Platform Admin', 'development_needed', 2)
    ) AS x(pos_name, cand_name, readiness, rank_o)
  )
INSERT INTO succession_candidates (
  id, critical_role_id, candidate_employee_id, tenant_id, readiness_level, rank_order, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  p.id, e.id, (SELECT id FROM hs),
  cm.readiness, cm.rank_o, now(), now()
FROM candidate_map cm
JOIN plans p ON p.position_name=cm.pos_name
JOIN emp_lookup e ON e.full_name=cm.cand_name
WHERE NOT EXISTS (
  SELECT 1 FROM succession_candidates sc
  WHERE sc.critical_role_id=p.id AND sc.candidate_employee_id=e.id
);

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18k_heuresys_succession_scaffold', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_plans INT; v_cands INT;
BEGIN
  SELECT COUNT(*) INTO v_plans FROM succession_plans WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys');
  SELECT COUNT(*) INTO v_cands FROM succession_candidates WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys');
  RAISE NOTICE 'phase18k HS succession: plans=% (target 3) · candidates=% (target 6)', v_plans, v_cands;
END$$;

COMMIT;
