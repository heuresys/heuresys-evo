#!/usr/bin/env node
/**
 * Test REV/FTE + EQUITY + TOTAL TC live queries post-phase18u (S60 CF-4).
 */
import pg from 'pg';
const { Pool } = pg;
const TENANTS = {
  'RTL Bank': '0c54b84a-db6e-4da4-bc91-af5d480d524e',
  SmartFood: '1d7bf448-ceac-4215-917d-45ff13678104',
  EcoNova: 'fb1e866c-e90a-4e25-a146-f68d660a0be8',
  Heuresys: 'd5855519-3ed1-4427-865f-fe75f1e42c4c',
};

async function main() {
  const url = process.env.DATABASE_URL?.replace(/\?.*$/, '');
  if (!url) throw new Error('DATABASE_URL not set');
  const pool = new Pool({ connectionString: url });
  const results = {};
  for (const [name, tid] of Object.entries(TENANTS)) {
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      await c.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [tid]);
      const rev = await c.query(
        `
        WITH r AS (
          SELECT SUM(revenue_amount)::float AS total
          FROM tenant_revenue_periods
          WHERE tenant_id = $1 AND period_end >= (CURRENT_DATE - INTERVAL '12 months')
        ), h AS (
          SELECT COUNT(*)::float AS n FROM employees
          WHERE tenant_id = $1 AND deleted_at IS NULL AND is_active = true
        )
        SELECT CASE WHEN h.n = 0 OR r.total IS NULL THEN NULL
          ELSE ROUND(r.total / h.n / 1000)::int END AS v
        FROM r, h
      `,
        [tid]
      );
      const eq = await c.query(
        `SELECT ROUND(SUM(fair_value)/1000)::int v FROM equity_grants WHERE tenant_id=$1 AND status='active'`,
        [tid]
      );
      const tc = await c.query(
        `SELECT ROUND((base_payroll_eur+bonus_pool_eur+equity_active_eur)/100000)/10.0 v FROM total_compensation_tenant_aggregated WHERE tenant_id=$1`,
        [tid]
      );
      await c.query('COMMIT');
      results[name] = {
        rev_per_fte_k: rev.rows[0]?.v,
        equity_k: eq.rows[0]?.v,
        total_tc_M: tc.rows[0]?.v,
      };
    } finally {
      c.release();
    }
  }
  console.table(results);
  await pool.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
