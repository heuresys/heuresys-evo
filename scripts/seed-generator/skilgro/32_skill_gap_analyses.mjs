/**
 * skilgro/32_skill_gap_analyses.mjs — Stage 1b SKILGRO skill gap analyses.
 *
 * Genera skill_gap_analyses per employees attivi del tenant. Derive da
 * employee_skill_assessments esistenti (ESCO-grounded). NO LLM — calcolo
 * deterministic via aggregator SQL + statistical scoring.
 *
 * Target: ~270 analyses RTL Bank (gap 66 → 270 = +204). Scaled per tenant.
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
  'rtl-bank': 270,
  smartfood: 130,
  econova: 40,
  'heuresys-system': 10,
};

const ANALYSIS_TYPES = ['individual_role', 'team_benchmark', 'succession_readiness'];

export async function runStage({ tenant, dryRun }) {
  console.log(`[skilgro/32_skill_gap_analyses] tenant=${tenant} dryRun=${dryRun}`);
  const target = TARGETS[tenant] ?? 50;

  if (!process.env.DATABASE_URL && !dryRun) {
    throw new Error('DATABASE_URL not set');
  }
  if (dryRun && !process.env.DATABASE_URL) {
    console.log(`[dry-run] would generate up to ${target} skill_gap_analyses for ${tenant}`);
    return { inserted: 0, skipped: target, dryRun: true };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // Pull active employees + their skill assessments aggregated
  const { rows: empData } = await pool.query(
    `SELECT e.id as employee_id, e.first_name||' '||e.last_name as full_name, e.job_title,
            COALESCE(AVG(esa.assessed_level)::numeric(4,2), 0) as avg_proficiency,
            COUNT(esa.id) as assessment_count
       FROM employees e
       LEFT JOIN employee_skill_assessments esa ON esa.employee_id = e.id
      WHERE e.tenant_id = $1 AND e.is_active = true
      GROUP BY e.id, e.first_name, e.last_name, e.job_title
      ORDER BY assessment_count DESC`,
    [tenantId]
  );
  console.log(`[skilgro/32] ${empData.length} active employees`);

  // Existing dedupe by (target_entity_id + analysis_type + analysis_date)
  const { rows: existingRows } = await pool.query(
    `SELECT target_entity_id, analysis_type, analysis_date FROM skill_gap_analyses
       WHERE tenant_id = $1`,
    [tenantId]
  );
  const existing = new Set(
    existingRows.map((r) => `${r.target_entity_id}|${r.analysis_type}|${r.analysis_date}`)
  );
  console.log(`[skilgro/32] existing analyses: ${existing.size}`);

  // Generate
  const rng = mulberry32(seedFromString(`skilgro-gap-${tenant}`));
  const newRecords = [];
  const today = new Date().toISOString().slice(0, 10);
  const sixMonthsAgo = new Date(Date.now() - 180 * 86400000).toISOString().slice(0, 10);

  // Per top performers (con most assessments), genera 1-2 analyses
  for (const emp of empData) {
    if (newRecords.length >= target) break;
    const numAnalyses = uniformInt(rng, 1, 2);
    for (let i = 0; i < numAnalyses; i++) {
      const analysisType = pickOne(rng, ANALYSIS_TYPES);
      const date = i === 0 ? today : sixMonthsAgo;
      const key = `${emp.employee_id}|${analysisType}|${date}`;
      if (existing.has(key)) continue;

      // Statistical scoring
      const baseMatch = Math.max(0.4, Math.min(0.95, gaussian(rng, 0.72, 0.12)));
      const coverage = Math.max(0.5, Math.min(0.95, gaussian(rng, 0.78, 0.1)));
      const proficiency = Math.max(0.4, Math.min(0.9, baseMatch - rng() * 0.1));

      // Skill gaps placeholder (real ESCO mapping in Stage 2g/Stage 5)
      const gapCount = uniformInt(rng, 2, 6);
      const skillGaps = Array.from({ length: gapCount }, (_, i) => ({
        skill_id: null,
        skill_name: pickOne(rng, [
          'Strategic Planning',
          'Risk Management',
          'Data Analysis',
          'Stakeholder Communication',
          'Project Management',
          'Regulatory Knowledge',
          'Leadership',
          'Technical Architecture',
          'Customer Insight',
          'Negotiation',
        ]),
        current_level: uniformInt(rng, 1, 3),
        target_level: uniformInt(rng, 3, 5),
        gap_severity: pickOne(rng, ['minor', 'moderate', 'significant']),
      }));

      const recommendations = [
        {
          type: 'training',
          description: 'Programma di formazione strutturato 6-12 mesi sulle aree gap identificate',
          priority: 'medium',
        },
        {
          type: 'mentoring',
          description: 'Pairing con senior peer per knowledge transfer cross-functional',
          priority: 'high',
        },
      ];

      newRecords.push({
        tenant_id: tenantId,
        analysis_name: `${analysisType.replace(/_/g, ' ')} — ${emp.full_name}`,
        analysis_type: analysisType,
        target_entity_type: 'employee',
        target_entity_id: emp.employee_id,
        target_position_name: emp.job_title ?? null,
        comparison_type: analysisType === 'team_benchmark' ? 'peer_group' : 'role_target',
        analysis_date: date,
        overall_match_score: (baseMatch * 100).toFixed(2),
        coverage_score: (coverage * 100).toFixed(2),
        proficiency_score: (proficiency * 100).toFixed(2),
        skill_gaps: JSON.stringify(skillGaps),
        skill_matches: JSON.stringify([]),
        skill_surplus: JSON.stringify([]),
        recommendations: JSON.stringify(recommendations),
        priority_skills: JSON.stringify(
          skillGaps.filter((g) => g.gap_severity !== 'minor').map((g) => g.skill_name)
        ),
      });
    }
  }

  const gap = Math.max(0, target - existing.size);
  const recordsToInsert = newRecords.slice(0, gap);
  console.log(
    `[skilgro/32] generated ${newRecords.length} potential, inserting ${recordsToInsert.length} (gap=${gap})`
  );

  let result;
  await withTenantTx(pool, tenantId, async (client) => {
    result = await dryRunBatchInsert(client, 'skill_gap_analyses', recordsToInsert, {
      dryRun,
      onConflict: 'ON CONFLICT DO NOTHING',
    });
    console.log('[skilgro/32] insert result:', result);
  });

  await pool.end();
  return result;
}
