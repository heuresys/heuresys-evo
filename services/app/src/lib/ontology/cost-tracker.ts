/**
 * Phase 14 Sprint 2.F — Daily cost tracker for the OpenAI advisor.
 *
 * Process-local fallback (in-memory map keyed by UTC day). Production should
 * upgrade to Redis with the same interface so cross-instance cap enforcement
 * works under horizontal scaling.
 */

import { dailyCostKey, estimateCostUsd } from './openai-client';

interface CostBucket {
  totalUsd: number;
  requests: number;
}

const buckets = new Map<string, CostBucket>();

function getBucket(key: string): CostBucket {
  let b = buckets.get(key);
  if (!b) {
    b = { totalUsd: 0, requests: 0 };
    buckets.set(key, b);
  }
  return b;
}

export interface CostCheckResult {
  allowed: boolean;
  todayUsd: number;
  capUsd: number;
}

export function checkCostCap(capUsdDaily: number): CostCheckResult {
  const key = dailyCostKey();
  const bucket = getBucket(key);
  return { allowed: bucket.totalUsd < capUsdDaily, todayUsd: bucket.totalUsd, capUsd: capUsdDaily };
}

export function recordCost(model: string, inputTokens: number, outputTokens: number): number {
  const usd = estimateCostUsd(model, inputTokens, outputTokens);
  const bucket = getBucket(dailyCostKey());
  bucket.totalUsd += usd;
  bucket.requests += 1;
  return usd;
}

/** Test-only — clear all buckets. Not exported for production callers. */
export const __testing = {
  reset: (): void => {
    buckets.clear();
  },
  setBucket: (key: string, bucket: CostBucket): void => {
    buckets.set(key, bucket);
  },
};
