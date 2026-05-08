# heuresys-evo — Current State

> Updated: 2026-05-08T23:50Z · S19 closed — 7 prod commit + handoff (G2 full · G1 catalog · G4 DB · G3+G3-bis · G5 skeleton)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE (S20)

**Leggi PRIMA**: [`docs/30-developer/brand-dashboard-catalog.md`](../docs/30-developer/brand-dashboard-catalog.md) — catalogo formale Brand Identity dashboard (G1, S19). SoT canonical post-L42. **5 widget 🆕 PROMOTE-NEW ora shipped** (status 🆕→✅ post-L43): aggiornare il catalogo se serve riflettere il nuovo stato.

**S19 ha shipped 7 prod commit**:

| Commit | Subject | Status |
|---|---|---|
| `3867c6a` | refactor(app): G2 drift remediation D1 D3 (L41) | ✅ |
| `8574d9e` | refactor(app): G2 drift remediation D2 D4 D5 D6 (L42) | ✅ |
| `7c8ebb7` | docs(developer): canonical Brand Identity dashboard catalog (G1) | ✅ |
| `2ed436b` | migration(db): G4 dashboard_elements hierarchy + variant | ✅ applicato bare-metal SoT |
| `910ab0e` | feat(app): G3 register BrandActivityFeed in widget registry (D8 fix) | ✅ |
| `84c72e1` | feat(app): G3-bis 5 BrandWidget + G5 DashboardRenderer skeleton (L43) | ✅ |
| (next) | chore: handoff S19 | (questo) |

**Decisioni prese in S19** (10 totali · L41 + L42 + L43):

| ID | Drift | Risolto come | Commit |
|---|---|---|---|
| D1 | Pill 2-system | `.pill` canonical · `.status-pill` rimosso | L41 / 3867c6a |
| D2 | Split 3-system | `.double-split` canonical · `.kg-split` + `.bottom-split` rimossi | L42 / 8574d9e |
| D3 | Heatmap bucket | `.heat-{0..6}` canonical · `.hl-*` rimossi | L41 / 3867c6a |
| D4 | Bar fill 2-system | `.bar-fill.fill-*` canonical · `.gauge-bar-fill.gauge-*` rimossi | L42 / 8574d9e |
| D5 | Activity vs Audit | Mantenuti separati (DOM shape distinta · LOW severity) | L42 / 8574d9e |
| D6 | RBAC matrix wrapper | `.matrix-wrap` introdotto · `.skill-gap-head` → `.widget-head` shared | L42 / 8574d9e |
| D7 | Atomic packages/ui keep/deprecate | **Keep parallel** (atomic per Storybook + design-system, BrandWidget per dashboard) | L43 / 84c72e1 |
| D8 | BrandActivityFeed registry gap | Registrato + adapter aggiunto | G3 / 910ab0e |
| D9 | 7 view bespoke convergence | Skeleton DashboardRenderer pronto · adoption pending S20 G5-phase-2 | L43 / 84c72e1 |
| D10 | Atomic senza test | Pending → S20 (D7=A retained) | — |

## 🚀 Carry-forward S20 — lavoro restante

**G5-phase-2 (~6-8h)** · DashboardRenderer hierarchy + adoption path

- Layout container widgets in `WIDGET_REGISTRY`: `LayoutDoubleSplit` · `LayoutMainSplit` · `LayoutPanel` · `LayoutWorkspace` (renderizzano `<div className="..." >{children}</div>` ricorsivamente via `parent_element_id`)
- DashboardRenderer aggiornato per supportare nesting: ogni element con figli renderizza tramite layout container, ricorsione su `parent_element_id`
- Adoption: redirect `services/app/src/app/(app)/dashboard/page.tsx` switch (lines 79-111) a `<DashboardRenderer presetCode={resolvedPreset.preset_code} />`
- Server component wrapper: data fetching via `prefetch.ts` esistente + passa map a renderer client
- Eliminazione 7 `_views/*View.tsx` (~244-374 righe ciascuno = ~2200 righe rimosse)

**G6 (~3-4h)** · Seed 8 platform preset DB-driven

- File `db/seeds/phase15g6_preset_layouts.sql`
- Per ogni `preset_code`: ~5-10 elements con (widget_code, position, parent_element_id, variant, query, grid_col_*) replicando i layout dei 7 view bespoke
- Apply via SSH bare-metal SoT
- Visual diff: `/dashboard` (renderer DB-driven post-G5-phase-2) vs `/dashboard` pre-S19 (view bespoke screenshot baseline) deve coincidere

