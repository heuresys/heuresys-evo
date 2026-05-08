# heuresys-evo — Current State

> Updated: 2026-05-08T23:08Z · S19 closed — 5 prod commits + handoff (G2 full · G1 catalog · G4 DB · G3 partial)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE (S20)

**Leggi PRIMA**: [`docs/30-developer/brand-dashboard-catalog.md`](../docs/30-developer/brand-dashboard-catalog.md) — catalogo formale Brand Identity dashboard (G1, S19). SoT canonical post-L42 per qualunque dashboard work.

**S19 ha shipped 5 prod commit**:

| Commit | Subject | Status |
|---|---|---|
| `3867c6a` | refactor(app): G2 drift remediation D1 D3 (L41) | ✅ |
| `8574d9e` | refactor(app): G2 drift remediation D2 D4 D5 D6 (L42) | ✅ |
| `7c8ebb7` | docs(developer): canonical Brand Identity dashboard catalog (G1) | ✅ |
| `2ed436b` | migration(db): G4 dashboard_elements hierarchy + variant | ✅ applicato bare-metal SoT |
| `910ab0e` | feat(app): G3 register BrandActivityFeed in widget registry (D8 fix) | ✅ |

**Decisioni prese in S19** (10 totali · L41 + L42):

| ID | Drift | Risolto come | Commit |
|---|---|---|---|
| D1 | Pill 2-system | `.pill` canonical · `.status-pill` rimosso | L41 / 3867c6a |
| D2 | Split 3-system | `.double-split` canonical · `.kg-split` + `.bottom-split` rimossi | L42 / 8574d9e |
| D3 | Heatmap bucket | `.heat-{0..6}` canonical · `.hl-*` rimossi | L41 / 3867c6a |
| D4 | Bar fill 2-system | `.bar-fill.fill-*` canonical · `.gauge-bar-fill.gauge-*` rimossi | L42 / 8574d9e |
| D5 | Activity vs Audit | Mantenuti separati (DOM shape distinta · LOW severity) | L42 / 8574d9e |
| D6 | RBAC matrix wrapper | `.matrix-wrap` introdotto · `.skill-gap-head` → `.widget-head` shared | L42 / 8574d9e |
| D7 | Atomic packages/ui keep/deprecate | **Keep parallel** (atomic per Storybook + design-system, BrandWidget per dashboard) | S19 chat |
| D8 | BrandActivityFeed registry gap | Registrato + adapter aggiunto | G3 partial / 910ab0e |
| D9 | 7 view bespoke convergence | Concordato in S18 → G5 (deferred a S20) | — |
| D10 | Atomic senza test | Solo se mantenuti (pending) | — |

## Carry-forward S20 — lavoro deferred ancora da fare

**G3-bis (~6-10h)**: 5 nuovi BrandWidget + atomic test coverage

- `BrandGaugeCard` (CSS pronto in `dashboard-brand.css:1788-1844`, riusa `.bar-fill.fill-*` post-L42)
- `BrandHistogram` (CSS pronto `:1978-2057`)
- `BrandCompCard` (CSS pronto `~:1895`)
- `BrandBridgeCard` (CSS pronto `~:2299`)
- `BrandProfileHero` (CSS pronto `~:2179-2257`)
- Pattern: vedi `BrandKpiCard` come template + adapter in `adapters.ts` + entry in `registry.tsx` + test count update
- Plus: D10 — aggiungere test atomic packages/ui (8 component senza `.test.tsx`) se atomic mantenuti per coverage

**G5 (~6-8h)**: Single `<DashboardRenderer/>` consumer registry

- Server component in `services/app/src/components/DashboardRenderer.tsx` (oppure RSC + client wrapper)
- Input: `presetCode` + `roleSession`
- Flow: load `dashboard_elements` via `loader.ts` (esistente) + filter via `resolver.ts` (RBP) + apply hierarchy via nuova logica G4 (parent_element_id) + render slots tramite `WIDGET_REGISTRY`
- Output: rimpiazza `dashboard/page.tsx` switch (lines 79-111) e i 7 `_views/*.tsx` bespoke con 1 chiamata renderer
- D9 ✅ pre-approvato

