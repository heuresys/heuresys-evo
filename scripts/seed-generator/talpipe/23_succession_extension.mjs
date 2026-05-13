/**
 * talpipe/23_succession_extension.mjs — Stage 1a TALPIPE RTL Bank succession extension.
 *
 * Carica `_research_cache/<tenant>_succession_candidates_generated.json` (prodotto da
 * Claude main loop reasoning con grounding ESCO + performance reviews + existing employees)
 * → valida via zod → INSERT in succession_candidates con RLS-aware tx + dry-run support.
 *
 * Idempotency: skip se candidate (critical_role_id, candidate_employee_id) gia esiste.
 */

import { Pool } from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { SuccessionCandidateSchema, validateBatch } from '../lib/zod-schemas.mjs';
import { dryRunBatchInsert, isDryRun } from '../lib/dry-run.mjs';

const CACHE_DIR = 'db/seeds/realistic/_research_cache';

function tenantFileStem(tenantCode) {
  if (tenantCode === 'heuresys-system') return 'heuresys';
  return tenantCode.replace(/-/g, '_');
}

export async function runStage({ tenant, dryRun, engine }) {
  console.log(
    `[talpipe/23_succession_extension] tenant=${tenant} dryRun=${dryRun} engine=${engine}`
  );

  const stem = tenantFileStem(tenant);
  const candidatesPath = path.join(CACHE_DIR, `${stem}_succession_candidates_generated.json`);

  let raw;
  try {
    raw = JSON.parse(await fs.readFile(candidatesPath, 'utf-8'));
  } catch (err) {
    throw new Error(
      `[talpipe/23] candidates JSON not found at ${candidatesPath}. Generate via Claude main loop first.`
    );
  }

  const candidates = raw.candidates ?? [];
  console.log(`[talpipe/23] loaded ${candidates.length} candidates from ${candidatesPath}`);
  if (raw.metadata)
    console.log(`  metadata:`, raw.metadata.rationale_summary?.slice(0, 200) ?? '(no rationale)');

  // Zod validation
  const { passed, failed } = validateBatch(SuccessionCandidateSchema, candidates);
  if (failed.length > 0) {
    console.error(
      `[talpipe/23] ${failed.length}/${candidates.length} records FAILED schema validation:`
    );
    for (const f of failed.slice(0, 5)) {
      console.error(`  [${f.index}]`, JSON.stringify(f.error).slice(0, 200));
    }
    throw new Error(`[talpipe/23] schema validation failed — fix candidates JSON before retry`);
  }
  console.log(`[talpipe/23] ${passed.length} records passed zod validation`);

  // DB connection
  if (!process.env.DATABASE_URL && !dryRun) {
    throw new Error('DATABASE_URL not set — required for real run');
  }
  if (dryRun && !process.env.DATABASE_URL) {
    // Pure dry-run: simulate without DB
    console.log(
      `[dry-run] would connect to DB, resolve tenant ${tenant}, then insert ${passed.length} records`
    );
    for (const c of passed.slice(0, 3)) {
      console.log(`  preview:`, {
        critical_role_id: c.critical_role_id,
        candidate_employee_id: c.candidate_employee_id,
        readiness_level: c.readiness_level,
        strengths_preview: c.strengths.slice(0, 80) + '...',
      });
    }
    return { inserted: 0, skipped: passed.length, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Pre-flight: verify all critical_role_id + candidate_employee_id exist for this tenant
  const validRoleIds = new Set();
  const validEmployeeIds = new Set();
  {
    const { rows: roleRows } = await pool.query(
      'SELECT id FROM succession_plans WHERE tenant_id = $1',
      [tenantId]
    );
    for (const r of roleRows) validRoleIds.add(r.id);
    const { rows: empRows } = await pool.query(
      'SELECT id FROM employees WHERE tenant_id = $1 AND is_active = true',
      [tenantId]
    );
    for (const e of empRows) validEmployeeIds.add(e.id);
  }
  const fkErrors = [];
  for (const c of passed) {
    if (!validRoleIds.has(c.critical_role_id))
      fkErrors.push(`role_id ${c.critical_role_id} not in tenant`);
    if (!validEmployeeIds.has(c.candidate_employee_id))
      fkErrors.push(`employee_id ${c.candidate_employee_id} not in tenant`);
  }
  if (fkErrors.length > 0) {
    console.error(`[talpipe/23] FK preflight FAIL:`, fkErrors.slice(0, 5));
    await pool.end();
    throw new Error(`[talpipe/23] FK violations — abort before INSERT`);
  }

  // Idempotency check + insert
  let result;
  await withTenantTx(pool, tenantId, async (client) => {
    // Check existing pairs
    const { rows: existingRows } = await client.query(
      `SELECT critical_role_id, candidate_employee_id FROM succession_candidates WHERE tenant_id = $1`,
      [tenantId]
    );
    const existing = new Set(
      existingRows.map((r) => `${r.critical_role_id}|${r.candidate_employee_id}`)
    );

    const toInsert = passed.filter(
      (c) => !existing.has(`${c.critical_role_id}|${c.candidate_employee_id}`)
    );
    const dupSkipped = passed.length - toInsert.length;
    console.log(
      `[talpipe/23] dedupe: ${dupSkipped} duplicates skipped, ${toInsert.length} new candidates to insert`
    );

    const records = toInsert.map((c) => ({
      critical_role_id: c.critical_role_id,
      candidate_employee_id: c.candidate_employee_id,
      readiness_level: c.readiness_level,
      strengths: c.strengths,
      development_needs: c.development_needs,
      development_plan: c.development_plan,
      rank_order: c.rank_order,
      tenant_id: tenantId,
    }));
    result = await dryRunBatchInsert(client, 'succession_candidates', records, {
      dryRun,
      onConflict: 'ON CONFLICT DO NOTHING',
    });
    console.log(`[talpipe/23] insert result:`, result);
  });

  await pool.end();
  return result;
}
