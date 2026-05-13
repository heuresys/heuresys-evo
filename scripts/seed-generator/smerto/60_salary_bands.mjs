/**
 * smerto/60_salary_bands.mjs — SMERTO compensation closure: salary_bands non-RTL/non-SmartFood.
 *
 * EcoNova (0 → 11) + Heuresys (0 → 7). RTL Bank (12) + SmartFood (11) skipped (already 🟢).
 * Bands coerenti con NACE tenant: D.35 renewables/green-tech (EcoNova) · J.62 SaaS B2B (Heuresys).
 * Currency EUR · geo_region Italy. Idempotente via dedupe (tenant_id, band_code).
 *
 * Closure target: verify-area compensation salary_bands 🟡 → 🟢 (threshold=5).
 *
 * Usage:
 *   node -e "import('./scripts/seed-generator/smerto/60_salary_bands.mjs').then(m=>m.runStage({tenant:'econova',dryRun:false}))"
 *   node -e "import('./scripts/seed-generator/smerto/60_salary_bands.mjs').then(m=>m.runStage({tenant:'heuresys',dryRun:false}))"
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';

// EcoNova (NACE D.35): renewables/green-tech premium ~8-12% over food (SmartFood baseline).
// Heuresys (NACE J.62): SaaS B2B platform, tech premium ~10-15% over EcoNova for equivalent tech roles.
const BANDS_BY_TENANT = {
  econova: [
    {
      band_code: 'EX-1',
      band_name: 'Executive Band 1',
      job_level: 'Executive',
      job_family: 'Leadership',
      min_salary: 140000,
      mid_salary: 175000,
      max_salary: 220000,
      description: 'C-level + CEO/COO/CFO renewable energy holding',
    },
    {
      band_code: 'EX-2',
      band_name: 'Executive Band 2',
      job_level: 'Director',
      job_family: 'Leadership',
      min_salary: 95000,
      mid_salary: 120000,
      max_salary: 150000,
      description: 'VP/Director engineering, operations, business development',
    },
    {
      band_code: 'MG-1',
      band_name: 'Management Band 1',
      job_level: 'Senior Manager',
      job_family: 'Management',
      min_salary: 68000,
      mid_salary: 84000,
      max_salary: 105000,
      description: 'Senior managers operations + engineering programs',
    },
    {
      band_code: 'MG-2',
      band_name: 'Management Band 2',
      job_level: 'Manager',
      job_family: 'Management',
      min_salary: 52000,
      mid_salary: 64000,
      max_salary: 80000,
      description: 'Team leads + first-line managers',
    },
    {
      band_code: 'EN-1',
      band_name: 'Engineering Band 1',
      job_level: 'Senior',
      job_family: 'Engineering — Renewables',
      min_salary: 55000,
      mid_salary: 68000,
      max_salary: 85000,
      description: 'Senior solar/wind/grid engineers, electrical + power systems',
    },
    {
      band_code: 'EN-2',
      band_name: 'Engineering Band 2',
      job_level: 'Professional',
      job_family: 'Engineering — Renewables',
      min_salary: 42000,
      mid_salary: 52000,
      max_salary: 65000,
      description: 'Mid-level engineers renewable plant design + commissioning',
    },
    {
      band_code: 'EN-3',
      band_name: 'Engineering Band 3',
      job_level: 'Junior',
      job_family: 'Engineering — Renewables',
      min_salary: 32000,
      mid_salary: 38000,
      max_salary: 48000,
      description: 'Junior engineers post-graduate energy transition track',
    },
    {
      band_code: 'PM-1',
      band_name: 'Project Management Band 1',
      job_level: 'Senior',
      job_family: 'Project Management',
      min_salary: 58000,
      mid_salary: 72000,
      max_salary: 90000,
      description: 'Senior project managers utility-scale solar/wind farms',
    },
    {
      band_code: 'PM-2',
      band_name: 'Project Management Band 2',
      job_level: 'Professional',
      job_family: 'Project Management',
      min_salary: 45000,
      mid_salary: 55000,
      max_salary: 68000,
      description: 'Mid-level PMs residential/commercial installations',
    },
    {
      band_code: 'FO-1',
      band_name: 'Field Operations Band 1',
      job_level: 'Senior Technician',
      job_family: 'Field Operations',
      min_salary: 30000,
      mid_salary: 36000,
      max_salary: 44000,
      description: 'Senior field technicians O&M solar/wind installations',
    },
    {
      band_code: 'SC-1',
      band_name: 'Sustainability/Compliance Band 1',
      job_level: 'Professional',
      job_family: 'Sustainability & Compliance',
      min_salary: 40000,
      mid_salary: 48000,
      max_salary: 60000,
      description: 'ESG specialists, environmental compliance, ISO 14001 auditors',
    },
  ],
  heuresys: [
    {
      band_code: 'EX-1',
      band_name: 'Executive Band 1',
      job_level: 'Executive',
      job_family: 'Leadership',
      min_salary: 160000,
      mid_salary: 200000,
      max_salary: 250000,
      description: 'Founder/CEO + C-level SaaS platform',
    },
    {
      band_code: 'EX-2',
      band_name: 'Executive Band 2',
      job_level: 'Director',
      job_family: 'Leadership',
      min_salary: 105000,
      mid_salary: 135000,
      max_salary: 170000,
      description: 'VP Engineering, VP Product, VP Customer Success',
    },
    {
      band_code: 'PL-1',
      band_name: 'Platform Engineering Band 1',
      job_level: 'Staff',
      job_family: 'Engineering — Platform',
      min_salary: 85000,
      mid_salary: 105000,
      max_salary: 135000,
      description: 'Staff/Principal engineers platform core + architecture',
    },
    {
      band_code: 'PL-2',
      band_name: 'Platform Engineering Band 2',
      job_level: 'Senior',
      job_family: 'Engineering — Platform',
      min_salary: 60000,
      mid_salary: 75000,
      max_salary: 95000,
      description: 'Senior full-stack engineers Next.js/Prisma/Postgres',
    },
    {
      band_code: 'PL-3',
      band_name: 'Platform Engineering Band 3',
      job_level: 'Professional',
      job_family: 'Engineering — Platform',
      min_salary: 42000,
      mid_salary: 52000,
      max_salary: 65000,
      description: 'Mid-level engineers feature delivery + integrations',
    },
    {
      band_code: 'PD-1',
      band_name: 'Product Management Band 1',
      job_level: 'Senior',
      job_family: 'Product Management',
      min_salary: 65000,
      mid_salary: 80000,
      max_salary: 100000,
      description: 'Senior product managers organizational intelligence platform',
    },
    {
      band_code: 'CS-1',
      band_name: 'Customer Success Band 1',
      job_level: 'Professional',
      job_family: 'Customer Success',
      min_salary: 38000,
      mid_salary: 46000,
      max_salary: 58000,
      description: 'Customer Success Managers + onboarding specialists tenant accounts',
    },
  ],
};

function rangeSpread(min, max) {
  return Number((((max - min) / min) * 100).toFixed(2));
}

export async function runStage({ tenant, dryRun }) {
  console.log(`[smerto/60_salary_bands] tenant=${tenant} dryRun=${dryRun}`);
  const bands = BANDS_BY_TENANT[tenant];
  if (!bands) {
    console.log('[smerto/60] no bands defined for tenant — skip');
    return { inserted: 0 };
  }
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would insert ${bands.length} salary_bands`);
    return { inserted: 0, skipped: bands.length, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/\?.*$/, '') });
  const tenantId = await getTenantIdByCode(pool, tenant);

  const { rows: existingRows } = await pool.query(
    `SELECT band_code FROM salary_bands WHERE tenant_id=$1`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => r.band_code));
  const today = new Date();
  const effectiveFrom = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const b of bands) {
      if (existing.has(b.band_code)) {
        console.log(`  skip dup: ${b.band_code}`);
        continue;
      }
      await client.query(
        `INSERT INTO salary_bands
          (tenant_id, band_code, band_name, description, job_level, job_family,
           currency, min_salary, mid_salary, max_salary, range_spread_percent,
           geo_region, effective_from, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 'EUR', $7, $8, $9, $10, 'Italy', $11, true)`,
        [
          tenantId,
          b.band_code,
          b.band_name,
          b.description,
          b.job_level,
          b.job_family,
          b.min_salary,
          b.mid_salary,
          b.max_salary,
          rangeSpread(b.min_salary, b.max_salary),
          effectiveFrom,
        ]
      );
      inserted++;
    }
  });
  console.log(`[smerto/60] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
