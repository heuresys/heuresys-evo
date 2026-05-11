-- Phase 18i (S35.4 EcoNova + Heuresys enrichment) — GOKMER + TALPIPE + ESKAP
--
-- Goal: replicare pattern S35.4 SmartFood (phase18h) su EcoNova (D.35 energy, 26 emp)
--       e Heuresys (J.62 SaaS, 4 emp micro-tenant).
--
-- Industry profiles reference:
--   - db/seeds/realistic/_research_cache/econova_industry_profile.json
--   - db/seeds/realistic/_research_cache/heuresys_industry_profile.json
--
-- Blocks per tenant: M9 Gaussian assessments + M11a perf_box update + M11b succession_candidates + M13 KG projection
-- Heuresys M11b SKIP: 0 succession_plans existing — carry-forward S36+.
--
-- Lexicon: GOKMER + TALPIPE + ESKAP
-- Idempotent: NOT EXISTS + ON CONFLICT DO NOTHING
-- Rollback: phase18i_DOWN.sql

BEGIN;

-- ============================================================================
-- TENANT 1: ECONOVA — Block M9 Gaussian skill assessments
-- ============================================================================

SELECT setseed(0.44);

WITH
  en_tenant AS (SELECT id FROM tenants WHERE code='econova'),
  en_emp_occ AS (
    SELECT e.id AS emp_id, e.auth_role, eo.esco_occupation_id
    FROM employees e
    JOIN employee_occupations eo ON eo.employee_id=e.id AND eo.is_current=true
    WHERE e.tenant_id=(SELECT id FROM en_tenant) AND e.employment_status='active'
  ),
  occ_skills_ranked AS (
    SELECT eos.occupation_id, eos.skill_id, es.preferred_label AS skill_name, eos.relation_type,
      ROW_NUMBER() OVER (PARTITION BY eos.occupation_id
        ORDER BY CASE eos.relation_type WHEN 'essential' THEN 1 ELSE 2 END, random()) AS rn
    FROM esco_occupation_skills eos JOIN esco_skills es ON es.id=eos.skill_id
  ),
  pairings AS (
    SELECT e.emp_id, s.skill_name,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 4.5 WHEN 'SUPERUSER' THEN 4.5 WHEN 'TENANT_OWNER' THEN 3.8
        WHEN 'IT_ADMIN' THEN 3.5 WHEN 'HR_DIRECTOR' THEN 3.5
        WHEN 'HR_MANAGER' THEN 3.2 WHEN 'DEPT_HEAD' THEN 3.0
        WHEN 'LINE_MANAGER' THEN 2.8 ELSE 2.5 END AS mu,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 0.4 WHEN 'SUPERUSER' THEN 0.4 WHEN 'TENANT_OWNER' THEN 0.6
        WHEN 'IT_ADMIN' THEN 0.6 WHEN 'HR_DIRECTOR' THEN 0.6
        WHEN 'HR_MANAGER' THEN 0.7 WHEN 'DEPT_HEAD' THEN 0.7
        WHEN 'LINE_MANAGER' THEN 0.6 ELSE 0.7 END AS sigma,
      CASE e.auth_role
        WHEN 'LINE_MANAGER' THEN 4 WHEN 'EMPLOYEE' THEN 4 WHEN 'USER' THEN 4 ELSE 5 END AS cap_max,
      random()::double precision AS u1, random()::double precision AS u2, s.relation_type
    FROM en_emp_occ e
    JOIN occ_skills_ranked s ON s.occupation_id=e.esco_occupation_id AND s.rn <= 10
  ),
  to_insert AS (
    SELECT p.emp_id, p.skill_name,
      GREATEST(LEAST(
        ROUND(p.mu + p.sigma * sqrt(-2.0 * ln(GREATEST(p.u1, 0.0001))) * cos(2.0 * pi() * p.u2))::int,
        p.cap_max), 1) AS assessed_level,
      CASE p.relation_type WHEN 'essential' THEN 3 ELSE 2 END AS required_level
    FROM pairings p
    WHERE NOT EXISTS (SELECT 1 FROM employee_skill_assessments esa
      WHERE esa.employee_id=p.emp_id AND esa.skill_name=p.skill_name)
  )
