/**
 * lib/openai-wrapper.mjs — Cost-cap aware OpenAI FALLBACK wrapper.
 *
 * S55+ autonomous mode: research engine primary = Claude main loop (WebFetch/WebSearch
 * + reasoning interno, vedi `cascadia/research-bridge.md`). Questo wrapper resta come
 * fallback opzionale — invocato SOLO da industry-research.mjs#synthesizeIndustryProfileFallback
 * o per mass-generation ripetitive >1000 rows via engine='openai-mini' flag.
 *
 * Cost cap: OPENAI_COST_CAP_USD_DAILY env, default $5. Model: gpt-4o-mini.
 * Cache: hit-first per cache_path arg.
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
 * Fallback OpenAI chat completion (gpt-4o-mini, cost-capped).
 *
 * USAGE: invocato SOLO se Claude native path non disponibile (rate-limit) o
 * mass-generation ripetitive >1000 rows con template identico.
 *
 * Cache hit: se cache_path esiste, ritorna cached senza API call.
 *
 * @param {{
 *   prompt: string,
 *   system?: string,
 *   model?: string,
 *   max_tokens?: number,
 *   cache_path?: string | null,
 *   responseFormat?: 'json_object' | 'text'
 * }} args
 */
export async function callOpenAIFallback(args) {
  const {
    prompt,
    system = 'You are an HR strategy expert specializing in Italian labor markets.',
    model = DEFAULT_MODEL,
    max_tokens = 2000,
    cache_path = null,
    responseFormat = 'json_object',
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

  // Pre-flight: API key + cost cap
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('[openai-wrapper] OPENAI_API_KEY not set — fallback unavailable');
  }
  const approxInTokens = Math.ceil((system.length + prompt.length) / 4);
  const approxOutTokens = max_tokens;
  const estCost = estimateCostUsd(approxInTokens, approxOutTokens);
  const capUsd = Number(process.env.OPENAI_COST_CAP_USD_DAILY ?? DEFAULT_CAP_USD_DAILY);
  const check = checkCostCap(estCost, capUsd);
  if (!check.ok) {
    throw new Error(
      `[openai-wrapper] cost cap exceeded: current=${check.current_usd} estimated=${check.estimated_usd} cap=${check.cap_usd}`
    );
  }

  // Live API call (lazy SDK import per evitare hard dep se mai usato)
  let OpenAI;
  try {
    ({ default: OpenAI } = await import('openai'));
  } catch (err) {
    throw new Error(
      `[openai-wrapper] 'openai' package not installed. Run: npm install --no-save openai`
    );
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
    max_tokens,
    response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
  });

  const usage = completion.usage ?? {};
  const realCost = estimateCostUsd(
    usage.prompt_tokens ?? approxInTokens,
    usage.completion_tokens ?? approxOutTokens
  );
  addDailyCost(realCost);

  const content = completion.choices[0]?.message?.content ?? '';
  let parsed;
  try {
    parsed = responseFormat === 'json_object' ? JSON.parse(content) : { text: content };
  } catch (e) {
    throw new Error(`[openai-wrapper] response not valid JSON: ${e.message}`);
  }

  if (cache_path) {
    const fs = await import('node:fs/promises');
    await fs.writeFile(cache_path, JSON.stringify(parsed, null, 2));
  }
  return { ...parsed, _meta: { model, cost_usd: realCost, usage } };
}

// Legacy alias (deprecato — usare callOpenAIFallback)
export const callOpenAI = callOpenAIFallback;
