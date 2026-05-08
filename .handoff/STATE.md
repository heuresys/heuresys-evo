# heuresys-evo — Current State

> Updated: 2026-05-09T00:50Z · S19 closed — 9 prod commit + handoff (G2 full · G1 catalog · G4 DB · G3+G3-bis · G5 skeleton + phase-2 · G6 smoke)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE (S20)

**Leggi PRIMA**: [`docs/30-developer/brand-dashboard-catalog.md`](../docs/30-developer/brand-dashboard-catalog.md) — catalogo formale Brand Identity dashboard (G1, S19). SoT canonical post-L42. **5 widget 🆕→✅ shipped (G3-bis L43)** + **4 layout containers shipped (G5-phase-2 L44)**: aggiornare catalog se serve riflettere il nuovo stato.

**S19 ha shipped 9 prod commit**:

| Commit | Subject |
|---|---|
| `3867c6a` | refactor(app): G2 drift remediation D1 D3 (L41) |
| `8574d9e` | refactor(app): G2 drift remediation D2 D4 D5 D6 (L42) |
| `7c8ebb7` | docs(developer): canonical Brand Identity dashboard catalog (G1) |
| `2ed436b` | migration(db): G4 dashboard_elements hierarchy + variant |
| `910ab0e` | feat(app): G3 register BrandActivityFeed in widget registry (D8 fix) |
| `e94ad2a` | chore: handoff S19 (intermedio) |
| `84c72e1` | feat(app): G3-bis 5 BrandWidget + G5 DashboardRenderer skeleton (L43) |
| `27fe984` | chore: handoff S19 (intermedio post-G3-bis) |
| `081a5e2` | feat(app): G5-phase-2 layout containers + DashboardRenderer hierarchy |
| `7ac676d` | migration(db): G6 hierarchical preset smoke (org_systems_v2, hr_director_overview_v2) |

**Decisioni prese in S19** (10 totali · L41 + L42 + L43 + L44):

| ID | Drift | Risolto come | Commit |
|---|---|---|---|
| D1 | Pill 2-system | `.pill` canonical · `.status-pill` rimosso | L41 / 3867c6a |
| D2 | Split 3-system | `.double-split` canonical · `.kg-split` + `.bottom-split` rimossi | L42 / 8574d9e |
| D3 | Heatmap bucket | `.heat-{0..6}` canonical · `.hl-*` rimossi | L41 / 3867c6a |
| D4 | Bar fill 2-system | `.bar-fill.fill-*` canonical · `.gauge-bar-fill.gauge-*` rimossi | L42 / 8574d9e |
| D5 | Activity vs Audit | Mantenuti separati (DOM shape distinta · LOW severity) | L42 / 8574d9e |
| D6 | RBAC matrix wrapper | `.matrix-wrap` introdotto · `.skill-gap-head` → `.widget-head` shared | L42 / 8574d9e |
| D7 | Atomic packages/ui keep/deprecate | Keep parallel | L43 / 84c72e1 |
| D8 | BrandActivityFeed registry gap | Registrato + adapter aggiunto | G3 / 910ab0e |
| D9 | 7 view bespoke convergence | Renderer skeleton ✅ + hierarchy ✅ · adoption pending S20 G6 full | L43+L44 / 84c72e1+081a5e2 |
| D10 | Atomic senza test | Pending → S20 (D7=A retained) | — |

## 🚀 Carry-forward S20 — lavoro restante

**G6 full (~3-4h)** · Seed 5 preset rimanenti

- File `db/seeds/phase15g6_full_preset_layouts.sql`
- Per ognuno: `cross_tenant_overview_v2` · `tenant_owner_overview_v2` · `skills_heatmap_v2` · `capability_graph_v2` · `employee_journey_v2`
- Pattern: stessa hierarchy structure dei 2 smoke (org_systems_v2, hr_director_overview_v2)
- Apply via SSH bare-metal SoT
- Verify: `SELECT code, COUNT(*) FILTER (WHERE parent_element_id IS NULL) AS top, COUNT(*) AS total FROM dashboard_elements ... WHERE code LIKE '%_v2' GROUP BY code`

**G6-adoption (~2-3h)** · Redirect `dashboard/page.tsx` switch a `<DashboardRenderer/>`