**G6 (~3-4h)**: Seed 8 DB-driven preset matching i 7 view bespoke

- File `db/seeds/phase15g6_preset_layouts.sql`
- Per ogni `preset_code` (cross_tenant_overview · tenant_owner_overview · org_systems · hr_director_overview · skills_heatmap · capability_graph · employee_journey): inserire ~5-10 elements con (widget_code, position, parent_element_id, variant, query, grid_*) per replicare il layout della view bespoke
- Apply via SSH bare-metal SoT
- Test: visualmente confrontare `/dashboard/[code]` (renderer DB-driven) con `/dashboard` (view bespoke) — devono coincidere

## Top priorities (next session — S20)

1. **G3-bis 5 nuovi BrandWidget** (~6-10h) — completare il catalog brand-fedele con i widget mancanti
2. **G5 DashboardRenderer** (~6-8h) — eliminare 7 *View.tsx bespoke
3. **G6 8 preset seed** (~3-4h) — popolare slot data-driven
4. **G3-bis-bis (D10)** atomic packages/ui test coverage — solo se decisione D7=A mantenuta
5. **Mockup HTML drift sync** (`.ux-design/06-mockups/dashboards/{org-systems,cross-tenant-overview}.html`) — `.status-pill` / `.kg-split` / `.bottom-split` ancora presenti (segregati dal runtime). Sync ora o parte di v1.0 promotion.
6. **Audit doc cross-references update** — line numbers in `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` sono pre-L41/L42, shift `−40` cumulativo per CSS oltre 1700 e `−15` oltre 1260. Solo cosmetico, audit doc resta utile come historical snapshot.

## Old priorities (carry-forward — meno urgenti)

