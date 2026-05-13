/**
 * smerto/70_salary_band_assignments.mjs — SMERTO compensation_planning closure.
 *
 * EcoNova + Heuresys: assegna 1 salary_band per ogni employee attivo.
 * Pattern coerente con RTL (156) + SmartFood (82). Threshold compensation_planning = 1.
 *
 * Logic:
 *  - Per ogni employee del tenant, scelgo band tramite hash deterministico (employee_id seed)
 *  - current_salary = uniform random nel range [min_salary, max_salary] (deterministico)
 *  - compa_ratio = current_salary / mid_salary
 *  - range_penetration = (current_salary - min_salary) / (max_salary - min_salary)
 *
 * Idempotente: skip se employee già ha assignment.
 *
 * Usage:
 *   node -e "import('./scripts/seed-generator/smerto/70_salary_band_assignments.mjs').then(m=>m.runStage({tenant:'econova',dryRun:false}))"
 *   node -e "import('./scripts/seed-generator/smerto/70_salary_band_assignments.mjs').then(m=>m.runStage({tenant:'heuresys',dryRun:false}))"
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { mulberry32, seedFromString } from '../lib/distributions.mjs';

function pickBandForEmployee(emp, bands, rng) {
  // Strategy: hash-based deterministic rotation. Variazione: dirigenti/manager → EX/MG band.
  // Default: rotazione uniforme su tutti i band.
  const title = (emp.job_title || '').toLowerCase();
  let pool = bands;
  if (/director|chief|ceo|cfo|coo|cto|president|head of/i.test(title)) {
    pool = bands.filter((b) => b.band_code.startsWith('EX')) || bands;
  } else if (/manager|lead|supervisor/i.test(title)) {
    pool = bands.filter((b) => b.band_code.startsWith('MG') || b.band_code.startsWith('EX-2'));
  } else if (/senior|principal|staff/i.test(title)) {
    pool = bands.filter((b) => /1$/.test(b.band_code)); // band 1 = senior tier
  } else if (/junior|associate|intern/i.test(title)) {
    pool = bands.filter((b) => /3$/.test(b.band_code) || /2$/.test(b.band_code));
  }
  if (!pool || pool.length === 0) pool = bands;
  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}

export async function runStage({ tenant, dryRun }) {
  console.log(`[smerto/70_salary_band_assignments] tenant=${tenant} dryRun=${dryRun}`);
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/\?.*$/, '') });
  const tenantId = await getTenantIdByCode(pool, tenant);

  const { rows: bands } = await pool.query(
    `SELECT id, band_code, min_salary, mid_salary, max_salary
       FROM salary_bands
      WHERE tenant_id=$1 AND is_active=true
      ORDER BY band_code`,
    [tenantId]
  );
  if (bands.length === 0) {
    console.log('[smerto/70] no salary_bands for tenant — run 60_salary_bands.mjs first');
    await pool.end();
    return { inserted: 0 };
  }

  const { rows: employees } = await pool.query(
    `SELECT id, job_title FROM employees
      WHERE tenant_id=$1 AND deleted_at IS NULL`,
    [tenantId]
  );
  if (employees.length === 0) {
    console.log('[smerto/70] no employees — skip');
    await pool.end();
    return { inserted: 0 };
  }

  const { rows: existingRows } = await pool.query(
    `SELECT employee_id FROM salary_band_assignments WHERE tenant_id=$1`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => r.employee_id));

  if (dryRun) {
    const eligible = employees.filter((e) => !existing.has(e.id)).length;
    console.log(
      `[dry-run] ${bands.length} bands, ${employees.length} employees, ${eligible} eligible inserts`
    );
    await pool.end();
    return { inserted: 0, dryRun: true };
  }

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const emp of employees) {
      if (existing.has(emp.id)) continue;
      const rng = mulberry32(seedFromString(`salary-assignment-${emp.id}`));
      const band = pickBandForEmployee(emp, bands, rng);
      const min = Number(band.min_salary);
      const max = Number(band.max_salary);
      const mid = Number(band.mid_salary);
      // current_salary uniformly distributed in [min, max] (skewed slightly toward mid)
      const r1 = rng();
      const r2 = rng();
      const r = (r1 + r2) / 2; // triangular-ish, biased toward middle
      const currentSalary = Number((min + (max - min) * r).toFixed(2));
      const compaRatio = Number((currentSalary / mid).toFixed(4));
      const rangePenetration = Number(((currentSalary - min) / (max - min)).toFixed(4));

      await client.query(
        `INSERT INTO salary_band_assignments
          (tenant_id, employee_id, band_id, current_salary, compa_ratio, range_penetration, assigned_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [tenantId, emp.id, band.id, currentSalary, compaRatio, rangePenetration]
      );
      inserted++;
    }
  });
  console.log(`[smerto/70] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