- Modifica `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` per appendere `_v2` al preset_code (o aggiornare `role_default_dashboards` con `*_v2` codes)
- Modifica `dashboard/page.tsx`: rimuovi switch lines 79-111 + i 7 import `_views/*View.tsx`, sostituisci con:
  ```tsx
  const elements = await loadDashboardElements(preset.code, role)
  const slots = elementsToSlots(elements)
  const data = await prefetchAllElements(slots) // existing pattern
  return <DashboardRenderer elements={slots} data={data} />
  ```
- **TEST OBBLIGATORIO browser**: aprire `/dashboard` per ogni 8 ruoli, verificare visivamente che il render brand-fedele sia equivalente o accettabile vs view bespoke pre-S19. Screenshot diff Playwright opzionale.
- **Rollback ready**: se regression, rinominare `_v2` → preserva i view bespoke
- Eliminazione 7 `_views/*View.tsx` (~2200 righe rimosse) **solo dopo verifica visiva ok**

**G3-bis-completion (~2-3h)** · 5 widget mancanti per layout matching

- BrandTenantCard (per tenant-grid in org_systems / cross-tenant)
- BrandMetricCard (per metrics-grid in org_systems)
- BrandSectionHead (per separator section-head)
- BrandIntRow (per int-row in integration list — alternativa a IntegrationHealthPill semplice)
- BrandAuditRow (per audit-list/.audit-row in org_systems)
- Senza questi, i preset `*_v2` G6 sono approssimazioni

**D10 atomic packages/ui test coverage (~2-3h)** · D7=A retained → atomic mantenuti, mancano test

- Aggiungere `.test.tsx` per 8 atomic in `packages/ui/src/components/dashboard/`
- Vitest + React Testing Library

**Mockup HTML drift sync** (~1h) · `.ux-design/06-mockups/dashboards/{org-systems,cross-tenant-overview}.html` ancora con `.status-pill` / `.kg-split` / `.bottom-split` (segregati). Sync ora o parte di v1.0 promotion.

**Audit doc cross-references update** (~30min) · line numbers in audit doc S18 sono pre-L41/L42, shift cumulativo. Solo cosmetico.

**G1 catalog refresh** (~30min) · 5 widget 🆕→✅ ora shipped + 4 layout containers nuovi. Aggiornare status in `docs/30-developer/brand-dashboard-catalog.md`.

## Top priorities (next session — S20)

1. **G6 full + adoption** (~5-7h) — completare 5 preset + redirect dashboard/page.tsx con browser test
2. **G3-bis-completion** (~2-3h) — 5 widget mancanti per layout matching pixel-perfect
3. **G1 catalog refresh** (~30min) — flip stati post-shipped
4. **D10 atomic test coverage** (~2-3h)
5. **Mockup HTML drift sync** (~1h)

## Old priorities (carry-forward — meno urgenti)