INSERT INTO employee_skill_assessments (id, employee_id, tenant_id, tenant_job_skill_id, esco_skill_uri,
  skill_name, assessed_level, required_level, assessment_date, assessment_method, created_at, updated_at)
SELECT gen_random_uuid(), ti.emp_id, (SELECT id FROM en_tenant), NULL, NULL,
  ti.skill_name, ti.assessed_level, ti.required_level,
  CURRENT_DATE - (random() * 90)::int,
  CASE WHEN random() < 0.5 THEN 'self' WHEN random() < 0.8 THEN 'manager' ELSE 'peer' END,
  now(), now()
FROM to_insert ti;

-- ============================================================================
-- ECONOVA — Block M11a perf_reviews nine_box
-- ============================================================================

SELECT setseed(0.80);

WITH
  en_tenant AS (SELECT id FROM tenants WHERE code='econova'),
  en_reviews AS (
    SELECT pr.id AS review_id, pr.overall_rating, e.auth_role, random() AS rand_perf, random() AS rand_pot
    FROM performance_reviews pr JOIN employees e ON e.id=pr.employee_id
    WHERE pr.tenant_id=(SELECT id FROM en_tenant) AND pr.performance_box IS NULL
  ),
  scored AS (
    SELECT review_id,
      CASE WHEN overall_rating IS NULL THEN
          CASE WHEN rand_perf < 0.25 THEN 1 WHEN rand_perf < 0.75 THEN 2 ELSE 3 END
        WHEN overall_rating < 2.5 THEN 1 WHEN overall_rating < 4.0 THEN 2 ELSE 3 END AS perf_box,
      LEAST(GREATEST(ROUND(
        CASE auth_role
          WHEN 'SYSADMIN' THEN 2.5 WHEN 'SUPERUSER' THEN 2.5 WHEN 'TENANT_OWNER' THEN 2.5
          WHEN 'HR_DIRECTOR' THEN 2.3 WHEN 'IT_ADMIN' THEN 2.3
          WHEN 'HR_MANAGER' THEN 2.0 WHEN 'DEPT_HEAD' THEN 2.0 WHEN 'LINE_MANAGER' THEN 2.0
          ELSE 1.7 END + 0.6 * sqrt(-2.0 * ln(GREATEST(rand_pot, 0.0001))) * cos(2.0 * pi() * rand_perf))::int, 1), 3) AS pot_box,
      CASE WHEN overall_rating IS NULL THEN
          (CASE WHEN rand_perf < 0.25 THEN 'low' WHEN rand_perf < 0.75 THEN 'medium' ELSE 'high' END)::varchar
        WHEN overall_rating < 2.5 THEN 'low'::varchar
        WHEN overall_rating < 4.0 THEN 'medium'::varchar ELSE 'high'::varchar END AS pot_rating_str
    FROM en_reviews
  )
UPDATE performance_reviews pr
SET performance_box=s.perf_box, potential_box=s.pot_box, potential_rating=s.pot_rating_str, updated_at=now()
FROM scored s WHERE pr.id=s.review_id;

-- ============================================================================
-- ECONOVA — Block M11b succession_candidates expansion (~30 row target)
-- ============================================================================

SELECT setseed(0.81);

