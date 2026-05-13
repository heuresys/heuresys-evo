/**
 * h2r/45_onboarding.mjs — Stage 2b H2R-Onboarding cross-tenant sweep.
 *
 * Genera onboarding_instances + onboarding_tasks per tenant con templates esistenti.
 * Per ogni instance: 4-6 tasks template-based (departments/role mix) + status distribution.
 *
 * Target per tenant:
 *   - rtl-bank: +11 instances (4 → 15)
 *   - smartfood: +12 instances (0 → 12)
 *   - heuresys-system: +3 instances (0 → 3)
 *   - econova: skip (0 templates)
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import {
  mulberry32,
  seedFromString,
  uniformInt,
  pickOne,
  quintile,
} from '../lib/distributions.mjs';
import { dryRunBatchInsert } from '../lib/dry-run.mjs';

const TARGETS = {
  'rtl-bank': 15,
  smartfood: 12,
  econova: 0, // no templates
  'heuresys-system': 3,
};

const TASK_TEMPLATES = [
  {
    title: 'Setup IT account + email + VPN',
    description: 'Configurazione completa account IT: AD, email, VPN, 2FA, hardware assegnato.',
    category: 'it_setup',
    priority: 3,
    sequence_order: 1,
  },
  {
    title: 'Compilare documentazione HR (CCNL, modulistica)',
    description: 'Firma contratto, moduli fiscali F24, scelta TFR, modulistica sindacale.',
    category: 'hr_documents',
    priority: 3,
    sequence_order: 2,
  },
  {
    title: 'Training compliance obbligatorio (GDPR, sicurezza)',
    description: 'Corso e-learning GDPR + sicurezza informatica + AML (banking) — 4h totali.',
    category: 'compliance_training',
    priority: 2,
    sequence_order: 3,
  },
  {
    title: 'Welcome session con HR Business Partner',
    description: 'Meeting 1:1 di benvenuto con HRBP per orientamento iniziale + Q&A.',
    category: 'welcome',
    priority: 2,
    sequence_order: 4,
  },
  {
    title: 'Affiancamento con buddy + tour team',
    description: 'Presentazione team + pairing con buddy assegnato per 30 giorni.',
    category: 'team_intro',
    priority: 2,
    sequence_order: 5,
  },
  {
    title: 'Set goals iniziali con manager (1° mese)',
    description: 'Definizione 3-5 goal SMART per primo mese con manager diretto.',
    category: 'goal_setting',
    priority: 1,
    sequence_order: 6,
  },
];

export async function runStage({ tenant, dryRun }) {
  console.log(`[h2r/45_onboarding] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 0;
  if (target === 0) {
    console.log('[h2r/45] target=0 for this tenant — skip');
    return { inserted: 0, skipped: 0 };
  }

  if (!process.env.DATABASE_URL && !dryRun) {
    throw new Error('DATABASE_URL not set');
  }
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would generate up to ${target} onboarding instances for ${tenant}`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Templates esistenti
  const { rows: templates } = await pool.query(
    `SELECT id, name, duration_days, is_default FROM onboarding_templates
      WHERE tenant_id=$1 AND is_active=true AND deleted_at IS NULL`,
    [tenantId]
  );
  if (templates.length === 0) {
    console.log('[h2r/45] no active templates — skip');
    await pool.end();
    return { inserted: 0, skipped: 0 };
  }
  console.log(`[h2r/45] ${templates.length} templates available`);

  // Existing instances count
  const { rows: existingRows } = await pool.query(
    `SELECT employee_id FROM onboarding_instances WHERE tenant_id=$1 AND employee_id IS NOT NULL`,
    [tenantId]
  );
  const alreadyOnboarded = new Set(existingRows.map((r) => r.employee_id));
  const gap = Math.max(0, target - alreadyOnboarded.size);
  console.log(`[h2r/45] existing=${alreadyOnboarded.size} · gap=${gap}`);
  if (gap === 0) {
    await pool.end();
    return { inserted: 0, skipped: 0 };
  }

  // Pick eligible employees: prefer recent hires (last 180d), fallback active employees
  const { rows: emp180 } = await pool.query(
    `SELECT id, hire_date FROM employees
      WHERE tenant_id=$1 AND is_active=true AND created_at >= NOW() - INTERVAL '180 days'
        AND id NOT IN (SELECT COALESCE(employee_id, '00000000-0000-0000-0000-000000000000'::uuid) FROM onboarding_instances WHERE tenant_id=$1)
      ORDER BY created_at DESC
      LIMIT $2`,
    [tenantId, gap * 2]
  );
  let candidates = emp180;
  if (candidates.length < gap) {
    // Fallback: any active employee not yet onboarded
    const { rows: empAny } = await pool.query(
      `SELECT id, hire_date FROM employees
        WHERE tenant_id=$1 AND is_active=true
          AND id NOT IN (SELECT COALESCE(employee_id, '00000000-0000-0000-0000-000000000000'::uuid) FROM onboarding_instances WHERE tenant_id=$1)
        ORDER BY hire_date DESC NULLS LAST, created_at DESC
        LIMIT $2`,
      [tenantId, gap * 2]
    );
    candidates = empAny;
  }
  console.log(`[h2r/45] ${candidates.length} candidate employees`);

  const rng = mulberry32(seedFromString(`h2r-onboard-${tenant}`));
  const newInstances = [];
  const today = new Date();

  for (const emp of candidates.slice(0, gap)) {
    const template = pickOne(rng, templates);
    const durationDays = template.duration_days ?? 30;
    // Distribuzione status: 50% completed, 30% in_progress, 20% pending
    const statusIdx = quintile(rng, [0.5, 0.3, 0.2]);
    const status = ['completed', 'in_progress', 'pending'][statusIdx];
    // start_date based on status
    let startDate, completionDate, progress;
    if (status === 'completed') {
      const ago = uniformInt(rng, 30, 150);
      startDate = new Date(today.getTime() - ago * 86400000);
      completionDate = new Date(startDate.getTime() + durationDays * 86400000);
      progress = 100;
    } else if (status === 'in_progress') {
      const ago = uniformInt(rng, 10, 25);
      startDate = new Date(today.getTime() - ago * 86400000);
      completionDate = null;
      progress = uniformInt(rng, 30, 90);
    } else {
      // pending
      const ahead = uniformInt(rng, 1, 14);
      startDate = new Date(today.getTime() + ahead * 86400000);
      completionDate = null;
      progress = 0;
    }
    const target_completion = new Date(startDate.getTime() + durationDays * 86400000);

    newInstances.push({
      _employeeId: emp.id,
      _template: template,
      record: {
        tenant_id: tenantId,
        employee_id: emp.id,
        template_id: template.id,
        status,
        start_date: startDate.toISOString().slice(0, 10),
        target_completion_date: target_completion.toISOString().slice(0, 10),
        actual_completion_date: completionDate ? completionDate.toISOString().slice(0, 10) : null,
        progress_percent: progress,
        notes: `Onboarding generato S35.4.2 CASCADIA · template ${template.name}`,
      },
    });
  }

  console.log(`[h2r/45] generated ${newInstances.length} instances ready to INSERT`);

  let inserted = 0;
  let tasksInserted = 0;
  await withTenantTx(pool, tenantId, async (client) => {
    for (const item of newInstances) {
      if (dryRun) {
        console.log(
          `  [dry-run] instance for emp ${item._employeeId} status=${item.record.status}`
        );
        continue;
      }
      // Insert instance
      const cols = Object.keys(item.record);
      const vals = Object.values(item.record);
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const { rows } = await client.query(
        `INSERT INTO onboarding_instances (${cols.join(', ')}) VALUES (${placeholders}) RETURNING id`,
        vals
      );
      const instanceId = rows[0].id;
      inserted++;

      // Insert 4-6 tasks per instance
      const numTasks = uniformInt(rng, 4, 6);
      const taskTemplates = [...TASK_TEMPLATES].sort(() => rng() - 0.5).slice(0, numTasks);
      for (const t of taskTemplates) {
        let taskStatus, completedAt;
        if (item.record.status === 'completed') {
          taskStatus = 'completed';
          completedAt = new Date(
            new Date(item.record.start_date).getTime() + t.sequence_order * 5 * 86400000
          );
        } else if (item.record.status === 'in_progress') {
          const completedRatio = item.record.progress_percent / 100;
          if (t.sequence_order / numTasks <= completedRatio) {
            taskStatus = 'completed';
            completedAt = new Date(
              new Date(item.record.start_date).getTime() + t.sequence_order * 3 * 86400000
            );
          } else {
            taskStatus = 'pending';
            completedAt = null;
          }
        } else {
          taskStatus = 'pending';
          completedAt = null;
        }
        const dueDate = new Date(
          new Date(item.record.start_date).getTime() + t.sequence_order * 5 * 86400000
        );
        await client.query(
          `INSERT INTO onboarding_tasks
            (instance_id, title, description, category, priority, status, assignee_type,
             assigned_to_id, due_date, completed_at, sequence_order)
           VALUES ($1, $2, $3, $4, $5, $6, 'employee', $7, $8, $9, $10)`,
          [
            instanceId,
            t.title,
            t.description,
            t.category,
            t.priority,
            taskStatus,
            item._employeeId,
            dueDate.toISOString().slice(0, 10),
            completedAt ? completedAt.toISOString() : null,
            t.sequence_order,
          ]
        );
        tasksInserted++;
      }
    }
  });

  console.log(`[h2r/45] insert result: instances=${inserted} · tasks=${tasksInserted}`);
  await pool.end();
  return { inserted, tasksInserted };
}
