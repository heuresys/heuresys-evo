# heuresys-evo — Current State

> Updated: 2026-05-09T01:10Z · S19 closed — 11 prod commit + handoff (G2 full · G1 catalog · G4 DB · G3+G3-bis · G5 skeleton+phase-2 · **G6 full + adoption shipped**)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE (S20)

**🚨 PRIORITÀ #1 — TEST BROWSER `/dashboard` post-G6 adoption**: l'adoption è shipped (S19) ma non testato visivamente in browser. Loggati per ognuno degli 8 ruoli (SUPERUSER, TENANT_OWNER, IT_ADMIN, HR_DIRECTOR, HR_MANAGER, DEPT_HEAD, LINE_MANAGER, EMPLOYEE) e verifica `/dashboard` → DashboardRenderer rende correttamente vs 7 view bespoke pre-S19. **Se regressione critica**: rollback immediato via SQL alla fine di `db/seeds/phase15g6_full_preset_layouts.sql` (revert mapping `*_v2` → `*` originale).

**Leggi PRIMA**: [`docs/30-developer/brand-dashboard-catalog.md`](../docs/30-developer/brand-dashboard-catalog.md) — catalogo formale Brand Identity dashboard (G1, S19). SoT canonical post-L42.

**S19 ha shipped 11 prod commit**:

| Commit | Subject |
|---|---|
| `3867c6a` | refactor(app): G2 D1 D3 (L41) |
| `8574d9e` | refactor(app): G2 D2 D4 D5 D6 (L42) |
| `7c8ebb7` | docs(developer): G1 canonical catalog |
| `2ed436b` | migration(db): G4 hierarchy + variant |
| `910ab0e` | feat(app): G3 ActivityFeed register (D8) |
| `e94ad2a` | chore: handoff S19 (post-G3) |
| `84c72e1` | feat(app): G3-bis 5 widget + G5 skeleton (L43) |
| `27fe984` | chore: handoff S19 (post-G3-bis) |
| `081a5e2` | feat(app): G5-phase-2 layout containers + hierarchy |
| `7ac676d` | migration(db): G6 smoke preset layouts |
| `6c42108` | chore: handoff S19 (G5-phase-2 + G6 L44) |
| `35ba6bb` | **feat(app+db): G6 full + adoption · *_v2 via DashboardRenderer** |

**Decisioni prese in S19** (10 totali · L41 + L42 + L43 + L44 + L45):

| ID | Drift | Risolto come | Commit |
|---|---|---|---|
| D1 | Pill 2-system | `.pill` canonical | L41 |
| D2 | Split 3-system | `.double-split` canonical | L42 |
| D3 | Heatmap bucket | `.heat-{0..6}` canonical | L41 |
| D4 | Bar fill 2-system | `.bar-fill.fill-*` canonical | L42 |
| D5 | Activity vs Audit | Mantenuti separati | L42 |
| D6 | RBAC matrix wrapper | `.matrix-wrap` + `.widget-head` | L42 |
| D7 | Atomic packages/ui keep/deprecate | Keep parallel | L43 |
| D8 | BrandActivityFeed registry gap | Registrato + adapter | G3 |
| D9 | 7 view bespoke convergence | **Adoption shipped (`_v2` route attiva)** · 7 *View.tsx preserved fallback (S21 deletion post-browser-test) | L45 / 35ba6bb |
| D10 | Atomic senza test | Pending → S20 | — |

## 🚀 Carry-forward S20 — lavoro restante

