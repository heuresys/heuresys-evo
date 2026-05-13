#!/usr/bin/env node
/**
 * cascadia/verify-area.mjs — 25-area SQL verification queries CASCADIA.
 *
 * Uso:
 *   node scripts/seed-generator/cascadia/verify-area.mjs --area=<name>
 *   node scripts/seed-generator/cascadia/verify-area.mjs --all
 *
 * Esegue counts per tabella critica per ogni tenant + classificazione 🟢/🟡/🔴.
 *
 * Aree (mappa coerente con audit Stage 1 + CLAUDE.md 16 sigle):
 *   org_structure · workforce · skill_assessment · performance_goals
 *   career_succession · compensation · engagement · knowledge_graph
 *   process_governance · data_governance · talent_pools · internal_mobility
 *   time_off · recruiting · onboarding · italian_labor · rbp
 *   dashboard_config · competency · notifications · compensation_planning
 *   feedback · learning_recommendations · analytics · checkins
 */

import { Pool } from 'pg';

const TENANT_IDS = {
  'rtl-bank': '0c54b84a-db6e-4da4-bc91-af5d480d524e',
  smartfood: '1d7bf448-ceac-4215-917d-45ff13678104',
  econova: 'fb1e866c-e90a-4e25-a146-f68d660a0be8',
  heuresys: 'd5855519-3ed1-4427-865f-fe75f1e42c4c',
};

const AREAS = {
  org_structure: { tables: ['org_units', 'job_templates'], threshold: 5 },
  workforce: { tables: ['employees'], threshold: 4 },
  skill_assessment: { tables: ['employee_skill_assessments'], threshold: 10 },
  performance_goals: { tables: ['performance_reviews', 'goals'], threshold: 5 },
  career_succession: { tables: ['succession_candidates', 'succession_plans'], threshold: 3 },
  compensation: { tables: ['salary_bands', 'salary_history'], threshold: 5 },
  engagement: { tables: ['engagement_surveys'], threshold: 1 },
  knowledge_graph: { tables: ['kg_nodes', 'kg_edges'], threshold: 10 },
  process_governance: { tables: ['business_processes'], threshold: 5 },
  data_governance: { tables: ['audit_logs', 'notifications'], threshold: 3 },
  talent_pools: { tables: ['talent_pools'], threshold: 1 },
  internal_mobility: { tables: ['internal_mobility_postings'], threshold: 1 },
  time_off: { tables: ['employee_time_off_requests'], threshold: 1 },
  recruiting: { tables: ['recruiting_candidates'], threshold: 5 },
  onboarding: { tables: ['onboarding_instances'], threshold: 1 },
  italian_labor: {
    tables: ['ccnl_contracts', 'sindacati', 'holiday_calendars_it'],
    threshold: 1,
    global: true,
  },
  rbp: {
    tables: ['rbp_roles', 'rbp_functional_areas', 'rbp_role_permissions'],
    threshold: 1,
    global: true,
  },
  dashboard_config: { tables: ['dashboard_elements', 'dashboard_presets'], threshold: 5 },
  competency: { tables: ['competencies'], threshold: 1 },
  notifications: { tables: ['notifications'], threshold: 1 },
  compensation_planning: { tables: ['salary_band_assignments'], threshold: 1 },
  feedback: { tables: ['continuous_feedback'], threshold: 1 },
  learning_recommendations: { tables: ['learning_recommendations'], threshold: 1 },
  analytics: { tables: ['workforce_plan_scenarios'], threshold: 1 },
  checkins: { tables: ['check_ins'], threshold: 1 },
};

function parseArgs(argv) {
  const out = { area: null, all: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--area=')) out.area = a.slice(7);
    else if (a === '--area') out.area = argv[++i];
    else if (a === '--all') out.all = true;
  }
  return out;
}

async function tableExists(pool, table) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1`,
    [table]
  );
  return rows.length > 0;
}

async function countPerTenant(pool, table, isGlobal) {
  if (!(await tableExists(pool, table))) {
    return { missing: true, counts: {} };
  }
  if (isGlobal) {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
    return { counts: { global: rows[0].n }, missing: false };
  }
  const out = {};
  for (const [code, id] of Object.entries(TENANT_IDS)) {
    try {
      const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS n FROM ${table} WHERE tenant_id = $1`,
        [id]
      );
      out[code] = rows[0].n;
    } catch (e) {
      out[code] = `err: ${e.code ?? e.message}`;
    }
  }
  return { counts: out, missing: false };
}

function classify(counts, threshold, isGlobal) {
  if (isGlobal) {
    const n = counts.global;
    return n >= threshold ? '🟢' : n > 0 ? '🟡' : '🔴';
  }
  const values = Object.values(counts).filter((v) => typeof v === 'number');
  const tenantsAbove = values.filter((v) => v >= threshold).length;
  if (tenantsAbove >= 3) return '🟢';
  if (tenantsAbove >= 1 || values.some((v) => v > 0)) return '🟡';
  return '🔴';
}

async function checkArea(pool, areaName, spec) {
  const out = { area: areaName, threshold: spec.threshold, tables: [] };
  let worst = '🟢';
  for (const t of spec.tables) {
    const { counts, missing } = await countPerTenant(pool, t, !!spec.global);
    let status;
    if (missing) {
      status = '⛔ table missing';
      worst = '🔴';
    } else {
      status = classify(counts, spec.threshold, !!spec.global);
      if (status === '🔴' && worst !== '🔴') worst = '🔴';
      else if (status === '🟡' && worst === '🟢') worst = '🟡';
    }
    out.tables.push({ table: t, counts, status });
  }
  out.classification = worst;
  return out;
}

function printResult(result) {
  const isGlobal = result.tables[0]?.counts && 'global' in (result.tables[0]?.counts ?? {});
  const header = isGlobal
    ? `${result.classification} ${result.area} (global, threshold=${result.threshold})`
    : `${result.classification} ${result.area} (threshold=${result.threshold})`;
  console.log(`\n${header}`);
  for (const t of result.tables) {
    if (t.status.startsWith('⛔')) {
      console.log(`  ${t.status} ${t.table}`);
      continue;
    }
    if ('global' in t.counts) {
      console.log(`  ${t.status} ${t.table}: ${t.counts.global}`);
    } else {
      const parts = Object.entries(t.counts)
        .map(([k, v]) => `${k}=${v}`)
        .join(' · ');
      console.log(`  ${t.status} ${t.table}: ${parts}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.area && !args.all) {
    console.error('Usage: --area=<name> | --all');
    console.error(`Known areas: ${Object.keys(AREAS).join(', ')}`);
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL must be set');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const areasToCheck = args.all ? Object.keys(AREAS) : [args.area];
  if (!args.all && !AREAS[args.area]) {
    console.error(`Unknown area: ${args.area}`);
    console.error(`Known: ${Object.keys(AREAS).join(', ')}`);
    process.exit(1);
  }

  const results = [];
  for (const a of areasToCheck) {
    const r = await checkArea(pool, a, AREAS[a]);
    results.push(r);
    printResult(r);
  }

  const summary = {
    green: results.filter((r) => r.classification === '🟢').length,
    yellow: results.filter((r) => r.classification === '🟡').length,
    red: results.filter((r) => r.classification === '🔴').length,
  };
  console.log(
    `\nSUMMARY: 🟢 ${summary.green} · 🟡 ${summary.yellow} · 🔴 ${summary.red} (total ${results.length})`
  );

  await pool.end();
  process.exit(summary.red > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('[verify-area] FATAL:', e?.stack ?? e);
  process.exit(99);
});