WITH
  en_tenant AS (SELECT id FROM tenants WHERE code='econova'),
  en_plans AS (
    SELECT id, incumbent_employee_id FROM succession_plans
    WHERE tenant_id=(SELECT id FROM en_tenant) AND status='active'
  ),
  en_eligible_emp AS (
    SELECT e.id AS emp_id FROM employees e
    WHERE e.tenant_id=(SELECT id FROM en_tenant) AND e.employment_status='active'
      AND e.auth_role IN ('LINE_MANAGER','EMPLOYEE')
  ),
  plan_candidates AS (
    SELECT p.id AS plan_id, e.emp_id,
      row_number() OVER (PARTITION BY p.id ORDER BY random()) AS rank_in_plan
    FROM en_plans p
    CROSS JOIN en_eligible_emp e
    WHERE e.emp_id <> COALESCE(p.incumbent_employee_id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND NOT EXISTS (SELECT 1 FROM succession_candidates sc
        WHERE sc.critical_role_id=p.id AND sc.candidate_employee_id=e.emp_id)
  )
INSERT INTO succession_candidates (id, critical_role_id, candidate_employee_id, tenant_id,
  readiness_level, rank_order, created_at, updated_at)
SELECT gen_random_uuid(), pc.plan_id, pc.emp_id, (SELECT id FROM en_tenant),
  CASE WHEN random() < 0.30 THEN 'ready_now'
    WHEN random() < 0.55 THEN 'ready_1_year'
    WHEN random() < 0.80 THEN 'ready_2_years'
    ELSE 'development_needed' END,
  pc.rank_in_plan, now(), now()
FROM plan_candidates pc WHERE pc.rank_in_plan <= 4;

-- ============================================================================
-- ECONOVA — Block M13 KG projection
-- ============================================================================

-- 4.1 EN employees → kg_nodes EMPLOYEE
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT e.tenant_id, 'EMPLOYEE', e.id::text,
  coalesce(e.first_name,'')||' '||coalesce(e.last_name,''),
  'employees', e.id,
  jsonb_build_object('job_title', e.job_title, 'auth_role', e.auth_role, 'hire_date', e.hire_date)
FROM employees e
WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND e.employment_status='active'
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn WHERE kn.tenant_id=e.tenant_id AND kn.node_type='EMPLOYEE' AND kn.source_id=e.id);

-- 4.2 EN job_templates → kg_nodes JOB_TEMPLATE (DISTINCT ON job_code per dedupe — EN has 454 templates with duplicates)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT DISTINCT ON (jt.tenant_id, jt.job_code)
  jt.tenant_id, 'JOB_TEMPLATE', jt.job_code, jt.title_it, jt.title_en,
  'job_templates', jt.id, jsonb_build_object('esco_occupation_code', jt.esco_occupation_code)
FROM job_templates jt
WHERE jt.tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn WHERE kn.tenant_id=jt.tenant_id AND kn.node_type='JOB_TEMPLATE' AND kn.node_code=jt.job_code)
ON CONFLICT (tenant_id, node_type, node_code) DO NOTHING;

-- 4.3 ENERGY-S business_processes → kg_nodes PROCESS (tenant-scoped projection)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT (SELECT id FROM tenants WHERE code='econova'),
  'PROCESS', bp.process_code, bp.process_name,
  'business_processes', bp.id,
  jsonb_build_object('category', bp.process_category, 'value_chain_position', bp.value_chain_position)
FROM business_processes bp
WHERE bp.profile_id=(SELECT id FROM industry_profiles WHERE code='ENERGY-S')
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='econova')
      AND kn.node_type='PROCESS' AND kn.source_id=bp.id);

-- 4.4 rbp_roles → kg_nodes ROLE
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, metadata)
SELECT (SELECT id FROM tenants WHERE code='econova'),
  'ROLE', r.code, r.name, 'rbp_roles',
  jsonb_build_object('rbp_role_id', r.id, 'hierarchy_level', r.hierarchy_level, 'is_system_role', r.is_system_role)
FROM rbp_roles r
WHERE NOT EXISTS (SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='econova')
    AND kn.node_type='ROLE' AND kn.node_code=r.code);

-- 4.5 EN has_occupation edges
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT (SELECT id FROM tenants WHERE code='econova'),
  emp_node.id, occ_node.id, 'HAS_OCCUPATION', 1.0,
  jsonb_build_object('is_current', eo.is_current)
FROM employee_occupations eo
JOIN employees e ON e.id=eo.employee_id AND e.tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes occ_node ON occ_node.tenant_id IS NULL AND occ_node.node_type='OCCUPATION' AND occ_node.source_id=eo.esco_occupation_id
WHERE eo.is_current=true
  AND NOT EXISTS (SELECT 1 FROM kg_edges ke
    WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='econova')
      AND ke.source_node_id=emp_node.id AND ke.target_node_id=occ_node.id AND ke.edge_type='HAS_OCCUPATION');

