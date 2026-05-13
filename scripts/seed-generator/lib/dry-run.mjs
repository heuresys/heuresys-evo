/**
 * lib/dry-run.mjs — Dry-run wrapper per stage scripts CASCADIA.
 *
 * Intercetta INSERT/UPDATE: in dry-run mode logga su stdout senza commit DB.
 * In real mode, esegue normalmente via `withTenantTx`.
 *
 * Usa flag global `process.env.CASCADIA_DRY_RUN === '1'` o flag CLI passato
 * tramite `dryRun: true` arg.
 *
 * Esempio uso in stage script:
 *
 *   import { dryRunSafeInsert, isDryRun } from '../lib/dry-run.mjs';
 *   await dryRunSafeInsert(client, 'succession_candidates', record, { dryRun });
 */

export function isDryRun(opts = {}) {
  if (opts.dryRun === true) return true;
  if (opts.dryRun === false) return false;
  return process.env.CASCADIA_DRY_RUN === '1';
}

/**
 * Insert sicuro con dry-run support. In dry-run logga e ritorna null.
 *
 * @param {import('pg').PoolClient} client — RLS-aware tx client da rls-tx.mjs
 * @param {string} table — nome tabella
 * @param {object} record — kv pairs delle colonne
 * @param {{ dryRun?: boolean, onConflict?: string, returning?: string }} opts
 * @returns {Promise<object|null>} la row inserita oppure null in dry-run
 */
export async function dryRunSafeInsert(client, table, record, opts = {}) {
  const cols = Object.keys(record);
  const vals = Object.values(record);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
  const onConflict = opts.onConflict ? ` ${opts.onConflict}` : '';
  const returning = opts.returning ? ` RETURNING ${opts.returning}` : ' RETURNING id';
  const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})${onConflict}${returning}`;

  if (isDryRun(opts)) {
    console.log(`[dry-run] ${table}`, {
      cols: cols.length,
      preview: cols.slice(0, 6).reduce((acc, k, i) => ({ ...acc, [k]: truncate(vals[i]) }), {}),
    });
    return null;
  }
  const { rows } = await client.query(sql, vals);
  return rows[0] ?? null;
}

/**
 * Batch insert con dry-run support. Stampa count + summary in dry-run.
 */
export async function dryRunBatchInsert(client, table, records, opts = {}) {
  if (records.length === 0) {
    console.log(`[batch] ${table}: 0 records, skip`);
    return { inserted: 0, skipped: 0 };
  }
  if (isDryRun(opts)) {
    console.log(`[dry-run-batch] ${table}: would insert ${records.length} records`);
    console.log(`  sample[0]:`, truncate(JSON.stringify(records[0])));
    if (records.length > 1)
      console.log(`  sample[last]:`, truncate(JSON.stringify(records[records.length - 1])));
    return { inserted: 0, skipped: records.length, dryRun: true };
  }
  let inserted = 0;
  let skipped = 0;
  for (const rec of records) {
    const result = await dryRunSafeInsert(client, table, rec, opts);
    if (result) inserted++;
    else skipped++;
  }
  return { inserted, skipped };
}

function truncate(v, max = 100) {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (!s) return s;
  return s.length > max ? s.slice(0, max) + '...' : s;
}
