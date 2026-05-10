/**
 * Bare-metal Postgres test helper (S28 Wave 5 H11, ADR-0027).
 *
 * Replaces the testcontainers-node strategy of ADR-0002 (Superseded).
 * Coerente con ADR-0001 (no Docker in repo) e ADR-0023 (bare-metal SoT):
 * test integration usano un Postgres bare-metal locale o di CI installato
 * via apt, NON un container ephemeral.
 *
 * USAGE in integration test:
 *
 *   import { describe, beforeAll, afterAll } from 'vitest';
 *   import { getTestDB, hasTestDB } from '@heuresys/shared/test-utils/postgres-bare-metal';
 *
 *   describe.runIf(hasTestDB())('my integration suite', () => {
 *     let db: Awaited<ReturnType<typeof getTestDB>>;
 *     beforeAll(async () => { db = await getTestDB(); });
 *     afterAll(async () => { await db.client.end(); });
 *
 *     it('does the thing', async () => {
 *       await db.transaction(async (tx) => {
 *         await tx.query('INSERT INTO ...');
 *         // ROLLBACK at end of transaction → suite isolation
 *       });
 *     });
 *   });
 *
 * Setup prerequisiti (locale o CI):
 *   - Postgres 16 + pgvector installed bare-metal (vedi db/scripts/setup-local.sh
 *     o setup-vm.sh); CI in .github/workflows/quality.yml installa via apt.
 *   - Env DATABASE_URL_TEST set to test DB connection string
 *     (default fallback: postgresql://heuresys:heuresys@localhost:5432/heuresys_test)
 *
 * Test isolation pattern:
 *   - Default: transaction-per-test (BEGIN start, ROLLBACK end di ogni test)
 *   - Alternative: tenant-namespace partitioning (ogni suite usa tenant_id distinto)
 */
import { Client, type ClientConfig } from 'pg';

const DEFAULT_TEST_URL = 'postgresql://heuresys:heuresys@localhost:5432/heuresys_test';

export function hasTestDB(): boolean {
  // Conditional skip helper: returns true se ENV DATABASE_URL_TEST è set.
  // In CI è sempre set (vedi quality.yml). In dev locale opt-in.
  return Boolean(process.env.DATABASE_URL_TEST);
}

export interface TestDB {
  client: Client;
  url: string;
  /**
   * Run `fn` inside BEGIN/ROLLBACK so any DML is reverted at end. Errors are
   * propagated after rollback to surface test failures.
   */
  transaction<T>(fn: (client: Client) => Promise<T>): Promise<T>;
}

/**
 * Connect to the test DB. Throws if DATABASE_URL_TEST is missing —
 * always pair with `describe.runIf(hasTestDB())` to skip gracefully when
 * the integration env is not available (e.g. dev locale without Postgres).
 */
export async function getTestDB(config: ClientConfig = {}): Promise<TestDB> {
  const url = process.env.DATABASE_URL_TEST ?? DEFAULT_TEST_URL;
  if (!hasTestDB()) {
    throw new Error(
      'getTestDB(): DATABASE_URL_TEST not set. Use describe.runIf(hasTestDB()) to skip.'
    );
  }
  const client = new Client({ connectionString: url, ...config });
  await client.connect();

  return {
    client,
    url,
    async transaction<T>(fn: (c: Client) => Promise<T>): Promise<T> {
      await client.query('BEGIN');
      try {
        const result = await fn(client);
        await client.query('ROLLBACK');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    },
  };
}

/**
 * Helper per impostare il GUC `app.current_tenant_id` (RLS context).
 * Coerente con `services/app/src/lib/db.ts` withTenant() pattern.
 */
export async function withTenantContext(
  client: Client,
  tenantId: string,
  fn: () => Promise<void>
): Promise<void> {
  await client.query(`SET LOCAL app.current_tenant_id = $1`, [tenantId]);
  await fn();
}
