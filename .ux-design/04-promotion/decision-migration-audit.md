# Decision Migration Audit — Cycle 1 → Cycle 2

> Audit selettivo S62 (2026-05-13) delle 85 entry cycle 1 (`../.ux-design-archive-2026-05-13/DECISIONS-LOG.md`) per stabilire outcome migration al cycle 2.
>
> **Conteggio effettivo**: 85 entry (L1-L49 sequenziali + L52-L87, L50/L51 numericamente mancanti).
>
> **Categorie outcome**:
>
> - `MIGRATE` — ri-affermata come Ln cycle 2 in `../DECISIONS-LOG-v2.md` con citazione predecessore
> - `DECAY` — non più valida, non portata avanti (cycle 2 reinizia)
> - `SUPERSEDED` — già supersedutta dentro cycle 1, irrilevante per cycle 2
> - `N-A` — operativa/contestuale/sprint-closure, non brand decision

## Scorecard

| Cycle 1 | Data       | Titolo 1-line                                                         | Outcome    | Motivazione                                                                                                                                     |
| ------- | ---------- | --------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| L1      | 2026-05-04 | Scope `.ux-design/` definito                                          | MIGRATE    | Policy segregazione resta valida cycle 2 (vedi `.ux-design/README.md`)                                                                          |
| L2      | 2026-05-04 | Direzione greenfield + guida progressiva                              | DECAY      | Cycle 1 setup specifico, cycle 2 reinizia da assessment                                                                                         |
| L3      | 2026-05-04 | Riferimenti compass approvati                                         | DECAY      | Compass cycle 1 specifico (Linear/Stripe/Vercel-like), cycle 2 può rivedere                                                                     |
| L4      | 2026-05-04 | Dashboard come focus prioritario                                      | MIGRATE    | Priorità dashboard resta valida (G6 \_v2 preset in produzione live)                                                                             |
| L5      | 2026-05-04 | Versionato cross-machine via git                                      | MIGRATE    | Decision strutturale (no cloud sync, git è SoT)                                                                                                 |
| L6      | 2026-05-04 | Logo www.heuresys.com definitivo                                      | SUPERSEDED | Sciolto in L11 nello stesso cycle 1                                                                                                             |
| L7      | 2026-05-04 | Dashboard architecture 4-elementi data-driven                         | MIGRATE    | Architectural decision (preset/elements/role/render) preservata in DBMS schema                                                                  |
| L8      | 2026-05-04 | β Enterprise audience positioning                                     | DECAY      | Cycle 1 selection esplorativa, cycle 2 reinizia audience selection                                                                              |
| L9      | 2026-05-04 | "Editorial Cinematic Ontologico" raccomandata                         | SUPERSEDED | Sciolto in L11                                                                                                                                  |
| L10     | 2026-05-05 | B1 Geist convince + alternative                                       | SUPERSEDED | Sciolto in L11                                                                                                                                  |
| L11     | 2026-05-05 | Reset completo: logo/palette/tipografia ricondiderati                 | DECAY      | Reset interno cycle 1, ha aperto esplorazione Set 1-4 poi tutta archiviata                                                                      |
| L12     | 2026-05-05 | Sistema continuità cross-session istituito                            | DECAY      | Skill brand-resume riridisegnata cycle 2 (4-step vs 8-step)                                                                                     |
| L13     | 2026-05-05 | Slash command `/brand` + skill `brand-resume` istituiti               | DECAY      | Skill esistono ma protocol cycle 2 differente (vedi S62 Phase 1)                                                                                |
| L14     | 2026-05-05 | Integrazione brand reference library `99-samples/`                    | DECAY      | Library `99-samples/` archived                                                                                                                  |
| L15     | 2026-05-05 | Set 3 data-dense variants ι κ λ μ + family-picker                     | DECAY      | Set 3 archived, cycle 2 può ripartire da family-picker se richiesto                                                                             |
| L16     | 2026-05-05 | Logo y-accent standard cross-direction                                | MIGRATE    | Supersedutta da L25 (regole permanenti) — migro L25                                                                                             |
| L17     | 2026-05-05 | Set 1 dual-theme rewrite + Set 4 μ persona variants                   | DECAY      | Set 1 + Set 4 archived                                                                                                                          |
| L18     | 2026-05-05 | Logo y italic vietato per sans-serif                                  | MIGRATE    | Regola visiva preservata (Exo 2 non-italic per "y")                                                                                             |
| L19     | 2026-05-05 | μ-architect-legacy applicata                                          | MIGRATE    | È la baseline conservata in `services/app/src/styles/tokens.css` Phase 5                                                                        |
| L20     | 2026-05-05 | Set 5 estensione palette legacy a 16 mockup                           | DECAY      | Set 5 archived, baseline preservata via L19                                                                                                     |
| L21     | 2026-05-05 | D1 CHIUSA · μ-architect-legacy fissato                                | SUPERSEDED | Sostituita da L1 cycle 2 (reset charter) — baseline preservata via L19 migration                                                                |
| L22     | 2026-05-05 | Phase 9 5/5 dashboard + layout v2                                     | MIGRATE    | 5 dashboard mockup canonici disponibili come reference per cycle 2 (in archive `06-mockups/dashboards/`)                                        |
| L23     | 2026-05-05 | Architect-style customizations cross-dashboard                        | MIGRATE    | Scelte visive (logo legacy / bordered avatars / sticky header+footer / scroll indipendenti) preservate come reference                           |
| L24     | 2026-05-05 | Phase 8 Motion language complete                                      | MIGRATE    | `motion.css` preservato in produzione (4 ease + 6 durations + 7 utilities)                                                                      |
| L25     | 2026-05-05 | Logo wordmark — REGOLE PERMANENTI                                     | MIGRATE    | Logo h lowercase + Exo 2 700 + y accent in `var(--accent)` — reaffirmata come L2 cycle 2 (supersedes L16 cycle 1)                               |
| L26     | 2026-05-06 | Skill `studio` + namespace `/studio:*`                                | DECAY      | Sostituita da `/studio2:*` v2 in S62 Phase 6                                                                                                    |
| L27     | 2026-05-06 | "Logo originale" canonical · 2 colori fissi                           | MIGRATE    | Body `var(--brand-blue)` + y `var(--accent)` regola visiva preservata                                                                           |
| L28     | 2026-05-06 | "Logo relativo" convenzione `.wordmark-relative`                      | MIGRATE    | Body `var(--logo-body, var(--ink))` + y `var(--accent)` regola visiva preservata                                                                |
| L29     | 2026-05-06 | Phase 13.A — Atomic dashboard components                              | N-A        | Operativo `packages/ui/` (componenti tecnici, non brand decision)                                                                               |
| L30     | 2026-05-06 | Phase 13.B — Dashboard engine schema                                  | N-A        | Operativo DBMS schema (`dashboard_presets` + `dashboard_elements`)                                                                              |
| L31     | 2026-05-06 | Phase 13 CHIUSA · 13.C-D-E                                            | N-A        | Operativo sprint closure                                                                                                                        |
| L32     | 2026-05-07 | Phase 14 Sprint 1 (Bundle F sub-phase A+H)                            | N-A        | Operativo sprint                                                                                                                                |
| L33     | 2026-05-07 | Sprint 1 follow-up + Sprint 2.E RBP matrix                            | N-A        | Operativo sprint                                                                                                                                |
| L34     | 2026-05-07 | DBMS bare-metal SoT + Phase 14.SH plan                                | N-A        | Infrastructural (ADR-0023)                                                                                                                      |
| L35     | 2026-05-07 | Phase 10 (altre surface) chiusa via 14.SH                             | N-A        | Operativo sprint                                                                                                                                |
| L36     | 2026-05-07 | Phase 11 — Theme variants JSON (W3C DTCG)                             | MIGRATE    | Formato W3C DTCG preservato come canonical in `02-tokens/tokens.json` (popolato Phase 5)                                                        |
| L37     | 2026-05-07 | Phase 12 — Brand book v0                                              | DECAY      | Brand book v0 archived, cycle 2 può ricreare brand book ex-novo dopo Phase 1 assessment                                                         |
| L38     | 2026-05-08 | Pre-promotion audit + 5 gap chiusi                                    | N-A        | Operativo audit closure                                                                                                                         |
| L39     | 2026-05-08 | Phase 15.A brand-fedele dashboard rendering                           | SUPERSEDED | Superseduta da ADR-0032 (cycle 2 reset). Dashboard pipeline G6 `_v2` in produzione resta funzionante ma non più "brand-fedele" definita cycle 1 |
| L40     | 2026-05-08 | Tassonomia dashboard dinamica + catalog DB                            | DECAY      | Catalog DB archived in cycle 2                                                                                                                  |
| L41     | 2026-05-08 | Drift D1+D3 risolti · pill `.pill` · heatmap `.heat-{0..6}`           | N-A        | Operativo styling fix                                                                                                                           |
| L42     | 2026-05-08 | G2 completion · D2 D4 D5 D6 risolti                                   | N-A        | Operativo styling fix                                                                                                                           |
| L43     | 2026-05-08 | D7 keep parallel · D8 chiuso · G3-bis 5 widget · G5 DashboardRenderer | N-A        | Operativo component build                                                                                                                       |
| L44     | 2026-05-09 | G5-phase-2 hierarchy + G6 smoke seed 2 preset                         | N-A        | Operativo engine adoption                                                                                                                       |
| L45     | 2026-05-09 | G6 full · 7 preset hierarchical · adoption shipped                    | N-A        | Operativo engine adoption                                                                                                                       |
| L46     | 2026-05-09 | Catalog DB SoT operativa · org-systems body import                    | DECAY      | Catalog DB archived                                                                                                                             |
| L47     | 2026-05-09 | Body-only import 10 mockup · 11 dashboardCode                         | DECAY      | Catalog DB archived                                                                                                                             |
| L48     | 2026-05-09 | Theme/palette framework v1 + wordmark `var(--primary)`                | DECAY      | Consolidato in `tokens.css` cycle 2 (1 SoT) — wordmark body convention preservata via L25+L27+L28                                               |
| L49     | 2026-05-09 | Theme framework in `/brand-studio` + canonical sweep                  | DECAY      | `/brand-studio` route adattata cycle 2 (1 palette baseline vs 17 switchable)                                                                    |
| L52     | 2026-05-09 | `users.tenant_id` resta derivata                                      | N-A        | DBMS schema decision (non brand)                                                                                                                |
| L53     | 2026-05-09 | Forensic DBMS audit baseline + legacy login purge                     | N-A        | Audit DBMS                                                                                                                                      |
| L54     | 2026-05-09 | S23 forensic audit partial closure                                    | N-A        | Sprint closure                                                                                                                                  |
| L55     | 2026-05-09 | S23-bis extension closure                                             | N-A        | Sprint closure                                                                                                                                  |
| L56     | 2026-05-09 | S23-tris: tenant_id 24 tables + triggers + parametrize                | N-A        | DBMS hardening                                                                                                                                  |
| L57     | 2026-05-10 | S23-quater residual sweep                                             | N-A        | Sprint closure                                                                                                                                  |
| L58     | 2026-05-10 | S24: forensic audit FINAL closure 95%                                 | N-A        | Sprint closure                                                                                                                                  |
| L59     | 2026-05-10 | S24 ext: employees vertical-split Phase 1                             | N-A        | DBMS schema (non brand)                                                                                                                         |
| L60     | 2026-05-10 | S26: Phase 2 vertical-split DEFERRED                                  | N-A        | DBMS schema                                                                                                                                     |
| L61     | 2026-05-12 | S50 brand audit visivo + 14 drift chiusi                              | DECAY      | Audit cycle 1, drift specifici a mockup archived                                                                                                |
| L62     | 2026-05-12 | S51: 3 carry-forward S50 chiusi                                       | N-A        | Sprint closure                                                                                                                                  |
| L63     | 2026-05-12 | S52: Phase 2 vertical-split già shipped retroactively                 | N-A        | DBMS schema                                                                                                                                     |
| L64     | 2026-05-12 | S52: audit retroattivo commit DDL orphan                              | N-A        | DDL audit                                                                                                                                       |
| L65     | 2026-05-12 | S52: pre-push hook DDL → DECISIONS-LOG                                | N-A        | Tooling (cycle 1 specifico, cycle 2 ridefinirà se necessario)                                                                                   |
| L66     | 2026-05-12 | S53: P4 WCAG 2.2 AA sign-off                                          | N-A        | A11y compliance (preservata in produzione, indipendente dal cycle reset)                                                                        |
| L67     | 2026-05-12 | S53: P5 Lighthouse bench partial                                      | N-A        | Perf bench                                                                                                                                      |
| L68     | 2026-05-12 | S54: pgBouncer transaction-mode + Prisma fix                          | N-A        | DBMS connection pooling                                                                                                                         |
| L69     | 2026-05-12 | S54: WCAG 2.2 AAA enhanced contrast                                   | N-A        | A11y compliance (palette legacy specifica, ma il principio AAA resta indipendente)                                                              |
| L70     | 2026-05-12 | S54: W#1 Header HR_DIRECTOR mockup canonical                          | N-A        | Sprint W#1 closure                                                                                                                              |
| L71     | 2026-05-12 | S54: W#2 KPI cards layout mockup-fedele                               | N-A        | Sprint W#2 closure                                                                                                                              |
| L72     | 2026-05-12 | S54: AAA regression fix post-W#2                                      | N-A        | A11y fix                                                                                                                                        |
| L73     | 2026-05-13 | S54: W#3+W#4 body panels prod-as-shipped                              | N-A        | Sprint W closure                                                                                                                                |
| L74     | 2026-05-13 | S54: W#5+W#6+W#7 sweep batch                                          | N-A        | Sprint W closure                                                                                                                                |
| L75     | 2026-05-13 | S54: CF#4+#5+#2+#6+#1 sweep                                           | N-A        | Sprint CF closure                                                                                                                               |
| L76     | 2026-05-13 | S55: WCAG AAA 15-palette batch                                        | N-A        | A11y across 17 palette (palette archiviate, no more switchable)                                                                                 |
| L77     | 2026-05-13 | S55: Bundle perf audit baseline                                       | N-A        | Perf bench                                                                                                                                      |
| L78     | 2026-05-13 | S35.2 CASCADIA Stage 0: tooling foundation                            | N-A        | CASCADIA seeding pipeline (non brand)                                                                                                           |
| L79     | 2026-05-13 | S35.3 CASCADIA Stage 1a: TALPIPE RTL Bank                             | N-A        | CASCADIA seeding                                                                                                                                |
| L80     | 2026-05-13 | S35.3 Stage 1b: SKILGRO+PULSAR+GOKMER RTL                             | N-A        | CASCADIA seeding                                                                                                                                |
| L81     | 2026-05-13 | S35.4 Stage 2b: H2R-Onboarding cross-tenant                           | N-A        | CASCADIA seeding                                                                                                                                |
| L82     | 2026-05-13 | S35.4 Stage 2f+3: carry-forward batch closure                         | N-A        | CASCADIA seeding                                                                                                                                |
| L83     | 2026-05-13 | CASCADIA closure S55+6: EcoNova + EPRA + verify-area                  | N-A        | CASCADIA seeding                                                                                                                                |
| L84     | 2026-05-13 | S57 CASCADIA Stage 5: Dashboard Registry sweep                        | N-A        | CASCADIA seeding                                                                                                                                |
| L85     | 2026-05-13 | P11 constraint codificato + tenant_owner_overview_v2 live             | N-A        | P11 NO MOCK è principio indipendente dal cycle (preservato in CARD-4 + project P1-P11)                                                          |
| L86     | 2026-05-13 | S59: P1 cross-tenant leak fix + 5 preset bonifica                     | N-A        | DBMS security fix                                                                                                                               |
| L87     | 2026-05-13 | S60: zero carry-forward — 5 CF chiusi                                 | N-A        | Sprint closure                                                                                                                                  |

