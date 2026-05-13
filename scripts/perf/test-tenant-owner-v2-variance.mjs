#!/usr/bin/env node
/**
 * Test cross-tenant variance for tenant_owner_overview_v2 KPIs post phase18p migration.
 * P11 verification: numbers must DIFFER across tenants (not constant hardcoded).
 */
import pg from 'pg';

const { Pool } = pg;
const TENANTS = {
  'RTL Bank': '0c54b84a-db6e-4da4-bc91-af5d480d524e',
  SmartFood: '1d7bf448-ceac-4215-917d-45ff13678104',
  EcoNova: 'fb1e866c-e90a-4e25-a146-f68d660a0be8',
  Heuresys: 'd5855519-3ed1-4427-865f-fe75f1e42c4c',
};

const QUERIES = {
  headcount: `SELECT COUNT(*)::int AS value FROM employees WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND deleted_at IS NULL AND is_active = true`,
  performance: `SELECT CASE WHEN AVG(overall_rating) IS NULL THEN NULL ELSE ROUND(AVG(overall_rating) / 5.0 * 100)::int END AS value FROM performance_reviews WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND overall_rating IS NOT NULL`,
  retention: `
    WITH terminations AS (SELECT COUNT(*)::float AS n FROM employees WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND termination_date IS NOT NULL AND termination_date >= (CURRENT_DATE - INTERVAL '12 months')),
         headcount AS (SELECT COUNT(*)::float AS n FROM employees WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND deleted_at IS NULL)
    SELECT CASE WHEN headcount.n = 0 THEN NULL ELSE ROUND((1 - terminations.n / headcount.n) * 100)::int END AS value FROM terminations, headcount`,
  avg_salary: `SELECT ROUND(AVG(sba.current_salary) / 1000)::int AS value FROM salary_band_assignments sba JOIN employees e ON e.id = sba.employee_id WHERE e.tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND e.deleted_at IS NULL`,
  bonus_pool: `SELECT ROUND(SUM(total_budget) / 1000)::int AS value FROM bonus_plans WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid AND status = 'active'`,
};

async function main() {
  const url = process.env.DATABASE_URL?.replace(/\?.*$/, '');
  if (!url) throw new Error('DATABASE_URL not set');
  const pool = new Pool({ connectionString: url });

  const results = {};
  for (const [name, tid] of Object.entries(TENANTS)) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [tid]);
      const row = {};
      for (const [key, sql] of Object.entries(QUERIES)) {
        const r = await client.query(sql);
        row[key] = r.rows[0]?.value ?? null;
      }
      await client.query('COMMIT');
      results[name] = row;
    } finally {
      client.release();
    }
  }

  console.table(results);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
