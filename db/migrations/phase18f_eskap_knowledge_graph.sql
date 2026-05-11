-- Phase 18f (S35.3 M13 + S35.5 ESKAP) — Knowledge Graph master tables
--
-- Lexicon: ESKAP = ESCO + Knowledge graph Application Projection
--
-- Goal:
--   1. CREATE TABLE kg_nodes (master) + kg_edges (master)
--   2. Seed ESCO catalog (platform-default, tenant_id NULL):
--      - esco_skills (14k) → kg_nodes type='SKILL'
--      - esco_occupations (3k) → kg_nodes type='OCCUPATION'
--      - esco_occupation_skills (126k) → kg_edges type='REQUIRES_SKILL'
--      - skill_adjacencies (11.6k) → kg_edges type='ADJACENT_SKILL'
--   3. Seed RTL Bank tenant projection (tenant_id = RTL UUID):
--      - 158 active employees → kg_nodes type='EMPLOYEE'
--      - 32 job_templates → kg_nodes type='JOB_TEMPLATE'
--      - 11 business_processes BANKING-M → kg_nodes type='PROCESS'
--      - 8 rbp_roles → kg_nodes type='ROLE'
--      - 156 employee→occupation links → kg_edges type='HAS_OCCUPATION'
--      - employee_skill_assessments (1859 RTL) → kg_edges type='OWNS_SKILL' weight=proficiency
--
-- Volume target: ~150k nodes + ~280k edges (ESCO catalog dominates)
-- Idempotent: ON CONFLICT (UNIQUE keys) DO NOTHING
-- Rollback: phase18f_DOWN.sql

BEGIN;

-- ============================================================================
-- 1. KG_NODES master
-- ============================================================================

CREATE TABLE IF NOT EXISTS kg_nodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  node_type       VARCHAR(32) NOT NULL
    CHECK (node_type IN ('SKILL','OCCUPATION','EMPLOYEE','ROLE','PROCESS','JOB_TEMPLATE','ORG_UNIT')),
  node_code       VARCHAR(255) NOT NULL,
  label           VARCHAR(512),
  label_en        VARCHAR(512),
  metadata        JSONB,
  source_table    VARCHAR(64),
  source_id       UUID,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, node_type, node_code)
);

CREATE INDEX IF NOT EXISTS idx_kg_nodes_type ON kg_nodes (node_type);
CREATE INDEX IF NOT EXISTS idx_kg_nodes_tenant ON kg_nodes (tenant_id) WHERE tenant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kg_nodes_source ON kg_nodes (source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_kg_nodes_label ON kg_nodes USING gin (to_tsvector('italian', coalesce(label,'')));

ALTER TABLE kg_nodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS kg_nodes_isolation ON kg_nodes;
CREATE POLICY kg_nodes_isolation ON kg_nodes
  USING (
    tenant_id IS NULL  -- platform catalog visibile a tutti
    OR tenant_id = (NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  );

COMMENT ON TABLE kg_nodes IS
  'ESKAP: Knowledge Graph nodes (ESCO catalog NULL tenant + tenant projection per employees/roles/processes/skills).';

-- ============================================================================
-- 2. KG_EDGES master
-- ============================================================================

CREATE TABLE IF NOT EXISTS kg_edges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  source_node_id  UUID NOT NULL REFERENCES kg_nodes(id) ON DELETE CASCADE,
  target_node_id  UUID NOT NULL REFERENCES kg_nodes(id) ON DELETE CASCADE,
  edge_type       VARCHAR(48) NOT NULL
    CHECK (edge_type IN (
      'REQUIRES_SKILL','ADJACENT_SKILL','HAS_OCCUPATION','OWNS_SKILL',
      'HAS_ROLE','EXECUTES_PROCESS','BELONGS_TO_ORG_UNIT','REPORTS_TO',
      'JOB_REQUIRES_SKILL','PROCESS_REQUIRES_ROLE','SKILL_OF_OCCUPATION'
    )),
  weight          DOUBLE PRECISION DEFAULT 1.0,
  metadata        JSONB,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, source_node_id, target_node_id, edge_type)
);

CREATE INDEX IF NOT EXISTS idx_kg_edges_source ON kg_edges (source_node_id);
CREATE INDEX IF NOT EXISTS idx_kg_edges_target ON kg_edges (target_node_id);
CREATE INDEX IF NOT EXISTS idx_kg_edges_type ON kg_edges (edge_type);
CREATE INDEX IF NOT EXISTS idx_kg_edges_tenant ON kg_edges (tenant_id) WHERE tenant_id IS NOT NULL;

