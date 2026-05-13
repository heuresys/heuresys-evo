/**
 * talpipe/27_workforce_scenarios.mjs — Stage 3 workforce_plan_scenarios cross-tenant.
 *
 * SmartFood (0 → 5) + EcoNova (0 → 5) + Heuresys (0 → 1). RTL Bank già 9.
 * Linka ai workforce_plans esistenti per tenant. Scenario_type: base/optimistic/pessimistic.
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { mulberry32, seedFromString, uniformInt, pickOne } from '../lib/distributions.mjs';

const TARGETS = {
  smartfood: 5,
  econova: 5,
  heuresys: 1,
  'rtl-bank': 0, // already saturated
};

const SCENARIO_TEMPLATES = [
  {
    type: 'base',
    name_suffix: 'Base Case',
    description: 'Scenario base — proiezione su assunzioni di mercato neutrali, no shock esogeni.',
  },
  {
    type: 'optimistic',
    name_suffix: 'Optimistic Growth',
    description:
      'Scenario crescita aggressiva — mercato favorevole + expansion geografica + nuovi prodotti.',
  },
  {
    type: 'pessimistic',
    name_suffix: 'Downturn Resilience',
    description:
      'Scenario downturn — contrazione mercato + cost reduction + hiring freeze selettivo.',
  },
  {
    type: 'merger',
    name_suffix: 'M&A Integration',
    description:
      'Scenario M&A — integrazione acquisizione + consolidamento ruoli + sinergie operative.',
  },
  {
    type: 'tech_transition',
    name_suffix: 'Tech & Skills Transition',
    description:
      'Scenario shift competenze digitali — upskilling massivo + ESCO emerging skills + automation.',
  },
];

export async function runStage({ tenant, dryRun }) {
  console.log(`[talpipe/27_workforce_scenarios] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 0;
  if (target === 0) {
    console.log('[talpipe/27] target=0 — skip');
    return { inserted: 0 };
  }
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would insert ${target} scenarios`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Pull workforce_plans for tenant
  const { rows: plans } = await pool.query(
    `SELECT id, name FROM workforce_plans WHERE tenant_id=$1 ORDER BY created_at DESC`,
    [tenantId]
  );
  if (plans.length === 0) {
    console.log('[talpipe/27] no workforce_plans found — skip');
    await pool.end();
    return { inserted: 0 };
  }
  console.log(`[talpipe/27] ${plans.length} workforce_plans available`);

  // Existing scenarios dedupe by name
  const { rows: existingRows } = await pool.query(
    `SELECT name FROM workforce_plan_scenarios WHERE tenant_id=$1`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => r.name));

  const rng = mulberry32(seedFromString(`talpipe-wps-${tenant}`));
  const today = new Date();
  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    let count = 0;
    for (const tmpl of SCENARIO_TEMPLATES) {
      if (count >= target) break;
      const plan = pickOne(rng, plans);
      const name = `${plan.name} — ${tmpl.name_suffix}`;
      if (existing.has(name)) {
        console.log(`  skip dup: ${name}`);
        continue;
      }
      const targetMonths = uniformInt(rng, 6, 24);
      const targetDate = new Date(today.getTime() + targetMonths * 30 * 86400000);

      await client.query(
        `INSERT INTO workforce_plan_scenarios
          (tenant_id, workforce_plan_id, name, description, scenario_type,
           assumptions, target_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')`,
        [
          tenantId,
          plan.id,
          name,
          tmpl.description,
          tmpl.type,
          JSON.stringify({
            growth_rate_pct: tmpl.type === 'optimistic' ? 12 : tmpl.type === 'pessimistic' ? -5 : 3,
            hiring_velocity_factor:
              tmpl.type === 'optimistic' ? 1.3 : tmpl.type === 'pessimistic' ? 0.6 : 1.0,
            attrition_assumption_pct: tmpl.type === 'pessimistic' ? 18 : 11,
            timeframe_months: targetMonths,
          }),
          targetDate.toISOString().slice(0, 10),
        ]
      );
      inserted++;
      count++;
    }
  });
  console.log(`[talpipe/27] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