**🚨 BROWSER TEST POST-G6 adoption (PRIORITÀ #1)** · ~30min-1h

- Login per ognuno degli 8 ruoli
- Visit `/dashboard` → verifica DashboardRenderer brand-fedele rende
- Confronto visivo vs view bespoke (memoria recente o screenshot S18)
- Identifica gap visivi (5 widget mancanti, layout approssimazioni)
- **Se OK**: procedi a delete 7 *View.tsx in commit separato
- **Se KO**: rollback SQL per role_default_dashboards (revert mapping `*_v2` → `*` originale, vedi commenti finali in `phase15g6_full_preset_layouts.sql`)

**`prisma generate` regen (~5min)** · S20 obbligatorio

- Stop Next.js dev server (PID 1036 + 11716 in S19)
- `cd services/app && npx prisma generate`
- Rigenera client con `parent_element_id` + `variant` + self-relation `dashboard_elements_hierarchy`
- Refactor `dashboard/page.tsx`: rimuovi `loadG6Elements` $queryRaw + interface DashboardElementG4 → usa `prisma.dashboard_elements.findMany({ where: { dashboard_presets: { code: presetCode } }, include: { children: true } })` o pattern simile
- Test gate

**G3-bis-completion** (~6-10h) · 5 widget mancanti per layout pixel-perfect

- `BrandTenantCard` (per tenant-grid in org-systems_v2 / cross-tenant-overview_v2)
- `BrandMetricCard` (per metrics-grid in org-systems_v2)
- `BrandSectionHead` (per separator section-head)
- `BrandIntRow` (per int-row in integration list)
- `BrandAuditRow` (per audit-list/.audit-row)
- Aggiornare adapter + registry + test count
- Re-seedare i preset `_v2` per usare i nuovi widget (ricarica `phase15g6_full_preset_layouts.sql` con widget aggiornati)

**Delete 7 *View.tsx (~30min · S20 · POST browser-test ok)**

- `services/app/src/app/(app)/dashboard/_views/*.tsx` (~2200 righe rimosse)
- Plus rimuovere import in `dashboard/page.tsx` + switch case + interface
- Plus `components/widgets/brand/index.ts`: rimuovere export di adapters dei v2-only widget se non più riutilizzati
- Test gate

**G3-bis test coverage S20** (~30min)

- Aggiungere unit test per i 5 BrandWidget creati in S19 (Gauge, Histogram, Comp, Bridge, ProfileHero)
- Aggiungere unit test per i 4 layout containers (BrandDoubleSplit, BrandMainSplit, BrandKpiRing, BrandPanel)

**D10 atomic packages/ui test coverage** (~2-3h) · 8 atomic in `packages/ui/src/components/dashboard/`

**Mockup HTML drift sync** (~1h) · `.ux-design/06-mockups/dashboards/{org-systems,cross-tenant-overview}.html`

**Audit doc cross-references update** (~30min)

**G1 catalog refresh** (~30min) · 5 widget 🆕→✅ ora shipped + 4 layout containers nuovi · gli 5 widget mancanti S20 G3-bis-completion → flip status post-shipped

## Top priorities (next session — S20)

1. **🚨 Browser test G6 adoption** (~30min-1h) — verificare gli 8 ruoli su `/dashboard`
2. **Prisma generate** (~5min) — regen client + refactor page.tsx via Prisma client
3. **G3-bis-completion** (~6-10h) — 5 widget mancanti + re-seed
4. **Delete 7 *View.tsx** (~30min) — solo se browser-test ok
5. **D10 atomic test coverage** (~2-3h)

## Old priorities (carry-forward — meno urgenti)

- **Data binding live full** (~3-5h) — sostituire `data_source.type='static'` con `'sql'` + query Prisma per data live
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS
- **MV auto-refresh** (~2-3h) — `pg_cron` schedule REFRESH 5min
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI · post-G6-adoption
- **API gateway cross-service JWT fix** (~2-3h)
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`

## Open questions

- **🚨 G6 adoption browser test passed?** Se KO → rollback role_default_dashboards immediato
- **5 widget mancanti**: blocca o procede G3-bis-completion in step separato post-adoption verifica?
- **Mockup HTML drift sync**: ora o post v1.0?
- **`pg_cron` extension installata?**
- **Live data binding**: progressivo per preset (org_systems_v2 prima per tenants reali) o batch?

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` **ora dual-path**: `*_v2` → DashboardRenderer (default 8 ruoli) · `*` originali → 7 *View.tsx fallback |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + **14 BrandWidget + 4 layout containers** services/app + 8 atomic dashboard packages/ui · D7=keep parallel |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · **18 presets** (11 originali + 7 G6 v2) · 2 MV · `role_default_dashboards` 8 row UPDATED → `*_v2` · `dashboard_elements` post-G4: 38 demo + 77 G6 v2 = **115 rows** con hierarchy completa |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical ~2295 righe · `docs/30-developer/brand-dashboard-catalog.md` G1 596 righe canonical SoT |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-browser-test G6) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · **199 app** · 82 shared · **95 ui** (833 totali) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→**L45** (L41-L45 cycle in S19) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 può richiedere restart in nuova sessione (PID 1036 + 11716 in S19 lockano Prisma engine .dll.node)

## Verification post-S19