ALTER TABLE kg_edges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS kg_edges_isolation ON kg_edges;
CREATE POLICY kg_edges_isolation ON kg_edges
  USING (
    tenant_id IS NULL
    OR tenant_id = (NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  );

COMMENT ON TABLE kg_edges IS
  'ESKAP: Knowledge Graph edges (relations skill↔skill, skill↔occupation, employee↔skill, role↔process).';

-- ============================================================================
-- 3. updated_at trigger
-- ============================================================================

DROP TRIGGER IF EXISTS trg_kg_nodes_updated_at ON kg_nodes;
CREATE TRIGGER trg_kg_nodes_updated_at
  BEFORE UPDATE ON kg_nodes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- ============================================================================
-- 4. SEED ESCO CATALOG (platform-default, tenant_id NULL)
-- ============================================================================

-- 4.1 ESCO SKILLS → kg_nodes type='SKILL' (~14k rows)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT
  NULL,
  'SKILL',
  es.id::text,
  es.preferred_label,
  es.preferred_label,
  'esco_skills',
  es.id,
  jsonb_build_object(
    'skill_type', es.skill_type,
    'reuse_level', es.reuse_level
  )
FROM esco_skills es
WHERE NOT EXISTS (
  SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id IS NULL AND kn.node_type='SKILL' AND kn.source_id = es.id
);

-- 4.2 ESCO OCCUPATIONS → kg_nodes type='OCCUPATION' (~3k rows)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT
  NULL,
  'OCCUPATION',
  eo.id::text,
  eo.preferred_label,
  eo.preferred_label,
  'esco_occupations',
  eo.id,
  jsonb_build_object(
    'isco_code', eo.isco_code
  )
FROM esco_occupations eo
WHERE NOT EXISTS (
  SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id IS NULL AND kn.node_type='OCCUPATION' AND kn.source_id = eo.id
);

-- 4.3 ESCO OCCUPATION→SKILL → kg_edges type='REQUIRES_SKILL' (~126k rows)
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  NULL,
  occ_node.id,
  skl_node.id,
  CASE WHEN eos.relation_type='essential' THEN 'REQUIRES_SKILL' ELSE 'SKILL_OF_OCCUPATION' END,
  CASE WHEN eos.relation_type='essential' THEN 1.0 ELSE 0.5 END,
  jsonb_build_object('relation_type', eos.relation_type)
FROM esco_occupation_skills eos
JOIN kg_nodes occ_node ON occ_node.tenant_id IS NULL AND occ_node.node_type='OCCUPATION' AND occ_node.source_id = eos.occupation_id
JOIN kg_nodes skl_node ON skl_node.tenant_id IS NULL AND skl_node.node_type='SKILL' AND skl_node.source_id = eos.skill_id
WHERE NOT EXISTS (
  SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id IS NULL AND ke.source_node_id=occ_node.id AND ke.target_node_id=skl_node.id
    AND ke.edge_type IN ('REQUIRES_SKILL','SKILL_OF_OCCUPATION')
);

-- 4.4 ESCO SKILL→SKILL adjacency → kg_edges type='ADJACENT_SKILL' (~11.6k rows)
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  NULL,
  src_node.id,
  tgt_node.id,
  'ADJACENT_SKILL',
  COALESCE(sa.adjacency_score::float, 0.5),
  jsonb_build_object(
    'adjacency_type', sa.adjacency_type,
    'job_posting_cooccurrence', sa.job_posting_cooccurrence,
    'employee_cooccurrence', sa.employee_cooccurrence
  )
FROM skill_adjacencies sa
JOIN kg_nodes src_node ON src_node.tenant_id IS NULL AND src_node.node_type='SKILL' AND src_node.source_id = sa.skill_id
JOIN kg_nodes tgt_node ON tgt_node.tenant_id IS NULL AND tgt_node.node_type='SKILL' AND tgt_node.source_id = sa.adjacent_skill_id
WHERE NOT EXISTS (
  SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id IS NULL AND ke.source_node_id=src_node.id AND ke.target_node_id=tgt_node.id
    AND ke.edge_type='ADJACENT_SKILL'
);

-- ============================================================================
-- 5. SEED RTL BANK TENANT PROJECTION
-- ============================================================================

-- 5.1 RTL employees → kg_nodes type='EMPLOYEE' (158 active)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT
  e.tenant_id,
  'EMPLOYEE',
  e.id::text,
  coalesce(e.first_name,'') || ' ' || coalesce(e.last_name,''),
  'employees',
  e.id,
  jsonb_build_object(
    'job_title', e.job_title,
    'auth_role', e.auth_role,
    'hire_date', e.hire_date
  )
FROM employees e
WHERE e.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
  AND e.employment_status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id = e.tenant_id AND kn.node_type='EMPLOYEE' AND kn.source_id = e.id
  );

