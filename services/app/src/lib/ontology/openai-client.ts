/**
 * Phase 14 Sprint 2.F — OpenAI client wrapper for the ontology advisor.
 *
 * Centralizes the env-driven configuration so the route handler can stay
 * thin. When `OPENAI_API_KEY` is not set the wrapper exposes
 * `isAdvisorEnabled() === false` and the route returns 503 instead of
 * instantiating the client.
 *
 * Cost cap is intentionally conservative (USD 5/day default) — production
 * deployments can override via env. The Redis counter is keyed on the day
 * (UTC) so it auto-resets at 00:00 UTC. Pricing uses gpt-4o-mini's published
 * input+output token rates as a proxy; for higher-fidelity accounting we'd
 * add per-model coefficients.
 */

import OpenAI from 'openai';

export interface AdvisorConfig {
  apiKey: string | null;
  model: string;
  costCapUsdDaily: number;
  timeoutMs: number;
}

export function readAdvisorConfig(): AdvisorConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim() || null;
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';
  const costCapUsdDaily = Number(process.env.OPENAI_COST_CAP_USD_DAILY || '5');
  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS || '30000');
  return { apiKey, model, costCapUsdDaily, timeoutMs };
}

export function isAdvisorEnabled(cfg: AdvisorConfig = readAdvisorConfig()): boolean {
  return cfg.apiKey !== null && cfg.apiKey.length > 0;
}

let cachedClient: OpenAI | null = null;
export function getOpenAIClient(cfg: AdvisorConfig = readAdvisorConfig()): OpenAI {
  if (!cfg.apiKey) {
    throw new Error('OpenAI client requested but OPENAI_API_KEY is not set');
  }
  if (cachedClient) return cachedClient;
  cachedClient = new OpenAI({ apiKey: cfg.apiKey, timeout: cfg.timeoutMs });
  return cachedClient;
}

/**
 * gpt-4o-mini pricing (USD per 1M tokens, 2026):
 *   input  : 0.15
 *   output : 0.60
 * https://openai.com/api/pricing
 */
const MODEL_RATES: Record<string, { inUsdPerMillion: number; outUsdPerMillion: number }> = {
  'gpt-4o-mini': { inUsdPerMillion: 0.15, outUsdPerMillion: 0.6 },
  'gpt-4o': { inUsdPerMillion: 2.5, outUsdPerMillion: 10 },
};

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const fallback = { inUsdPerMillion: 0.15, outUsdPerMillion: 0.6 };
  const rate = MODEL_RATES[model] ?? fallback;
  return (
    (inputTokens / 1_000_000) * rate.inUsdPerMillion +
    (outputTokens / 1_000_000) * rate.outUsdPerMillion
  );
}

/** UTC YYYY-MM-DD, used as the Redis cost-counter bucket. */
export function dailyCostKey(date: Date = new Date()): string {
  return `openai:cost:${date.toISOString().slice(0, 10)}`;
}
