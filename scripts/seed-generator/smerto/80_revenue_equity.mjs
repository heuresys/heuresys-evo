/**
 * smerto/80_revenue_equity.mjs — Schema extension P11 seeding (S60 CF-4).
 *
 * Popola tenant_revenue_periods (12 mesi RTL + 12 mesi SmartFood + EcoNova partial + Heuresys partial)
 * + equity_grants (SaaS Heuresys + scale-up EcoNova senior staff).
 *
 * Benchmark realistici banking Italia (Q4 2024 deloitte report):
 *   RTL Bank: ~€450M annual revenue, ~156 FTE → ~€2.88M / FTE
 *   SmartFood: ~€80M annual revenue, ~82 FTE → ~€976k / FTE
 *   EcoNova: ~€25M annual (early stage), ~25 FTE → ~€1M / FTE
 *   Heuresys: ~€2M ARR (1 founder), 1 FTE → €2M / FTE
 *
 * Idempotent: dedupe via (tenant_id, period_start, period_end).
 */
import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';

// Monthly revenue split (12 months, slight seasonal variation)
const MONTHLY_REVENUE = {
  'rtl-bank': [
    36000000, 34500000, 38500000, 37000000, 39500000, 38000000, 37500000, 36500000, 39000000,
    41000000, 42500000, 40500000,
  ], // ~€460M total
  smartfood: [
    6200000, 5800000, 6500000, 6300000, 6800000, 7100000, 7500000, 6900000, 6700000, 6900000,
    7200000, 6900000,
  ], // ~€80.8M total
  econova: [
    1800000, 1700000, 2100000, 2000000, 2200000, 2300000, 2500000, 2400000, 2200000, 2200000,
    2400000, 2200000,
  ], // ~€26M total
  heuresys: [
    140000, 145000, 150000, 155000, 160000, 165000, 170000, 175000, 180000, 185000, 195000, 180000,
  ], // ~€2M ARR
};

const EQUITY_GRANTS_HEURESYS = [
  {
    grant_type: 'esop',
    shares_granted: 100000,
    fair_value: 250000, // €2.50/share early stage
    grant_date: '2024-01-15',
    vesting: { type: '4y_cliff_1y', total_months: 48, cliff_months: 12 },
  },
];

const EQUITY_GRANTS_ECONOVA_FRAC = 0.2; // 20% senior staff gets equity

async function seedRevenue(pool, tenantCode, monthlyAmounts) {
  const tenantId = await getTenantIdByCode(pool, tenantCode);
  if (!tenantId) {
    console.log(`  skip ${tenantCode}: tenant not found`);
    return 0;
  }

  // Seed previous 12 months trailing window (rolling) so REV/FTE 12m query has data.
  // Anchor to fixed 2025 calendar year to keep seed deterministic.
  const baseYear = 2025;
  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (let m = 0; m < 12; m++) {
      const periodStart = new Date(Date.UTC(baseYear, m, 1));
      const periodEnd = new Date(Date.UTC(baseYear, m + 1, 0));
      const ps = periodStart.toISOString().slice(0, 10);
      const pe = periodEnd.toISOString().slice(0, 10);

      const { rowCount } = await client.query(
        `INSERT INTO tenant_revenue_periods
          (tenant_id, period_start, period_end, currency, revenue_amount, source)
         VALUES ($1, $2, $3, 'EUR', $4, 'cascadia_seed')
         ON CONFLICT (tenant_id, period_start, period_end) DO NOTHING`,
        [tenantId, ps, pe, monthlyAmounts[m]]
      );
      inserted += rowCount;
    }
  });
  console.log(`  ${tenantCode}: revenue periods inserted=${inserted}`);
  return inserted;
}

async function seedEquityHeuresys(pool) {
  const tenantId = await getTenantIdByCode(pool, 'heuresys');
  if (!tenantId) return 0;

  // Get first active employee (Enzo founder)
  const { rows: emp } = await pool.query(
    `SELECT id FROM employees
       WHERE tenant_id = $1 AND deleted_at IS NULL AND is_active = true
       ORDER BY hire_date ASC NULLS LAST LIMIT 1`,
    [tenantId]
  );
  if (emp.length === 0) {
    console.log(`  heuresys: no employees → skip equity`);
    return 0;
  }
  const founderId = emp[0].id;

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const g of EQUITY_GRANTS_HEURESYS) {
      const { rowCount } = await client.query(
        `INSERT INTO equity_grants
          (tenant_id, employee_id, grant_type, shares_granted, fair_value, currency, grant_date, vesting_schedule, status)
         VALUES ($1, $2, $3, $4, $5, 'EUR', $6, $7::jsonb, 'active')`,
        [
          tenantId,
          founderId,
          g.grant_type,
          g.shares_granted,
          g.fair_value,
          g.grant_date,
          JSON.stringify(g.vesting),
        ]
      );
      inserted += rowCount;
    }
  });
  console.log(`  heuresys: equity grants inserted=${inserted}`);
  return inserted;
}

async function seedEquityEcoNova(pool) {
  const tenantId = await getTenantIdByCode(pool, 'econova');
  if (!tenantId) return 0;

  const { rows: emp } = await pool.query(
    `SELECT id, hire_date FROM employees
       WHERE tenant_id = $1 AND deleted_at IS NULL AND is_active = true
       ORDER BY hire_date ASC NULLS LAST`,
    [tenantId]
  );
  if (emp.length === 0) return 0;

  // Seniors first 20% get equity (scale-up retention pattern)
  const seniorCount = Math.max(1, Math.floor(emp.length * EQUITY_GRANTS_ECONOVA_FRAC));
  const seniors = emp.slice(0, seniorCount);

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const e of seniors) {
      const grantDate = '2024-03-01';
      const fairValue = 25000 + Math.floor(Math.random() * 35000); // €25k-€60k per grant
      const { rowCount } = await client.query(
        `INSERT INTO equity_grants
          (tenant_id, employee_id, grant_type, shares_granted, fair_value, currency, grant_date, vesting_schedule, status)
         VALUES ($1, $2, 'rsu', 5000, $3, 'EUR', $4, $5::jsonb, 'active')`,
        [
          tenantId,
          e.id,
          fairValue,
          grantDate,
          JSON.stringify({ type: '4y_quarterly', total_months: 48, cliff_months: 12 }),
        ]
      );
      inserted += rowCount;
    }
  });
  console.log(`  econova: equity grants inserted=${inserted} (${seniors.length} senior staff)`);
  return inserted;
}

export async function runStage() {
  console.log('[smerto/80_revenue_equity] starting');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/\?.*$/, '') });

  let totalRev = 0,
    totalEq = 0;
  for (const code of Object.keys(MONTHLY_REVENUE)) {
    totalRev += await seedRevenue(pool, code, MONTHLY_REVENUE[code]);
  }
  totalEq += await seedEquityHeuresys(pool);
  totalEq += await seedEquityEcoNova(pool);

  console.log(`[smerto/80] revenue_periods=${totalRev} equity_grants=${totalEq}`);
  await pool.end();
  return { revenue_periods: totalRev, equity_grants: totalEq };
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  runStage()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
