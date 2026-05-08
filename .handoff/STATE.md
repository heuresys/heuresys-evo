# heuresys-evo — Current State

> Updated: 2026-05-08T21:25Z · S19 in progress — G2-partial shipped (D1+D3 drift remediation, L41)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE

**Leggi PRIMA**: [`.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`](../.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md) — audit catalogo Brand Identity dashboard (S18, ancora canonical). **Nota**: line numbers post-L41 shiftano `−24` per CSS oltre 1700 e `−15` per CSS oltre 1260 — il contenuto delle classificazioni resta valido.

**Decisioni di metodo già stabilite** (S18 + S19):

- **L40** — Dashboard dinamica = compone DOM **solo da asset del catalogo Brand Identity** (single SoT visiva), preset DB-driven con slot count **variabile**. Catalogo dashboard ≡ Libreria asset Brand Identity. Dashboard ad-hoc = eccezione.
- **L41** — Drift D1 (pill) e D3 (heatmap bucket) risolti: `.pill` canonical (4 modifier ok/warn/critical/info) · `.heat-{0..6}` canonical (7 bucket).
- **D7** — BrandWidget come compositor degli atomic packages/ui (refactor in G3) ✅ concordato S18
- **D9** — Convergenza a un solo `<DashboardRenderer/>` DB-driven (G5) ✅ concordato S18

**Decisioni pending residue (drift MED/LOW, bloccano G2 completion)** — RICHIEDONO DISCUSSIONE PRIMA DI CODICE:

| ID | Drift | Severity | Audit reco |
|---|---|---|---|
| **D2** | Split 3-system: `.double-split` (4/7) vs `.kg-split` (1/7) vs `.bottom-split` (1/7) — stesso pattern semantico "2-col split" con naming diverso | MED | Unify a `.split-2` con varianti ratio (`.split-2--asymmetric`, `.split-2--symmetric`) |
| **D4** | Bar fill 2-system: `.bar-fill.fill-*` (4/7) vs `.gauge-bar-fill.gauge-*` (1/7) | MED | Unify a `.bar-fill.fill-*` |
| **D5** | Activity vs Audit row: `.activity-list/.activity-item` (HrDirector) vs `.audit-list/.audit-row` (OrgSystems) | LOW | Optional: promuovere a `.event-stream` + 2 varianti |
| **D6** | RBAC matrix usa `.skill-gap` wrapper (semanticamente improprio) | MED | Promuovere `.matrix-wrap` come wrapper canonico |

## Last session brief (S19)

S19 G2-partial sessione: 1 commit prod code, 1 entry DECISIONS-LOG. D1+D3 drift remediation completata: `.status-pill` + `.status-{ok,warn,down}` rimossi da `dashboard-brand.css` (~24 righe) · 2 callsite migrati (OrgSystemsView:253 + CrossTenantOverviewView:293) a `.pill pill-${status}` con dataset corrente `ok|warn` (mapping `down→critical` documentato in L41 come spec). `.heatmap-cell.hl-{10..90}` rimosso (~15 righe) · `BrandSkillHeatmap.tsx` helper migrato a 7 soglie matching `SkillsHeatmapView.tsx`. Test gate verde: typecheck app+ui PASS · vitest 186/186 services/app · 95/95 packages/ui (281 totali). Nessuna regressione. **Drift mockup HTML**: `.ux-design/06-mockups/dashboards/{org-systems,cross-tenant-overview}.html` continuano a usare `.status-pill` (segregati dal runtime, no import in prod). Sync mockup vs canonical = follow-up brand-side, da decidere se parte di v1.0 promotion o L42 separato.

## Top priorities (next session)

1. **Decisioni D2 + D4 + D5 + D6** — 4 decisioni pending sopra. Una volta prese, completare G2 (~2-3h: `.double-split` unify · `.bar-fill` unify · `.event-stream` decisione · `.matrix-wrap` promote).

2. **G1 — Formalizzazione catalogo Brand Identity dashboard** (~4-6h) — produrre doc canonical `docs/30-developer/brand-dashboard-catalog.md` con spec asset + varianti dichiarate per ognuno dei 138 selettori CSS classificati `(a)` IN-CATALOG. Base: §3 di `brand-dashboard-catalog-CURRENT-STATE.md`. Deliverable: catalogo formale che è la SoT post-promotion.

3. **G3 — Promozione asset mancanti** (~8-12h) — implementare BrandWidget per `.gauge-card`, `.comp-card`, `.bridge-card`, `.profile-hero`, `.histogram` (5 nuovi). Aggiungere BrandActivityFeed in `WIDGET_REGISTRY` (gap D8). Eseguire refactor compositor (D7): BrandKpiCard riusa atomic KpiRing + chrome, ecc.

4. **G4 — Estensione schema preset DB** (~3-4h) — nuova tabella `dashboard_preset_layout` con slot variabili gerarchici (es. `double-split.left/right`). Migration + RLS + seed.

5. **G5 — Riscrivere `<DashboardRenderer>`** (~6-8h) — consumer del widget registry; eliminare i 7 `*View.tsx`; switch in `dashboard/page.tsx` collassa a 1 chiamata. D9 ✅.

