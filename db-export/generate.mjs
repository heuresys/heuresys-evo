#!/usr/bin/env node
// db-export/generate.mjs
// Genera bundle data dictionary `heuresys_platform` per agente esterno.
// Input: .meta-*.json (estratti via SSH+psql) + schema-raw.sql (pg_dump) + Prisma schema + lexicon.md
// Output: catalog.json, schema.sql (filtered), README.md, exclusions.md, views.md, domains/*.md

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Exclusions ─────────────────────────────────────────────────────────────
const EXCLUSIONS = new Set([
  'account', // NextAuth provider link
  'session', // NextAuth session store
  'verification_token', // NextAuth email verify
  'audit_logs', // Audit event log
  'kg_nodes', // Knowledge graph nodes
  'kg_edges', // Knowledge graph edges
  '_prisma_migrations', // Prisma infra (may not exist as table here)
]);

const EXCLUSION_REASONS = {
  account: 'NextAuth provider account link · transiente · agente target ha proprio auth',
  session: 'NextAuth session store · transiente · regenerable',
  verification_token: 'NextAuth email-verify tokens · transiente',
  audit_logs: 'Log eventi runtime · non importabile cross-DB · ricostruibile post-ingest',
  kg_nodes: 'Knowledge graph derivato · ricomputabile da esco_*',
  kg_edges: 'Knowledge graph derivato · ricomputabile da esco_*',
  _prisma_migrations: 'Prisma migration state · strumentale, non dato applicativo',
};

// ── Load metadata ──────────────────────────────────────────────────────────
const loadJson = (name) => {
  const path = join(__dirname, name);
  if (!existsSync(path)) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, 'utf8')) || [];
};

const tablesRaw = loadJson('.meta-tables.json');
const columnsRaw = loadJson('.meta-columns.json');
const pksRaw = loadJson('.meta-pks.json');
const fksRaw = loadJson('.meta-fks.json');
const indexesRaw = loadJson('.meta-indexes.json');
const rlsRaw = loadJson('.meta-rls.json');
const viewsRaw = loadJson('.meta-views.json');
const matviewsRaw = loadJson('.meta-matviews.json');
const colCommentsRaw = loadJson('.meta-col-comments.json');

console.log(
  `Loaded: ${tablesRaw.length} tables · ${columnsRaw.length} columns · ${fksRaw.length} fk-cols · ${rlsRaw.length} RLS · ${viewsRaw.length} views · ${matviewsRaw.length} matviews`
);

// ── Build tableMap ─────────────────────────────────────────────────────────
const tableMap = new Map();

for (const t of tablesRaw) {
  if (EXCLUSIONS.has(t.table_name)) continue;
  tableMap.set(t.table_name, {
    name: t.table_name,
    row_estimate: Number(t.row_estimate) || 0,
    comment: t.comment || null,
    rls_enabled: !!t.rls_enabled,
    rls_forced: !!t.rls_forced,
    tenant_scoped: false, // computed below
    columns: [],
    primary_key: [],
    foreign_keys: [],
    indexes: [],
    rls_policies: [],
    domains: [],
    inverse_relations: [],
    prisma_model: null,
    prisma_doc: null,
  });
}

const get = (name) => tableMap.get(name);

// Columns
const colCommentLookup = new Map();
for (const cc of colCommentsRaw) {
  colCommentLookup.set(`${cc.table_name}::${cc.column_name}`, cc.comment);
}
for (const c of columnsRaw) {
  const t = get(c.table_name);
  if (!t) continue;
  if (c.column_name === 'tenant_id') t.tenant_scoped = true;
  t.columns.push({
    name: c.column_name,
    position: c.ordinal_position,
    type: c.udt_name,
    data_type: c.data_type,
    nullable: c.is_nullable === 'YES',
    default: c.column_default,
    max_length: c.character_maximum_length,
    precision: c.numeric_precision,
    scale: c.numeric_scale,
    comment: colCommentLookup.get(`${c.table_name}::${c.column_name}`) || null,
  });
}
for (const t of tableMap.values()) {
  t.columns.sort((a, b) => a.position - b.position);
}

// Primary keys
const pkMap = new Map();
for (const p of pksRaw) {
  if (!pkMap.has(p.table_name)) pkMap.set(p.table_name, []);
  pkMap.get(p.table_name).push(p);
}
for (const [name, cols] of pkMap) {
  const t = get(name);
  if (!t) continue;
  t.primary_key = cols
    .sort((a, b) => a.ordinal_position - b.ordinal_position)
    .map((c) => c.column_name);
}

// Foreign keys (group by constraint_name)
const fkMap = new Map();
for (const f of fksRaw) {
  const key = `${f.from_table}::${f.constraint_name}`;
  if (!fkMap.has(key)) {
    fkMap.set(key, {
      table: f.from_table,
      constraint: f.constraint_name,
      cols: [],
      ref_table: f.to_table,
      ref_cols: [],
      on_update: f.update_rule,
      on_delete: f.delete_rule,
    });
  }
  const fk = fkMap.get(key);
  fk.cols.push({ name: f.from_col, pos: f.from_position });
  if (!fk.ref_cols.includes(f.to_col)) fk.ref_cols.push(f.to_col);
}
for (const fk of fkMap.values()) {
  if (EXCLUSIONS.has(fk.table)) continue;
  const t = get(fk.table);
  if (!t) continue;
  fk.cols.sort((a, b) => a.pos - b.pos);
  const colNames = fk.cols.map((c) => c.name);
  t.foreign_keys.push({
    constraint: fk.constraint,
    columns: colNames,
    ref_table: fk.ref_table,
    ref_columns: fk.ref_cols,
    references: `${fk.ref_table}(${fk.ref_cols.join(',')})`,
    on_update: fk.on_update,
    on_delete: fk.on_delete,
    ref_excluded: EXCLUSIONS.has(fk.ref_table),
  });
  // Inverse: registra solo se ref non escluso
  if (!EXCLUSIONS.has(fk.ref_table)) {
    const targetT = get(fk.ref_table);
    if (targetT) {
      targetT.inverse_relations.push({
        from_table: fk.table,
        from_columns: colNames,
        constraint: fk.constraint,
      });
    }
  }
}

