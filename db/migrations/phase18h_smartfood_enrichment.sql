-- Phase 18h (S35.4 SmartFood enrichment) — GOKMER assessments + TALPIPE nine_box + ESKAP projection
--
-- Goal: replicare pattern S35.3 pilot RTL Bank su SmartFood (NACE C.10 food mfg, 82 emp).
-- Industry profile reference: db/seeds/realistic/_research_cache/smartfood_industry_profile.json
--
-- Blocks:
--   1. M9 — Gaussian skill assessments per 82 SmartFood emp × top 10 ESCO skills/occupation
--   2. M11a — UPDATE performance_reviews SF set performance_box + potential_box (nine_box derivation)
--   3. M11b — Espansione succession_candidates SF (~50 row) per 10 succession_plans esistenti
--   4. M13 — KG projection SmartFood: emp + job_templates + processes + roles + has_occupation + owns_skill edges
--
-- Lexicon: GOKMER + TALPIPE + ESKAP — vedi docs/_meta/lexicon.md
-- Idempotent: NOT EXISTS + ON CONFLICT DO NOTHING
-- Rollback: phase18h_DOWN.sql

BEGIN;

-- ============================================================================
-- BLOCK 1: M9 GAUSSIAN SKILL ASSESSMENTS — SmartFood (target ~820 new rows)
-- ============================================================================

SELECT setseed(0.43);