6. **G6 — Seedare 8 preset DB-driven** (~3-4h) — 1 preset per ruolo, slot composte da catalogo. Sostituisce hardcoded JSX delle 7 view.

**Total roadmap residua**: ~24-34h (3-5 sessioni). G2 residual + G1 sono il prossimo blocco operativo.

## Old priorities (carry-forward — meno urgenti post-L40)

- **Mockup vs canonical sync** — 2 file HTML in `.ux-design/06-mockups/dashboards/` ancora con `.status-pill` (segregati, no impatto prod). Da decidere se sync ora o parte di v1.0 promotion.
- **Data binding live full** (~3-5h) — 6 view non-`org_systems`. **Nota**: post-G5 assorbito automaticamente.
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS. Collassa in G6 seed.
- **MV auto-refresh** (~2-3h) — pg_cron schedule REFRESH 5min. Indipendente.
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI. Da fare post-G5.
- **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode.
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`.

## Open questions

- **D2 split 3-system**: `.split-2` + varianti? Quali varianti? (asymmetric/symmetric? rate-based 60/40 70/30?)
- **D4 bar fill**: deprecare `.gauge-bar-fill.gauge-*` direttamente o phase-out con alias temporaneo?
- **D5 activity/audit**: semantic distinct (auditing trail vs feed live) → mantenere separati? o unify a `.event-stream`?
- **D6 RBAC matrix wrapper**: introdurre `.matrix-wrap` separato o accettare `.skill-gap` riusato?
- **Mockup HTML drift**: aggiorniamo mockup `.ux-design/06-mockups/dashboards/*.html` ora (sync brand SoT) o lasciamo come historical reference Phase 9?
- **`pg_cron` extension installata su Postgres bare-metal?** Se no → systemd timer + psql script per MV auto-refresh
- **D7 atomic packages/ui — keep or deprecate dopo refactor compositor?** Decidere pre-G3 esecuzione.

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + 9 BrandWidget services/app + 8 atomic dashboard packages/ui |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · 11 presets · 2 MV · `role_default_dashboards` 8 row |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical ~2335 righe (post-L41 cleanup -39 righe) |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-G5) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · **186 app** · 82 shared · **95 ui** (820 totali · 281 verificati S19) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→**L41** (L41 = 2026-05-08 D1+D3 drift remediation) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 può richiedere restart in nuova sessione

## Verification post-S19

```bash
git status -sb                                                     # clean post G2-partial
git log --oneline -3
# <new>     refactor(app): G2 drift remediation D1 D3 (L41)
# fb98fdf chore: handoff S18
# 808c7f6 docs(ux-design): catalog audit dashboard pre-flight (L40)

# Verifica zero residui drift D1+D3
grep -rn "status-pill\|status-ok\|status-warn\|status-down" services/app/src packages/ui/src   # 0 match
grep -rn "hl-9\|hl-7\|hl-5\|hl-3\|hl-1" services/app/src packages/ui/src                       # 0 match

# Verifica canonical attivo
grep -c "\.pill" services/app/src/styles/dashboard-brand.css                                    # >= 5
grep -c "\.heatmap-cell\.heat-" services/app/src/styles/dashboard-brand.css                     # 7

# Test gate baseline
npm run typecheck --workspace=services/app
npm run typecheck --workspace=packages/ui
npm test --workspace=services/app -- --run        # 186/186
npm test --workspace=packages/ui -- --run         # 95/95
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **L41 D1+D3 decisioni** | `.ux-design/DECISIONS-LOG.md` § L41 |
| **Audit catalogo S18** | `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` |
| **Tassonomia + L40** | `.ux-design/DECISIONS-LOG.md` § L40 |
| **Phase 15.A architettura** | `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md` (ADR) |
| **Mockup brand canonical (modello unificato)** | `.ux-design/06-mockups/dashboards/org-systems.html` |
| **CSS catalogo (post-L41)** | `services/app/src/styles/dashboard-brand.css` |
| **Widget registry attivo** | `services/app/src/lib/dashboard-engine/registry.tsx` (8/9 brand widget) |
| **Role-preset resolver** | `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` |
| **DB seed presets** | `db/seeds/phase15a_role_default_dashboards.sql` (8 platform default) |
| **7 view bespoke da convergere (G5)** | `services/app/src/app/(app)/dashboard/_views/*.tsx` |
| **9 BrandWidget catalog** | `services/app/src/components/widgets/brand/*.tsx` |
| **8 atomic Phase 13.A** | `packages/ui/src/components/dashboard/*.tsx` |
| **BrandShell layout** | `services/app/src/app/(app)/_components/BrandShell.tsx` |
| **Data fetcher pattern** | `services/app/src/lib/dashboard-views/org-systems-data.ts` |

## Operating baseline reminder per nuova sessione

- **R1**: pensa prima, agisci dopo
- **R5**: TEST-BEFORE-CLAIM — verified-by stamp obbligatorio per asserzioni
- **R8**: parallelismo tool calls indipendenti
- **R11**: direct push main default, no PR (post-S11)
- **R14**: anti-bias — cerca evidenza contraria · stop dopo 30 min senza convergenza
- Prima di partire G2 residual (D2/D4/D5/D6), **ESPLICITA decisioni a Enzo** — non assumere