**D10 (~2-3h)** · atomic packages/ui test coverage (D7=A retained)

- Aggiungere `.test.tsx` per 8 atomic in `packages/ui/src/components/dashboard/`
- Vitest + React Testing Library + @testing-library/jest-dom
- Coverage target: render snapshot + props variants + accessibility

**Mockup HTML drift sync** · `.ux-design/06-mockups/dashboards/{org-systems,cross-tenant-overview}.html` ancora con `.status-pill` / `.kg-split` / `.bottom-split` (segregati dal runtime). Sync ora o parte di v1.0 promotion.

**Audit doc cross-references update** · line numbers in `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` sono pre-L41/L42, shift `−40` cumulativo per CSS oltre 1700 e `−15` oltre 1260. Solo cosmetico.

**G1 catalog refresh** · 5 widget 🆕→✅ ora shipped (BrandGaugeCard · BrandHistogram · BrandCompCard · BrandBridgeCard · BrandProfileHero). Aggiornare status in `docs/30-developer/brand-dashboard-catalog.md` § 5.8-5.11 + §6.4 + §7.4 + §11.

## Top priorities (next session — S20)

1. **G1 catalog status refresh** (~30min) — flip 🆕→✅ per i 5 widget shipped
2. **G5-phase-2 hierarchy + adoption** (~6-8h) — layout container widgets + redirect dashboard/page.tsx
3. **G6 8 preset seed** (~3-4h) — popolare slot data-driven
4. **D10 atomic test coverage** (~2-3h)
5. **Mockup HTML drift sync** (~1h)

## Old priorities (carry-forward — meno urgenti)