WITH
  sf_tenant AS (SELECT id FROM tenants WHERE code='smartfood'),
  sf_emp_occ AS (
    SELECT e.id AS emp_id, e.auth_role, eo.esco_occupation_id
    FROM employees e
    JOIN employee_occupations eo ON eo.employee_id=e.id AND eo.is_current=true
    WHERE e.tenant_id=(SELECT id FROM sf_tenant) AND e.employment_status='active'
  ),
  occ_skills_ranked AS (
    SELECT
      eos.occupation_id, eos.skill_id,
      es.preferred_label AS skill_name, eos.relation_type,
      ROW_NUMBER() OVER (
        PARTITION BY eos.occupation_id
        ORDER BY CASE eos.relation_type WHEN 'essential' THEN 1 ELSE 2 END, random()
      ) AS rn
    FROM esco_occupation_skills eos
    JOIN esco_skills es ON es.id=eos.skill_id
  ),
  pairings AS (
    SELECT
      e.emp_id, e.auth_role, s.skill_name,
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
    FROM sf_emp_occ e
    JOIN occ_skills_ranked s ON s.occupation_id=e.esco_occupation_id AND s.rn <= 10
  ),
  to_insert AS (
    SELECT
      p.emp_id, p.skill_name,
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
      WHERE esa.employee_id=p.emp_id AND esa.skill_name=p.skill_name
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
  gen_random_uuid(), ti.emp_id, (SELECT id FROM sf_tenant), NULL, NULL,
  ti.skill_name, ti.assessed_level, ti.required_level,
  CURRENT_DATE - (random() * 90)::int,
  CASE WHEN random() < 0.5 THEN 'self' WHEN random() < 0.8 THEN 'manager' ELSE 'peer' END,
  now(), now()
FROM to_insert ti;

-- ============================================================================
-- BLOCK 2: M11a UPDATE PERFORMANCE_REVIEWS — nine_box derivation
-- ============================================================================

SELECT setseed(0.78);

WITH
  sf_tenant AS (SELECT id FROM tenants WHERE code='smartfood'),
  sf_reviews AS (
    SELECT
      pr.id AS review_id, pr.overall_rating, e.auth_role,
      random() AS rand_perf, random() AS rand_pot
    FROM performance_reviews pr
    JOIN employees e ON e.id=pr.employee_id
    WHERE pr.tenant_id=(SELECT id FROM sf_tenant) AND pr.performance_box IS NULL
  ),
  scored AS (
    SELECT
      review_id,
      CASE
        WHEN overall_rating IS NULL THEN
          CASE WHEN rand_perf < 0.25 THEN 1 WHEN rand_perf < 0.75 THEN 2 ELSE 3 END
        WHEN overall_rating < 2.5 THEN 1
        WHEN overall_rating < 4.0 THEN 2
        ELSE 3
      END AS perf_box,
      LEAST(GREATEST(
        ROUND(
          CASE auth_role
            WHEN 'SYSADMIN' THEN 2.5 WHEN 'SUPERUSER' THEN 2.5
            WHEN 'TENANT_OWNER' THEN 2.5
            WHEN 'HR_DIRECTOR' THEN 2.3 WHEN 'IT_ADMIN' THEN 2.3
            WHEN 'HR_MANAGER' THEN 2.0 WHEN 'DEPT_HEAD' THEN 2.0 WHEN 'LINE_MANAGER' THEN 2.0
            ELSE 1.7
          END
          + 0.6 * sqrt(-2.0 * ln(GREATEST(rand_pot, 0.0001))) * cos(2.0 * pi() * rand_perf)
        )::int
      , 1), 3) AS pot_box,
      CASE
        WHEN overall_rating IS NULL THEN
          (CASE WHEN rand_perf < 0.25 THEN 'low' WHEN rand_perf < 0.75 THEN 'medium' ELSE 'high' END)::varchar
        WHEN overall_rating < 2.5 THEN 'low'::varchar
        WHEN overall_rating < 4.0 THEN 'medium'::varchar
        ELSE 'high'::varchar
      END AS pot_rating_str
    FROM sf_reviews
  )
UPDATE performance_reviews pr
SET
  performance_box=s.perf_box,
  potential_box=s.pot_box,
  potential_rating=s.pot_rating_str,
  updated_at=now()
FROM scored s
WHERE pr.id=s.review_id;

-- ============================================================================
-- BLOCK 3: M11b SUCCESSION CANDIDATES expansion (~50 row target)
-- ============================================================================

SELECT setseed(0.79);

WITH
  sf_tenant AS (SELECT id FROM tenants WHERE code='smartfood'),
  sf_plans AS (
    SELECT id, incumbent_employee_id, criticality_level
    FROM succession_plans WHERE tenant_id=(SELECT id FROM sf_tenant) AND status='active'
  ),
  sf_eligible_emp AS (
    SELECT
      e.id AS emp_id, e.auth_role, e.hire_date,
      row_number() OVER (ORDER BY random()) AS rn_global
    FROM employees e
    WHERE e.tenant_id=(SELECT id FROM sf_tenant)
      AND e.employment_status='active'
      AND e.auth_role IN ('LINE_MANAGER','EMPLOYEE')
  ),
  -- Per ogni plan, prendi 5 emp candidate random (escluso incumbent + già esistenti candidate)
  plan_candidates AS (
    SELECT
      p.id AS plan_id,
      e.emp_id,
      row_number() OVER (PARTITION BY p.id ORDER BY random()) AS rank_in_plan
    FROM sf_plans p
    CROSS JOIN sf_eligible_emp e
    WHERE e.emp_id <> COALESCE(p.incumbent_employee_id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND NOT EXISTS (
        SELECT 1 FROM succession_candidates sc
        WHERE sc.critical_role_id=p.id AND sc.candidate_employee_id=e.emp_id
      )
  )
INSERT INTO succession_candidates (
  id, critical_role_id, candidate_employee_id, tenant_id,
  readiness_level, rank_order, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  pc.plan_id,
  pc.emp_id,
  (SELECT id FROM sf_tenant),
  CASE
    WHEN random() < 0.30 THEN 'ready_now'
    WHEN random() < 0.55 THEN 'ready_1_year'
    WHEN random() < 0.80 THEN 'ready_2_years'
    ELSE 'development_needed'
  END,
  pc.rank_in_plan,
  now(), now()
FROM plan_candidates pc
WHERE pc.rank_in_plan <= 5;

-- ============================================================================
-- BLOCK 4: M13 KG PROJECTION SmartFood (ESKAP)
-- ============================================================================

-- 4.1 SF employees → kg_nodes type='EMPLOYEE'
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT
  e.tenant_id, 'EMPLOYEE', e.id::text,
  coalesce(e.first_name,'')||' '||coalesce(e.last_name,''),
  'employees', e.id,
  jsonb_build_object('job_title', e.job_title, 'auth_role', e.auth_role, 'hire_date', e.hire_date)
FROM employees e
WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND e.employment_status='active'
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id=e.tenant_id AND kn.node_type='EMPLOYEE' AND kn.source_id=e.id
  );

-- 4.2 SF job_templates → kg_nodes type='JOB_TEMPLATE'
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT
  jt.tenant_id, 'JOB_TEMPLATE', jt.job_code, jt.title_it, jt.title_en,
  'job_templates', jt.id,
  jsonb_build_object('esco_occupation_code', jt.esco_occupation_code)
FROM job_templates jt
WHERE jt.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id=jt.tenant_id AND kn.node_type='JOB_TEMPLATE' AND kn.source_id=jt.id
  );

-- 4.3 FOOD-MFG-M business_processes → kg_nodes type='PROCESS' (tenant-scoped projection)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='smartfood'),
  'PROCESS', bp.process_code, bp.process_name,
  'business_processes', bp.id,
  jsonb_build_object('category', bp.process_category, 'value_chain_position', bp.value_chain_position)
