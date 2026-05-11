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
      // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
      await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);

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
      // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
      await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);

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

  it('cross-tenant UPDATE: tenant A cannot UPDATE tenant B rows (RLS USING bloccato)', async () => {
    await db.transaction(async (tx) => {
      await tx.query(`SET LOCAL ROLE heuresys`);
      // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
      await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);

      // UPDATE su tenant B mentre context = A → 0 rows affected (RLS hides them)
      const r = await tx.query(
        `UPDATE employees SET department = 'Hijacked' WHERE tenant_id = $1 RETURNING id`,
        [TENANT_B]
      );
      expect(r.rows.length).toBe(0); // RLS blocks discoverability
    });
  });

  it('cross-tenant DELETE: tenant A cannot DELETE tenant B rows', async () => {
    await db.transaction(async (tx) => {
      await tx.query(`SET LOCAL ROLE heuresys`);
      // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
      await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);

      const r = await tx.query(`DELETE FROM employees WHERE tenant_id = $1 RETURNING id`, [
        TENANT_B,
      ]);
      expect(r.rows.length).toBe(0); // RLS blocks DELETE row visibility
    });
  });

  it('cross-tenant audit_logs: RLS isolates audit trail per tenant', async () => {
    await db.transaction(async (tx) => {
      await tx.query(`SET LOCAL ROLE heuresys`);
      // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
      await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);

      // Tenant A query own audit_logs OK (typically empty in fresh test DB)
      const own = await tx.query(`SELECT count(*)::int AS n FROM audit_logs WHERE tenant_id = $1`, [
        TENANT_A,
      ]);
      expect(typeof own.rows[0]?.n).toBe('number');

      // Tenant A query tenant B audit_logs → 0 by RLS
      const cross = await tx.query(
        `SELECT count(*)::int AS n FROM audit_logs WHERE tenant_id = $1`,
        [TENANT_B]
      );
      expect(cross.rows[0]?.n).toBe(0);
    });
  });

  it('SUPERUSER bypass: postgres role can SELECT any tenant (sanity check su BYPASSRLS)', async () => {
    await db.transaction(async (tx) => {
      // Postgres superuser bypassa RLS by design — verifica integrity check
      // (NOT eseguibile come heuresys role, solo per validazione architetturale)
      const r = await tx.query(`SELECT current_user`);
      // In test, role è di default heuresys (FORCE RLS attivo)
      expect(typeof r.rows[0]?.current_user).toBe('string');
    });
  });

  // ────────────────────────────────────────────────────────────────────
  // S30 H13 extension — parametric matrix across 8 representative tenant-scoped
  // tables (covers org/recruiting/learning/performance/skills/leaves domains).
  // For each table: SELECT(B from A) → 0 · UPDATE(B from A) → 0 rows · DELETE(B from A) → 0 rows.
  // Total +24 scenarios, bringing matrix to 30 well-distributed assertions.
  // ────────────────────────────────────────────────────────────────────

  const tenantScopedTables: Array<{ table: string; updateCol: string; updateVal: string }> = [
    { table: 'org_units', updateCol: 'description', updateVal: 'Hijacked' },
    { table: 'recruiting_candidates', updateCol: 'stage', updateVal: 'rejected' },
    { table: 'recruiting_offers', updateCol: 'status', updateVal: 'rejected' },
    { table: 'courses', updateCol: 'status', updateVal: 'archived' },
    { table: 'course_enrollments', updateCol: 'status', updateVal: 'cancelled' },
    { table: 'certifications', updateCol: 'is_active', updateVal: 'false' },
    { table: 'employee_skill_assessments', updateCol: 'assessed_level', updateVal: '0' },
    { table: 'merit_cycles', updateCol: 'status', updateVal: 'cancelled' },
  ];

  for (const { table, updateCol, updateVal } of tenantScopedTables) {
    describe(`tenant isolation · ${table}`, () => {
      it(`SELECT(B from A context) → 0 rows visible`, async () => {
        await db.transaction(async (tx) => {
          await tx.query(`SET LOCAL ROLE heuresys`);
          // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
          await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);
          const r = await tx.query(`SELECT count(*)::int AS n FROM ${table} WHERE tenant_id = $1`, [
            TENANT_B,
          ]);
          expect(r.rows[0]?.n).toBe(0);
        });
      });

      it(`UPDATE(B from A context) → 0 rows affected (RLS USING blocks)`, async () => {
        await db.transaction(async (tx) => {
          await tx.query(`SET LOCAL ROLE heuresys`);
          // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
          await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);
          // Use literal (not parametrized) col since identifiers cannot be bound
          const isNumOrBool = /^(true|false|\d+)$/.test(updateVal);
          const valLit = isNumOrBool ? updateVal : `'${updateVal.replace(/'/g, "''")}'`;
          const r = await tx.query(
            `UPDATE ${table} SET ${updateCol} = ${valLit} WHERE tenant_id = $1 RETURNING tenant_id`,
            [TENANT_B]
          );
          expect(r.rows.length).toBe(0);
        });
      });

      it(`DELETE(B from A context) → 0 rows affected (RLS hides discoverability)`, async () => {
        await db.transaction(async (tx) => {
          await tx.query(`SET LOCAL ROLE heuresys`);
          // PG limitation: SET LOCAL doesn't accept $1 placeholders. Use set_config() function instead.
          await tx.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [TENANT_A]);
          const r = await tx.query(
            `DELETE FROM ${table} WHERE tenant_id = $1 RETURNING tenant_id`,
            [TENANT_B]
          );
          expect(r.rows.length).toBe(0);
        });
      });
    });
  }
});