// Indexes
const idxMap = new Map();
for (const i of indexesRaw) {
  const key = `${i.table_name}::${i.index_name}`;
  if (!idxMap.has(key)) {
    idxMap.set(key, {
      table: i.table_name,
      name: i.index_name,
      cols: [],
      unique: !!i.indisunique,
      primary: !!i.indisprimary,
    });
  }
  idxMap
    .get(key)
    .cols.push({ name: i.column_name, pos: i.key_position == null ? 0 : i.key_position });
}
for (const ix of idxMap.values()) {
  const t = get(ix.table);
  if (!t) continue;
  ix.cols.sort((a, b) => a.pos - b.pos);
  t.indexes.push({
    name: ix.name,
    columns: ix.cols.map((c) => c.name),
    unique: ix.unique,
    primary: ix.primary,
  });
}

// RLS policies
for (const p of rlsRaw) {
  const t = get(p.tablename);
  if (!t) continue;
  t.rls_policies.push({
    name: p.policyname,
    permissive: p.permissive,
    roles: p.roles,
    cmd: p.cmd,
    qual: p.qual,
    with_check: p.with_check,
  });
}

// ── Parse Prisma schema ────────────────────────────────────────────────────
const prismaSchema = readFileSync(join(ROOT, 'services/app/prisma/schema.prisma'), 'utf8');
const prismaLines = prismaSchema.split('\n');