## Conta totale

| Outcome    | Count  | %        |
| ---------- | ------ | -------- |
| MIGRATE    | 14     | 16.5%    |
| DECAY      | 16     | 18.8%    |
| SUPERSEDED | 5      | 5.9%     |
| N-A        | 50     | 58.8%    |
| **TOTALE** | **85** | **100%** |

## MIGRATE candidates ri-affermati in cycle 2

| Cycle 1         | Cycle 2                          | Topic                                                                 |
| --------------- | -------------------------------- | --------------------------------------------------------------------- |
| L1              | (in policy `README.md`)          | Scope `.ux-design/`                                                   |
| L4              | (in BRAND-STATE)                 | Dashboard prioritario                                                 |
| L5              | (in policy `README.md`)          | Versionato cross-machine via git                                      |
| L7              | (preserved in DBMS)              | Dashboard architecture data-driven                                    |
| L16 + L18 + L25 | L2 cycle 2                       | Logo wordmark — regole permanenti                                     |
| L19             | L3 cycle 2                       | μ-architect-legacy baseline preservata in `tokens.css`                |
| L22 + L23       | reference in archive             | 5 dashboard mockup canonici + architect customizations come reference |
| L24             | preserved in `motion.css`        | Motion language                                                       |
| L27 + L28       | L4 cycle 2                       | Logo originale + relativo convenzioni                                 |
| L36             | preserved in `02-tokens/` format | W3C DTCG format                                                       |

