# heuresys-evo — Current State

> Updated: 2026-05-12T04:00Z · S44 Lighthouse 100/100 + bulk WCAG palette + perf bench baseline

## Last session brief

S44: Lighthouse 100/100 Accessibility raggiunto in production build (post bulk WCAG dark-palette audit). 13 valori `--ink-tertiary` bumped sopra threshold 4.5:1 (palette legacy + alpha + 11 alt). Perf bench autocannon su 9 routes: solo 2/9 entro P95 ≤ 500ms target (`/login` 28ms, `/cross_tenant_overview` 439ms). 7/9 dashboard routes exceed (635-1193ms) — bottleneck identificato: N+1 query patterns + no fetch cache + SSH tunnel latency.

## Top priorities

1. **Perf optimization batch** (~4-5h, carry-forward S45+) — implementare le 5 raccomandazioni del REPORT.md per ridurre P95 sotto 500ms target su 7 routes lente.
2. **§ 1.2 employees vertical-split Phase 2** (~15-25h, architectural) — DROP COLUMN ×77 + 65 view refactor. Multi-sessione.
3. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — 8 categorie asset checklist.

## Open questions

- **Mat view refresh frequency**: 1-day mat views per workforce trend + RBAC matrix? O 4h come le mat view esistenti (systemd timer)?
- **unstable_cache vs React 19 cache()**: precedenza? React 19 `cache()` è per-request memoization (intra-render), `unstable_cache` è cross-request (CDN-like). Combinarli su fetcher diversi.

## Stack snapshot (post-S44)

- Lighthouse **100/100 a11y** · 100/100 best-practices · 100/100 SEO (production build, snapshot mode, desktop)
- 36/37 audits passed · 1 non-WCAG agentic-tree skip
- 13 dark-palette `--ink-tertiary` valori bumped: tutte le palette ora ≥ luminance 0.21
- 4/4 widget kinds api-bound (post-phase18o)
- 4 process_*_v2 preset (post-phase18p)
- 7/7 view Prisma-bound (no fixture residue)
- typecheck + lint:mock-identities PASS
- **Perf baseline acquisita**: 2/9 routes within P95 ≤ 500ms target, 7/9 require optimization

## Verification

```bash
# Lighthouse production audit (confirm 100/100)
rm -rf services/app/.next && npm run build --workspace=services/app
npm run start --workspace=services/app &
# Open Chrome MCP, login, navigate /dashboard/cross_tenant_overview → lighthouse_audit

# Perf bench re-run after optimization
CSRF=$(curl -s -c /tmp/cookies.txt http://localhost:3200/api/auth/csrf | grep -oP '"csrfToken":"\K[^"]+')
curl -s -c /tmp/cookies.txt -b /tmp/cookies.txt -X POST \
  http://localhost:3200/api/auth/callback/credentials \
  -d "csrfToken=$CSRF&username=sysadmin&password=Heuresys2026!&redirect=false&json=true"
COOKIE=$(grep "authjs.session-token" /tmp/cookies.txt | awk '{print $7}')
npx autocannon -c 10 -d 10 -H "Cookie: authjs.session-token=$COOKIE" \
  http://localhost:3200/dashboard/org_systems
# Target: P95 ≤ 500ms (current 1193ms)
```

Riferimenti: `docs/_audit/2026-05-12-w5-visual-baseline/REPORT.md` (a11y baseline) · `docs/_audit/2026-05-12-perf-baseline/REPORT.md` (perf bench + raccomandazioni S45+)
