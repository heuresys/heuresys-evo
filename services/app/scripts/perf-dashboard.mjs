#!/usr/bin/env node
/**
 * Phase 14.A.7 — Dashboard load test (P95 ≤ 500ms target).
 *
 * Logs in via NextAuth, then drives autocannon against the chosen path with
 * the session cookie attached. Reports throughput + P50/P95/P99 latency.
 *
 * Usage:
 *   node scripts/perf-dashboard.mjs [path] [duration_s] [connections]
 * Examples:
 *   node scripts/perf-dashboard.mjs                                # default /dashboard/hr_director_overview · 10s · 100c
 *   node scripts/perf-dashboard.mjs /api/dashboard/data/31 20 50   # data endpoint · 20s · 50c
 *
 * Env:
 *   HEURESYS_BASE_URL   default http://localhost:3200
 *   HEURESYS_USERNAME   default rtl-bank.valentina.conti
 *   HEURESYS_PASSWORD   default Heuresys2026!
 *
 * Note: dev mode (turbopack) has overhead. For binding numbers, run after
 * `npm run build` + `npm start` (production). This script is mode-agnostic.
 */

import autocannon from 'autocannon';

const BASE = process.env.HEURESYS_BASE_URL ?? 'http://localhost:3200';
const USER = process.env.HEURESYS_USERNAME ?? 'rtl-bank.valentina.conti';
const PASS = process.env.HEURESYS_PASSWORD ?? 'Heuresys2026!';
const TARGET_PATH = process.argv[2] ?? '/dashboard/hr_director_overview';
const DURATION = Number(process.argv[3] ?? 10);
const CONNECTIONS = Number(process.argv[4] ?? 100);

async function login() {
  // 1. CSRF token + cookie
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const csrfJson = await csrfRes.json();
  const csrfCookie = csrfRes.headers
    .getSetCookie()
    .find((c) => c.startsWith('next-auth.csrf-token='))
    ?.split(';')[0];
  if (!csrfCookie) throw new Error('failed to obtain CSRF cookie');

  // 2. POST credentials
  const body = new URLSearchParams({
    username: USER,
    password: PASS,
    csrfToken: csrfJson.csrfToken,
    json: 'true',
  });
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: csrfCookie,
    },
    body,
  });
  const sessionCookie = loginRes.headers
    .getSetCookie()
    .find((c) => c.startsWith('authjs.session-token='))
    ?.split(';')[0];
  if (!sessionCookie) {
    const text = await loginRes.text();
    throw new Error(`login failed: ${loginRes.status} ${text}`);
  }
  return sessionCookie;
}

async function probe(cookie) {
  const r = await fetch(`${BASE}${TARGET_PATH}`, { headers: { Cookie: cookie } });
  if (!r.ok) throw new Error(`probe failed: ${r.status} ${r.statusText}`);
  return r.status;
}

function fmtMs(n) {
  return `${n.toFixed(1)}ms`;
}

(async () => {
  console.log(`[perf] login as ${USER} on ${BASE}`);
  const cookie = await login();
  const probeStatus = await probe(cookie);
  console.log(`[perf] probe ${TARGET_PATH} → HTTP ${probeStatus}`);

  console.log(`[perf] autocannon ${TARGET_PATH} · ${CONNECTIONS} connections · ${DURATION}s`);
  const result = await autocannon({
    url: `${BASE}${TARGET_PATH}`,
    duration: DURATION,
    connections: CONNECTIONS,
    headers: { cookie },
  });

  const { latency, requests, throughput, errors, non2xx, '2xx': twoXx } = result;
  // autocannon fields can be undefined when sample count is tiny; guard each.
  const f = (v) => (typeof v === 'number' ? fmtMs(v) : 'n/a');
  const p95 = latency.p95 ?? latency.p97_5 ?? latency.average;

  console.log('\n=== Results ===');
  console.log(`  Requests/s:  ${requests.average.toFixed(0)} (avg) · ${requests.max} (peak)`);
  console.log(`  Throughput:  ${((throughput.average ?? 0) / 1024).toFixed(1)} KiB/s`);
  console.log(`  Latency:`);
  console.log(`    avg:  ${f(latency.average)}`);
  console.log(`    p50:  ${f(latency.p50)}`);
  console.log(`    p95:  ${f(p95)}`);
  console.log(`    p99:  ${f(latency.p99)}`);
  console.log(`    max:  ${f(latency.max)}`);
  console.log(`  HTTP:`);
  console.log(`    2xx:  ${twoXx ?? 0}`);
  console.log(`    non2xx: ${non2xx ?? 0}`);
  console.log(`    errors: ${errors ?? 0}`);

  const TARGET_P95_MS = Number(process.env.HEURESYS_PERF_TARGET_P95_MS ?? 500);
  const ok2xx = (twoXx ?? 0) > 0;
  const pass = ok2xx && (errors ?? 0) === 0 && (non2xx ?? 0) === 0 && p95 <= TARGET_P95_MS;
  console.log(`\n=== Verdict (target p95 ≤ ${TARGET_P95_MS}ms · prod mode binding) ===`);
  console.log(`  ${pass ? 'PASS ✅' : 'FAIL ❌'}  (p95=${f(p95)})`);
  console.log(
    `\n[note] dev server (turbopack) = ballpark only — for binding numbers run` +
      `\n       NODE_ENV=production npm run build && npm start, then re-run this script.`
  );
  process.exit(pass ? 0 : 1);
})().catch((err) => {
  console.error('[perf] fatal:', err.message);
  process.exit(2);
});