**Le 14 decisioni MIGRATE NON vengono trascritte automaticamente come 14 entry L-NN cycle 2.** Vengono **consolidate** in 4 entry cycle 2 (L1-L4) che le ri-affermano per categoria, citando esplicitamente i predecessori archive. L1 cycle 2 (charter reset) è già scritto durante Phase 3.

**Le 14 entry consolidate vengono scritte in L2-L4 cycle 2 immediatamente dopo questo audit** (sotto).

## Razionale dei DECAY (16)

Cycle 1 ha esplorato in modo legitimo molte direzioni che sono state tutte scartate (Set 1-4, theme framework runtime, catalog DB). Quelle decisioni hanno valore storico (in archive) ma non sopravvivono cycle 2 perché:

- Il cycle 2 vuole partire da assessment fresco, non da decisioni esplorative cycle 1
- L'asset DB locale non è SoT cycle 2 (è frozen in archive)
- Il theme/palette framework runtime è collassato in 1 SoT `tokens.css` (Phase 5)

## Razionale dei SUPERSEDED (5)

Le 5 supersedute sono tutte interne al cycle 1:

- L6 (logo definitivo www.heuresys.com) → L11 reset interno
- L9 (Editorial Cinematic) → L11
- L10 (B1 Geist) → L11
- L21 (D1 chiusa μ-architect-legacy fissato) → L1 cycle 2 (charter reset complessivo)
- L39 (Phase 15.A brand-fedele rendering) → ADR-0032 charter reset

## Razionale dei N-A (50)

La maggior parte delle entry cycle 1 sono operative (sprint closure, DBMS schema, A11y compliance, CASCADIA seeding, perf bench). Non sono brand identity decisions in senso stretto. Il principio underlying (P11 NO MOCK, WCAG 2.2 AA compliance, dashboard rendering G6) resta **indipendente dal cycle reset** e preservato in produzione.
