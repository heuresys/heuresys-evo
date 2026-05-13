/**
 * h2r/40_recruiting_econova.mjs — Stage 2f recruiting_candidates EcoNova.
 *
 * EcoNova ha 0 recruiting_candidates. Genera ~10 candidati realistici per sector
 * renewable energy + green-tech (NACE D.35). Italian names + role mix.
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { mulberry32, seedFromString, uniformInt, pickOne } from '../lib/distributions.mjs';

const TARGETS = {
  econova: 10,
  'rtl-bank': 0,
  smartfood: 0,
  heuresys: 0,
};

const FIRST_NAMES_M = [
  'Marco',
  'Luca',
  'Andrea',
  'Matteo',
  'Davide',
  'Simone',
  'Alessandro',
  'Stefano',
  'Paolo',
  'Giovanni',
];
const FIRST_NAMES_F = [
  'Giulia',
  'Sara',
  'Chiara',
  'Martina',
  'Elena',
  'Francesca',
  'Anna',
  'Laura',
  'Cristina',
  'Valentina',
];
const LAST_NAMES = [
  'Rossi',
  'Russo',
  'Ferrari',
  'Esposito',
  'Bianchi',
  'Romano',
  'Colombo',
  'Ricci',
  'Marino',
  'Greco',
  'Bruno',
  'Gallo',
  'Conti',
  'De Luca',
  'Mancini',
];

const ROLES_ECONOVA = [
  { title: 'Renewable Energy Project Manager', source_channel: 'LinkedIn' },
  { title: 'Solar PV Systems Engineer', source_channel: 'Indeed' },
  { title: 'Wind Turbine Maintenance Technician', source_channel: 'Referral' },
  { title: 'Sustainability Compliance Officer', source_channel: 'LinkedIn' },
  { title: 'Energy Storage Battery Specialist', source_channel: 'JobBoard_GreenJobs' },
  { title: 'Grid Integration Engineer', source_channel: 'University_Career_Fair' },
  { title: 'Carbon Footprint Analyst', source_channel: 'LinkedIn' },
  { title: 'Environmental Impact Assessor', source_channel: 'Headhunter' },
  { title: 'Green Bond Financial Analyst', source_channel: 'Referral' },
  { title: 'Smart Grid Software Developer', source_channel: 'Indeed' },
];

const STATUSES = ['new', 'screening', 'phone_screen', 'interview', 'offer', 'rejected'];

export async function runStage({ tenant, dryRun }) {
  console.log(`[h2r/40_recruiting_econova] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 0;
  if (target === 0) {
    console.log('[h2r/40] target=0 — skip');
    return { inserted: 0 };
  }
  if (!process.env.DATABASE_URL && !dryRun) throw new Error('DATABASE_URL not set');
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would insert ${target} candidates`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Inspect schema first to handle drift
  const { rows: cols } = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name='recruiting_candidates' ORDER BY ordinal_position`
  );
  const colNames = cols.map((c) => c.column_name);
  console.log(`[h2r/40] recruiting_candidates cols: ${colNames.length}`);

  const rng = mulberry32(seedFromString(`h2r-recruit-${tenant}`));
  const today = new Date();
  let inserted = 0;

  await withTenantTx(pool, tenantId, async (client) => {
    for (let i = 0; i < target; i++) {
      const role = ROLES_ECONOVA[i % ROLES_ECONOVA.length];
      const isM = rng() < 0.5;
      const firstName = pickOne(rng, isM ? FIRST_NAMES_M : FIRST_NAMES_F);
      const lastName = pickOne(rng, LAST_NAMES);
      const status = pickOne(rng, STATUSES);
      const appliedDaysAgo = uniformInt(rng, 7, 90);
      const appliedDate = new Date(today.getTime() - appliedDaysAgo * 86400000);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '')}@example.com`;
      const phone = `+39 3${uniformInt(rng, 10, 99)} ${uniformInt(rng, 100, 999)} ${uniformInt(rng, 1000, 9999)}`;

      // Build INSERT dynamically based on actual schema (skip cols we don't have data for)
      const desiredFields = {
        tenant_id: tenantId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        applied_for_role: role.title,
        source: role.source_channel,
        status,
        applied_at: appliedDate.toISOString(),
        notes: `Candidato CASCADIA seed EcoNova sector D.35 renewable energy — ${role.title}`,
      };
      const insertable = Object.keys(desiredFields).filter((k) => colNames.includes(k));
      const cols2 = insertable.join(', ');
      const placeholders = insertable.map((_, i) => `$${i + 1}`).join(', ');
      const vals = insertable.map((k) => desiredFields[k]);
      try {
        await client.query(
          `INSERT INTO recruiting_candidates (${cols2}) VALUES (${placeholders})`,
          vals
        );
        inserted++;
      } catch (e) {
        console.error(`  failed: ${e.message.slice(0, 200)}`);
      }
    }
  });
  console.log(`[h2r/40] inserted=${inserted}`);
  await pool.end();
  return { inserted };
}
