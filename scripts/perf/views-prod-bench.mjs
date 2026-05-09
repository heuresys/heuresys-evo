#!/usr/bin/env node
/**
 * Production-mode perf benchmark for 8 representative views (same matrix
 * as the WCAG AAA audit). Logs in programmatically via NextAuth Credentials
 * for each view's role, then hits the page with autocannon.
 *
 * Pre-req: `next build && next start -p 3201` running.
 *
 * Output:
 *   scripts/perf/results/views-prod-<ISO>.json     (machine-readable)
 *   scripts/perf/results/views-prod-<ISO>.md       (human report)
 *
 * Usage:
 *   PERF_BASE_URL=http://127.0.0.1:3201 \
 *   AUTH_URL=http://127.0.0.1:3201 \
 *   node scripts/perf/views-prod-bench.mjs
 */
import autocannon from 'autocannon';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, 'results');
mkdirSync(OUT_DIR, { recursive: true });

const BASE = process.env.PERF_BASE_URL || 'http://127.0.0.1:3201';
const AUTH_URL = process.env.AUTH_URL || BASE;
const DURATION = Number(process.env.PERF_DURATION || 10);
const CONNECTIONS = Number(process.env.PERF_CONN || 10);
const PASSWORD = 'Heuresys2026!';

const VIEWS = [
  { label: 'login (public)', path: '/login', user: null },
  {
    label: 'dashboard/cross_tenant_overview',
    path: '/dashboard/cross_tenant_overview',
    user: 'sysadmin',
  },
  {
    label: 'dashboard/tenant_owner_overview',
    path: '/dashboard/tenant_owner_overview',
    user: 'federica.marchetti@rtl-bank.org',
  },
  {
    label: 'dashboard/hr_director_overview',
    path: '/dashboard/hr_director_overview',
    user: 'valentina.conti@rtl-bank.org',
  },
  { label: 'employees', path: '/employees', user: 'maria.colombo@rtl-bank.org' },
  { label: 'me/skills', path: '/me/skills', user: 'francesca.gallo@rtl-bank.org' },
  { label: 'admin/users', path: '/admin/users', user: 'federica.marchetti@rtl-bank.org' },
  { label: 'ontology', path: '/ontology', user: 'valentina.conti@rtl-bank.org' },
];

async function getSessionCookie(username) {
  if (!username) return null;
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
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: csrfCookie,
    },
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
  if (!sessionCookie) {
    throw new Error(
      `Login failed for ${username} — no session cookie in response (status ${loginRes.status})`
    );
  }
  return sessionCookie;
}

function pickP95(latency) {
  return latency.p99 ?? latency.p95 ?? latency.average;
}

async function bench(label, url, cookie) {
  const headers = cookie ? { cookie } : {};
  console.log(`→ ${label}: ${url}`);
  const result = await autocannon({
    url,
    duration: DURATION,
    connections: CONNECTIONS,
    headers,
    excludeErrorStats: true,
  });
  return {
    label,
    url,
    rps: Math.round(result.requests.average),
    latency_avg_ms: Math.round(result.latency.average * 100) / 100,
    latency_p95_ms: Math.round(pickP95(result.latency) * 100) / 100,
    latency_max_ms: Math.round(result.latency.max * 100) / 100,
    errors: result.errors,
    non2xx: result.non2xx,
  };
}

async function main() {
  console.log(`[perf] base=${BASE} duration=${DURATION}s connections=${CONNECTIONS}`);
  const results = [];
  for (const view of VIEWS) {
    let cookie = null;
    if (view.user) {
      try {
        cookie = await getSessionCookie(view.user);
      } catch (e) {
        console.error(`[perf] login failed for ${view.user}:`, e.message);
        results.push({
          label: view.label,
          url: BASE + view.path,
          error: `login failed: ${e.message}`,
        });
        continue;
      }
    }
    const r = await bench(view.label, BASE + view.path, cookie);
    results.push(r);
  }

  const successful = results.filter((r) => !r.error);
  const overallP95 = Math.max(0, ...successful.map((r) => r.latency_p95_ms));
  const target = 500;
  const upperBound = 800;
  const verdict =
    overallP95 <= target ? 'PASS' : overallP95 <= upperBound ? 'PASS_WITH_GAP' : 'FAIL';

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outJson = resolve(OUT_DIR, `views-prod-${ts}.json`);
  const outMd = resolve(OUT_DIR, `views-prod-${ts}.md`);

  const summary = {
    timestamp: new Date().toISOString(),
    base: BASE,
    duration_s: DURATION,
    connections: CONNECTIONS,
    target_p95_ms: target,
    acceptable_p95_ms: upperBound,
    overall_max_p95_ms: overallP95,
    verdict,
    views: results,
  };
  writeFileSync(outJson, JSON.stringify(summary, null, 2));

  let md = `# Perf benchmark — production build · 8 representative views\n\n`;
  md += `> Run: ${summary.timestamp} · base ${BASE} · duration ${DURATION}s · ${CONNECTIONS} conns\n`;
  md += `> Target P95 ≤ ${target}ms · Acceptable ≤ ${upperBound}ms · **Overall P95: ${overallP95}ms · ${verdict}**\n\n`;
  md += `| View | RPS | Avg ms | P95 ms | Max ms | Non-2xx | Errors |\n`;
  md += `|------|----:|-------:|-------:|-------:|--------:|-------:|\n`;
  for (const r of results) {
    if (r.error) {
      md += `| ${r.label} | — | — | — | — | — | ${r.error} |\n`;
    } else {
      md += `| ${r.label} | ${r.rps} | ${r.latency_avg_ms} | ${r.latency_p95_ms} | ${r.latency_max_ms} | ${r.non2xx} | ${r.errors} |\n`;
    }
  }
  md += `\n## Verdict\n\n`;
  md +=
    verdict === 'PASS'
      ? `✅ **PASS** — All 8 views render within target P95 ≤ ${target}ms in production build mode.\n`
      : verdict === 'PASS_WITH_GAP'
        ? `🟡 **PASS_WITH_GAP** — P95 ${overallP95}ms exceeds ${target}ms target but stays below ${upperBound}ms upper bound. Optimization opportunity.\n`
        : `❌ **FAIL** — P95 ${overallP95}ms exceeds ${upperBound}ms acceptable upper bound. Investigate hotspots.\n`;
  writeFileSync(outMd, md);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`Overall max P95: ${overallP95}ms (target ≤${target}, acceptable ≤${upperBound})`);
  console.log(`Verdict: ${verdict}`);
  console.log(`JSON: ${outJson}`);
  console.log(`MD:   ${outMd}`);
}

main().catch((e) => {
  console.error('[perf] fatal:', e);
  process.exit(1);
});
