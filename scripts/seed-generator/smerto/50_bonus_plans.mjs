/**
 * smerto/50_bonus_plans.mjs — Stage 2f SMERTO bonus_plans non-RTL.
 *
 * EcoNova (0 → 3) + Heuresys (0 → 1). RTL Bank + SmartFood skipped (già 5+5).
 * Bonus_type + calculation_method coerenti con NACE tenant + CCNL reference.
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { mulberry32, seedFromString, uniformInt } from '../lib/distributions.mjs';

const PLANS_BY_TENANT = {
  econova: [
    {
      name: 'Performance Bonus 2026 — Energy Transition Targets',
      bonus_type: 'annual',
      description:
        'Bonus annuale legato ai target di efficienza energetica + safety KPI. Eligible per tutto il personale full-time post-probation.',
      calculation_method: 'percentage',
      total_budget: 180000,
      payout_quarter: 'Q1_2027',
    },
    {
      name: 'Project Completion Bonus — Solar Farm Lombardia',
      bonus_type: 'spot',
      description:
        'Bonus one-shot per completion progetto Solar Farm Lombardia entro target date. Eligible team progetto + engineering support.',
      calculation_method: 'fixed',
      total_budget: 75000,
      payout_quarter: 'Q3_2026',
    },
    {
      name: 'Retention Bonus 2026 — Senior Engineers',
      bonus_type: 'retention',
      description:
        'Bonus retention 18-month vesting per senior engineers in renewable & green-tech roles. Mitigation talent flight high-demand segment.',
      calculation_method: 'fixed',
      total_budget: 120000,
      payout_quarter: 'Q4_2026',
    },
  ],
  heuresys: [
    {
      name: 'Platform Performance Bonus 2026',
      bonus_type: 'annual',
      description:
        'Bonus annuale legato a OKR raggiunti + uptime SLA piattaforma. Eligible platform team + senior platform engineers.',
      calculation_method: 'percentage',
      total_budget: 60000,
      payout_quarter: 'Q1_2027',
    },
  ],
};

export async function runStage({ tenant, dryRun }) {
  console.log(`[smerto/50_bonus_plans] tenant=${tenant} dryRun=${dryRun}`);
  const plans = PLANS_BY_TENANT[tenant];
  if (!plans) {
    console.log('[smerto/50] no plans defined for tenant — skip');
    return { inserted: 0 };
  }
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would insert ${plans.length} bonus_plans`);
    return { inserted: 0, skipped: plans.length, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Existing dedupe by name
  const { rows: existingRows } = await pool.query(
    `SELECT name FROM bonus_plans WHERE tenant_id=$1`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => r.name));
  const rng = mulberry32(seedFromString(`smerto-${tenant}`));
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const yearEnd = new Date(today.getFullYear(), 11, 31);

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const p of plans) {
      if (existing.has(p.name)) {
        console.log(`  skip dup: ${p.name}`);
        continue;
      }
      await client.query(
        `INSERT INTO bonus_plans
          (tenant_id, name, description, bonus_type, period_start, period_end, payout_date,
           total_budget, allocated_amount, calculation_method, eligibility_rules,
           performance_multipliers, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')`,
        [
          tenantId,
          p.name,
          p.description,
          p.bonus_type,
          yearStart.toISOString().slice(0, 10),
          yearEnd.toISOString().slice(0, 10),
          new Date(
            today.getFullYear() + (p.payout_quarter.includes('2027') ? 1 : 0),
            uniformInt(rng, 0, 11),
            15
          )
            .toISOString()
            .slice(0, 10),
          p.total_budget,
          0,
          p.calculation_method,
          JSON.stringify({ employment_type: 'full_time', min_tenure_months: 6 }),
          JSON.stringify({ excellent: 1.5, exceeds: 1.2, meets: 1.0, below: 0.5 }),
        ]
      );
      inserted++;
    }
  });
  console.log(`[smerto/50] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
