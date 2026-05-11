-- S35.3 M9 (GOKMER Layer 5 — Skill assessments Gaussian) RTL Bank
--
-- Strategia REVISED v2:
-- - employees.position_id era mixed text/UUID (architettura ibrida), no clean FK
-- - Pivot a `employee_occupations` (156 RTL emp linkati via esco_occupation_id, clean FK)
-- - Per ogni emp: top 10 ESCO skills via esco_occupation_skills → esco_skills.preferred_label
-- - Gaussian assessed_level via Box-Muller PG-native per auth_role
-- - Target: 156 emp × 10 skills = ~1560 new assessments (gap pre-M9: 1200 verso 1500 target)
--
-- Distribuzione:
--   SYSADMIN/SUPERUSER μ=4.5 σ=0.4 cap 1-5
--   TENANT_OWNER       μ=3.8 σ=0.6 cap 1-5
--   IT_ADMIN           μ=3.5 σ=0.6 cap 1-5
--   HR_DIRECTOR        μ=3.5 σ=0.6 cap 1-5
--   HR_MANAGER         μ=3.2 σ=0.7 cap 1-5
--   DEPT_HEAD          μ=3.0 σ=0.7 cap 1-5
--   LINE_MANAGER       μ=2.8 σ=0.6 cap 1-4
--   EMPLOYEE / USER    μ=2.5 σ=0.7 cap 1-4

BEGIN;

SELECT setseed(0.42);

WITH
  rtl_tenant AS (
    SELECT id FROM tenants WHERE code = 'rtl-bank'
  ),
  rtl_emp_occ AS (
    SELECT
      e.id AS emp_id,
      e.auth_role,
      eo.esco_occupation_id
    FROM employees e
    JOIN employee_occupations eo ON eo.employee_id = e.id AND eo.is_current = true
    WHERE e.tenant_id = (SELECT id FROM rtl_tenant)
      AND e.employment_status = 'active'
  ),
  -- Top 10 skills per ESCO occupation (essential first, then optional)
  occ_skills_ranked AS (
    SELECT
      eos.occupation_id,
      eos.skill_id,
      es.preferred_label AS skill_name,
      eos.relation_type,
      ROW_NUMBER() OVER (
        PARTITION BY eos.occupation_id
        ORDER BY
          CASE eos.relation_type WHEN 'essential' THEN 1 ELSE 2 END,
          random()
      ) AS rn
    FROM esco_occupation_skills eos
    JOIN esco_skills es ON es.id = eos.skill_id
  ),
  -- Cross-join: each emp × top 10 skills of their occupation
  pairings AS (
    SELECT
      e.emp_id,
      e.auth_role,
      s.skill_name,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 4.5 WHEN 'SUPERUSER' THEN 4.5
        WHEN 'TENANT_OWNER' THEN 3.8
        WHEN 'IT_ADMIN' THEN 3.5 WHEN 'HR_DIRECTOR' THEN 3.5
        WHEN 'HR_MANAGER' THEN 3.2 WHEN 'DEPT_HEAD' THEN 3.0
        WHEN 'LINE_MANAGER' THEN 2.8
        ELSE 2.5
      END AS mu,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 0.4 WHEN 'SUPERUSER' THEN 0.4
        WHEN 'TENANT_OWNER' THEN 0.6
        WHEN 'IT_ADMIN' THEN 0.6 WHEN 'HR_DIRECTOR' THEN 0.6
        WHEN 'HR_MANAGER' THEN 0.7 WHEN 'DEPT_HEAD' THEN 0.7
        WHEN 'LINE_MANAGER' THEN 0.6
        ELSE 0.7
      END AS sigma,
      CASE e.auth_role
        WHEN 'LINE_MANAGER' THEN 4
        WHEN 'EMPLOYEE' THEN 4 WHEN 'USER' THEN 4
        ELSE 5
      END AS cap_max,
      random()::double precision AS u1,
      random()::double precision AS u2,
      s.relation_type
    FROM rtl_emp_occ e
    JOIN occ_skills_ranked s
      ON s.occupation_id = e.esco_occupation_id
     AND s.rn <= 10
  ),
  to_insert AS (
    SELECT
      p.emp_id,
      p.skill_name,
      GREATEST(
        LEAST(
          ROUND(p.mu + p.sigma * sqrt(-2.0 * ln(GREATEST(p.u1, 0.0001))) * cos(2.0 * pi() * p.u2))::int,
          p.cap_max
        ),
        1
      ) AS assessed_level,
      CASE p.relation_type WHEN 'essential' THEN 3 ELSE 2 END AS required_level
    FROM pairings p
    WHERE NOT EXISTS (
      SELECT 1 FROM employee_skill_assessments esa
      WHERE esa.employee_id = p.emp_id AND esa.skill_name = p.skill_name
    )
  )
INSERT INTO employee_skill_assessments (
  id, employee_id, tenant_id, tenant_job_skill_id,
  esco_skill_uri, skill_name,
  assessed_level, required_level,
  assessment_date, assessment_method,
  created_at, updated_at
)
SELECT
  gen_random_uuid(),
  ti.emp_id,
  (SELECT id FROM rtl_tenant),
  NULL,
  NULL,
  ti.skill_name,
  ti.assessed_level,
  ti.required_level,
  CURRENT_DATE - (random() * 90)::int,
  CASE
    WHEN random() < 0.5 THEN 'self'
    WHEN random() < 0.8 THEN 'manager'
    ELSE 'peer'
  END,
  now(),
  now()
FROM to_insert ti;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M9_gokmer_rtl_bank_gaussian_assessments', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT count(*), round(avg(assessed_level)::numeric, 2), round(stddev(assessed_level)::numeric, 2)
-- FROM employee_skill_assessments esa
-- JOIN employees e ON e.id=esa.employee_id
-- WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank');
-- Expected: count >=1500, avg ~2.7-2.9, stddev 0.65-0.85 (Bell distribution).
