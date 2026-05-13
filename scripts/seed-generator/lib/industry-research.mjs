/**
 * lib/industry-research.mjs — Industry profile reader + (fallback) synthesizer.
 *
 * Path principale (S55+ autonomous mode): Claude main loop produce/aggiorna
 * `<tenant>_industry_profile.json` via WebSearch/WebFetch + reasoning interno
 * (vedi `cascadia/research-bridge.md`). Questo modulo si limita a:
 *   - leggere il profile cached
 *   - validarlo via lib/zod-schemas#IndustryProfileSchema
 *   - esporre fallback OpenAI gpt-4o-mini SOLO se invocato esplicitamente
 *
 * Cache: `db/seeds/realistic/_research_cache/`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { callOpenAIFallback } from './openai-wrapper.mjs';
import { IndustryProfileSchema, validateIndustryProfile } from './zod-schemas.mjs';

const CACHE_DIR = 'db/seeds/realistic/_research_cache';

/**
 * Normalize tenant code (slug) → filename stem.
 * Convention: tenant codes use hyphen ('rtl-bank'), filenames use underscore
 * ('rtl_bank_industry_profile.json'). Heuresys System maps to 'heuresys'.
 */
function tenantFileStem(tenantCode) {
  if (tenantCode === 'heuresys-system') return 'heuresys';
  return tenantCode.replace(/-/g, '_');
}

/**
 * Carica profile cached + valida via zod. Throw se mancante o invalid.
 * Path principale per stage scripts.
 */
export async function loadValidatedProfile(tenantCode) {
  const stem = tenantFileStem(tenantCode);
  const profilePath = path.join(CACHE_DIR, `${stem}_industry_profile.json`);
  let raw;
  try {
    raw = JSON.parse(await fs.readFile(profilePath, 'utf-8'));
  } catch (err) {
    throw new Error(
      `[industry-research] profile not found at ${profilePath}. ` +
        `In autonomous mode, Claude main loop must generate it via WebFetch/WebSearch first.`
    );
  }
  const result = validateIndustryProfile(raw);
  if (!result.ok) {
    throw new Error(
      `[industry-research] profile at ${profilePath} failed zod validation:\n${JSON.stringify(result.error, null, 2)}`
    );
  }
  return result.data;
}

/**
 * Fetch raw research data per NACE — stub passive (no live fetch).
 * Riempire via Claude main loop WebFetch/WebSearch e salvare manualmente.
 */
export async function fetchRawResearch(naceCode, options = {}) {
  const cachePath = path.join(CACHE_DIR, `raw_${naceCode}_${dateStamp()}.json`);
  try {
    return JSON.parse(await fs.readFile(cachePath, 'utf-8'));
  } catch {
    throw new Error(
      `[industry-research] raw research for NACE ${naceCode} not yet cached. ` +
        `In autonomous mode, populate ${cachePath} via Claude main loop research, ` +
        `then re-invoke this script.`
    );
  }
}

/**
 * FALLBACK synthesizer — usa OpenAI gpt-4o-mini SOLO se invocato con engine='openai-mini'.
 * Path principale: Claude main loop produce direttamente il profile JSON.
 */
export async function synthesizeIndustryProfileFallback({
  tenant_code,
  nace_code,
  raw_research,
  engine = 'claude-native',
}) {
  const profilePath = path.join(CACHE_DIR, `${tenant_code}_industry_profile.json`);

  // Cache hit
  try {
    return JSON.parse(await fs.readFile(profilePath, 'utf-8'));
  } catch {
    // miss
  }

  if (engine !== 'openai-mini') {
    throw new Error(
      `[industry-research] no cached profile at ${profilePath} and engine='${engine}'. ` +
        `Either generate via Claude main loop (preferred) or pass engine='openai-mini' for OpenAI fallback.`
    );
  }

  const prompt = buildPrompt(tenant_code, nace_code, raw_research);
  const llmResponse = await callOpenAIFallback({
    prompt,
    system:
      'You are an HR strategy expert specializing in Italian labor markets, ESCO taxonomy, and organizational design.',
    max_tokens: 3000,
    cache_path: profilePath,
  });

  await fs.writeFile(profilePath, JSON.stringify(llmResponse, null, 2));
  return llmResponse;
}

function buildPrompt(tenant_code, nace_code, raw) {
  return `Given the following raw research data for an Italian company in NACE class ${nace_code}, produce a structured industry profile JSON matching the schema specified in the heuresys-evo plan.

Tenant code: ${tenant_code}
NACE: ${nace_code}

Raw research data:
${JSON.stringify(raw, null, 2)}

Produce JSON with fields:
- nace_class_code, nace_label_it, sub_industry (array), company_size_code
- workforce_baseline (total_employees_canonical, org_depth_typical, span_of_control_max, fte_by_function map)
- org_structure_template (root, depth_1 array, typical_units array)
- process_blueprint (value_chain array, support array, typical_count, critical_processes)
- role_inventory (total_unique_roles, canonical_roles)
- skill_emphasis (primary_esco_occupations, critical_skills)
- kpi_framework (operational, strategic, compliance, regulatory)
- compliance_frameworks (array)
- assessment_patterns
- italian_context (ccnl_reference, payroll_specifics, sindacati)
- stakeholder_profile, ld_focus_areas, recruiting_focus

Be specific to Italian commercial banking / food mfg / renewable energy / SaaS sector as appropriate.
Return ONLY valid JSON, no markdown wrapping.`;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

export function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}