const prismaModels = new Map(); // dbTableName → { prismaName, doc }
{
  let pendingDoc = [];
  let i = 0;
  while (i < prismaLines.length) {
    const line = prismaLines[i];
    const tripleSlash = line.match(/^\s*\/\/\/\s?(.*)$/);
    if (tripleSlash) {
      pendingDoc.push(tripleSlash[1]);
      i++;
      continue;
    }
    const modelMatch = line.match(/^model\s+(\w+)\s*\{/);
    if (modelMatch) {
      const prismaName = modelMatch[1];
      let dbName = prismaName;
      let body = [];
      i++;
      while (i < prismaLines.length && !/^\}/.test(prismaLines[i])) {
        body.push(prismaLines[i]);
        i++;
      }
      const bodyStr = body.join('\n');
      const mapMatch = bodyStr.match(/@@map\("([^"]+)"\)/);
      if (mapMatch) dbName = mapMatch[1];
      // Discard prisma boilerplate doc comments
      const doc =
        pendingDoc
          .filter((d) => !/This model contains row level security/.test(d))
          .filter((d) => !/This table contains check constraints/.test(d))
          .filter((d) => !/This model or at least one of its fields has comments/.test(d))
          .join(' ')
          .trim() || null;
      prismaModels.set(dbName, { prismaName, doc });
      pendingDoc = [];
      i++;
      continue;
    }
    if (line.trim() !== '' && !line.match(/^\s*\/\//)) pendingDoc = [];
    i++;
  }
}

for (const [dbName, meta] of prismaModels) {
  const t = get(dbName);
  if (!t) continue;
  t.prisma_model = meta.prismaName;
  t.prisma_doc = meta.doc;
}

// ── Parse lexicon.md per domain mapping ────────────────────────────────────
const lexiconMd = readFileSync(join(ROOT, 'docs/_meta/lexicon.md'), 'utf8');

const DOMAINS = [
  {
    sigla: 'OPOURSKA',
    full: 'Organization-Process-OrgUnit-Role-Skill-KPI-Assessment',
    desc: 'Ontologia core 7-layer canonical (base attiva)',
    patterns: [
      'tenants',
      'tenants_books',
      'tenant_onboarding_profiles',
      'tenant_org_*',
      'tenant_jobs',
      'tenant_job_*',
      'tenant_custom_skills',
      'tenant_skill_dimensions',
      'tenant_sap_mapping',
      'tenant_schema_version',
      'tenant_revenue_periods',
      'tenant_retirement_rules',
      'tenant_regulatory_compliance',
      'org_units',
      'org_unit_*',
      'org_chart_*',
      'org_prototype_*',
      'org_templates',
      'org_scenarios',
      'org_areas',
      'org_levels',
      'business_processes',
      'rbp_roles',
      'job_templates',
      'job_template_skills',
      'esco_skills',
      'kpi_definitions',
      'kpi_*',
      'performance_reviews',
      'role_default_dashboards',
      'company_profiles',
      'company_sizes',
      'cost_centers',
      'locations',
    ],
  },
  {
    sigla: 'PET',
    full: 'Process / Enterprise / Talent',
    desc: '3 access perspectives (COO / CFO-Chief Org / CHRO)',
    patterns: ['rbp_perspectives', 'rbp_functional_areas'],
  },
  {
    sigla: 'INDOOR',
    full: 'Industry-NACE-Domain-Org-OrgUnit-Roles',
    desc: 'Industry-driven cascade (industry → workforce baseline → org → roles)',
    patterns: [
      'industry_*',
      'tenant_industry_classifications',
      'benchmark_*',
      'blueprint_*',
      'market_benchmarks',
      'market_salary_data',
      'occupation_industry_classifications',
    ],
  },
  {
    sigla: 'TALPIPE',
    full: 'Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility-Promotion)',
    desc: 'Talent flow + succession derivation',
    patterns: [
      'career_paths',
      'career_*',
      'succession_pipeline',
      'succession_*',
      'talent_pools',
      'talent_*',
      'internal_mobility_*',
      'nine_box_grid',
      'nine_box_*',
      'critical_roles',
      'mentor_*',
      'mentorship_*',
      'mentorships',
      'workforce_plan*',
      'workforce_plans',
      'employee_career_*',
    ],
  },
  {
    sigla: 'H2R',
    full: 'Hire-to-Retire',
    desc: 'Industry-standard HR lifecycle',
    patterns: [
      'recruiting_*',
      'onboarding_*',
      'preboarding_*',
      'employees',
      'employees_*',
      'employee_employment_history',
      'termination_*',
      'requisitions',
      'requisition_*',
      'candidates',
      'candidate_*',
      'applications',
      'application_*',
      'interviews',
      'interview_*',
      'offers',
      'offer_*',
      'job_postings',
      'job_postings_raw',
      'job_market_*',
      'job_evaluations',
      'job_families',
      'job_qualifications',
      'job_analysis',
      'job_kpi*',
      'job_skills',
      'job_tasks',
      'job_task_*',
      'job_title_*',
      'internal_applications',
      'internal_job_*',
      'internal_jobs',
      'saved_jobs',
      'employee_addresses',
      'employee_attendance',
      'employee_bank_details',
      'employee_benefit_*',
      'employee_benefits',
      'employee_clubs',
      'employee_contract*',
      'employee_contracts',
      'employee_documents',
      'employee_emergency_contacts',
      'employee_job_assignments',
      'employee_kpi_targets',
      'employee_occupations',
      'employee_overtime',
      'employee_pay_stubs',
      'employee_permission_overrides',
      'employee_requests',
      'employee_time_off_*',
      'employee_timeline',
      'employee_training_records',
      'contracts',
      'contract_amendments',
      'leave_*',
      'medical_certificates',
      'position_skill_requirements',
    ],
  },
  {
    sigla: 'SKILGRO',
    full: 'Skill-Knowledge-Inventory-Learning-GROwth',
    desc: 'Learning Loop (gap → recommend → enroll → cert → reassess)',
    patterns: [
      'skill_gap_analyses',
      'learning_recommendations',
      'course_enrollments',
      'certifications',
      'certification_*',
      'employee_skill_assessments',
      'employee_skill_*',
      'employee_skills',
      'employee_certifications',
      'learning_*',
      'courses',
      'course_*',
      'skill_*',
      'training_*',
      'curricula',
      'curriculum_*',
      'module_completions',
      'competencies',
      'competency_*',
      'extracted_skills',
      'unknown_skills',
      'import_skill_links',
      'rating_scales',
    ],
  },
  {
    sigla: 'GOKMER',
    full: 'Goal-Objective-KPI-Measurement-Evaluation-Review',
    desc: 'Performance Cycle',
    patterns: [
      'goals',
      'goal_*',
      'okrs',
      'okr_*',
      'performance_reviews',
      'performance_*',
      'calibration_*',
      'feedback_360',
      'feedback_*',
      'review_cycle*',
      'reviews',
      'self_reviews',
      'self_assessment_*',
      'continuous_feedback',
      'check_ins',
      'check_in_*',
      'key_results',
      'recognition',
      'roadmap_phases',
    ],
  },
  {
    sigla: 'PROGOV',
    full: 'Process Governance (Workflow-Approval-Audit-Compliance)',
    desc: 'Process-driven governance + audit trail',
    patterns: [
      'business_processes',
      'workflow_*',
      'approval_chains',
      'approval_*',
      'compliance_checks',
      'compliance_*',
      'regulatory_frameworks',
      'regulatory_*',
      'process_*',
      'whistleblowing_*',
      'signature_*',
    ],
  },
  {
    sigla: 'ESKAP',
    full: 'ESCO + Knowledge graph Application Projection',
    desc: 'KG full + tenant projection',
    patterns: [
      'esco_*',
      'skill_adjacencies',
      'kg_*',
      'onet_*',
      'ontology_*',
      'semantic_entity_*',
      'semantic_search_log',
      'cross_entity_*',
    ],
  },
  {
    sigla: 'ITLAB',
    full: 'Italian Labor (CCNL-INPS-Sindacati-Holidays IT)',
    desc: 'Italian labor context governance',
    patterns: [
      'ccnl_*',
      'holidays',
      'sindacati',
      'sindacato_*',
      'tenant_ccnl_links',
      'inps_*',
      'industry_ccnl_mapping',
    ],
  },
  {
    sigla: 'RBP',
    full: 'Role-Based Permissions matrix',
    desc: '8 roles × 34 areas governance',
    patterns: [
      'rbp_*',
      'users',
      'user_*',
      'role_*',
      'permission_*',
      'permissions',
      'api_keys',
      'sso_*',
      'login_attempts',
      'canonical_demo_users',
      'plugin_api_keys',
    ],
  },
  {
    sigla: 'DGOV',
    full: 'Data Governance (Multi-tenant + RLS + Audit + GDPR)',
    desc: 'Trasversale, enforce P1+P4+P5+P7',
    patterns: [
      'data_*',
      'documents',
      'document_*',
      'gdpr_*',
      'notification_*',
      'notifications',
      'export_*',
      'import_*',
      'sync_*',
      'integration_*',
      'integrations',
      'sap_*',
      'ext_*',
      'hrp*',
      'pa0*',
      'pa1*',
      'pa2*',
      'pb*',
      'pcl*',
      't0*',
      't1*',
      't2*',
      't5*',
      't7*',
      'webhook_*',
      'webhooks',
      'plugin_*',
      'plugins',
      'page_table_*',
      'platform_*',
      'feature_*',
      'features',
      'admin_*',
      'service_config',
      'workspace_*',
      'widget_*',
      'dashboard_*',
      'dashboards',
      'db_table_*',
      'tenant_sap_*',
      'tenant_schema_*',
      'schema_migrations',
      'heuresys_sap_mapping',
      'table_usage_rules',
      'enrichment_*',
      'rag_*',
      'report_*',
      'crawl_*',
      'crawler_*',
      'error_*',
    ],
  },
  {
    sigla: 'SMERTO',
    full: 'Salary-Merit-Equity-Reward-TOtal',
    desc: 'Compensation Cycle',
    patterns: [
      'salary_*',
      'merit_*',
      'bonuses',
      'bonus_*',
      'compensation_*',
      'reward_*',
      'equity_*',
      'total_*',
      'payroll_*',
    ],
  },
  {
    sigla: 'PULSAR',
    full: 'PUlse-LinkedScore-Action-Retention',
    desc: 'Engagement Loop',
    patterns: [
      'engagement_*',
      'pulse_*',
      'survey_*',
      'surveys',
      'burnout_*',
      'wellbeing_*',
      'club_*',
      'news_*',
      'social_*',
    ],
  },
  {
    sigla: 'EPRA',
    full: 'Embedding-Prediction-Recommendation-Action',
    desc: 'AI/Predictive stack',
    patterns: [
      'ai_*',
      'model_predictions',
      'prediction_*',
      'predictive_*',
      'turnover_*',
      'performance_predictions',
      'recommendation_*',
      'embedding_*',
      'analytics_*',
      'analysis_*',
    ],
  },
  {
    sigla: 'CASCADIA',
    full: 'Catena seeding realistic end-to-end',
    desc: 'Self-reference: orchestrator pipeline (no DB tables — meta-domain)',
    patterns: [],
  },
];

const matchPattern = (pattern, tableName) => {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return tableName.startsWith(prefix);
  }
  return tableName === pattern;
};

for (const dom of DOMAINS) {
  for (const t of tableMap.values()) {
    if (dom.patterns.some((p) => matchPattern(p, t.name))) {
      if (!t.domains.includes(dom.sigla)) t.domains.push(dom.sigla);
    }
  }
}

// Stats
let multiDomain = 0,
  noDomain = 0;
for (const t of tableMap.values()) {
  if (t.domains.length > 1) multiDomain++;
  if (t.domains.length === 0) noDomain++;
}
console.log(
  `Domain mapping: ${tableMap.size - noDomain}/${tableMap.size} tabelle mappate · ${multiDomain} multi-domain · ${noDomain} uncategorized`
);

// ── Filter schema-raw.sql → schema.sql ─────────────────────────────────────
const rawSchemaSql = readFileSync(join(__dirname, 'schema-raw.sql'), 'utf8');

const filterSchema = (raw, exclusions) => {
  // Split per blocco di commento header pg_dump: "--\n-- Name: ...; Type: ...; Schema: ...\n--"
  // Approach: split su `\n--\n-- Name:` (preserve header), keep block if non match exclusions
  const blocks = raw.split(/(?=^--\n-- Name: )/m);
  const out = [];
  const excludedPattern = new RegExp(`\\bpublic\\.(${[...exclusions].join('|')})\\b`);
  let dropped = 0;
  for (const block of blocks) {
    if (excludedPattern.test(block)) {
      dropped++;
      continue;
    }
    out.push(block);
  }
  console.log(
    `schema.sql: ${blocks.length} blocks → ${blocks.length - dropped} kept · ${dropped} dropped`
  );
  return out.join('');
};

writeFileSync(join(__dirname, 'schema.sql'), filterSchema(rawSchemaSql, EXCLUSIONS));

// ── Build catalog.json ─────────────────────────────────────────────────────
const catalog = {
  $meta: {
    source: 'heuresys_platform@oracle-vm-default:5432',
    pg_version: '16.13',
    generated_at: new Date().toISOString(),
    exclusions: [...EXCLUSIONS],
    table_count: tableMap.size,
    view_count: viewsRaw.length,
    matview_count: matviewsRaw.length,
    fk_count: [...tableMap.values()].reduce((s, t) => s + t.foreign_keys.length, 0),
    rls_count: [...tableMap.values()].reduce((s, t) => s + t.rls_policies.length, 0),
    tenant_scoped_count: [...tableMap.values()].filter((t) => t.tenant_scoped).length,
  },
  domains: DOMAINS.map((d) => ({
    sigla: d.sigla,
    full: d.full,
    desc: d.desc,
    table_count: [...tableMap.values()].filter((t) => t.domains.includes(d.sigla)).length,
  })),
  tables: {},
  views: {},
  matviews: {},
};

for (const [name, t] of [...tableMap.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  catalog.tables[name] = t;
}
for (const v of viewsRaw) catalog.views[v.viewname] = { definition: v.definition };
for (const m of matviewsRaw) catalog.matviews[m.matviewname] = { definition: m.definition };

writeFileSync(join(__dirname, 'catalog.json'), JSON.stringify(catalog, null, 2));

// ── Markdown builders ──────────────────────────────────────────────────────
const fmtColumn = (c) => {
  const type = c.max_length
    ? `${c.type}(${c.max_length})`
    : c.precision
      ? `${c.type}(${c.precision}${c.scale ? ',' + c.scale : ''})`
      : c.type;
  return {
    name: c.name,
    type,
    nullable: c.nullable ? 'YES' : 'NO',
    default: c.default || '—',
    comment: c.comment || '',
  };
};

const tableMarkdown = (t) => {
  const lines = [];
  lines.push(`### \`${t.name}\``);
  if (t.prisma_doc) lines.push(`\n> ${t.prisma_doc}\n`);
  lines.push('');
  lines.push(`- **Tenant scoped**: ${t.tenant_scoped ? 'yes' : 'no'}`);
  lines.push(`- **Row estimate**: ${t.row_estimate.toLocaleString()}`);
  lines.push(`- **Domains**: ${t.domains.length ? t.domains.join(' · ') : '_uncategorized_'}`);
  if (t.prisma_model) lines.push(`- **Prisma model**: \`${t.prisma_model}\``);
  if (t.rls_enabled) lines.push(`- **RLS**: enabled${t.rls_forced ? ' (forced)' : ''}`);
  lines.push('');

  // Columns
  lines.push('#### Columns');
  lines.push('');
  lines.push('| # | Column | Type | Null | Default | Notes |');
  lines.push('|---|---|---|---|---|---|');
  for (const c of t.columns) {
    const f = fmtColumn(c);
    const inPk = t.primary_key.includes(c.name);
    const notes = [
      inPk ? 'PK' : null,
      c.comment ? c.comment.replace(/\|/g, '\\|').replace(/\n/g, ' ') : null,
    ]
      .filter(Boolean)
      .join(' · ');
    lines.push(
      `| ${c.position} | \`${c.name}\` | ${f.type} | ${f.nullable} | ${f.default === '—' ? '—' : '`' + f.default.replace(/\|/g, '\\|') + '`'} | ${notes} |`
    );
  }
  lines.push('');

  // Primary key
  if (t.primary_key.length) {
    lines.push(`#### Primary Key`);
    lines.push('');
    lines.push(`\`(${t.primary_key.map((c) => '`' + c + '`').join(', ')})\``.replace(/`+/g, '`'));
    lines.push('');
  }

  // Foreign Keys
  if (t.foreign_keys.length) {
    lines.push('#### Foreign Keys');
    lines.push('');
    lines.push('| Columns | References | ON UPDATE | ON DELETE | Notes |');
    lines.push('|---|---|---|---|---|');
    for (const fk of t.foreign_keys) {
      const refNote = fk.ref_excluded ? '⚠️ target escluso (vedi exclusions.md)' : '';
      lines.push(
        `| ${fk.columns.map((c) => '`' + c + '`').join(', ')} | \`${fk.references}\` | ${fk.on_update} | ${fk.on_delete} | ${refNote} |`
      );
    }
    lines.push('');
  }

  // Indexes
  if (t.indexes.length) {
    lines.push('#### Indexes');
    lines.push('');
    for (const ix of t.indexes) {
      const tag = ix.primary ? 'PRIMARY' : ix.unique ? 'UNIQUE' : 'INDEX';
      lines.push(
        `- \`${ix.name}\` [${tag}] · (${ix.columns.map((c) => '`' + c + '`').join(', ')})`
      );
    }
    lines.push('');
  }

  // RLS
  if (t.rls_policies.length) {
    lines.push('#### RLS Policies');
    lines.push('');
    for (const p of t.rls_policies) {
      lines.push(
        `- **${p.name}** (${p.cmd} · ${p.permissive}) · roles: \`${(p.roles || []).join(',')}\``
      );
      if (p.qual) lines.push(`  - USING: \`${p.qual}\``);
      if (p.with_check) lines.push(`  - WITH CHECK: \`${p.with_check}\``);
    }
    lines.push('');
  }

  // Inverse relations
  if (t.inverse_relations.length) {
    const grouped = new Map();
    for (const ir of t.inverse_relations) {
      if (!grouped.has(ir.from_table)) grouped.set(ir.from_table, []);
      grouped.get(ir.from_table).push(ir.from_columns.join(','));
    }
    lines.push('#### Inverse relations (referenced by)');
    lines.push('');
    for (const [src, cols] of [...grouped.entries()].sort()) {
      lines.push(`- \`${src}\` via (${[...new Set(cols)].map((c) => '`' + c + '`').join(' · ')})`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  return lines.join('\n');
};

// Domain markdowns
mkdirSync(join(__dirname, 'domains'), { recursive: true });

for (let i = 0; i < DOMAINS.length; i++) {
  const dom = DOMAINS[i];
  const num = String(i + 1).padStart(2, '0');
  const slug = dom.sigla.toLowerCase();
  const filename = `${num}-${slug}.md`;
  const tablesInDom = [...tableMap.values()]
    .filter((t) => t.domains.includes(dom.sigla))
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines = [];
  lines.push(`# Dominio ${dom.sigla} — ${dom.full}`);
  lines.push('');
  lines.push(`> ${dom.desc}`);
  lines.push('');
  lines.push(`**Tabelle in questo dominio**: ${tablesInDom.length}`);
  lines.push('');

  if (tablesInDom.length === 0) {
    lines.push(`_Nessuna tabella DB diretta in questo dominio._`);
    if (dom.sigla === 'CASCADIA') {
      lines.push('');
      lines.push(
        'CASCADIA è una meta-pipeline orchestratrice che combina output di INDOOR + OPOURSKA + TALPIPE + SKILGRO + GOKMER + PROGOV + ESKAP + ITLAB + SMERTO + PULSAR + EPRA per popolare 4 tenant (RTL Bank · SmartFood · EcoNova · Heuresys) con dati realistici end-to-end. Implementazione: `scripts/seed-generator/cascadia/`.'
      );
    }
  } else {
    lines.push('## Tabelle');
    lines.push('');
    lines.push('| Tabella | Rows | Tenant | RLS | FK out | Cols |');
    lines.push('|---|---|---|---|---|---|');
    for (const t of tablesInDom) {
      lines.push(
        `| [\`${t.name}\`](#${t.name.replace(/_/g, '')}) | ${t.row_estimate.toLocaleString()} | ${t.tenant_scoped ? '✓' : '—'} | ${t.rls_enabled ? '✓' : '—'} | ${t.foreign_keys.length} | ${t.columns.length} |`
      );
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    for (const t of tablesInDom) {
      lines.push(tableMarkdown(t));
    }
  }

  writeFileSync(join(__dirname, 'domains', filename), lines.join('\n'));
}

// Uncategorized
const uncat = [...tableMap.values()]
  .filter((t) => t.domains.length === 0)
  .sort((a, b) => a.name.localeCompare(b.name));
{
  const lines = [];
  lines.push(`# Uncategorized — tabelle non mappate dal lexicon`);
  lines.push('');
  lines.push(
    `> Tabelle business presenti nel DBMS ma non incluse in alcuno dei 16 domini lexicon. Da consultare per completezza durante import.`
  );
  lines.push('');
  lines.push(`**Conteggio**: ${uncat.length}`);
  lines.push('');
  if (uncat.length) {
    lines.push('| Tabella | Rows | Tenant | RLS | FK out | Cols |');
    lines.push('|---|---|---|---|---|---|');
    for (const t of uncat) {
      lines.push(
        `| [\`${t.name}\`](#${t.name.replace(/_/g, '')}) | ${t.row_estimate.toLocaleString()} | ${t.tenant_scoped ? '✓' : '—'} | ${t.rls_enabled ? '✓' : '—'} | ${t.foreign_keys.length} | ${t.columns.length} |`
      );
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    for (const t of uncat) lines.push(tableMarkdown(t));
  }
  writeFileSync(join(__dirname, 'domains/99-uncategorized.md'), lines.join('\n'));
}

// Domain index 00
{
  const lines = [];
  lines.push('# Indice domini lexicon');
  lines.push('');
  lines.push(
    `> Mapping sigla → tabelle. 16 sigle canonical + 1 sezione \`uncategorized\` per residue.`
  );
  lines.push('');
  lines.push('| # | Sigla | Full | Tables | File |');
  lines.push('|---|---|---|---|---|');
  for (let i = 0; i < DOMAINS.length; i++) {
    const dom = DOMAINS[i];
    const num = String(i + 1).padStart(2, '0');
    const slug = dom.sigla.toLowerCase();
    const count = [...tableMap.values()].filter((t) => t.domains.includes(dom.sigla)).length;
    lines.push(
      `| ${i + 1} | **${dom.sigla}** | ${dom.full} | ${count} | [\`${num}-${slug}.md\`](./${num}-${slug}.md) |`
    );
  }
  lines.push(
    `| — | _Uncategorized_ | tabelle non mappate dal lexicon | ${uncat.length} | [\`99-uncategorized.md\`](./99-uncategorized.md) |`
  );
  lines.push('');
  lines.push('## Tabelle multi-domain (≥2 sigle)');
  lines.push('');
  const multi = [...tableMap.values()]
    .filter((t) => t.domains.length >= 2)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (multi.length) {
    lines.push('| Tabella | Domains |');
    lines.push('|---|---|');
    for (const t of multi) lines.push(`| \`${t.name}\` | ${t.domains.join(' · ')} |`);
  }
  writeFileSync(join(__dirname, 'domains/00-index.md'), lines.join('\n'));
}

// exclusions.md
{
  const lines = [];
  lines.push('# Tabelle escluse dal data dictionary');
  lines.push('');
  lines.push(
    '> Le tabelle seguenti sono **escluse** da `catalog.json`, `schema.sql` filtered, e dai markdown di dominio. Sono presenti in `schema-raw.sql` per reference.'
  );
  lines.push('');
  lines.push('| Tabella | Famiglia | Motivo |');
  lines.push('|---|---|---|');
  for (const name of [...EXCLUSIONS].sort()) {
    let famiglia = 'altro';
    if (['account', 'session', 'verification_token'].includes(name)) famiglia = 'NextAuth';
    else if (name.startsWith('audit_')) famiglia = 'Audit';
    else if (name.startsWith('kg_')) famiglia = 'Knowledge graph';
    else if (name.startsWith('_prisma')) famiglia = 'Prisma infra';
    lines.push(`| \`${name}\` | ${famiglia} | ${EXCLUSION_REASONS[name] || '—'} |`);
  }
  lines.push('');
  lines.push('## Implicazioni FK');
  lines.push('');
  lines.push(
    "Foreign key che referenzano tabelle escluse sono mantenute nel catalog (`ref_excluded: true`) ma non hanno entry nei domain markdown sul lato target. La maggior parte dei riferimenti riguarda `users → account` (NextAuth account link) o `audit_logs` derivate, gestibili dall'agente target ridichiarando i propri equivalenti."
  );
  writeFileSync(join(__dirname, 'exclusions.md'), lines.join('\n'));
}

// views.md
{
  const lines = [];
  lines.push('# Views & Materialized Views');
  lines.push('');
  lines.push(
    `> Schema \`public\` · ${viewsRaw.length} view · ${matviewsRaw.length} materialized view.`
  );
  lines.push('');
  lines.push(
    'Le view sono **derivate** dalle tabelle: non importarle come tabelle nel DBMS target, ricostruirle dopo aver importato le sorgenti.'
  );
  lines.push('');
  lines.push('## Views');
  lines.push('');
  for (const v of viewsRaw.sort((a, b) => a.viewname.localeCompare(b.viewname))) {
    lines.push(`### \`${v.viewname}\``);
    lines.push('');
    lines.push('```sql');
    lines.push(v.definition.trim());
    lines.push('```');
    lines.push('');
  }
  lines.push('## Materialized Views');
  lines.push('');
  for (const m of matviewsRaw.sort((a, b) => a.matviewname.localeCompare(b.matviewname))) {
    lines.push(`### \`${m.matviewname}\``);
    lines.push('');
    lines.push('```sql');
    lines.push(m.definition.trim());
    lines.push('```');
    lines.push('');
  }
  writeFileSync(join(__dirname, 'views.md'), lines.join('\n'));
}

// README.md
{
  const meta = catalog.$meta;
  const lines = [];
  lines.push('# `heuresys_platform` — Data Dictionary export');
  lines.push('');
  lines.push(`> **Source**: ${meta.source} · PostgreSQL ${meta.pg_version}`);
  lines.push(`> **Generated**: ${meta.generated_at}`);
  lines.push(
    `> **Scope**: solo tabelle business · esclusioni in [\`exclusions.md\`](./exclusions.md)`
  );
  lines.push('');
  lines.push("## Cos'è questo bundle");
  lines.push('');
  lines.push(
    `Documento granulare ed esaustivo dello schema DBMS \`heuresys_platform\` (piattaforma SaaS B2B Organizational Intelligence & Workforce Orchestration · stack Next.js + Prisma + PostgreSQL multi-tenant). Destinato a un agente esterno che ha generato un proprio DBMS PostgreSQL e deve capire **cosa importare** e **come è strutturato** il nostro DB.`
  );
  lines.push('');
  lines.push('## Stats');
  lines.push('');
  lines.push(
    `- **Tabelle catalogate**: ${meta.table_count} (su ${tablesRaw.length} totali, ${EXCLUSIONS.size} escluse)`
  );
  lines.push(`- **Tenant-scoped**: ${meta.tenant_scoped_count} tabelle con colonna \`tenant_id\``);
  lines.push(`- **Foreign keys**: ${meta.fk_count}`);
  lines.push(`- **RLS policies attive**: ${meta.rls_count}`);
  lines.push(`- **Views**: ${meta.view_count} · **Materialized views**: ${meta.matview_count}`);
  lines.push(`- **Domini lexicon**: 16 sigle canonical + uncategorized`);
  lines.push('');
  lines.push('## Struttura del bundle');
  lines.push('');
  lines.push('```');
  lines.push('db-export/');
  lines.push('├── README.md            ← questo file');
  lines.push('├── catalog.json         ← catalogo machine-readable (tables/views/matviews + meta)');
  lines.push(
    '├── schema.sql           ← DDL filtered (pg_dump --schema-only · esclusioni applicate)'
  );
  lines.push('├── schema-raw.sql       ← DDL completo (reference, include escluse)');
  lines.push('├── exclusions.md        ← tabelle escluse + motivazione');
  lines.push('├── views.md             ← definizioni SQL di tutte le view + matview');
  lines.push('└── domains/             ← markdown per dominio (16 sigle + index + uncategorized)');
  lines.push('    ├── 00-index.md');
  lines.push('    ├── 01-opourska.md');
  lines.push('    ├── 02-pet.md');
  lines.push('    ├── ...');
  lines.push('    ├── 16-cascadia.md');
  lines.push('    └── 99-uncategorized.md');
  lines.push('```');
  lines.push('');
  lines.push('## Domini lexicon (16 sigle canonical)');
  lines.push('');
  lines.push(
    'Vocabolario controllato di acronimi per le catene relazionali della piattaforma. Ogni tabella business è mappata a 1+ sigle.'
  );
  lines.push('');
  lines.push('| # | Sigla | Full | Tables | Doc |');
  lines.push('|---|---|---|---|---|');
  for (let i = 0; i < DOMAINS.length; i++) {
    const d = DOMAINS[i];
    const num = String(i + 1).padStart(2, '0');
    const slug = d.sigla.toLowerCase();
    const count = catalog.domains[i].table_count;
    lines.push(
      `| ${i + 1} | **${d.sigla}** | ${d.full} | ${count} | [\`domains/${num}-${slug}.md\`](./domains/${num}-${slug}.md) |`
    );
  }
  lines.push('');
  lines.push('## Architettura multi-tenant + RLS');
  lines.push('');
  lines.push(
    'La piattaforma è **multi-tenant** con 4 tenant: Heuresys System (platform) · RTL Bank · SmartFood · EcoNova. Pattern enforced:'
  );
  lines.push('');
  lines.push(
    '- Ogni tabella tenant-scoped ha colonna `tenant_id uuid NOT NULL REFERENCES tenants(id)`'
  );
  lines.push('- **Row-Level Security (RLS) attiva DB-level** su tabelle tenant-scoped via policy:');
  lines.push('  ```sql');
  lines.push("  USING (tenant_id = current_setting('app.current_tenant_id')::uuid)");
  lines.push('  ```');
  lines.push(
    '- Pattern app-side: `withTenant()` wrapper esegue `SET LOCAL app.current_tenant_id = ...` prima di ogni query Prisma'
  );
  lines.push('- Bypass solo per ruolo SUPERUSER via `BYPASSRLS` o `set_config` esplicito');
  lines.push('');
  lines.push(
    'Se il DBMS target **non implementa RLS**, applicare il filtering a livello applicativo: ogni SELECT/INSERT/UPDATE/DELETE deve includere `tenant_id = ?` nella WHERE.'
  );
  lines.push('');
  lines.push('## RBP — Role-Based Permissions');
  lines.push('');
  lines.push(
    '- **8 ruoli canonical**: SUPERUSER · TENANT_OWNER · IT_ADMIN · HR_DIRECTOR · HR_MANAGER · DEPT_HEAD · LINE_MANAGER · EMPLOYEE'
  );
  lines.push('- **34 functional areas** × **3 perspectives** (PET: Process / Enterprise / Talent)');
  lines.push('- Permessi data-driven via `rbp_role_permissions` (179 canonical join)');
  lines.push('');
  lines.push('Vedi [`domains/11-rbp.md`](./domains/11-rbp.md) per dettaglio.');
  lines.push('');
  lines.push('## How-to-use per agente target');
  lines.push('');
  lines.push('### Discovery programmatica');
  lines.push('');
  lines.push('Parsa `catalog.json` per ottenere struttura completa machine-readable:');
  lines.push('');
  lines.push('```js');
  lines.push("const catalog = JSON.parse(fs.readFileSync('db-export/catalog.json'));");
  lines.push(
    "// catalog.tables['employees'].columns → array di {name, type, nullable, default, ...}"
  );
  lines.push(
    "// catalog.tables['employees'].foreign_keys → array di {columns, ref_table, on_delete, ...}"
  );
  lines.push("// catalog.tables['employees'].rls_policies → array di policy DBMS-level");
  lines.push("// catalog.tables['employees'].domains → ['OPOURSKA', 'H2R']");
  lines.push('```');
  lines.push('');
  lines.push('### DDL replay (sub-set)');
  lines.push('');
  lines.push(
    '`schema.sql` contiene `pg_dump --schema-only` con esclusioni applicate. È SQL valido PostgreSQL 16 (compatibilità ≥14 testata su feature core). Per replay:'
  );
  lines.push('');
  lines.push('```bash');
  lines.push('psql -d <target_db> < schema.sql');
  lines.push('```');
  lines.push('');
  lines.push(
    'Dipendenze: estensioni `uuid-ossp`, `pgcrypto`, `vector` (pgvector). Pre-create con `CREATE EXTENSION IF NOT EXISTS ...`.'
  );
  lines.push('');
  lines.push('### Workflow consigliato');
  lines.push('');
  lines.push('1. Leggi `README.md` per overview + glossario domini');
  lines.push('2. Consulta `domains/00-index.md` per mapping sigla → tabelle');
  lines.push(
    '3. Per ogni dominio rilevante, leggi `domains/<NN>-<sigla>.md` (semantica + relazioni)'
  );
  lines.push('4. Genera mapping cross-DB partendo da `catalog.json` (programmaticamente)');
  lines.push(
    '5. Eventuale replay DDL: `schema.sql`, poi importa dati via COPY/INSERT da export riga-per-riga (NON incluso in questo bundle)'
  );
  lines.push(
    '6. Le `views.md` sono **derivate**: non importare, ricreare dopo che le tabelle sorgente sono popolate'
  );
  lines.push('');
  lines.push('### Tabelle escluse');
  lines.push('');
  lines.push(
    `${EXCLUSIONS.size} tabelle escluse: vedi [\`exclusions.md\`](./exclusions.md). Le FK che referenziavano tabelle escluse sono mantenute in \`catalog.json\` con flag \`ref_excluded: true\`. Tipico: \`users → account\` (NextAuth) — l'agente target può ridichiararle nel proprio modello auth.`
  );
  lines.push('');
  lines.push('## PostgreSQL types cheat sheet');
  lines.push('');
  lines.push('Tipi più frequenti incontrati:');
  lines.push('');
  lines.push('| PostgreSQL (udt_name) | Note |');
  lines.push('|---|---|');
  lines.push(
    '| `uuid` | Surrogate key default. Default `uuid_generate_v4()` (estensione `uuid-ossp`). |'
  );
  lines.push('| `varchar` / `text` | Stringhe. `varchar(N)` con limite, `text` illimitato. |');
  lines.push('| `int4` / `int8` | Integer 32/64-bit. |');
  lines.push('| `numeric(P,S)` | Decimale arbitrary precision (es. salari `numeric(15,2)`). |');
  lines.push('| `bool` | Boolean. |');
  lines.push('| `timestamp` / `timestamptz` | Timestamp senza/con timezone. Default `now()`. |');
  lines.push('| `date` | Solo data. |');
  lines.push('| `jsonb` | JSON binary indicizzabile (preferito su `json`). |');
  lines.push('| `_text` / `_varchar` / `_uuid` | Array (prefix `_`). |');
  lines.push('| `vector` | pgvector embedding (es. `vector(1536)` per OpenAI ada-002). |');
  lines.push(
    '| ENUM types | `career_skill_importance`, `company_size`, `crud_operation`, `permission_scope`, `rbac_role`, ... definiti in `schema.sql` `CREATE TYPE`. |'
  );
  lines.push('');
  lines.push('## Generation provenance');
  lines.push('');
  lines.push(
    `- Generato via \`db-export/generate.mjs\` (Node 20 ESM, ${Math.round(readFileSync(join(__dirname, 'generate.mjs'), 'utf8').split('\n').length)} righe)`
  );
  lines.push(
    `- Source SQL dump: \`pg_dump --schema-only --no-owner --no-privileges --schema=public heuresys_platform\` via SSH \`oracle-vm-default\``
  );
  lines.push(
    `- Metadata: 9 query JSON su \`information_schema\` + \`pg_catalog\` + \`pg_views\` + \`pg_matviews\` + \`pg_policies\``
  );
  lines.push(
    `- Enrichment: Prisma schema (\`services/app/prisma/schema.prisma\`, ${prismaModels.size} model mappati) + lexicon canonical (\`docs/_meta/lexicon.md\`, 16 sigle)`
  );
  lines.push('');
  writeFileSync(join(__dirname, 'README.md'), lines.join('\n'));
}

console.log(`\n✓ Done.`);
console.log(`  catalog.json:       ${tableMap.size} tables`);
console.log(`  schema.sql:         filtered`);
console.log(`  domains/*.md:       ${DOMAINS.length} domain files + 00-index + 99-uncategorized`);
console.log(`  README.md, exclusions.md, views.md`);
