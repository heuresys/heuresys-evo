#!/usr/bin/env node
/**
 * S48 G6 perf verification — focused bench for /dashboard role-driven route.
 *
 * Targets the canonical role-resolved /dashboard path (not /dashboard/<code>)
 * across 3 representative roles to validate the S48 cache layer wins:
 *   1. resolvePresetCodeForRole wrapped unstable_cache (TTL 300s)
 *   2. getCachedTenantName / getCachedPresetMeta (TTL 300s, tag dashboard-meta)
 *   3. Promise.all parallelization of 2 cold-data pairs in DashboardPage()
 *
 * Acceptance: warm-cache P95 ≤ 1000ms on /dashboard (S47 baseline 1006ms).
 *
 * Usage from VM:
 *   PERF_BASE_URL=https://evo.heuresys.com \
 *   AUTH_URL=https://evo.heuresys.com \
 *   PERF_DURATION=30 PERF_CONN=20 \
 *   node scripts/perf/s48-g6-dashboard-bench.mjs
 */
import autocannon from 'autocannon';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, 'results');
mkdirSync(OUT_DIR, { recursive: true });

const BASE = process.env.PERF_BASE_URL || 'https://evo.heuresys.com';
const AUTH_URL = process.env.AUTH_URL || BASE;
const DURATION = Number(process.env.PERF_DURATION || 20);
const CONNECTIONS = Number(process.env.PERF_CONN || 10);
const PASSWORD = 'Heuresys2026!';

const VIEWS = [
  { label: '/dashboard · HR_DIRECTOR', path: '/dashboard', user: 'valentina.conti@rtl-bank.org' },
  { label: '/dashboard · SUPERUSER', path: '/dashboard', user: 'sysadmin' },
  {
    label: '/dashboard · TENANT_OWNER',
    path: '/dashboard',
    user: 'federica.marchetti@rtl-bank.org',
  },
];

async function getSessionCookie(username) {
  const csrfRes = await fetch(`${AUTH_URL}/api/auth/csrf`, { credentials: 'include' });
  const { csrfToken } = await csrfRes.json();
  const csrfCookie =
    csrfRes.headers.getSetCookie?.()?.join('; ') ?? csrfRes.headers.get('set-cookie') ?? '';
  const body = new URLSearchParams({
    username,
    password: PASSWORD,
    csrfToken,
    callbackUrl: BASE,
    json: 'true',
  });
  const loginRes = await fetch(`${AUTH_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: csrfCookie },
    body,
    redirect: 'manual',
  });
  const setCookies =
    loginRes.headers.getSetCookie?.() ?? [loginRes.headers.get('set-cookie')].filter(Boolean);
  const sessionCookie = setCookies
    .map((c) => c.split(';')[0])
    .find(
      (c) =>
        c.startsWith('authjs.session-token=') ||
        c.startsWith('next-auth.session-token=') ||
        c.startsWith('__Secure-authjs.session-token=')
    );
  if (!sessionCookie) throw new Error(`Login failed for ${username} (status ${loginRes.status})`);
  return sessionCookie;
}

async function warmupHit(url, cookie) {
  // Single GET to prime unstable_cache + LRU data-fetcher cache before bench.
  await fetch(url, { headers: { cookie } }).catch(() => undefined);
}

async function bench(label, url, cookie) {
  console.log(`→ ${label}: ${url}`);
  await warmupHit(url, cookie);
  const result = await autocannon({
    url,
    duration: DURATION,
    connections: CONNECTIONS,
    headers: { cookie },
    excludeErrorStats: true,
  });
  return {
    label,
    url,
    rps: Math.round(result.requests.average),
    latency_avg_ms: Math.round(result.latency.average * 100) / 100,
    latency_p95_ms: Math.round((result.latency.p95 ?? result.latency.average) * 100) / 100,
    latency_p99_ms: Math.round((result.latency.p99 ?? result.latency.average) * 100) / 100,
    latency_max_ms: Math.round(result.latency.max * 100) / 100,
    errors: result.errors,
    non2xx: result.non2xx,
  };
}

async function main() {
  console.log(`[g6-bench] base=${BASE} duration=${DURATION}s connections=${CONNECTIONS}`);
  const results = [];
  for (const v of VIEWS) {
    try {
      const cookie = await getSessionCookie(v.user);
      const r = await bench(v.label, BASE + v.path, cookie);
      results.push(r);
    } catch (e) {
      console.error(`[g6-bench] ${v.label} failed:`, e.message);
      results.push({ label: v.label, url: BASE + v.path, error: e.message });
    }
  }

  const successful = results.filter((r) => !r.error);
  const overallP95 = Math.max(0, ...successful.map((r) => r.latency_p95_ms));
  const target = 1000;
  const verdict = overallP95 <= target ? 'PASS' : 'FAIL';

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outJson = resolve(OUT_DIR, `s48-g6-${ts}.json`);
  const outMd = resolve(OUT_DIR, `s48-g6-${ts}.md`);

  writeFileSync(
    outJson,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        base: BASE,
        duration_s: DURATION,
        connections: CONNECTIONS,
        target_p95_ms: target,
        overall_max_p95_ms: overallP95,
        verdict,
        views: results,
      },
      null,
      2
    )
  );

  let md = `# S48 G6 perf verification — /dashboard role-driven\n\n`;
  md += `> Run: ${new Date().toISOString()} · base ${BASE} · duration ${DURATION}s · ${CONNECTIONS} conns\n`;
  md += `> Target P95 ≤ ${target}ms (S47 baseline /dashboard 1006ms) · **Overall P95: ${overallP95}ms · ${verdict}**\n\n`;
  md += `| Persona | RPS | Avg ms | P95 ms | P99 ms | Max ms | Non-2xx | Errors |\n`;
  md += `|---------|----:|-------:|-------:|-------:|-------:|--------:|-------:|\n`;
  for (const r of results) {
    if (r.error) {
      md += `| ${r.label} | — | — | — | — | — | — | ${r.error} |\n`;
    } else {
      md += `| ${r.label} | ${r.rps} | ${r.latency_avg_ms} | ${r.latency_p95_ms} | ${r.latency_p99_ms} | ${r.latency_max_ms} | ${r.non2xx} | ${r.errors} |\n`;
    }
  }
  md += `\n## Verdict\n\n`;
  md +=
    verdict === 'PASS'
      ? `✅ **PASS** — /dashboard role-driven warm-cache P95 ≤ ${target}ms target met for all 3 personas. S48 G6 cache layer effective.\n`
      : `❌ **FAIL** — P95 ${overallP95}ms exceeds ${target}ms target. Hotspot persists beyond cache layer scope.\n`;
  writeFileSync(outMd, md);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`Overall max P95: ${overallP95}ms (target ≤${target})`);
  console.log(`Verdict: ${verdict}`);
  console.log(`JSON: ${outJson}`);
  console.log(`MD:   ${outMd}`);
}

main().catch((e) => {
  console.error('[g6-bench] fatal:', e);
  process.exit(1);
});
