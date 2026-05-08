# heuresys-evo — Current State

> Updated: 2026-05-08T19:00Z · S18 closed — 1 commit shipped (`808c7f6` catalog audit dashboard pre-flight L40)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🎯 DA DOVE PARTIRE NELLA PROSSIMA SESSIONE

**Leggi PRIMA**: [`.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`](../.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md) — audit catalogo Brand Identity dashboard prodotto in S18, contiene tassonomia condivisa, classificazione 5-tag su 138 selettori CSS + 17 React component, drift map D1-D10, gap formali GA1-GA8, roadmap G1-G6.

**Decisione di metodo già stabilita** (L40, S18):

- **Dashboard dinamica** = compone DOM **solo da asset del catalogo Brand Identity** (single SoT visiva), composti via preset DB-driven con slot count **variabile**
- **Catalogo dashboard ≡ Libreria asset Brand Identity** (decisione fondante)
- **Dashboard ad-hoc** = eccezione, definita di volta in volta

**Decisioni concordate da S18 che orientano la roadmap**:

| ID | Decisione | Status |
|---|---|---|
| **D7** | BrandWidget come **compositor degli atomic** packages/ui (refactor in G3): atomic restano riusabili fuori dashboard, BrandWidget = atomic + brand chrome wrapper. Sistema più ampio e versatile. | ✅ Concordato |
| **D9** | Convergenza a **un solo `<DashboardRenderer/>`** DB-driven (gap G5): elimina i 7 file `*View.tsx` bespoke, switch in `dashboard/page.tsx` collassa a 1 chiamata renderer | ✅ Concordato |

**Decisioni pending che bloccano G2 (drift remediation)** — RICHIEDONO DISCUSSIONE PRIMA DI CODICE:

| ID | Drift | Opzioni concrete |
|---|---|---|
| **D1** | **Pill 2-system**: `.pill` (HrDirector + Skills) vs `.status-pill` (org-systems) — stesso scopo (etichetta colorata stato), naming + classi diverse | A) tieni `.pill` e migra `.status-pill` (raccomandato — già usato 6/7 mockup) · B) tieni `.status-pill` · C) crea nuovo nome neutro `.tag-status` |
| **D3** | **Heatmap bucket 2-system**: `.heat-{0..6}` (7 bucket, usato in `SkillsHeatmapView`) vs `.hl-{10..90}` (5 bucket, usato in `BrandSkillHeatmap`) — stesso file CSS dichiarato 2 volte | A) tieni `.heat-{0..6}` (raccomandato — granularità 7 bucket più ricca, usato in produzione) · B) tieni `.hl-{10..90}` |

Spiegazioni dettagliate D1+D3 nel commit `808c7f6` chat history (S18 trailing) e in audit doc §5.

## Last session brief (S18)

S18 audit-only sessione: nessun codice produzione modificato. Intervista chiarificazione tassonomia dashboard → emersione che le 7 view brand-fedeli Phase 15.A (S17) sono ibrido bespoke, non vere "dashboard dinamiche" secondo modello unificato. Generato `brand-dashboard-catalog-CURRENT-STATE.md` (384 righe) che mappa esaustivamente 138 selettori CSS + 9 BrandWidget + 8 atomic packages/ui + widget registry, classifica 10 drift D1-D10, identifica 8 gap GA1-GA8, traccia roadmap 6-step G1-G6 (~26-37h) verso modello unificato. 4 cross-link aggiunti (BRAND-BOOK + v1.0-checklist + BRAND-STATE + DECISIONS-LOG L40). Pre-flight per promotion v1.0 dashboard.

## Top priorities (next session) — RIORDINATE post-L40

1. **G1 — Formalizzazione catalogo Brand Identity dashboard** (~4-6h) — produrre doc canonical `docs/30-developer/brand-dashboard-catalog.md` con spec asset + varianti dichiarate per ognuno dei 138 selettori CSS classificati `(a)` IN-CATALOG. Base: §3 di `brand-dashboard-catalog-CURRENT-STATE.md`. Deliverable: catalogo formale che è la SoT post-promotion.

2. **G2 — Drift remediation D1-D6** (~3-4h) — risoluzione drift naming/duplicate. **Bloccato da decisione D1 + D3** sopra. Una volta deciso, intervento su `dashboard-brand.css` + view consumer (BrandSkillHeatmap.tsx, OrgSystemsView.tsx, ecc.). Test regression: vitest UI + Playwright RBP matrix.

3. **G3 — Promozione asset mancanti** (~8-12h) — implementare BrandWidget per `.gauge-card`, `.comp-card`, `.bridge-card`, `.profile-hero`, `.histogram` (5 nuovi). Aggiungere BrandActivityFeed in `WIDGET_REGISTRY` (gap D8). Eseguire refactor compositor (D7): BrandKpiCard riusa atomic KpiRing + chrome, ecc.

4. **G4 — Estensione schema preset DB** (~3-4h) — nuova tabella `dashboard_preset_layout` con slot variabili gerarchici (es. `double-split.left/right`). Migration + RLS + seed.

