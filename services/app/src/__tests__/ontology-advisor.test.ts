/**
 * Phase 14 Sprint 2.F — Ontology advisor unit tests.
 *
 * Covers the wrapper helpers without hitting the real OpenAI API.
 *   - isAdvisorEnabled: env-driven boolean
 *   - estimateCostUsd: pricing math
 *   - cost-tracker: cap enforcement + recording
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  estimateCostUsd,
  isAdvisorEnabled,
  readAdvisorConfig,
  dailyCostKey,
} from '@/lib/ontology/openai-client';
import { __testing, checkCostCap, recordCost } from '@/lib/ontology/cost-tracker';

describe('openai-client config', () => {
  const ORIG_KEY = process.env.OPENAI_API_KEY;
  const ORIG_MODEL = process.env.OPENAI_MODEL;
  const ORIG_CAP = process.env.OPENAI_COST_CAP_USD_DAILY;

  afterEach(() => {
    process.env.OPENAI_API_KEY = ORIG_KEY;
    process.env.OPENAI_MODEL = ORIG_MODEL;
    process.env.OPENAI_COST_CAP_USD_DAILY = ORIG_CAP;
  });

  it('isAdvisorEnabled returns false when OPENAI_API_KEY is missing/empty', () => {
    delete process.env.OPENAI_API_KEY;
    expect(isAdvisorEnabled(readAdvisorConfig())).toBe(false);
    process.env.OPENAI_API_KEY = '';
    expect(isAdvisorEnabled(readAdvisorConfig())).toBe(false);
    process.env.OPENAI_API_KEY = '   ';
    expect(isAdvisorEnabled(readAdvisorConfig())).toBe(false);
  });

  it('isAdvisorEnabled returns true with a non-empty key', () => {
    process.env.OPENAI_API_KEY = 'sk-test-fake';
    expect(isAdvisorEnabled(readAdvisorConfig())).toBe(true);
  });

  it('readAdvisorConfig defaults model + cost cap when env not set', () => {
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_COST_CAP_USD_DAILY;
    const cfg = readAdvisorConfig();
    expect(cfg.model).toBe('gpt-4o-mini');
    expect(cfg.costCapUsdDaily).toBe(5);
  });

  it('estimateCostUsd uses gpt-4o-mini rates by default', () => {
    // 1000 input + 500 output on gpt-4o-mini:
    //   (1000/1e6)*0.15 + (500/1e6)*0.60 = 0.00015 + 0.00030 = 0.00045
    expect(estimateCostUsd('gpt-4o-mini', 1000, 500)).toBeCloseTo(0.00045, 6);
  });

  it('estimateCostUsd handles unknown model by falling back to mini rates', () => {
    expect(estimateCostUsd('some-future-model', 1000, 500)).toBeCloseTo(0.00045, 6);
  });

  it('dailyCostKey is UTC-stable for a fixed instant', () => {
    expect(dailyCostKey(new Date('2026-05-07T10:30:00Z'))).toBe('openai:cost:2026-05-07');
  });
});

describe('cost-tracker cap enforcement', () => {
  beforeEach(() => {
    __testing.reset();
  });

  it('checkCostCap allows requests when bucket is empty', () => {
    const r = checkCostCap(5);
    expect(r.allowed).toBe(true);
    expect(r.todayUsd).toBe(0);
    expect(r.capUsd).toBe(5);
  });

  it('recordCost accumulates and disallows once cap is reached', () => {
    // Big cost record that exceeds $1 cap
    recordCost('gpt-4o', 100_000, 50_000); // ≈ 0.25 + 0.50 = $0.75
    expect(checkCostCap(1).allowed).toBe(true);
    recordCost('gpt-4o', 100_000, 50_000); // total ≈ $1.50
    expect(checkCostCap(1).allowed).toBe(false);
  });

  it('different days have isolated buckets', () => {
    __testing.setBucket('openai:cost:2020-01-01', { totalUsd: 999, requests: 1 });
    expect(checkCostCap(5).allowed).toBe(true); // today's bucket still empty
  });
});