- **Data binding live full** (~3-5h) — 6 view non-`org_systems`. Post-G5 assorbito.
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS. Collassa in G6.
- **MV auto-refresh** (~2-3h) — `pg_cron` schedule REFRESH 5min. Indipendente.
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI. Post-G5.
- **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode.
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`.

## Open questions

- **`pg_cron` extension installata su Postgres bare-metal?** Se no → systemd timer + psql script per MV auto-refresh
- **Mockup HTML drift**: aggiorniamo mockup `.ux-design/06-mockups/dashboards/*.html` ora (sync brand SoT) o lasciamo come historical reference Phase 9?
- **G6 seed strategia**: replicare 1:1 i layout dei 7 view bespoke (preserva visual fidelity ma duplica complessità) o semplificare layout per essere più data-driven (rischio visual change)?

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view (carry-forward G5 single renderer) |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + 9 BrandWidget services/app (10 post-G3 partial: ActivityFeed registered) + 8 atomic dashboard packages/ui · D7=keep parallel |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · 11 presets · 2 MV · `role_default_dashboards` 8 row · **`dashboard_elements`** post-G4: +parent_element_id +variant + hierarchy unique indexes |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical ~2295 righe (post-L42 cleanup -39+) · `docs/30-developer/brand-dashboard-catalog.md` G1 596 righe canonical SoT |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-G5) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · **186 app** · 82 shared · **95 ui** (820 totali · 281 verificati S19 · adapter test count updated 8→9) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→**L42** (L41 = D1+D3 · L42 = D2+D4+D5+D6 · catalogo formale in docs/30-developer/) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 può richiedere restart in nuova sessione

## Verification post-S19

```bash
git status -sb
git log --oneline -8
# 910ab0e feat(app): G3 register BrandActivityFeed in widget registry (D8 fix)
# 2ed436b migration(db): G4 dashboard_elements hierarchy + variant
# 7c8ebb7 docs(developer): canonical Brand Identity dashboard catalog (G1)
# 8574d9e refactor(app): G2 drift remediation D2 D4 D5 D6 (L42)
# 3867c6a refactor(app): G2 drift remediation D1 D3 (L41)
# fb98fdf chore: handoff S18
# 808c7f6 docs(ux-design): catalog audit dashboard pre-flight (L40)

# Verifica G2 + G3 zero drift
grep -rn "status-pill\|status-ok\|status-warn\|status-down\|hl-9\|hl-7\|hl-5\|hl-3\|hl-1\|kg-split\|bottom-split\|gauge-bar-fill\|skill-gap-head" services/app/src packages/ui/src
# Expected: 0 match (mockup HTML in .ux-design/06-mockups exclusi - drift accettato)

# Verifica G4 DB schema
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "\\d+ dashboard_elements"' | grep -E "parent_element_id|variant"
# Expected: 2 colonne nuove con commenti

# Verifica G3 ActivityFeed registrato
grep -E "ActivityFeed" services/app/src/lib/dashboard-engine/registry.tsx services/app/src/lib/dashboard-engine/adapters.ts
# Expected: ActivityFeedWidget + activityFeedAdapter + ADAPTER_REGISTRY entry

# Test gate baseline
npm run typecheck --workspace=services/app    # PASS
npm run typecheck --workspace=packages/ui     # PASS
npm test --workspace=services/app -- --run    # 186/186
npm test --workspace=packages/ui -- --run     # 95/95
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **Catalog canonical SoT** | `docs/30-developer/brand-dashboard-catalog.md` |
| **L41 D1+D3 decisioni** | `.ux-design/DECISIONS-LOG.md` § L41 |
| **L42 D2+D4+D5+D6 decisioni** | `.ux-design/DECISIONS-LOG.md` § L42 |
| **Audit catalog (S18 historical)** | `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` |
| **Tassonomia + L40** | `.ux-design/DECISIONS-LOG.md` § L40 |
| **Phase 15.A architettura** | `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md` |
| **Mockup brand canonical** | `.ux-design/06-mockups/dashboards/org-systems.html` |
| **CSS catalogo (post-L42)** | `services/app/src/styles/dashboard-brand.css` (~2295 righe) |
| **Widget registry (post-G3 partial: 9/9)** | `services/app/src/lib/dashboard-engine/registry.tsx` |
| **Widget adapters (post-G3 partial: 9 entries)** | `services/app/src/lib/dashboard-engine/adapters.ts` |
| **Role-preset resolver** | `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` |
| **DB seed presets (G6 base)** | `db/seeds/phase15a_role_default_dashboards.sql` |
| **DB schema migration (G4)** | `db/migrations/phase15g4_dashboard_elements_hierarchy.sql` |
| **7 view bespoke da convergere (G5)** | `services/app/src/app/(app)/dashboard/_views/*.tsx` |
| **9 BrandWidget catalog (post-G3: 10)** | `services/app/src/components/widgets/brand/*.tsx` |
| **8 atomic Phase 13.A** | `packages/ui/src/components/dashboard/*.tsx` |
| **BrandShell layout** | `services/app/src/app/(app)/_components/BrandShell.tsx` |
| **Data fetcher pattern** | `services/app/src/lib/dashboard-views/org-systems-data.ts` |

## Operating baseline reminder per nuova sessione

- **R1**: pensa prima, agisci dopo
- **R5**: TEST-BEFORE-CLAIM — verified-by stamp obbligatorio per asserzioni
- **R8**: parallelismo tool calls indipendenti
- **R11**: direct push main default, no PR (post-S11)
- **R14**: anti-bias — cerca evidenza contraria · stop dopo 30 min senza convergenza
- Per G3-bis nuovi BrandWidget: pattern fixed in `BrandKpiCard` template + adapter + registry. Test count update obbligatorio.
- Per G5 DashboardRenderer: integrazione con `loader.ts` + `resolver.ts` + `prefetch.ts` esistenti — non riscrivere infrastruttura, consumarla.