5. **G5 — Riscrivere `<DashboardRenderer>`** (~6-8h) — consumer del widget registry; eliminare i 7 `*View.tsx`; switch in `dashboard/page.tsx` collassa a 1 chiamata. Conferma D9 esplicita di Enzo.

6. **G6 — Seedare 8 preset DB-driven** (~3-4h) — 1 preset per ruolo, slot composte da catalogo. Sostituisce hardcoded JSX delle 7 view.

**Total roadmap**: ~26-37h (3-5 sessioni). G1 e G2 + decisione D1/D3 sono il prossimo blocco operativo.

## Old priorities (carry-forward — meno urgenti post-L40)

- **Data binding live full** (~3-5h) — sostituisci dati hardcoded mockup-fedeli nelle 6 view non-`org_systems` con query Prisma reali. **Nota**: post-G5 questo viene assorbito automaticamente (renderer DB-driven richiede preset con query bound).
- **Estensione preset minori** (~2-3h) — view brand-fedeli per 4 preset PROCESS (`process_recruiting_funnel`, ecc.). Anche questo collassa in G6 seed.
- **MV auto-refresh** (~2-3h) — pg_cron schedule REFRESH 5min su `mv_cross_tenant_rollup` + `mv_tenant_owner_rollup`. Indipendente dalla roadmap dashboard.
- **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass. Da fare post-G5 (su renderer unificato, non su 7 view bespoke).
- **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode. Indipendente.
- **Brand v1.0 promotion** (~16-25h) — pre-flight checks `v1.0-checklist.md`. Audit catalogo dashboard L40 è ora pre-flight ufficiale dello step "7 dashboard mockup → React route".

## Open questions

- **D1 pill 2-system**: scelta naming canonical (vedi sopra · raccomando A `.pill`)
- **D3 heatmap bucket 2-system**: scelta granularità (vedi sopra · raccomando A `.heat-{0..6}`)
- **`pg_cron` extension installata su Postgres bare-metal?** Se no → systemd timer + psql script per MV auto-refresh
- **D7 atomic packages/ui — keep or deprecate dopo refactor compositor?** Se atomic restano consumati solo da BrandWidget (no Storybook standalone use cases), valutare deprecazione e collasso. Decidere pre-G3 esecuzione.

## Stack snapshot

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view (audit S18: in conversione verso `<DashboardRenderer/>`) |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder pending |
| UI Library | `@heuresys/ui` Cantiere B + 9 BrandWidget services/app + 8 atomic dashboard packages/ui (17 parallel impl mappate D7) |
| **DB** | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · 11 presets · 2 MV · `role_default_dashboards` 8 row |
| Brand | `.ux-design/` 13 phase ✅ · CSS canonical 2370 righe (138 selettori classificati in audit S18) |
| a11y | WCAG 2.2 AAA 16/16 (verifica spot · full audit pending post-G5) |
| Perf | P95 794ms baseline · MV active · TTL 600s |
| Vulns | 0 |
| Tests | 457 gw · 186 app · 82 shared · 95 ui (820 totali) |
| ADR | 26 (ADR-0026 Phase 15.A brand-fedele dashboard) |
| DECISIONS-LOG | L1→L40 (L40 = 2026-05-08 tassonomia dashboard + audit) |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 attivo (HMR live in S17, può richiedere restart in nuova sessione)

## Verification post-S18

```bash
git status -sb                                                     # clean post 808c7f6
git log --oneline -3
# 808c7f6 docs(ux-design): catalog audit dashboard pre-flight (L40)
# 2d127fd chore: handoff S17
# 597d471 docs: Phase 15.A brand-fedele dashboard rendering — global doc sync

# Verifica audit doc
wc -l .ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md   # ~470 righe (post prettier)
ls -la .ux-design/08-promotion/                                          # 3 file: v1.0-checklist + promotion-candidates + brand-dashboard-catalog-CURRENT-STATE

# Verifica decisione DB seed
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT role, preset_code FROM role_default_dashboards ORDER BY role"'

# Pre-G2 prep: verifica drift D1+D3 ancora presenti
grep -n "status-pill\|\.pill" services/app/src/styles/dashboard-brand.css | head
grep -n "heat-\|hl-" services/app/src/styles/dashboard-brand.css | head
```

## Riferimenti critici per ripartire

| Per… | Vedi |
|---|---|
| **Audit catalogo S18** | `.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md` |
| **Tassonomia + decisioni S18** | `.ux-design/DECISIONS-LOG.md` § L40 |
| **Plan execution S18** | `~/.claude/plans/concordo-con-a-happy-tarjan.md` |
| **Phase 15.A architettura** | `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md` (ADR) |
| **Mockup brand canonical (modello unificato)** | `.ux-design/06-mockups/dashboards/org-systems.html` |
| **CSS catalogo classificato** | `services/app/src/styles/dashboard-brand.css` (138 selettori, 28 sezioni) |
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
- Prima di partire G2 (drift remediation), **ESPLICITA decisione D1+D3 a Enzo** — non assumere
