/**
 * h2r/44_onboarding_templates_econova.mjs — Stage 2a-bridge EcoNova onboarding_templates.
 *
 * EcoNova ha 0 templates — blocca Stage 2b onboarding_instances per il tenant.
 * Genera 5 templates renewable-energy sector NACE D.35.
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';

const TEMPLATES_ECONOVA = [
  {
    name: 'Engineer Onboarding — Renewable Energy',
    description:
      'Onboarding standard 30gg per engineer di nuova assunzione in renewable energy projects (solar/wind/storage).',
    department: 'Engineering',
    role_type: 'engineer',
    duration_days: 30,
    is_default: true,
  },
  {
    name: 'Technician Field Onboarding — O&M',
    description:
      'Onboarding 21gg per technician di campo (Operations & Maintenance) con focus safety + ground-work procedures.',
    department: 'Operations',
    role_type: 'technician',
    duration_days: 21,
    is_default: false,
  },
  {
    name: 'Sustainability Analyst Onboarding',
    description:
      'Onboarding 45gg per sustainability analyst con focus su carbon accounting + ESG reporting + EU Taxonomy.',
    department: 'Sustainability',
    role_type: 'analyst',
    duration_days: 45,
    is_default: false,
  },
  {
    name: 'Commercial Onboarding — Green Bond & Project Finance',
    description:
      'Onboarding 30gg per ruoli commerciali financial (green bonds, project finance, structured products).',
    department: 'Finance',
    role_type: 'commercial',
    duration_days: 30,
    is_default: false,
  },
  {
    name: 'Senior Leadership Onboarding',
    description:
      'Onboarding 60gg executive level con esposizione cross-functional + board-level briefings.',
    department: 'Executive',
    role_type: 'senior_management',
    duration_days: 60,
    is_default: false,
  },
];

export async function runStage({ tenant, dryRun }) {
  console.log(`[h2r/44_onboarding_templates_econova] tenant=${tenant} dryRun=${dryRun}`);
  if (tenant !== 'econova') {
    console.log('[h2r/44] only for econova — skip');
    return { inserted: 0 };
  }
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would insert ${TEMPLATES_ECONOVA.length} templates`);
    return { inserted: 0, skipped: TEMPLATES_ECONOVA.length, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  const { rows: existingRows } = await pool.query(
    `SELECT name FROM onboarding_templates WHERE tenant_id=$1 AND deleted_at IS NULL`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => r.name));

  let inserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const t of TEMPLATES_ECONOVA) {
      if (existing.has(t.name)) {
        console.log(`  skip dup: ${t.name}`);
        continue;
      }
      await client.query(
        `INSERT INTO onboarding_templates
          (tenant_id, name, description, department, role_type, duration_days, is_active, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, true, $7)`,
        [tenantId, t.name, t.description, t.department, t.role_type, t.duration_days, t.is_default]
      );
      inserted++;
    }
  });
  console.log(`[h2r/44] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
