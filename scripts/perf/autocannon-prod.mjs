#!/usr/bin/env node
// Phase 14.C — Production-mode perf benchmark for dashboard data pipeline.
//
// Runs autocannon against `next start` (production build) over 9 widget data
// endpoints + 1 dashboard page render. Fails (exit 1) if P95 latency exceeds
// 500ms (target) or 600ms (acceptable upper bound — emits warning instead).
//
// Pre-req: `next build && next start` is running on http://127.0.0.1:3200
// Pre-req: a session cookie for HR_DIRECTOR (valentina.conti@rtl-bank.org).
//
// Usage:
//   COOKIE="<next-auth.session-token=...>" node scripts/perf/autocannon-prod.mjs

import autocannon from 'autocannon';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, 'results');
mkdirSync(OUT_DIR, { recursive: true });

const BASE = process.env.PERF_BASE_URL || 'http://127.0.0.1:3200';
const COOKIE = process.env.COOKIE || '';
const DURATION = Number(process.env.PERF_DURATION || 15);
const CONNECTIONS = Number(process.env.PERF_CONN || 25);

// Element IDs from phase14b/c (8 composite + 2 simple = 10 widget endpoints)
const ELEMENT_IDS = [
  31, // KpiRing live SQL (hr_director_overview)
  34, // IntegrationHealthPill
  35, // KgMiniGraph (capability_graph) - SQL static-via-SELECT
  39, // SkillHeatmap (skills_heatmap)
  42, // CareerArc (employee_journey)
  43, // CapabilityRadar (employee_journey)
  44, // KgMiniGraph (employee_journey)
  46, // RbacMatrix (org_systems) - REAL SQL
  50, // CareerArc (process_recruiting_funnel)
  51, // SkillHeatmap (process_recruiting_funnel)
];

const headers = COOKIE ? { cookie: COOKIE } : {};

async function benchEndpoint(label, url) {
  console.log(`\n→ ${label}: ${url}`);
  const result = await autocannon({
    url,
    duration: DURATION,
    connections: CONNECTIONS,
    headers,
  });
  return result;
}

async function main() {
  const results = {};
  let allP95 = [];

  // 10 widget data endpoints
  for (const id of ELEMENT_IDS) {
    const url = `${BASE}/api/dashboard/data/${id}`;
    const r = await benchEndpoint(`widget id=${id}`, url);
    results[`widget_${id}`] = {
      requests_per_sec: r.requests.average,
      latency_p95_ms: r.latency.p99,
      latency_avg_ms: r.latency.average,
      errors: r.errors,
      non2xx: r.non2xx,
    };
    allP95.push(r.latency.p99);
  }

  // 1 dashboard page render
  const pageUrl = `${BASE}/dashboard/hr_director_overview?lang=en`;
  const pageResult = await benchEndpoint('page render', pageUrl);
  results.page_render = {
    requests_per_sec: pageResult.requests.average,
    latency_p95_ms: pageResult.latency.p99,
    latency_avg_ms: pageResult.latency.average,
    errors: pageResult.errors,
    non2xx: pageResult.non2xx,
  };
  allP95.push(pageResult.latency.p99);

  const overallP95 = Math.max(...allP95);
  const summary = {
    timestamp: new Date().toISOString(),
    base: BASE,
    duration_s: DURATION,
    connections: CONNECTIONS,
    target_p95_ms: 500,
    acceptable_p95_ms: 600,
    overall_max_p95_ms: overallP95,
    verdict: overallP95 <= 500 ? 'PASS' : overallP95 <= 600 ? 'PASS_WITH_GAP' : 'FAIL',
    results,
  };

  const outFile = resolve(OUT_DIR, `perf-prod-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(outFile, JSON.stringify(summary, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Overall max P95: ${overallP95}ms (target ≤500, acceptable ≤600)`);
  console.log(`Verdict: ${summary.verdict}`);
  console.log(`Report: ${outFile}`);

  if (summary.verdict === 'FAIL') {
    console.error('\n[FAIL] P95 exceeds 600ms acceptable upper bound');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