- **Data binding live full** (~3-5h) — 6 view non-`org_systems`. Post-G6-adoption assorbito (renderer + preset DB-driven con query bound).
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS. Collassa in G6 full.
- **MV auto-refresh** (~2-3h) — `pg_cron` schedule REFRESH 5min. Indipendente.
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI. Post-G6-adoption.
- **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode.
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`.

## Open questions

- **`pg_cron` extension installata su Postgres bare-metal?** Se no → systemd timer + psql script per MV auto-refresh
- **Mockup HTML drift**: aggiorniamo mockup `.ux-design/06-mockups/dashboards/*.html` ora (sync brand SoT) o lasciamo come historical reference Phase 9?
- **G6 full strategia preset_code**: continuare con suffix `_v2` (chiara distinzione) o rinominare al preset originale (overwrite limpido) post-adoption?
- **Widget mancanti per layout pixel-perfect** (BrandTenantCard ecc.): bloccanti per G6-adoption full o adoption procede con widget correnti + gap visibili documentati?

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view (S20 redirect a DashboardRenderer) |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + **14 BrandWidget + 4 layout containers** services/app + 8 atomic dashboard packages/ui · D7=keep parallel |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · **13 presets** (11 + 2 G6 smoke `_v2`) · 2 MV · `role_default_dashboards` 8 row · `dashboard_elements` post-G4: +parent_element_id +variant + hierarchy (38 demo + 21 G6 smoke = 59 rows) |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical ~2295 righe · `docs/30-developer/brand-dashboard-catalog.md` G1 596 righe canonical SoT |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-G6-adoption) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · **199 app** (post-G5-phase-2: +4 hierarchy tests) · 82 shared · **95 ui** (833 totali) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→**L44** (L41 D1+D3 · L42 D2+D4+D5+D6 · L43 D7+D8+G3-bis+G5 skeleton · **L44 G5-phase-2 hierarchy + G6 smoke**) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 può richiedere restart in nuova sessione

## Verification post-S19

```bash
git status -sb
git log --oneline -10

# Verifica G2 zero drift produzione
grep -rn "status-pill\|status-ok\|status-warn\|status-down\|hl-9\|hl-7\|hl-5\|hl-3\|hl-1\|kg-split\|bottom-split\|gauge-bar-fill\|skill-gap-head" services/app/src packages/ui/src
# Expected: 0 match

# Verifica G3-bis 5 nuovi widget esportati
grep -E "BrandGaugeCard|BrandHistogram|BrandCompCard|BrandBridgeCard|BrandProfileHero" services/app/src/components/widgets/brand/index.ts
# Expected: 5 matches

# Verifica G5-phase-2 layout containers
grep -E "BrandDoubleSplit|BrandMainSplit|BrandKpiRing|BrandPanel|LAYOUT_CONTAINERS" services/app/src/components/widgets/brand/index.ts
# Expected: 5 matches (4 components + LAYOUT_CONTAINERS)

# Verifica registry: WIDGET_REGISTRY 14 + LAYOUT_REGISTRY 4
grep -E "GaugeCard:|Histogram:|CompCard:|BridgeCard:|ProfileHero:|LAYOUT_REGISTRY" services/app/src/lib/dashboard-engine/registry.tsx
# Expected: 6+ matches

# Verifica G4 DB schema
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c '\d+ dashboard_elements'" | grep -E "parent_element_id|variant"
# Expected: 2 colonne

# Verifica G6 smoke seed
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c \"SELECT code, COUNT(*) FROM dashboard_elements de JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id WHERE code LIKE '%_v2' GROUP BY code;\""
# Expected: org_systems_v2: 10 · hr_director_overview_v2: 11

# Test gate baseline
npm run typecheck --workspace=services/app    # PASS
npm run typecheck --workspace=packages/ui     # PASS
npm test --workspace=services/app -- --run    # 199/199
npm test --workspace=packages/ui -- --run     # 95/95
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **Catalog canonical SoT** | `docs/30-developer/brand-dashboard-catalog.md` |
| **L41 D1+D3** | `.ux-design/DECISIONS-LOG.md` § L41 |
| **L42 D2+D4+D5+D6** | `.ux-design/DECISIONS-LOG.md` § L42 |
| **L43 D7+D8 + G3-bis + G5 skeleton** | `.ux-design/DECISIONS-LOG.md` § L43 |
| **L44 G5-phase-2 + G6 smoke** | `.ux-design/DECISIONS-LOG.md` § L44 |
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
| **DB seed presets G6 smoke** | `db/seeds/phase15g6_preset_layouts_smoke.sql` |
| **DB seed presets baseline** | `db/seeds/phase15a_role_default_dashboards.sql` |
| **DashboardRenderer (G5+G5-phase-2)** | `services/app/src/components/DashboardRenderer.tsx` |
| **DashboardRenderer test (13 tests)** | `services/app/src/__tests__/dashboard-renderer.test.tsx` |
| **7 view bespoke da convergere (S20 G6-adoption)** | `services/app/src/app/(app)/dashboard/_views/*.tsx` |
| **14 BrandWidget catalog** | `services/app/src/components/widgets/brand/*.tsx` |
| **8 atomic Phase 13.A** | `packages/ui/src/components/dashboard/*.tsx` |
| **BrandShell layout** | `services/app/src/app/(app)/_components/BrandShell.tsx` |
| **Data fetcher pattern** | `services/app/src/lib/dashboard-views/org-systems-data.ts` |

## Operating baseline reminder per nuova sessione

- **R1**: pensa prima, agisci dopo
- **R5**: TEST-BEFORE-CLAIM — verified-by stamp obbligatorio per asserzioni · per UI changes (G6-adoption): browser test obbligatorio prima di eliminare 7 *View.tsx
- **R8**: parallelismo tool calls indipendenti
- **R11**: direct push main default, no PR (post-S11)
- **R14**: anti-bias — cerca evidenza contraria · stop dopo 30 min senza convergenza
- Per G6 full: pattern smoke seed pronto (`phase15g6_preset_layouts_smoke.sql`) · replicare per 5 preset rimanenti seguendo stessa hierarchy structure
- Per G6-adoption: cambio role_default_dashboards.preset_code da `*` a `*_v2` · poi modifica dashboard/page.tsx · poi browser test · poi delete 7 *View.tsx