```bash
git status -sb
git log --oneline -12

# Verifica G6 adoption attivo
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c \"SELECT role, preset_code FROM role_default_dashboards ORDER BY role;\""
# Expected: tutti gli 8 ruoli hanno preset_code = '<role>_v2' (LINE_MANAGER + EMPLOYEE = 'employee_journey_v2')

# Verifica 77 dashboard_elements per i 7 v2 presets
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c \"SELECT dp.code, COUNT(de.id) FROM dashboard_elements de JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id WHERE dp.code LIKE '%_v2' GROUP BY dp.code ORDER BY dp.code;\""
# Expected: 7 rows totalizing 77 elements (10+11+11+13+10+11+11)

# Verifica adoption code
grep -E "loadG6Elements|endsWith.*_v2|DashboardRenderer" services/app/src/app/(app)/dashboard/page.tsx
# Expected: branch _v2 + DashboardRenderer mount

# Verifica schema.prisma G4 fields
grep -A 2 "parent_element_id\s*BigInt" services/app/prisma/schema.prisma
# Expected: parent_element_id BigInt? + variant String?

# Test gate baseline
npm run typecheck --workspace=services/app    # PASS
npm run typecheck --workspace=packages/ui     # PASS
npm test --workspace=services/app -- --run    # 199/199
npm test --workspace=packages/ui -- --run     # 95/95

# 🚨 BROWSER TEST (richiede dev server :3200 attivo + login)
# Loggati come SUPERUSER → /dashboard → verifica DashboardRenderer rende
# Se KO → rollback SQL (vedi commenti finali in phase15g6_full_preset_layouts.sql)
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **🚨 Rollback SQL G6 adoption** | `db/seeds/phase15g6_full_preset_layouts.sql` (commenti finali, ultime 10 righe) |
| **G6 full seed** | `db/seeds/phase15g6_full_preset_layouts.sql` (~370 righe) |
| **G6 smoke seed (historical)** | `db/seeds/phase15g6_preset_layouts_smoke.sql` (sostituito ma preservato) |
| **DashboardPage adoption** | `services/app/src/app/(app)/dashboard/page.tsx` (post-S19 dual-path) |
| **Schema.prisma G4 fields** | `services/app/prisma/schema.prisma` § dashboard_elements model |
| **Catalog canonical SoT** | `docs/30-developer/brand-dashboard-catalog.md` |
| **L41 D1+D3** | `.ux-design/DECISIONS-LOG.md` § L41 |
| **L42 D2+D4+D5+D6** | `.ux-design/DECISIONS-LOG.md` § L42 |
| **L43 D7+D8 + G3-bis + G5 skeleton** | `.ux-design/DECISIONS-LOG.md` § L43 |
| **L44 G5-phase-2 + G6 smoke** | `.ux-design/DECISIONS-LOG.md` § L44 |
| **L45 G6 full + adoption** | `.ux-design/DECISIONS-LOG.md` § L45 |
| **Audit catalog (S18 historical)** | `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` |
| **Phase 15.A architettura** | `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md` |
| **Mockup brand canonical** | `.ux-design/06-mockups/dashboards/org-systems.html` |
| **CSS catalogo (post-L42)** | `services/app/src/styles/dashboard-brand.css` (~2295 righe) |
| **Widget registry (14 entries)** | `services/app/src/lib/dashboard-engine/registry.tsx` |
| **LAYOUT registry (4 entries)** | `services/app/src/lib/dashboard-engine/registry.tsx` (LAYOUT_REGISTRY export) |
| **Layout containers** | `services/app/src/components/widgets/brand/BrandLayoutContainers.tsx` |
| **Widget adapters (14 entries)** | `services/app/src/lib/dashboard-engine/adapters.ts` |
| **Role-preset resolver** | `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` |
| **DB schema migration (G4)** | `db/migrations/phase15g4_dashboard_elements_hierarchy.sql` |
| **DashboardRenderer (G5+G5-phase-2)** | `services/app/src/components/DashboardRenderer.tsx` |
| **DashboardRenderer test (13 tests)** | `services/app/src/__tests__/dashboard-renderer.test.tsx` |
| **7 view bespoke (S20 post-test ok delete)** | `services/app/src/app/(app)/dashboard/_views/*.tsx` |
| **14 BrandWidget catalog** | `services/app/src/components/widgets/brand/*.tsx` |
| **8 atomic Phase 13.A** | `packages/ui/src/components/dashboard/*.tsx` |
| **BrandShell layout** | `services/app/src/app/(app)/_components/BrandShell.tsx` |

## Operating baseline reminder per nuova sessione

- **R1**: pensa prima, agisci dopo
- **R5**: TEST-BEFORE-CLAIM — UI changes G6 adoption richiede browser test prima di delete *View.tsx fallback
- **R8**: parallelismo tool calls indipendenti
- **R11**: direct push main default, no PR (post-S11)
- **R14**: anti-bias — cerca evidenza contraria · stop dopo 30 min senza convergenza
- Per S20 priority: BROWSER TEST G6 PRIMA di qualsiasi nuovo lavoro · rollback ready in `phase15g6_full_preset_layouts.sql`
- Per S20 prisma generate: REQUIRE Next.js dev server stopped · poi refactor `loadG6Elements` $queryRaw → Prisma client native
