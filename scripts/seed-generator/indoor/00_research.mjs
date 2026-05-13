/**
 * indoor/00_research.mjs — INDOOR research entry (Claude-native primary).
 *
 * In autonomous mode, questo script NON effettua chiamate LLM. La research
 * (WebSearch/WebFetch + reasoning + JSON synthesis) viene eseguita dalla
 * Claude main loop che produce `<tenant>_industry_profile.json` cached.
 *
 * Lo script si limita a:
 *   1. Verifica esistenza cached profile
 *   2. Validate via zod (lib/zod-schemas.mjs)
 *   3. Log summary
 *
 * Fallback OpenAI gpt-4o-mini disponibile via `--engine=openai-mini`.
 */

import { loadValidatedProfile } from '../lib/industry-research.mjs';

export async function runStage({ tenant, dryRun, engine }) {
  console.log(`[indoor/00_research] tenant=${tenant} dryRun=${dryRun} engine=${engine}`);

  if (engine === 'openai-mini') {
    console.log(
      '[indoor/00_research] engine=openai-mini → OpenAI fallback path not exercised in autonomous mode.'
    );
    console.log(
      '  To run fallback: import synthesizeIndustryProfileFallback from lib/industry-research.mjs'
    );
    return;
  }

  // Claude-native: profile already produced by main loop
  let profile;
  try {
    profile = await loadValidatedProfile(tenant);
  } catch (err) {
    console.error(err.message);
    if (dryRun) {
      console.log(
        '[indoor/00_research] dry-run: would FAIL if profile missing. Generate via Claude main loop first.'
      );
      return;
    }
    throw err;
  }

  console.log('[indoor/00_research] OK — profile loaded + zod-validated', {
    tenant_code: profile.tenant_code,
    schema_version: profile.schema_version,
    nace: profile.industry_classification.nace_class_code,
    canonical_roles_count: profile.role_inventory.canonical_roles?.length ?? 0,
    kpi_total:
      (profile.kpi_framework.operational?.length ?? 0) +
      (profile.kpi_framework.strategic?.length ?? 0) +
      (profile.kpi_framework.compliance_regulatory?.length ?? 0) +
      (profile.kpi_framework.people_culture?.length ?? 0),
    compliance_frameworks_count: profile.compliance_frameworks?.length ?? 0,
    ccnl: profile.italian_context.ccnl_reference_code,
  });
  console.log('research delegated to Claude main loop');
}