FROM business_processes bp
WHERE bp.profile_id=(SELECT id FROM industry_profiles WHERE code='FOOD-MFG-M')
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
      AND kn.node_type='PROCESS' AND kn.source_id=bp.id
  );

-- 4.4 rbp_roles → kg_nodes type='ROLE' (tenant-scoped projection)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='smartfood'),
  'ROLE', r.code, r.name, 'rbp_roles',
  jsonb_build_object('rbp_role_id', r.id, 'hierarchy_level', r.hierarchy_level, 'is_system_role', r.is_system_role)
FROM rbp_roles r
WHERE NOT EXISTS (
  SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
    AND kn.node_type='ROLE' AND kn.node_code=r.code
);

-- 4.5 SF employee→occupation links → kg_edges type='HAS_OCCUPATION'
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='smartfood'),
  emp_node.id, occ_node.id, 'HAS_OCCUPATION', 1.0,
  jsonb_build_object('is_current', eo.is_current)
FROM employee_occupations eo
JOIN employees e ON e.id=eo.employee_id
  AND e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes occ_node ON occ_node.tenant_id IS NULL AND occ_node.node_type='OCCUPATION' AND occ_node.source_id=eo.esco_occupation_id
WHERE eo.is_current=true
  AND NOT EXISTS (
    SELECT 1 FROM kg_edges ke
    WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
      AND ke.source_node_id=emp_node.id AND ke.target_node_id=occ_node.id
      AND ke.edge_type='HAS_OCCUPATION'
  );

-- 4.6 SF employee_skill_assessments → kg_edges type='OWNS_SKILL'
-- Match per skill_name → kg_nodes ESCO platform (label match)
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='smartfood'),
  emp_node.id, skill_node.id, 'OWNS_SKILL',
  esa.assessed_level::double precision / 5.0,
  jsonb_build_object('assessed_level', esa.assessed_level, 'required_level', esa.required_level, 'assessment_date', esa.assessment_date)
FROM employee_skill_assessments esa
JOIN employees e ON e.id=esa.employee_id
  AND e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id=e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id=e.id
JOIN kg_nodes skill_node ON skill_node.tenant_id IS NULL AND skill_node.node_type='SKILL' AND skill_node.label=esa.skill_name
WHERE NOT EXISTS (
  SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
    AND ke.source_node_id=emp_node.id AND ke.target_node_id=skill_node.id
    AND ke.edge_type='OWNS_SKILL'
);

-- ============================================================================
-- TRACK + VERIFY
-- ============================================================================

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18h_smartfood_enrichment', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE
  v_assess INTEGER;
  v_perf_box INTEGER;
  v_succ_cand INTEGER;
  v_kg_nodes INTEGER;
  v_kg_edges INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_assess FROM employee_skill_assessments esa
    JOIN employees e ON e.id=esa.employee_id
    WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood');
  SELECT COUNT(*) INTO v_perf_box FROM performance_reviews pr
    JOIN employees e ON e.id=pr.employee_id
    WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
      AND pr.performance_box IS NOT NULL;
  SELECT COUNT(*) INTO v_succ_cand FROM succession_candidates
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='smartfood');
  SELECT COUNT(*) INTO v_kg_nodes FROM kg_nodes
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='smartfood');
  SELECT COUNT(*) INTO v_kg_edges FROM kg_edges
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='smartfood');

  RAISE NOTICE '== phase18h SmartFood enrichment verification ==';
  RAISE NOTICE 'M9 skill_assessments SF: % (target ≥800)', v_assess;
  RAISE NOTICE 'M11a perf_reviews with box SF: % (target ≥50)', v_perf_box;
  RAISE NOTICE 'M11b succession_candidates SF: % (target ≥40)', v_succ_cand;
  RAISE NOTICE 'M13 kg_nodes SF: % (target ≥100)', v_kg_nodes;
  RAISE NOTICE 'M13 kg_edges SF: % (target ≥800)', v_kg_edges;

  IF v_assess < 800 THEN RAISE WARNING 'M9 below target: %', v_assess; END IF;
  IF v_succ_cand < 40 THEN RAISE WARNING 'M11b below target: %', v_succ_cand; END IF;
  IF v_kg_nodes < 100 THEN RAISE WARNING 'M13 nodes below target: %', v_kg_nodes; END IF;
END$$;

COMMIT;
