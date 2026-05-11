/**
 * lib/openai-wrapper.mjs — Cost-cap aware OpenAI wrapper for INDOOR research.
 *
 * Reuses cost-cap mechanism from `services/app/src/lib/ontology/openai-client.ts`
 * (OPENAI_COST_CAP_USD_DAILY, default $5). Model default: gpt-4o-mini.
 *
 * Use case: industry profile synthesis from raw research JSON (web research output).
 * Output structured (zod-validated downstream).
 */

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_PRICING = { inUsdPerMillion: 0.15, outUsdPerMillion: 0.6 };
const DEFAULT_CAP_USD_DAILY = 5;

/**
 * Estimate cost in USD for a single completion.
 */
export function estimateCostUsd(inputTokens, outputTokens, pricing = DEFAULT_PRICING) {
  return (
    (inputTokens * pricing.inUsdPerMillion + outputTokens * pricing.outUsdPerMillion) / 1_000_000
  );
}

/**
 * Daily key for cost tracking (YYYY-MM-DD UTC).
 */
export function dailyKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * In-memory daily cost tracker (per process).
 * Production would use DB-backed table; for seed scripts (one-shot) in-memory is sufficient.
 */
const dailyCostMap = new Map();

export function getDailyCost(date = new Date()) {
  return dailyCostMap.get(dailyKey(date)) ?? 0;
}

export function addDailyCost(usd, date = new Date()) {
  const k = dailyKey(date);
  dailyCostMap.set(k, (dailyCostMap.get(k) ?? 0) + usd);
}

/**
 * Pre-flight cost check. Returns { ok: true } or { ok: false, reason }.
 */
export function checkCostCap(estimatedUsd, capUsd = DEFAULT_CAP_USD_DAILY) {
  const current = getDailyCost();
  if (current + estimatedUsd > capUsd) {
    return {
      ok: false,
      reason: `cost_cap_exceeded`,
      current_usd: current,
      estimated_usd: estimatedUsd,
      cap_usd: capUsd,
    };
  }
  return { ok: true, current_usd: current, estimated_usd: estimatedUsd };
}

/**
 * Call OpenAI chat completion with cost cap enforcement.
 * Stub for now — actual implementation will use `openai` SDK or fetch directly.
 * Cache hit: if cache file exists, return cached response without API call.
 *
 * @param {{
 *   prompt: string,
 *   system?: string,
 *   model?: string,
 *   max_tokens?: number,
 *   cache_path?: string | null
 * }} args
 */
export async function callOpenAI(args) {
  const {
    prompt,
    system = 'You are an HR strategy expert specializing in Italian labor markets.',
    model = DEFAULT_MODEL,
    max_tokens = 2000,
    cache_path = null,
  } = args;

  // Try cache first
  if (cache_path) {
    const fs = await import('node:fs/promises');
    try {
      const cached = await fs.readFile(cache_path, 'utf-8');
      return { ...JSON.parse(cached), from_cache: true };
    } catch {
      // miss, continue
    }
  }

  // Estimate cost pre-call
  const approxInTokens = Math.ceil((system.length + prompt.length) / 4);
  const approxOutTokens = max_tokens;
  const estCost = estimateCostUsd(approxInTokens, approxOutTokens);
  const check = checkCostCap(estCost);
  if (!check.ok) {
    throw new Error(
      `[openai-wrapper] cost cap exceeded: current=${check.current_usd} estimated=${check.estimated_usd} cap=${check.cap_usd}`
    );
  }

  // Actual API call — defer implementation: this stub returns a placeholder.
  // Real impl: import { OpenAI } from 'openai'; const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); ...
  throw new Error(
    '[openai-wrapper] live OpenAI call not yet implemented — populate cache_path manually for now'
  );
}