- **Data binding live full** (~3-5h) — 6 view non-`org_systems`. Post-G5-phase-2 + G6 assorbito.
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS. Collassa in G6.
- **MV auto-refresh** (~2-3h) — `pg_cron` schedule REFRESH 5min. Indipendente.
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI. Post-G5-phase-2.
- **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode.
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`.

## Open questions

- **`pg_cron` extension installata su Postgres bare-metal?** Se no → systemd timer + psql script per MV auto-refresh
- **Mockup HTML drift**: aggiorniamo mockup `.ux-design/06-mockups/dashboards/*.html` ora (sync brand SoT) o lasciamo come historical reference Phase 9?
- **G6 seed strategia**: replicare 1:1 i layout dei 7 view bespoke (preserva visual fidelity ma duplica complessità) o semplificare layout per essere più data-driven (rischio visual change)?
- **Layout container widget naming convention**: `LayoutDoubleSplit` vs `Layout/DoubleSplit` namespaced vs `_layout_double_split` underscore-prefixed (per distinguere da widget regolari nel catalog)?

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view + DashboardRenderer skeleton (S20 adoption) |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + **14 BrandWidget** services/app (post-G3-bis: 9 originali + ActivityFeed + 5 nuovi) + 8 atomic dashboard packages/ui · D7=keep parallel |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · 11 presets · 2 MV · `role_default_dashboards` 8 row · **`dashboard_elements`** post-G4: +parent_element_id +variant + hierarchy unique indexes |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical ~2295 righe (post-L42 cleanup) · `docs/30-developer/brand-dashboard-catalog.md` G1 596 righe canonical SoT |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-G5-phase-2) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · **195 app** (post-G5: +9 dashboard-renderer tests) · 82 shared · **95 ui** (829 totali) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→**L43** (L41 D1+D3 · L42 D2+D4+D5+D6 · **L43 D7+D8+G3-bis+G5 skeleton**) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 può richiedere restart in nuova sessione

## Verification post-S19

```bash
git status -sb
git log --oneline -10
# 84c72e1 feat(app): G3-bis 5 BrandWidget + G5 DashboardRenderer skeleton (L43)
# 910ab0e feat(app): G3 register BrandActivityFeed in widget registry (D8 fix)
# 2ed436b migration(db): G4 dashboard_elements hierarchy + variant
# 7c8ebb7 docs(developer): canonical Brand Identity dashboard catalog (G1)
# 8574d9e refactor(app): G2 drift remediation D2 D4 D5 D6 (L42)
# 3867c6a refactor(app): G2 drift remediation D1 D3 (L41)
# fb98fdf chore: handoff S18

# Verifica G2 + G3 + G3-bis zero drift produzione
grep -rn "status-pill\|status-ok\|status-warn\|status-down\|hl-9\|hl-7\|hl-5\|hl-3\|hl-1\|kg-split\|bottom-split\|gauge-bar-fill\|skill-gap-head" services/app/src packages/ui/src
# Expected: 0 match (mockup HTML in .ux-design/06-mockups exclusi - drift accettato)

# Verifica G3-bis 5 nuovi widget esportati
grep -E "BrandGaugeCard|BrandHistogram|BrandCompCard|BrandBridgeCard|BrandProfileHero" services/app/src/components/widgets/brand/index.ts
# Expected: 5 matches in export blocks

# Verifica registry 14 entries + adapters 14 entries
grep -E "GaugeCard:|Histogram:|CompCard:|BridgeCard:|ProfileHero:" services/app/src/lib/dashboard-engine/registry.tsx services/app/src/lib/dashboard-engine/adapters.ts
# Expected: 10 matches (5 widgets × 2 files)

# Verifica G4 DB schema applicato bare-metal
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "\\d+ dashboard_elements"' | grep -E "parent_element_id|variant"
# Expected: 2 colonne nuove con commenti

# Verifica G5 DashboardRenderer
ls services/app/src/components/DashboardRenderer.tsx
ls services/app/src/__tests__/dashboard-renderer.test.tsx
# Expected: file esistono

# Test gate baseline
npm run typecheck --workspace=services/app    # PASS
npm run typecheck --workspace=packages/ui     # PASS
npm test --workspace=services/app -- --run    # 195/195
npm test --workspace=packages/ui -- --run     # 95/95
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **Catalog canonical SoT** | `docs/30-developer/brand-dashboard-catalog.md` |
| **L41 D1+D3 decisioni** | `.ux-design/DECISIONS-LOG.md` § L41 |
| **L42 D2+D4+D5+D6 decisioni** | `.ux-design/DECISIONS-LOG.md` § L42 |
| **L43 D7+D8 + G3-bis + G5** | `.ux-design/DECISIONS-LOG.md` § L43 |
| **Audit catalog (S18 historical)** | `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` |
| **Tassonomia + L40** | `.ux-design/DECISIONS-LOG.md` § L40 |
| **Phase 15.A architettura** | `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md` |
| **Mockup brand canonical** | `.ux-design/06-mockups/dashboards/org-systems.html` |
| **CSS catalogo (post-L42)** | `services/app/src/styles/dashboard-brand.css` (~2295 righe) |
| **Widget registry (14 entries)** | `services/app/src/lib/dashboard-engine/registry.tsx` |
| **Widget adapters (14 entries)** | `services/app/src/lib/dashboard-engine/adapters.ts` |
| **Role-preset resolver** | `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` |
| **DB schema migration (G4)** | `db/migrations/phase15g4_dashboard_elements_hierarchy.sql` |
| **DB seed presets (G6 base)** | `db/seeds/phase15a_role_default_dashboards.sql` |
| **DashboardRenderer (G5 skeleton)** | `services/app/src/components/DashboardRenderer.tsx` |
| **DashboardRenderer test** | `services/app/src/__tests__/dashboard-renderer.test.tsx` (9 unit test) |
| **7 view bespoke da convergere (G5-phase-2 + G6)** | `services/app/src/app/(app)/dashboard/_views/*.tsx` |
| **14 BrandWidget catalog** | `services/app/src/components/widgets/brand/*.tsx` |
| **8 atomic Phase 13.A** | `packages/ui/src/components/dashboard/*.tsx` |
| **BrandShell layout** | `services/app/src/app/(app)/_components/BrandShell.tsx` |
| **Data fetcher pattern** | `services/app/src/lib/dashboard-views/org-systems-data.ts` |

## Operating baseline reminder per nuova sessione

- **R1**: pensa prima, agisci dopo
- **R5**: TEST-BEFORE-CLAIM — verified-by stamp obbligatorio per asserzioni
- **R8**: parallelismo tool calls indipendenti
- **R11**: direct push main default, no PR (post-S11)
- **R14**: anti-bias — cerca evidenza contraria · stop dopo 30 min senza convergenza
- Per G5-phase-2 hierarchy: aggiungere layout container widgets nel registry, NON riscrivere DashboardRenderer da zero — estendere supportando nesting via ricorsione su `parent_element_id`
- Per G6 seed: usare DashboardRenderer come oracolo di correttezza (renderer DB-driven deve produrre output equivalente al view bespoke pre-S20). Test visivo: screenshot diff Playwright opzionale
