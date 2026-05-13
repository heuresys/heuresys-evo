/**
 * pulsar/41_engagement_responses.mjs — Stage 1b PULSAR engagement responses.
 *
 * Genera engagement_survey_responses statistically (Gaussian distribution mood scores)
 * per surveys attivi del tenant. NO LLM — deterministic via lib/distributions.mjs.
 *
 * Target: ~970 responses RTL Bank (gap 659 → 970 = +311). Scaled per tenant.
 */

import { Pool } from 'pg';
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import { mulberry32, seedFromString, gaussian, uniformInt } from '../lib/distributions.mjs';
import { dryRunBatchInsert, isDryRun } from '../lib/dry-run.mjs';

// Per-tenant target responses (rough scaling per headcount)
const TARGETS = {
  'rtl-bank': 970,
  smartfood: 500,
  econova: 150,
  heuresys: 25,
};

export async function runStage({ tenant, dryRun }) {
  console.log(`[pulsar/41_engagement_responses] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 100;

  if (!process.env.DATABASE_URL && !dryRun) {
    throw new Error('DATABASE_URL not set');
  }
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would generate up to ${target} responses for ${tenant}`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Pull surveys + employees
  const { rows: surveys } = await pool.query(
    `SELECT id, title, questions, start_date, status FROM engagement_surveys
      WHERE tenant_id = $1 AND status IN ('active', 'completed', 'closed')
      ORDER BY start_date`,
    [tenantId]
  );
  if (surveys.length === 0) {
    console.log('[pulsar/41] no surveys found — skip');
    await pool.end();
    return { inserted: 0, skipped: 0 };
  }
  const { rows: employees } = await pool.query(
    `SELECT id FROM employees WHERE tenant_id = $1 AND is_active = true`,
    [tenantId]
  );
  console.log(`[pulsar/41] ${surveys.length} surveys × ${employees.length} employees`);

  // Existing responses dedupe key
  const { rows: existingRows } = await pool.query(
    `SELECT survey_id, employee_id FROM engagement_survey_responses
       WHERE tenant_id = $1 AND employee_id IS NOT NULL`,
    [tenantId]
  );
  const existing = new Set(existingRows.map((r) => `${r.survey_id}|${r.employee_id}`));
  console.log(`[pulsar/41] existing responses: ${existing.size}`);

  // Generate new records — Gaussian mood scores
  const rng = mulberry32(seedFromString(`pulsar-${tenant}`));
  const newRecords = [];
  // For each survey, attempt 60% response rate of employees
  for (const survey of surveys) {
    const responseRate = 0.6 + rng() * 0.2; // 60-80%
    const targetForSurvey = Math.floor(employees.length * responseRate);
    const surveyQuestions = Array.isArray(survey.questions) ? survey.questions : [];
    const empIds = [...employees.map((e) => e.id)]
      .sort(() => rng() - 0.5)
      .slice(0, targetForSurvey);

    for (const empId of empIds) {
      if (existing.has(`${survey.id}|${empId}`)) continue;
      // Generate answers JSON: Likert 1-5 Gaussian skewed positive (mu=3.7, sigma=0.8)
      const answers =
        surveyQuestions.length > 0
          ? surveyQuestions.map((q, i) => ({
              question_id: q.id ?? `q${i + 1}`,
              question_type: q.type ?? 'likert',
              value: Math.max(1, Math.min(5, Math.round(gaussian(rng, 3.7, 0.8)))),
            }))
          : [
              {
                question_id: 'q1',
                question_type: 'likert',
                value: Math.max(1, Math.min(5, Math.round(gaussian(rng, 3.7, 0.8)))),
              },
              {
                question_id: 'q2',
                question_type: 'likert',
                value: Math.max(1, Math.min(5, Math.round(gaussian(rng, 3.7, 0.8)))),
              },
            ];
      const startTs = new Date(
        new Date(survey.start_date).getTime() + uniformInt(rng, 0, 14) * 86400000
      );
      const completeTs = new Date(startTs.getTime() + uniformInt(rng, 5, 30) * 60000);
      newRecords.push({
        tenant_id: tenantId,
        survey_id: survey.id,
        employee_id: empId,
        answers: JSON.stringify(answers),
        started_at: startTs.toISOString(),
        completed_at: completeTs.toISOString(),
        is_complete: true,
      });
    }
  }

  // Cap at gap target — avoid over-shoot
  const gap = Math.max(0, target - existing.size);
  const recordsToInsert = newRecords.slice(0, gap);
  console.log(
    `[pulsar/41] generated ${newRecords.length} potential, inserting ${recordsToInsert.length} (gap=${gap})`
  );

  let result;
  await withTenantTx(pool, tenantId, async (client) => {
    // Partial unique index su (survey_id, employee_id) WHERE employee_id IS NOT NULL.
    // Dedupe già fatto application-side via 'existing' set; uso ON CONFLICT DO NOTHING senza target.
    result = await dryRunBatchInsert(client, 'engagement_survey_responses', recordsToInsert, {
      dryRun,
      onConflict: 'ON CONFLICT DO NOTHING',
    });
    console.log('[pulsar/41] insert result:', result);
  });

  await pool.end();
  return result;
}
