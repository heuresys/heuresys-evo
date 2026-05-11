/**
 * lib/rls-tx.mjs — RLS-aware transaction wrapper (P5 enforcement)
 *
 * Wraps Prisma transactions with `SET LOCAL app.current_tenant_id = $tenantUuid`
 * so RLS policies (367 active) enforce tenant isolation DB-level.
 *
 * Mirrors pattern in `services/app/src/lib/db.ts withTenant()` and
 * `services/api-gateway/src/db/pool.ts`. Seed-side wrapper avoids importing
 * the full Prisma client to keep scripts/ standalone.
 *
 * Usage:
 *   import { withTenantTx } from '../lib/rls-tx.mjs';
 *   await withTenantTx(pool, tenantId, async (tx) => {
 *     await tx.query('INSERT INTO ...');
 *   });
 */

/**
 * @param {import('pg').Pool} pool — node-postgres pool
 * @param {string|null} tenantId — UUID tenant or NULL for platform-scope writes
 * @param {(client: import('pg').PoolClient) => Promise<T>} fn — work to run in tx
 * @returns {Promise<T>}
 */
export async function withTenantTx(pool, tenantId, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (tenantId !== null && tenantId !== undefined) {
      // SET LOCAL is tx-scoped; rolls back automatically on COMMIT/ROLLBACK.
      await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);
    } else {
      // Platform-scope writes (e.g. industry_classifications catalog): clear GUC.
      await client.query("SELECT set_config('app.current_tenant_id', '', true)");
    }
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get tenant UUID by code (rtl-bank, smartfood, econova, heuresys, ...).
 * @param {import('pg').Pool} pool
 * @param {string} code
 * @returns {Promise<string>} UUID
 */
export async function getTenantIdByCode(pool, code) {
  const { rows } = await pool.query('SELECT id FROM tenants WHERE code = $1 LIMIT 1', [code]);
  if (rows.length === 0) {
    throw new Error(`tenant code not found: ${code}`);
  }
  return rows[0].id;
}
