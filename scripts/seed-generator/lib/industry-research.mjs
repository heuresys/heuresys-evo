/**
 * lib/industry-research.mjs — Web research + LLM synthesis for INDOOR cascade.
 *
 * Goal: produce `<tenant>_industry_profile.json` deterministico per ognuno dei 4 tenant.
 * Combina web research (ESCO REST, Eurostat, OECD) + LLM synthesis (cost-capped).
 * Cache versionato in `db/seeds/realistic/_research_cache/`.
 *
 * Schema output: vedi plan canonical (`~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`)
 * sezione "Industry profile JSON schema".
 */

import { callOpenAI } from './openai-wrapper.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const CACHE_DIR = 'db/seeds/realistic/_research_cache';

/**
 * Fetch raw research data for a NACE class.
 * Stub for now — actual implementation will fetch ESCO REST / Eurostat / OECD.
 */
export async function fetchRawResearch(naceCode, options = {}) {
  // Plan: curl https://ec.europa.eu/esco/api/... + Eurostat SDMX-JSON + OECD
  // Output: { esco: {...}, eurostat: {...}, oecd: {...} } JSON
  const cachePath = path.join(CACHE_DIR, `raw_${naceCode}_${dateStamp()}.json`);
  try {
    return JSON.parse(await fs.readFile(cachePath, 'utf-8'));
  } catch {
    throw new Error(
      `[industry-research] raw research for NACE ${naceCode} not yet cached. Populate ${cachePath} manually or implement live fetch.`
    );
  }
}

/**
 * Synthesize industry profile JSON from raw research via LLM.
 */
export async function synthesizeIndustryProfile({ tenant_code, nace_code, raw_research }) {
  const profilePath = path.join(CACHE_DIR, `${tenant_code}_industry_profile.json`);

  // Cache hit
  try {
    return JSON.parse(await fs.readFile(profilePath, 'utf-8'));
  } catch {
    // miss
  }

  const prompt = buildPrompt(tenant_code, nace_code, raw_research);
  const llmResponse = await callOpenAI({
    prompt,
    system:
      'You are an HR strategy expert specializing in Italian labor markets, ESCO taxonomy, and organizational design.',
    max_tokens: 3000,
    cache_path: profilePath,
  });

  // Validate + save (zod schema validation TBD)
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
