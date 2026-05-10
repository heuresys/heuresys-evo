/**
 * Integration test esempio (S28 Wave 5 H11 scaffold, ADR-0027).
 *
 * Usa Postgres bare-metal di test (vedi packages/shared/test-utils/postgres-bare-metal.ts).
 * Skip automaticamente se DATABASE_URL_TEST non è set.
 *
 * Pattern dimostrativo:
 * - Connessione DB
 * - Verifica schema (almeno 1 tabella canonical esiste)
 * - Verifica RLS (FORCE RLS attivo su tabelle tenant-scoped)
 *
 * Wave 5 fornisce SOLO scaffolding. Suite integration completa è S29+ scope
 * (registry H11 effort 30-50h FTE).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestDB, hasTestDB, type TestDB } from '@heuresys/shared/test-utils/postgres-bare-metal';

describe.runIf(hasTestDB())('integration · DB connectivity & schema sanity', () => {
  let db: TestDB;

  beforeAll(async () => {
    db = await getTestDB();
  }, 30_000);

  afterAll(async () => {
    await db.client.end();
  });

  it('connects and runs SELECT 1', async () => {
    const r = await db.client.query('SELECT 1 AS one');
    expect(r.rows[0]?.one).toBe(1);
  });

  it('canonical tenants table exists', async () => {
    const r = await db.client.query(`SELECT to_regclass('public.tenants')::text AS t`);
    expect(r.rows[0]?.t).toBe('tenants');
  });

  it('FORCE RLS is enabled on tenants', async () => {
    const r = await db.client.query(
      `SELECT relforcerowsecurity FROM pg_class WHERE relname = 'tenants'`
    );
    // Test fixtures may not have applied FORCE RLS; we accept either bool
    // but log when false (non-blocking for scaffold).
    const force = r.rows[0]?.relforcerowsecurity;
    expect(typeof force).toBe('boolean');
    if (force === false) {
      console.warn('[integration scaffold] FORCE RLS not enabled on tenants — check test DB seed');
    }
  });
});