-- 4.6 EN owns_skill edges
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT (SELECT id FROM tenants WHERE code='econova'),
  emp_node.id, skill_node.id, 'OWNS_SKILL',
  esa.assessed_level::double precision / 5.0,
  jsonb_build_object('assessed_level', esa.assessed_level, 'required_level', esa.required_level, 'assessment_date', esa.assessment_date)
FROM employee_skill_assessments esa
JOIN employees e ON e.id=esa.employee_id AND e.tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes skill_node ON skill_node.tenant_id IS NULL AND skill_node.node_type='SKILL' AND skill_node.label=esa.skill_name
WHERE NOT EXISTS (SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='econova')
    AND ke.source_node_id=emp_node.id AND ke.target_node_id=skill_node.id AND ke.edge_type='OWNS_SKILL');

-- ============================================================================
-- TENANT 2: HEURESYS — Block M9 Gaussian skill assessments (micro 4 emp)
-- ============================================================================

SELECT setseed(0.45);

WITH
  hs_tenant AS (SELECT id FROM tenants WHERE code='heuresys'),
  hs_emp_occ AS (
    SELECT e.id AS emp_id, e.auth_role, eo.esco_occupation_id
    FROM employees e
    JOIN employee_occupations eo ON eo.employee_id=e.id AND eo.is_current=true
    WHERE e.tenant_id=(SELECT id FROM hs_tenant) AND e.employment_status='active'
  ),
  occ_skills_ranked AS (
    SELECT eos.occupation_id, eos.skill_id, es.preferred_label AS skill_name, eos.relation_type,
      ROW_NUMBER() OVER (PARTITION BY eos.occupation_id
        ORDER BY CASE eos.relation_type WHEN 'essential' THEN 1 ELSE 2 END, random()) AS rn
    FROM esco_occupation_skills eos JOIN esco_skills es ON es.id=eos.skill_id
  ),
  pairings AS (
    SELECT e.emp_id, s.skill_name,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 4.5 WHEN 'SUPERUSER' THEN 4.5 WHEN 'TENANT_OWNER' THEN 3.8
        WHEN 'IT_ADMIN' THEN 3.5 WHEN 'HR_DIRECTOR' THEN 3.5
        WHEN 'HR_MANAGER' THEN 3.2 WHEN 'DEPT_HEAD' THEN 3.0
        WHEN 'LINE_MANAGER' THEN 2.8 ELSE 2.5 END AS mu,
      CASE e.auth_role
        WHEN 'SYSADMIN' THEN 0.4 WHEN 'SUPERUSER' THEN 0.4 WHEN 'TENANT_OWNER' THEN 0.6
        WHEN 'IT_ADMIN' THEN 0.6 WHEN 'HR_DIRECTOR' THEN 0.6
        WHEN 'HR_MANAGER' THEN 0.7 WHEN 'DEPT_HEAD' THEN 0.7
        WHEN 'LINE_MANAGER' THEN 0.6 ELSE 0.7 END AS sigma,
      CASE e.auth_role
        WHEN 'LINE_MANAGER' THEN 4 WHEN 'EMPLOYEE' THEN 4 WHEN 'USER' THEN 4 ELSE 5 END AS cap_max,
      random()::double precision AS u1, random()::double precision AS u2, s.relation_type
    FROM hs_emp_occ e
    JOIN occ_skills_ranked s ON s.occupation_id=e.esco_occupation_id AND s.rn <= 10
  ),
  to_insert AS (
    SELECT p.emp_id, p.skill_name,
      GREATEST(LEAST(
        ROUND(p.mu + p.sigma * sqrt(-2.0 * ln(GREATEST(p.u1, 0.0001))) * cos(2.0 * pi() * p.u2))::int,
        p.cap_max), 1) AS assessed_level,
      CASE p.relation_type WHEN 'essential' THEN 3 ELSE 2 END AS required_level
    FROM pairings p
    WHERE NOT EXISTS (SELECT 1 FROM employee_skill_assessments esa
      WHERE esa.employee_id=p.emp_id AND esa.skill_name=p.skill_name)
  )
INSERT INTO employee_skill_assessments (id, employee_id, tenant_id, tenant_job_skill_id, esco_skill_uri,
  skill_name, assessed_level, required_level, assessment_date, assessment_method, created_at, updated_at)
