/**
 * RLS cross-tenant isolation security test (S28 Wave 5 H13 scaffold, ADR-0027).
 *
 * Verifica che un attacker con JWT di tenant A NON possa leggere/modificare
 * dati di tenant B, anche bypassando i WHERE clauses applicativi (RLS DB-level
 * deve fermare l'accesso).
 *
 * Skip automaticamente se DATABASE_URL_TEST non è set.
 *
 * Wave 5 fornisce 1 scenario base (cross-tenant SELECT bloccata). Suite
 * security completa (CRUD + UPDATE + DELETE cross-tenant + JWT attack via
 * supertest contro Express server live) è S29+ scope (registry H13 effort
 * 16-30h FTE).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestDB, hasTestDB, type TestDB } from '@heuresys/shared/test-utils/postgres-bare-metal';

const TENANT_A = '00000000-0000-0000-0000-000000000aaa';
const TENANT_B = '00000000-0000-0000-0000-000000000bbb';

describe.runIf(hasTestDB())('security · RLS cross-tenant isolation', () => {
  let db: TestDB;

  beforeAll(async () => {
    db = await getTestDB();
  }, 30_000);

  afterAll(async () => {
    await db.client.end();
  });

  it('SET LOCAL app.current_tenant_id = A → cannot SELECT rows of tenant B', async () => {
    await db.transaction(async (tx) => {
      // Set role to non-superuser (RLS not bypassed)
      await tx.query(`SET LOCAL ROLE heuresys`);
      await tx.query(`SET LOCAL app.current_tenant_id = $1`, [TENANT_A]);

      // Tenta una SELECT su qualunque tabella tenant-scoped (employees ha tenant_id)
      // RLS policy deve filtrare automaticamente su current_tenant_id.
      const r = await tx.query(`SELECT count(*)::int AS n FROM employees WHERE tenant_id = $1`, [
        TENANT_B,
      ]);
      // Even if test DB has rows for tenant B, RLS dovrebbe restituire 0
      // perché current_tenant_id = A.
      expect(r.rows[0]?.n).toBe(0);
    });
  });

  it('cross-tenant INSERT bloccata da WITH CHECK clause RLS', async () => {
    await db.transaction(async (tx) => {
      await tx.query(`SET LOCAL ROLE heuresys`);
      await tx.query(`SET LOCAL app.current_tenant_id = $1`, [TENANT_A]);

      // INSERT con tenant_id = B, mentre context = A → WITH CHECK fail
      let threw = false;
      try {
        await tx.query(
          `INSERT INTO employees (id, tenant_id, first_name, last_name, email, employment_status, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, 'Test', 'AttackerCross', 'attacker@x.test', 'active', now(), now())`,
          [TENANT_B]
        );
      } catch (err) {
        threw = true;
        // Expected: RLS policy violation OR FK violation OR check constraint
        const msg = err instanceof Error ? err.message : String(err);
        expect(msg).toMatch(/policy|row[- ]level|tenant|permission|denied/i);
      }
      // ROLLBACK happens automatically via db.transaction wrapper
      expect(threw).toBe(true);
    });
  });
});
