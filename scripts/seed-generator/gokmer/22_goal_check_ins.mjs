/**
 * gokmer/22_goal_check_ins.mjs — Stage 1b GOKMER goal check-ins.
 *
 * Genera goal_check_ins per goals attivi — progress updates con notes template
 * + statistical progress curve (Gaussian increment). Idempotent via dedupe
 * (goal_id, employee_id, check_in_date).
 *
 * Target: ~1000 check-ins RTL Bank (gap 480 → 1000 = +520).
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import {
  mulberry32,
  seedFromString,
  gaussian,
  uniformInt,
  pickOne,
} from '../lib/distributions.mjs';
import { dryRunBatchInsert } from '../lib/dry-run.mjs';

const TARGETS = {
  'rtl-bank': 1000,
  smartfood: 500,
  econova: 150,
  'heuresys-system': 30,
};

const STATUS_TEMPLATES = {
  on_track: [
    'Avanzamento regolare. Milestone Q-X raggiunta in tempo.',
    'Progresso costante, allineato al piano iniziale.',
    'Esecuzione fluida, no blockers materiali.',
    'Output trimestrale on-track con metrica target.',
    'Allineamento con manager confermato.',
  ],
  at_risk: [
    'Slippage di 2 settimane su deliverable principale. Recovery plan in revisione.',
    'Dipendenza esterna in ritardo (vendor / cross-team). Monitoraggio settimanale.',
    'Risk score elevato per resource constraint. Escalation valutata.',
    'Qualità sotto target su metric secondario. Refocus richiesto.',
  ],
  blocked: [
    'Bloccato su dependency cross-team (Finance Ops). Riallineamento in agenda.',
    'In attesa di sign-off compliance per next phase.',
    'Resource gap critico — hiring decision pending.',
  ],
  completed: [
    'Obiettivo chiuso entro target. KPI raggiunto +12% vs baseline.',
    'Delivery completata con quality score ≥ 4/5.',
    'Outcome misurabile validato dal manager.',
  ],
};

const BLOCKER_TEMPLATES = [
  'Dipendenza vendor in ritardo',
  'Risorsa team non disponibile',
  'Sign-off compliance pending',
  'Tool/platform issue tecnico',
  'Allineamento cross-team mancante',
  'Budget approval in attesa',
];

const NEXT_STEPS_TEMPLATES = [
  'Sync con manager venerdì. Define next 2-week sprint',
  'Escalare blocco a Director per unblock',
  'Workshop tecnico per refactor approach',
  'Update piano + rivedere milestone Q+1',
  'Drafting deliverable + share per peer review',
  'Allineamento con stakeholder esterno',
];

export async function runStage({ tenant, dryRun }) {
  console.log(`[gokmer/22_goal_check_ins] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 100;

  if (!process.env.DATABASE_URL && !dryRun) {
    throw new Error('DATABASE_URL not set');
  }
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would generate up to ${target} goal check-ins for ${tenant}`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Pull active goals
  const { rows: goals } = await pool.query(
    `SELECT id, employee_id, progress_percent AS progress_percentage, status, due_date AS target_date FROM goals
      WHERE tenant_id = $1 AND status IN ('active', 'in_progress')
      ORDER BY id`,
    [tenantId]
  );
  if (goals.length === 0) {
    console.log('[gokmer/22] no active goals — skip');
    await pool.end();
    return { inserted: 0, skipped: 0 };
  }
  console.log(`[gokmer/22] ${goals.length} active goals`);

  // Existing dedupe
  const { rows: existingRows } = await pool.query(
    `SELECT goal_id, employee_id, check_in_date FROM goal_check_ins WHERE tenant_id = $1`,
    [tenantId]
  );
  const existing = new Set(
    existingRows.map(
      (r) => `${r.goal_id}|${r.employee_id}|${r.check_in_date.toISOString().slice(0, 10)}`
    )
  );
  console.log(`[gokmer/22] existing check-ins: ${existing.size}`);

  // Generate
  const rng = mulberry32(seedFromString(`gokmer-checkin-${tenant}`));
  const newRecords = [];
  const today = new Date();
  // Per goal generate 2-4 check-ins distributed over time
  for (const g of goals) {
    if (newRecords.length >= target) break;
    const numCheckins = uniformInt(rng, 2, 4);
    let currentProgress = Math.max(0, (g.progress_percentage ?? 0) - 20);
    for (let i = 0; i < numCheckins; i++) {
      const daysAgo = uniformInt(rng, 7 * (numCheckins - i), 7 * (numCheckins - i) + 14);
      const checkDate = new Date(today.getTime() - daysAgo * 86400000);
      const dateStr = checkDate.toISOString().slice(0, 10);
      const key = `${g.id}|${g.employee_id}|${dateStr}`;
      if (existing.has(key)) continue;

      const prevProgress = currentProgress;
      const increment = Math.max(1, Math.round(gaussian(rng, 8, 4)));
      currentProgress = Math.min(100, currentProgress + increment);

      // Status determinato da progress + randomness
      let statusKey = 'on_track';
      const r = rng();
      if (currentProgress >= 100) statusKey = 'completed';
      else if (r < 0.1) statusKey = 'blocked';
      else if (r < 0.25) statusKey = 'at_risk';

      const notes = pickOne(rng, STATUS_TEMPLATES[statusKey]);
      const blocker =
        statusKey === 'blocked' || statusKey === 'at_risk' ? pickOne(rng, BLOCKER_TEMPLATES) : null;
      const nextSteps = statusKey !== 'completed' ? pickOne(rng, NEXT_STEPS_TEMPLATES) : null;
      const confidence =
        statusKey === 'completed'
          ? 5
          : statusKey === 'on_track'
            ? uniformInt(rng, 3, 5)
            : statusKey === 'at_risk'
              ? uniformInt(rng, 2, 3)
              : 1;

      newRecords.push({
        tenant_id: tenantId,
        goal_id: g.id,
        employee_id: g.employee_id,
        check_in_date: dateStr,
        previous_progress: prevProgress,
        new_progress: currentProgress,
        status_update: statusKey,
        notes,
        blockers: blocker,
        next_steps: nextSteps,
        confidence_level: confidence,
      });
    }
  }

  const gap = Math.max(0, target - existing.size);
  const recordsToInsert = newRecords.slice(0, gap);
  console.log(
    `[gokmer/22] generated ${newRecords.length} potential, inserting ${recordsToInsert.length} (gap=${gap})`
  );

  let result;
  await withTenantTx(pool, tenantId, async (client) => {
    result = await dryRunBatchInsert(client, 'goal_check_ins', recordsToInsert, {
      dryRun,
      onConflict: 'ON CONFLICT DO NOTHING',
    });
    console.log('[gokmer/22] insert result:', result);
  });

  await pool.end();
  return result;
}