SELECT gen_random_uuid(), ti.emp_id, (SELECT id FROM hs_tenant), NULL, NULL,
  ti.skill_name, ti.assessed_level, ti.required_level,
  CURRENT_DATE - (random() * 90)::int,
  CASE WHEN random() < 0.5 THEN 'self' WHEN random() < 0.8 THEN 'manager' ELSE 'peer' END,
  now(), now()
FROM to_insert ti;

-- ============================================================================
-- HEURESYS — Block M11a perf_reviews nine_box (4 reviews)
-- ============================================================================

SELECT setseed(0.82);

WITH
  hs_tenant AS (SELECT id FROM tenants WHERE code='heuresys'),
  hs_reviews AS (
    SELECT pr.id AS review_id, pr.overall_rating, e.auth_role, random() AS rand_perf, random() AS rand_pot
    FROM performance_reviews pr JOIN employees e ON e.id=pr.employee_id
    WHERE pr.tenant_id=(SELECT id FROM hs_tenant) AND pr.performance_box IS NULL
  ),
  scored AS (
    SELECT review_id,
      CASE WHEN overall_rating IS NULL THEN
          CASE WHEN rand_perf < 0.25 THEN 1 WHEN rand_perf < 0.75 THEN 2 ELSE 3 END
        WHEN overall_rating < 2.5 THEN 1 WHEN overall_rating < 4.0 THEN 2 ELSE 3 END AS perf_box,
      LEAST(GREATEST(ROUND(
        CASE auth_role
          WHEN 'SYSADMIN' THEN 2.5 WHEN 'SUPERUSER' THEN 2.5 WHEN 'TENANT_OWNER' THEN 2.5
          WHEN 'HR_DIRECTOR' THEN 2.3 WHEN 'IT_ADMIN' THEN 2.3
          WHEN 'HR_MANAGER' THEN 2.0 WHEN 'DEPT_HEAD' THEN 2.0 WHEN 'LINE_MANAGER' THEN 2.0
          ELSE 1.7 END + 0.6 * sqrt(-2.0 * ln(GREATEST(rand_pot, 0.0001))) * cos(2.0 * pi() * rand_perf))::int, 1), 3) AS pot_box,
      CASE WHEN overall_rating IS NULL THEN
          (CASE WHEN rand_perf < 0.25 THEN 'low' WHEN rand_perf < 0.75 THEN 'medium' ELSE 'high' END)::varchar
        WHEN overall_rating < 2.5 THEN 'low'::varchar
        WHEN overall_rating < 4.0 THEN 'medium'::varchar ELSE 'high'::varchar END AS pot_rating_str
    FROM hs_reviews
  )
UPDATE performance_reviews pr
SET performance_box=s.perf_box, potential_box=s.pot_box, potential_rating=s.pot_rating_str, updated_at=now()
FROM scored s WHERE pr.id=s.review_id;

-- NOTE: Heuresys M11b SKIP (0 succession_plans). Carry-forward S36+.

-- ============================================================================
-- HEURESYS — Block M13 KG projection (micro)
-- ============================================================================

INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT e.tenant_id, 'EMPLOYEE', e.id::text,
  coalesce(e.first_name,'')||' '||coalesce(e.last_name,''),
  'employees', e.id,
  jsonb_build_object('job_title', e.job_title, 'auth_role', e.auth_role, 'hire_date', e.hire_date)
FROM employees e
WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='heuresys') AND e.employment_status='active'
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn WHERE kn.tenant_id=e.tenant_id AND kn.node_type='EMPLOYEE' AND kn.source_id=e.id);

INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT DISTINCT ON (jt.tenant_id, jt.job_code)
  jt.tenant_id, 'JOB_TEMPLATE', jt.job_code, jt.title_it, jt.title_en,
  'job_templates', jt.id, jsonb_build_object('esco_occupation_code', jt.esco_occupation_code)
FROM job_templates jt
WHERE jt.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn WHERE kn.tenant_id=jt.tenant_id AND kn.node_type='JOB_TEMPLATE' AND kn.node_code=jt.job_code)
ON CONFLICT (tenant_id, node_type, node_code) DO NOTHING;

INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT (SELECT id FROM tenants WHERE code='heuresys'),
  'PROCESS', bp.process_code, bp.process_name,
  'business_processes', bp.id,
  jsonb_build_object('category', bp.process_category, 'value_chain_position', bp.value_chain_position)
FROM business_processes bp
WHERE bp.profile_id=(SELECT id FROM industry_profiles WHERE code='SOFTWARE-MICRO')
  AND NOT EXISTS (SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
      AND kn.node_type='PROCESS' AND kn.source_id=bp.id);

INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, metadata)
SELECT (SELECT id FROM tenants WHERE code='heuresys'),
  'ROLE', r.code, r.name, 'rbp_roles',
  jsonb_build_object('rbp_role_id', r.id, 'hierarchy_level', r.hierarchy_level, 'is_system_role', r.is_system_role)
FROM rbp_roles r
WHERE NOT EXISTS (SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
    AND kn.node_type='ROLE' AND kn.node_code=r.code);

INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT (SELECT id FROM tenants WHERE code='heuresys'),
  emp_node.id, occ_node.id, 'HAS_OCCUPATION', 1.0,
  jsonb_build_object('is_current', eo.is_current)
FROM employee_occupations eo
JOIN employees e ON e.id=eo.employee_id AND e.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes occ_node ON occ_node.tenant_id IS NULL AND occ_node.node_type='OCCUPATION' AND occ_node.source_id=eo.esco_occupation_id
WHERE eo.is_current=true
  AND NOT EXISTS (SELECT 1 FROM kg_edges ke
    WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
      AND ke.source_node_id=emp_node.id AND ke.target_node_id=occ_node.id AND ke.edge_type='HAS_OCCUPATION');

INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT (SELECT id FROM tenants WHERE code='heuresys'),
  emp_node.id, skill_node.id, 'OWNS_SKILL',
  esa.assessed_level::double precision / 5.0,
  jsonb_build_object('assessed_level', esa.assessed_level, 'required_level', esa.required_level, 'assessment_date', esa.assessment_date)
FROM employee_skill_assessments esa
JOIN employees e ON e.id=esa.employee_id AND e.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes skill_node ON skill_node.tenant_id IS NULL AND skill_node.node_type='SKILL' AND skill_node.label=esa.skill_name
WHERE NOT EXISTS (SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
    AND ke.source_node_id=emp_node.id AND ke.target_node_id=skill_node.id AND ke.edge_type='OWNS_SKILL');

-- ============================================================================
-- TRACK + VERIFY
-- ============================================================================

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18i_econova_heuresys_enrichment', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE
  v_en_assess INT; v_en_succ_cand INT; v_en_kg_nodes INT; v_en_kg_edges INT;
  v_hs_assess INT; v_hs_kg_nodes INT; v_hs_kg_edges INT;
BEGIN
  SELECT COUNT(*) INTO v_en_assess FROM employee_skill_assessments esa
    JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='econova');
  SELECT COUNT(*) INTO v_en_succ_cand FROM succession_candidates
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  SELECT COUNT(*) INTO v_en_kg_nodes FROM kg_nodes WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  SELECT COUNT(*) INTO v_en_kg_edges FROM kg_edges WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  SELECT COUNT(*) INTO v_hs_assess FROM employee_skill_assessments esa
    JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='heuresys');
  SELECT COUNT(*) INTO v_hs_kg_nodes FROM kg_nodes WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys');
  SELECT COUNT(*) INTO v_hs_kg_edges FROM kg_edges WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys');

  RAISE NOTICE '== phase18i EcoNova+Heuresys enrichment verification ==';
  RAISE NOTICE 'EN assessments: % (target ≥250) · succ_candidates: % (target ≥20) · kg_nodes: % · kg_edges: %',
    v_en_assess, v_en_succ_cand, v_en_kg_nodes, v_en_kg_edges;
  RAISE NOTICE 'HS assessments: % · kg_nodes: % · kg_edges: %', v_hs_assess, v_hs_kg_nodes, v_hs_kg_edges;
END$$;

COMMIT;
