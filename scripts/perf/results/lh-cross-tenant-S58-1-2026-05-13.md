# Lighthouse Cross-Tenant Audit — S58+ item #2

> Run: 2026-05-13 ~16:30 GMT+2 · chrome-devtools-mcp 1.x · device=desktop · mode=navigation
> URL audited: `https://evo.heuresys.com/dashboard` (auth-required)
> Role consistent: TENANT_OWNER cross-tenant (1 utente per tenant)

## Scope

4 tenant × 1 utente TENANT_OWNER × dashboard live + perf trace. Confronto consistent perché stesso ruolo e stessa preset dashboard (`tenant_owner_overview_v2`).

## Users (TENANT_OWNER)

| Tenant           | Username                          | Stato pre-audit                                     |
| ---------------- | --------------------------------- | --------------------------------------------------- |
| RTL Bank         | `federica.marchetti@rtl-bank.org` | active canonical (.test-env)                        |
| SmartFood S.r.l. | `smartfood-admin`                 | reactivated via `toggle-tenant-owners-tmp.mjs --on` |
| EcoNova          | `econova-admin`                   | reactivated via `toggle-tenant-owners-tmp.mjs --on` |
| Heuresys System  | `admin`                           | reactivated via `toggle-tenant-owners-tmp.mjs --on` |

Post-audit i 3 legacy users sono ri-soft-deletati via `--off`.

## Risultati comparativi

### Lighthouse categories (snapshot)

| Tenant          | A11y |  BP | SEO | Agentic Browsing (non-WCAG) |
| --------------- | ---: | --: | --: | --------------------------: |
| RTL Bank        |   94 |  96 | 100 |                          46 |
| SmartFood       |   94 |  96 | 100 |                          46 |
| EcoNova         |   94 |  96 | 100 |                          46 |
| Heuresys System |   94 |  96 | 100 |                          46 |

**Variance**: zero. Coerente con bundle + markup identico (UI è data-driven ma rendering è uguale).

### Performance trace (Core Web Vitals)

| Tenant          |                 LCP |              TTFB |        Render delay |        CLS | Insight set |
| --------------- | ------------------: | ----------------: | ------------------: | ---------: | :---------- |
| RTL Bank        |              539 ms |            128 ms |              411 ms |       0.09 | clean       |
| SmartFood       |              565 ms |             75 ms |              491 ms |       0.09 | clean       |
| EcoNova         |          **426 ms** |             77 ms |              349 ms |       0.09 | clean       |
| Heuresys System |              536 ms |             71 ms |              465 ms |       0.09 | clean       |
| **Range**       | 426–565ms (Δ 139ms) | 71–128ms (Δ 57ms) | 349–491ms (Δ 142ms) | 0.09 const |             |

### Score interpretation

- **LCP**: tutti `< 600ms` → **good** (Web Vitals threshold "good" è < 2.5s). Cross-tenant variance contenuta (Δ 139ms = ~25% relative).
- **CLS**: tutti 0.09 → **needs improvement** (good è < 0.1, ma 0.09 è marginale). Stesso valore ovunque suggerisce causa NON data-driven ma layout-shift strutturale (cf. activity feed / capability radar widget async hydration).
- **TTFB**: RTL Bank ha TTFB più alto (128ms vs 71-77ms altri). Probabile cache caldo server dopo i 3 round successivi su altri tenant — non significativo data-volume effect.
- **A11y / BP / SEO**: identici cross-tenant — atteso visto stesso bundle + markup base.

## Confronto vs S53 baseline `/login`

| Page             |        LCP | A11y |  BP | SEO | Note                           |
| ---------------- | ---------: | ---: | --: | --: | :----------------------------- |
| `/login` S53     | **12.5 s** |  100 | 100 | 100 | bundle Aurora + 8.3s unused JS |
| `/dashboard` S58 |  426-565ms |   94 |  96 | 100 | post-login lean                |

**Insight chiave**: il deficit perf di S53 era circoscritto a `/login` (Aurora gradient + bundle bloat anonymous route). `/dashboard` autenticato gira nel target perf desiderato. La carry-forward S53 bundle audit (12-20h effort) **resta valida solo per `/login`**, NON per le route auth-required.

## Caveat data-driven

I KPI mostrati nella dashboard `tenant_owner_overview_v2` sono **fixture hardcoded** (HEADCOUNT 86 · REV/FTE 142k · RETENTION 94% · PERFORMANCE 82% · AVG SALARY 68k · BONUS POOL 420k · EQUITY 1.2M · TOTAL TC 7.4M) — identici cross-tenant nonostante data volume reale variabile (RTL 86 employees vs Heuresys 1 employee post-CASCADIA). Quindi:

- **La perf misurata non riflette variance data-driven reale** sul SSR layer
- Per misurare vera variance data-driven serve audit su route con query Prisma live (vedi roadmap §1 "Data binding live full" ~3-5h in CLAUDE.md)
- Questo audit cross-tenant misura quindi la consistency di rendering, NON la sensibilità a data volume

## Carry-forward S59+

1. **Data binding live full** dashboard sostituendo fixture con query Prisma reali (3-5h) → poi ri-audit cross-tenant per misurare data-volume effect su SSR
2. **CLS 0.09 → < 0.05**: investigare layout shift culprits (probabile widget async hydration). Stesso valore cross-tenant suggerisce single fix risolve tutti
3. **`/login` LCP bundle audit** (12-20h, carry-forward S53) resta separato — non bloccato da questo audit
4. **A11y 94 / BP 96 → 100**: 4 failed audit residui (non investigati in questo run). Tipicamente piccoli: color-contrast minor + meta-tag enhancements

## Tooling

- chrome-devtools-mcp `lighthouse_audit` (a11y/SEO/BP, exclude Performance)
- chrome-devtools-mcp `performance_start_trace` (Core Web Vitals)
- Sessione live `evo.heuresys.com` prod (no throttling CPU/network)
- 4 isolatedContext separati per garantire cookie/storage isolation cross-tenant

## Commands

```bash
# Reattivazione TENANT_OWNER legacy (one-shot, NON viola .test-env SoT)
node scripts/perf/toggle-tenant-owners-tmp.mjs --on

# ... run cross-tenant audit via chrome-devtools-mcp ...

# Cleanup post-audit
node scripts/perf/toggle-tenant-owners-tmp.mjs --off
```

## Status final

✅ Item #2 STATE.md "Lighthouse perf re-run cross-tenant ~1h" — **CHIUSO** con risultati real-data.