-- 5.2 RTL job_templates → kg_nodes type='JOB_TEMPLATE' (32)
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, label_en, source_table, source_id, metadata)
SELECT
  jt.tenant_id,
  'JOB_TEMPLATE',
  jt.job_code,
  jt.title_it,
  jt.title_en,
  'job_templates',
  jt.id,
  jsonb_build_object('esco_occupation_code', jt.esco_occupation_code)
FROM job_templates jt
WHERE jt.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id = jt.tenant_id AND kn.node_type='JOB_TEMPLATE' AND kn.source_id = jt.id
  );

-- 5.3 BANKING-M business_processes → kg_nodes type='PROCESS' (11)
-- Note: business_processes ha profile_id NON tenant_id. Per RTL: profile_id = BANKING-M
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, source_id, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='rtl-bank'),
  'PROCESS',
  bp.process_code,
  bp.process_name,
  'business_processes',
  bp.id,
  jsonb_build_object(
    'category', bp.process_category,
    'value_chain_position', bp.value_chain_position
  )
FROM business_processes bp
WHERE bp.profile_id = (SELECT id FROM industry_profiles WHERE code='BANKING-M')
  AND NOT EXISTS (
    SELECT 1 FROM kg_nodes kn
    WHERE kn.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
      AND kn.node_type='PROCESS' AND kn.source_id = bp.id
  );

-- 5.4 RBP roles → kg_nodes type='ROLE' (8 canonical, tenant-scoped projection)
-- Note: rbp_roles.id is INTEGER not UUID; source_id stays NULL, dedup via node_code (role code).
INSERT INTO kg_nodes (tenant_id, node_type, node_code, label, source_table, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='rtl-bank'),
  'ROLE',
  r.code,
  r.name,
  'rbp_roles',
  jsonb_build_object(
    'rbp_role_id', r.id,
    'hierarchy_level', r.hierarchy_level,
    'is_system_role', r.is_system_role
  )
FROM rbp_roles r
WHERE NOT EXISTS (
  SELECT 1 FROM kg_nodes kn
  WHERE kn.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
    AND kn.node_type='ROLE' AND kn.node_code = r.code
);

-- 5.5 RTL employee→occupation links → kg_edges type='HAS_OCCUPATION' (~156)
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='rtl-bank'),
  emp_node.id,
  occ_node.id,
  'HAS_OCCUPATION',
  1.0,
  jsonb_build_object('is_current', eo.is_current)
FROM employee_occupations eo
JOIN employees e ON e.id = eo.employee_id AND e.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id = e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id = e.id
JOIN kg_nodes occ_node ON occ_node.tenant_id IS NULL AND occ_node.node_type='OCCUPATION' AND occ_node.source_id = eo.esco_occupation_id
WHERE eo.is_current = true
  AND NOT EXISTS (
    SELECT 1 FROM kg_edges ke
    WHERE ke.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
      AND ke.source_node_id = emp_node.id AND ke.target_node_id = occ_node.id
      AND ke.edge_type='HAS_OCCUPATION'
  );

-- 5.6 RTL employee→skill ownership da employee_skill_assessments → kg_edges type='OWNS_SKILL'
-- Linka emp a SKILL nodes matchando skill_name (ESCO label) - limit to top 1859 RTL assessments
INSERT INTO kg_edges (tenant_id, source_node_id, target_node_id, edge_type, weight, metadata)
SELECT
  (SELECT id FROM tenants WHERE code='rtl-bank'),
  emp_node.id,
  skl_node.id,
  'OWNS_SKILL',
  esa.assessed_level::float / 5.0,
  jsonb_build_object(
    'assessed_level', esa.assessed_level,
    'required_level', esa.required_level,
    'assessment_method', esa.assessment_method
  )
FROM employee_skill_assessments esa
JOIN employees e ON e.id = esa.employee_id
  AND e.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
  AND e.employment_status='active'
JOIN kg_nodes emp_node ON emp_node.tenant_id = e.tenant_id AND emp_node.node_type='EMPLOYEE' AND emp_node.source_id = e.id
JOIN kg_nodes skl_node ON skl_node.tenant_id IS NULL AND skl_node.node_type='SKILL' AND skl_node.label = esa.skill_name
WHERE NOT EXISTS (
  SELECT 1 FROM kg_edges ke
  WHERE ke.tenant_id = (SELECT id FROM tenants WHERE code='rtl-bank')
    AND ke.source_node_id = emp_node.id AND ke.target_node_id = skl_node.id
    AND ke.edge_type='OWNS_SKILL'
);

-- ============================================================================
-- 6. schema_migrations
-- ============================================================================

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18f_eskap_knowledge_graph', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT node_type, count(*) FROM kg_nodes GROUP BY 1 ORDER BY 1;
-- SELECT edge_type, count(*) FROM kg_edges GROUP BY 1 ORDER BY 1;
