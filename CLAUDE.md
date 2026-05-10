# heuresys-evo — Project Instructions

> **Operating Baseline** (regole comportamentali complete): [`docs/_meta/operating-baseline.md`](docs/_meta/operating-baseline.md). SoT cross-machine via git.
>
> Repo: `heuresys-evo` (greenfield rewrite di `heuresys.com.evo` legacy). Solo coder = Enzo Spenuso. No PR-driven default.

## Session start protocol

1. Leggi `.handoff/STATE.md`
2. `git status -sb` (clean? in sync con `origin/main`?)
3. Saluta: 1-line recap + top 3 priorities + open questions se rilevanti
4. Aspetta direzione esplicita prima di toccare codice

Eccezione: skip se utente apre con comando diretto self-contained.

A fine sessione, `/handoff` aggiorna `.handoff/STATE.md` + commit + push direct main.

## Brand workstream (active)

Workstream parallelo per costruzione brand identity completa di Heuresys, segregato in [`.ux-design/`](.ux-design/) (escluso da build pipeline, niente import in production code).

**Trigger di attivazione**: se Enzo dice "lavoriamo sul brand", "ux-design", "logo", "palette", "tipografia", "dashboard design", "riprendiamo il design" — segui il protocollo in [`.ux-design/SESSION-RESUME.md`](.ux-design/SESSION-RESUME.md) prima di rispondere.

**Attivazione esplicita** (3 modi ridondanti):

- Slash command `/brand` (vedi [`.claude/commands/brand.md`](.claude/commands/brand.md))
- Skill `brand-resume` (vedi [`.claude/skills/brand-resume/SKILL.md`](.claude/skills/brand-resume/SKILL.md))
- Trigger keyword detection via auto-memory `~/.claude/projects/D--evo-heuresys-com/memory/feedback_brand_workstream.md`

| File                                                           | Scopo                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`.ux-design/SESSION-RESUME.md`](.ux-design/SESSION-RESUME.md) | Protocollo 8-step per ripresa cross-session (skill + tools + http server + greeting)                    |
| [`.ux-design/BRAND-STATE.md`](.ux-design/BRAND-STATE.md)       | SoT consolidato: phase corrente, decisioni stabilite, decisioni pending, asset inventory, setup tecnico |
| [`.ux-design/DECISIONS-LOG.md`](.ux-design/DECISIONS-LOG.md)   | Log cronologico append-only di tutte le decisioni (con superseduture esplicite)                         |
| [`.ux-design/README.md`](.ux-design/README.md)                 | Policy segregazione + struttura directory                                                               |

**Phase corrente** (verifica sempre in `BRAND-STATE.md` per stato aggiornato): Phase 4 aesthetic direction in re-exploration (8 direzioni esposte α-θ, scelta finale pending).

## Studio workstream (active)

Workflow disciplinato per modifiche a route Next.js in produzione: ogni edit passa attraverso il dominio brand identity (`.ux-design/10-staging/`) con backup restorable obbligatorio prima della ri-promozione. **Mai modificare direttamente `services/app/src/app/<route>/`** — sempre clone → manipola → promote.

**Trigger di attivazione**: se Enzo dice "iteriamo sulla pagina /\<route\>", "clona la pagina di X", "lavoriamo sulla dashboard", "promote staging", "rollback design", o si riferisce a "staging" / "drift produzione" — segui il protocollo in [`.claude/skills/studio/SKILL.md`](.claude/skills/studio/SKILL.md) prima di rispondere.

**Attivazione esplicita** (3 modi ridondanti):

- Slash command `/studio` (entry) + namespace `/studio:*` (vedi [`.claude/commands/studio/`](.claude/commands/studio/))
- Skill `studio` (vedi [`.claude/skills/studio/SKILL.md`](.claude/skills/studio/SKILL.md))
- Trigger keyword detection via auto-memory `~/.claude/projects/D--evo-heuresys-com/memory/feedback_studio_workstream.md`

| Sub-command                          | Scopo                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `/studio`                            | Entry interattivo: lista staging attivi + ultimi backup + menu next action                                       |
| `/studio:clone <route>`              | Iterazione su pagina già implementata: clone produzione → staging                                                |
| `/studio:bootstrap <mockup> <route>` | Prima promozione greenfield: scaffold + mockup HTML come reference + README con workflow translation             |
| `/studio:diff <route> [<TS>]`        | Diff staging vs produzione (read-only)                                                                           |
| `/studio:promote <route> <TS>`       | 5-gate flow: brand audit + anti-slop + verification + dry-run + conferma → backup + overwrite + commit (NO push) |
| `/studio:restore <route> <bkp-TS>`   | Rollback istantaneo da backup (commit revert nuovo, NO history rewrite)                                          |
| `/studio:backup-list [<route>]`      | Tabella backup disponibili da MANIFEST.json                                                                      |
| `/studio:status`                     | Stato consolidato: staging attivi · ultimi backup · drift produzione vs ultimo backup                            |
| `/studio:doctor`                     | Self-check + auto-fix safe (`--apply`) + analisi log usage (`--learn`) + version (`--version`)                   |

**Quando usare `clone` vs `bootstrap`**: `clone` se la pagina è già implementata (iterazione); `bootstrap` se la pagina è scaffold e c'è un mockup HTML in `.ux-design/06-mockups/` da tradurre (prima implementazione).

**Disambiguazione**: la skill `studio` opera su filesystem (clone file source) ed è distinta dalla pagina URL `/brand-studio` (route runtime con wizard token CSS). Zero overlap.

**OUT-OF-SCOPE day-1**: token CSS (vedi `/brand-studio` URL), asset brand (vedi `/brand:*`), componenti `packages/ui/` isolati, cross-route refactor, DB/migration.

## Mission

Piattaforma SaaS B2B di Organizational Intelligence & Workforce Orchestration. Layer ontologico tra ERP/HR/BI per governare processi, struttura, ruoli, competenze e performance via Knowledge Graph ESCO bilingue (IT/EN).

## Stack

| Layer       | Tech                                                            |
| ----------- | --------------------------------------------------------------- |
| Workspace   | npm workspaces (Node ≥20, npm ≥10)                              |
| API Gateway | Express 5 + zod (port 8200) — `services/api-gateway`            |
| Frontend    | Next.js 16 + React 19 + Tailwind 4 (port 3200) — `services/app` |
| Workers     | BullMQ + Redis (6380) — `services/enrichment`                   |
| UI Library  | Shadcn + Cantiere B v2 (~180 component) — `packages/ui`         |
| ORM         | Prisma 5.22 (566 modelli)                                       |
| DB          | PostgreSQL 16 bare-metal (5432)                                 |
| Auth        | NextAuth v4 (Credentials + bcryptjs)                            |
| Test        | Vitest 4 (250 test verdi su 5 workspace)                        |
| Lint/Format | ESLint 9, Prettier, Husky + lint-staged + commitlint            |

## Comandi quotidiani

```bash
npm run dev --workspaces --if-present              # dev parallel
npm run build --workspace=services/api-gateway     # build mirato
npx tsc --noEmit -p tsconfig.base.json             # typecheck
npm test --workspace=services/api-gateway          # test
cd services/app && npx prisma migrate dev --name <desc>   # migration dev
cd services/app && npx prisma migrate deploy              # production
cd services/app && npx prisma migrate status              # drift check
```

## Domini

| Dominio                                                  | Repo                      | Stack   | FE port | API port | DB port           |
| -------------------------------------------------------- | ------------------------- | ------- | ------- | -------- | ----------------- |
| `evo.heuresys.com` (HTTPS)                               | questo                    | systemd | 3200    | 8200     | 5432 (bare-metal) |
| `www.heuresys.com`, `heuresys.com` (pending DNS+certbot) | `heuresys.com.evo` legacy | Docker  | 3012    | 8012     | 5433 (container)  |

VM: `oracle-vm-default` (IP 80.225.82.207). nginx vhosts in `/etc/nginx/sites-available/`.

## Principi P1-P10 (vincolanti)

| #   | Principio                      | Enforcement                                                                |
| --- | ------------------------------ | -------------------------------------------------------------------------- |
| P1  | Multi-tenant always            | `tenantId` in ogni query Prisma su tabelle tenant-scoped                   |
| P2  | Auth-required default          | Endpoint pubblici = eccezioni esplicite                                    |
| P3  | RBP enforced                   | `requirePermission(area, action)` middleware. Mai `requireRole`            |
| P4  | Audit logged                   | `audit_logs` insert per ogni write, atomico via `auditedTransaction()`     |
| P5  | RLS DB-level                   | Policy attiva su tabelle tenant-scoped + `SET LOCAL app.current_tenant_id` |
| P6  | No raw SQL injection + secrets | Prisma + tagged template `$queryRaw`. No hardcode                          |
| P7  | Validated input                | Zod schema su ogni boundary HTTP/file/IPC                                  |
| P8  | Error logged                   | Pino + Sentry. No `console.log` in prod path                               |
| P9  | Everything data-driven         | Ruoli/permessi/navigazione/perspective in DB                               |
| P10 | Multi-level Platform/Tenant    | Config supporta `tenantId NULL` (Platform) e `tenantId <uuid>`             |

## Multi-tenant & RBP (sintesi)

- 4 tenant: Heuresys System (platform), RTL Bank (test), SmartFood, EcoNova
- 8 ruoli: SUPERUSER (-1), TENANT_OWNER (0), IT_ADMIN (1), HR_DIRECTOR (2), HR_MANAGER (3), DEPT_HEAD (4), LINE_MANAGER (5), EMPLOYEE (6)
- 33 functional areas (`rbp_functional_areas`) + 47 PET mapping (Process/Enterprise/Talent)
- RLS attiva DB-level (605 policies, 326 RBP role-area-permission joins)

## Convenzioni commit (commitlint enforced)

```
<type>(<scope>): <subject>

[body 1-2 righe se serve]
```

- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `deps`, `config`, `security`, `adr`, `schema`, `ui`, `story`, `tokens`, `obs`, `migration`, `a11y`
- Scope: `api-gateway`, `app`, `enrichment`, `ui`, `shared`, `db`, `infra`, `docs`, `repo`
- Subject ≤ 70 char. No em-dash. No decorative date
- NO Co-Authored-By boilerplate

## Workflow GitHub (post-S11 simplification)

- Default: 1 sessione = 1 commit = direct push main
- PR solo se: utente esplicito | dependency major bump | cambio strutturale critico
- Branch protection main: RIMOSSA
- CI gira solo su PR + nightly cron security
- Workflows attivi: `quality.yml`, `security.yml`, `storybook.yml`
- Hooks: husky pre-commit (lint-staged + gitleaks-lite), commit-msg (commitlint)

## Legacy import workflow (active — Phase 13.0 mining)

> **Regola cross-progetto**: ogni oggetto importato dal repo legacy `D:\enzospenuso\Documents\GitHub\heuresys.com.evo` deve essere catalogato nel registry strutturato. Vedi memoria globale `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`.

**Registry SoT** (aggiornare ad ogni commit di import):

| File                                                                         | Scopo                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`.handoff/legacy-import-registry.csv`](.handoff/legacy-import-registry.csv) | Cataloghi parseabile (Excel/jq) di ogni oggetto importato — endpoint, helper, middleware, model allowlist, dependency, env-config, skipped |
| [`.handoff/legacy-import-registry.md`](.handoff/legacy-import-registry.md)   | Schema CSV + workflow stage + protocollo estirpazione                                                                                      |
| [`.handoff/legacy-mining-log.md`](.handoff/legacy-mining-log.md)             | Audit trail narrativo Pack-by-Pack (companion del CSV)                                                                                     |

**Stage workflow** (solo Enzo promuove): `Test Stage → PreOp Stage → Promoted/Rejected`. Default initial sempre `Test Stage`.

**Vincolo "estirpazione clean"**: ogni entry in `Test Stage`/`PreOp Stage` DEVE essere rimovibile dal repo evo SENZA conseguenze su stack/oggetti pre-import. Categorie removability tracciate nel CSV (`no-impact`, `embedded-in-existing-file`, `depends-on-X`, `not-yet-used`, `depends-on-DB-seed`).

## Stato attuale (2026-05-10T04:15Z · S24 · L58+L59 — forensic audit FINAL closure: 22/22 issues chiuse (100% Phase 1) · 1 architectural Phase 2 deferred S26+ · 1 miscount)

### DBMS = SoT (certified 2026-05-07T14:30Z)

- **Database `heuresys_platform`** (postgres 16.13 bare-metal, oracle-vm-default:5432) promosso a **Source of Truth unica**. Docker legacy NON è più riferimento (resta running come storico)
- Forensic certified vs docker: 506/506 tabelle popolate match · 477774/477774 rows match · 0 schema DDL diff · 17/18 MD5 bit-identical
- Primo backup baseline restorable: `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`)
- ADR-0023 documenta promotion + proof, ADR-0024 documenta plan Phase 14.SH

### Coverage live SQL widget

- **30/30 dashboard_elements bound** (26 sql + 4 static + 0 null) post `phase14c` + `phase14d`
- Demo fallback hardcoded "Stefania Bianchi" eliminato → SuccessionCard pull live `employees ORDER BY performance_rating` (mostra Gabriele Amato real)
- 7 widget composite ancora SQL static-via-SELECT → FASE 3.6 di Phase 14.SH (replace con real aggregations)

### App runtime (post-Phase 14.SH + carry-forward 2026-05-07/08)

- Pagine Next.js: 5 base (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) + 17+ viste in `(app)/` route group con AppShell role-based: `/dashboard/[code]`, `/dashboard/[code]/edit`, `/ontology`, `/explorer/{esco,sap,kg}`, `/employees`, `/team`, `/me`, `/me/skills`, `/me/{goals,reviews,learning}`, `/reviews`, `/goals`, `/learning`, `/compensation`, `/admin/{audit,tenants,users,rbac,integrations}`
- Login = `login-aurora` mockup promosso production (Phase 14.SH FASE 1)
- AppShell topbar con LocaleSwitcher globale + ThemeToggle + UserMenu (sessione carry-forward 2026-05-07)
- API Next.js route handlers: `/api/dashboard/data/[elementId]`, `/api/dashboard/[code]/elements` (PUT), `/api/ontology/advisor` (OpenAI), `/api/explorer/{esco/tree,sap/status,kg/expand}`
- Endpoint Express: 30 endpoint Pack 1-8 mounted (bypassed in (app)/ via Prisma direct, JWT cross-service fix pending — `services/api-gateway/src/auth.ts`)
- Auth: NextAuth v4 Credentials, **8 canonical users** (`Heuresys2026!`) ristretti a `tests/.test-env` matrix (1 SUPERUSER `sysadmin` + 7 RTL Bank ruoli con username = work email canonica `firstname.lastname@rtl-bank.org` post-L50). `tests/.test-env` è SoT autoritativa per il test environment (post-L51): ogni nuovo utente test va PRIMA in quel file, poi propagato a `apply-canonical-users.mjs` + DB + e2e helpers. `tenants.domain` SoT esplicita (econova.org · heuresys.com · rtl-bank.org · smartfood.org). 264 active employees · 265 active users · 1 platform user. Email canonical = `lower(strip-space-apostrophe(first.last))@<tenant.domain>`. `users` table NON ha tenant_id: legame derivato via `employee_id → employees.tenant_id` (platform users con `employee_id=NULL` usano `DEFAULT_SUPERUSER_TENANT_ID` env fallback)
- Test: 180/180 vitest services/app verde · 82/82 packages/shared · 95/95 packages/ui · 100/100 Playwright RBP matrix verde · perf script autocannon ready

### Sprint shipped (Phase 14)

- **Sprint 1.A** live data binding: data-fetcher (sql/static + cache TTL + RLS) · 8-widget adapter registry · prefetch · route handler · `useWidgetData()` hook
- **Sprint 1.D** Playwright RBP matrix 8 RTL × 9 dashboards = 72 + 27 cross-tenant smoke + regression anchor = 100/100
- **Sprint 1.H** i18n IT/EN runtime (LocaleProvider · pickBilingual · LocaleSwitcher)
- **Sprint 2.E** `auditedDashboardMutation()` helper + consumer wired in 3.C
- **Sprint 2.F** `/ontology` page + OpenAI advisor route handler + cost cap (graceful 503 senza key) + ADR-0022
- **Sprint 3.C** drag-resize dashboard editor + `auditedDashboardMutation` integration (`category=CONFIG`)
- **Sprint 3.G(foundation)** Tier 2 explorer: 3 atomic UI (`ESCOTreeNavigator`, `KGGraphCanvas`, `SAPSyncPanel`) + 3 route + 3 endpoint

### Stack snapshot

- Helper cross-cutting Pack 1: `escapeILIKE`/`safeParseInt`/`isUUID`/`buildMeta`/`validatePassword`/`generateSecurePassword`/`requirePermission` lazy/`ROLES`
- Prisma allowlist api-gateway: 16 model
- RLS policies: 605 attive · RBP joins: 326
- packages/ui: ~180 component, Storybook 9 (84 stories), GH Pages
- npm audit: 0 vulnerabilities
- Repo visibility: PUBLIC. Branch protection rimossa. CI minimal
- Schema docs: Diátaxis numbered + meta (`docs/_meta`, `10-strategy`, `20-architecture`, `30-developer`, `40-operations`, `50-reference`, `70-planning`, `90-archive`)

### ✅ Phase 14.SH chiusa (2026-05-07) + carry-forward shipped

Plan canonical eseguito: `~/.claude/plans/questo-quello-che-glittery-charm.md` · ADR-0024.

5 fasi sequenziali (24-34 FTE-day) tutte ✅ done:

1. ✅ Brand identity applied — `active-theme.css` μ-architect-legacy + `<HeuresysWordmark>` + `<AppShell>` cablato + `/login` = login-aurora promoted
2. ✅ Role-based dynamic sidebar — `SIDEBAR_MAP` 8 ruoli + `getNavForUser(session)` in `services/app/src/lib/navigation/role-nav-map.ts`
3. ✅ Sidebar views live data e2e — 8 viste SH-2 (`/employees`, `/team`, `/me`, `/me/skills`, `/admin/{audit,tenants,users}`, ecc.) + 9 viste SH-3 carry-forward (`/reviews`, `/goals`, `/learning`, `/compensation`, `/me/{goals,reviews,learning}`, `/admin/{rbac,integrations}`)
4. ✅ Composite real aggregations — `phase14e_composite_real_aggregations.sql` applicato
5. ✅ UX polish + theme toggle dark↔light + perf baseline dev (autocannon)
6. ✅ Production perf + handoff finale — STATE.md compacted + commit `0cd532d` push main

Carry-forward sessione 2026-05-07/08 (commit `0958625` + `5ebdc45` + `34f9ac8`):

- 2 mockup overview shipped (`cross-tenant-overview.html`, `tenant-owner-overview.html`) + seed `phase14f_overview_presets.sql` applicato bare-metal SoT
- LocaleSwitcher cablato in topbar AppShell (DRY, copre tutte le route `(app)/`)
- 9 viste SH-3 i18n IT/EN via `getServerLocale()` + `STRINGS` per-page const + cookie persistence

### ✅ Phase 15.A shipped (2026-05-08, commit `d59ae3e`)

Brand-fedele dashboard rendering: la rotta `/dashboard` ora renderizza un'interfaccia visivamente fedele ai mockup canonical (`.ux-design/06-mockups/dashboards/*.html`) con role-driven branching via `role_default_dashboards` (P9 + P10).

**7 view brand-fedeli** in `services/app/src/app/(app)/dashboard/_views/` — una per preset_code:

| Role                    | preset_code             | View                                                  | Mockup                     |
| ----------------------- | ----------------------- | ----------------------------------------------------- | -------------------------- |
| SUPERUSER               | `cross_tenant_overview` | `CrossTenantOverviewView`                             | cross-tenant-overview.html |
| TENANT_OWNER            | `tenant_owner_overview` | `TenantOwnerOverviewView`                             | tenant-owner-overview.html |
| IT_ADMIN                | `org_systems`           | `OrgSystemsView` (LIVE: tenants + audit + RBP counts) | org-systems.html           |
| HR_DIRECTOR             | `hr_director_overview`  | `HrDirectorOverviewView`                              | hr-director-overview.html  |
| HR_MANAGER              | `skills_heatmap`        | `SkillsHeatmapView`                                   | skills-heatmap.html        |
| DEPT_HEAD               | `capability_graph`      | `CapabilityGraphView`                                 | capability-graph.html      |
| LINE_MANAGER + EMPLOYEE | `employee_journey`      | `EmployeeJourneyView`                                 | employee-journey.html      |

**Architettura 4-layer**:

- **Layer A — Brand chrome via CSS canonical**: `services/app/src/styles/dashboard-brand.css` (~2370 righe scoped) — μ-architect-legacy direction. Classes: shell + nav-bar + sidebar collapsibile + workspace + ws-header/footer + app-footer + widget chrome (kpi-card · scope-pill · tenant-grid · double-split · panel · table.rbac heat-graded · int-row · status-pill · audit-list · metrics-grid + sparkline · gauge-grid · comp-grid · filter-bar · heatmap heat-0..6 · histogram · crit-row · kg-split · ontology-row · profile-hero · pbadge · career-arc 5-stage · capability-radar SVG · bridge-grid). 6 nuovi token in `active-theme.css` (`--cap-process/structure/role/competence/performance` + `--glow`).
- **Layer B — Layout brand-fedele**: `services/app/src/app/(app)/_components/BrandShell.tsx` (client) sostituisce AppShell generico Tailwind. `(app)/layout.tsx` (server) fa tenant lookup Prisma + passa user/tenant/env.
- **Layer C — Resolver + branching**: `lib/dashboard-engine/role-preset-resolver.ts` (`$queryRaw` P6) legge `role_default_dashboards` (tenant override > platform default > null). `(app)/dashboard/page.tsx` switch su preset_code → view brand-fedele dedicata.
- **Layer D — Data fetcher live + 9 brand widget**: `lib/dashboard-views/org-systems-data.ts` (Prisma server-side, tenants + audit + RBP counts live). 9 BrandWidget variants in `services/app/src/components/widgets/brand/` (BrandKpiCard · BrandIntegrationHealth · BrandSuccessionCard · BrandRbacMatrix · BrandSkillHeatmap · BrandActivityFeed · BrandKgGraph SVG no-Cytoscape · BrandCareerArc · BrandCapabilityRadar) registrati nel widget registry per la route override `/dashboard/[code]`.

**DB**: `db/seeds/phase15a_role_default_dashboards.sql` (CREATE TABLE + RLS + 8 platform seed). Applicato bare-metal SoT.

**Verifica**: typecheck UI+app PASS · 95/95 vitest UI · 186/186 vitest app · browser smoke PASS su SUPERUSER (cross_tenant_overview) + HR_DIRECTOR (hr_director_overview).

ADR-0026 documenta architettura + decisioni.

### ✅ Brand identity cycle SEALED (2026-05-08, L38)

Phase 1 → Phase 12 ufficialmente chiuso senza loose ends. 5 pre-promotion gap reali risolti:

- L35 — Phase 10 chiusa via Phase 14.SH execution
- L36 — Phase 11 theme variants JSON shipped (W3C DTCG · 4 file `.ux-design/05-theme-variants/`)
- L37 — Phase 12 brand book v0 shipped (`07-brand-book/BRAND-BOOK-v0.md`, 15 sezioni canoniche, single entry point)
- L38 — D1-D4 decisioni risolte · 4 personas mancanti create per coverage 1:1 RBP 8 ruoli (`05-superuser` · `06-tenant-owner` · `07-hr-manager` · `08-dept-head`) · `08-promotion/v1.0-checklist.md` scritto · promotion-candidates.md updated · brand book § 3 personas expanded a 8

### 🚀 Roadmap successiva (post Phase 15.A)

1. **Data binding live full** (~3-5h) — sostituisci dati hardcoded mockup-fedeli nelle 6 view non-org_systems con query Prisma reali (employees per tenant + skill_assessments + review_cycles + succession_pipeline)
2. **Estensione preset minori** (~2-3h) — view brand-fedeli per `process_recruiting_funnel` · `process_onboarding_flow` · `process_performance_cycle` · `process_learning_paths`
3. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass · ref: `docs/_meta/operating-baseline.md` §a11y
4. **Production build perf bench** (~1-2h) — `next build && next start` + autocannon su 8 viste auth-required, target P95 ≤ 500ms · ref: `scripts/perf/results/`
5. **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode · ref: `services/api-gateway/src/auth.ts`
6. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — pre-flight checks per 8 categorie asset · ref: `.ux-design/08-promotion/v1.0-checklist.md`

Backup track parallel: cron daily/weekly/monthly · off-site Oracle bucket · restore drill mensile · `docs/40-operations/dbms-backup-restore.md` (scaffolded).

### ✅ L46 + L47 governance shift shipped (2026-05-09)

**Catalog DB della webapp `09-asset-showcase` è ora la SoT operativa stable per il dashboard brand identity system.**

L46 (commit `15e9458`) — primo import: chrome universal cross-role (18 asset header/footer/sidebar standardizzati per TUTTE le dashboard di ruolo, `chromeStandard=true`) + body org-systems IT_ADMIN. Concetti introdotti: `chromeStandard`, `dashboardCode='*_v2'`, `mockupSource`, `behaviorsJson`/`colorTokensJson`/`subElementsJson`. 4 conflict resolutions (`.status-pill` → `.pill` canonical post-L41 · `.theme-toggle` → `.theme-toggle-btn` · `.wordmark-original` mockup wins · scaffolding mockup-only ignorato).

L47 (commit `08b2097`) — body-only import dei 10 mockup rimanenti (escluso `index.html`). 4 conflict resolutions strategiche (`.status-pill` recurrent canonical wins · `.succession-row` + `.succession-card` entrambi · `.gauge-wrap` + `.gauge-grid` entrambi · 4 process full-import autonomi). Scope:

- **11 dashboardCode mappati** `*_v2`:
  - `org_systems_v2` (IT_ADMIN · org-systems.html · 17 body)
  - `cross_tenant_overview_v2` (SUPERUSER · 4 new)
  - `tenant_owner_overview_v2` (TENANT_OWNER · 6 new)
  - `hr_director_overview_v2` (HR_DIRECTOR · 8 — 100% canonical match)
  - `skills_heatmap_v2` (HR_MANAGER · 9 + .kpi-card.compact variant)
  - `capability_graph_v2` (DEPT_HEAD · 10 new + 5 pill capability tones)
  - `employee_journey_v2` (LINE_MANAGER+EMPLOYEE · 13 new — profile-hero · arc · bridge)
  - 4 process dashboard autonomi (`process_recruiting_funnel_v2` · `process_onboarding_flow_v2` · `process_performance_cycle_v2` · `process_learning_paths_v2`) — role mapping TBD

- **DB stato post-L47**: 346 total assets (138 promoted · 208 available) · 18 chrome universal · 81 body distribuiti su 11 dashboardCode · 374 variants · 5 tags

- **File committable modificati**: 10 mockup HTML allineati canonical (`.status-pill`/`.theme-toggle`/`.bar-fill alias`/`.kpi-row alias` rimossi) · `dashboard-brand.css` esteso (~300 lines L47 block: chart-wrap · gauge-wrap · table.dept · succession-row · kg-canvas · ontology · profile-hero · arc · bridge-grid · process viz · pill-cap-\* · kpi-card.compact) · DECISIONS-LOG L46+L47 entries

- **Webapp showcase locale gitignored**: `.ux-design/09-asset-showcase/` (Express 5 + Prisma 5.22 SQLite + vanilla JS · localhost:5174 · no auth). Avvio: `cd .ux-design/09-asset-showcase && npm run dev`

**Out-of-scope L46+L47** (pronto come prossima phase):

- Production `/dashboard` refactor per consumare `chromeStandard` + `dashboardCode` dal DB → richiede modifiche `services/app/src/app/(app)/dashboard/page.tsx` + `services/app/src/app/(app)/_components/BrandShell.tsx` per dynamic chrome/body rendering DB-driven
- Mapping role → dashboardCode per i 4 process (decisione HR_MANAGER vs autonomous role)
- Promote degli asset packages/ui non utilizzati nei 10 mockup (es. data-table, hero-sections) — restano `available` nel catalog

### ✅ S22 close (2026-05-09) — L48 → L53 shipped

**6 ADR-level decisions in singola sessione, 8 commit pushed direct main, 391→848 test verdi.**

| Decisione                                                 | Commit                | Sintesi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **L48** Theme/palette framework v1                        | `11df303`             | 17 palette × 2 mode in `.ux-design/02-aesthetic/theme-framework/` (CSS framework 1638 lines + JS switcher zero deps + playground HTML). Wordmark body canonical `var(--primary)` palette-aware                                                                                                                                                                                                                                                                                         |
| **L49** Process autonomous + theme prod + canonical sweep | `7cb25e8`             | (1) 4 `process_*` come secondary nav HR_DIRECTOR + HR_MANAGER via `role_default_dashboards` priority 10..40 (16 rows total) · `resolveAllPresetsForRole` helper · `processSection` SIDEBAR_MAP. (2) Theme-framework portato in `services/app/src/{styles,lib}/theme-framework/`. `BrandStudioClient` refactored con tab `Palette Presets` + `Token Editor`. Root layout async legge `active-palette.json` SSR. (3) Mockup canonical sweep `--brand-blue` → `--primary` (17 file, 98→0) |
| **S22 cleanup canonical**                                 | `1ee7b65` + `a7f0a68` | Restringimento canonical demo users a `tests/.test-env` matrix (8 active: 1 SUPERUSER `sysadmin` + 7 RTL Bank email-format). Soft-delete `admin`/`smartfood-admin`/`econova-admin` (cross-tenant retired). Rinaming `USER_ECONOVA`/`USER_RTL` → `USER_EMPLOYEE`/`USER_TENANT_OWNER` per coerenza concettuale                                                                                                                                                                           |
| **L50** DBMS canonical consistency alignment              | `9f5569c`             | `tenants.domain` SoT NOT NULL UNIQUE (econova.org · heuresys.com · rtl-bank.org · smartfood.org). `employees.email` canonical = `lower(strip(first.last))@domain`. Soft-delete 5 orphan + `rtl-hr` + `evo.dev` + `laura.bertolini`. 264 `users.username` allineati a `employees.email`. 6 SQL asserts pre-commit                                                                                                                                                                       |
| **L51** `tests/.test-env` SoT formalization               | `3f19a21`             | Regola operativa cronologica: edit `.test-env` PRIMA → `apply-canonical-users.mjs` + SQL → DB → e2e helpers. Mai aggiungere user al DB senza prima averlo registrato qui                                                                                                                                                                                                                                                                                                               |
| **L52** `users.tenant_id` resta derivata                  | `f14f63a`             | Decisione architetturale documentata: NO denormalizzazione, legame derivato via `users.employee_id → employees.tenant_id` (SUPERUSER usa `DEFAULT_SUPERUSER_TENANT_ID` env fallback). 3 trigger di rivisitazione futura                                                                                                                                                                                                                                                                |
| **DRY refactor parser**                                   | `293e3eb`             | `tests/parse-test-env.mjs` + `.d.ts` come parser condiviso da `apply-canonical-users.mjs` + `auth.ts` e2e helper. Zero duplicazione username/password tra file                                                                                                                                                                                                                                                                                                                         |
| **Legacy login purge + cache wipe**                       | `074fe7d`             | 9 file source legacy aggiornati (`evo.dev`/`admin123`/`@rtlbank.it`/`@heuresys.test`/`rtl-bank.<first>.<last>`). `.next/` cache + 4 `*.tsbuildinfo` wipe. 15 match restanti tutti legitimati (audit trail, soft-delete list, mockup subdomain)                                                                                                                                                                                                                                         |
| **L53** Forensic DB audit                                 | `c5150c4`             | Audit qualitativo via subagent `database-admin`. **5 critical / 7 high / 12 lower** issues. Report 423 lines in `docs/_audit/2026-05-09-forensic-db-audit.md`. Top critical: ~30 tabelle senza `tenant_id`/RLS; 13 RLS policies con GUC sbagliato (`app.current_tenant`); 6 audit_logs ultimi 30d (P4 gap); 6/36 routes con `requirePermission` (P3 gap)                                                                                                                               |

### Stato DBMS post-L50 alignment

- 4 tenants con `domain` populated · 264 active employees · 265 active users (di cui 1 platform `sysadmin`)
- Login canonical 8 verificato end-to-end via bcryptjs server-side: 8/8 PASS bcrypt match
- DB SoT: `phase15h_*.sql` + `phase15i_canonical_consistency_alignment.sql` applicate
- 6 verification asserts pre-commit invariati (zero orphan · zero email duplicates · zero username≠email)

### ✅ S23 close (2026-05-09) — L54 forensic audit partial closure

**4 issue chiuse · 1 pilot · 2 deferred · 3 audit miscount rilevate.** Phase 16.A/B/C migrations + auditedTransaction helper. ~10h focus.

| #   | Issue                           | Status S23                                                             | Deliverable                                        |
| --- | ------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| 2   | 13 RLS GUC typo                 | ✅ **CLOSED**                                                          | `db/seeds/phase16a_audit_quick_wins.sql`           |
| 1   | ~24 tabelle senza tenant_id     | 🟡 **PILOT 6/24** (whistleblowing+mentor+survey)                       | `db/seeds/phase16b_tenant_id_pilot.sql`            |
| 4   | `users.role` FK to rbp_roles    | ✅ **CLOSED**                                                          | `db/seeds/phase16c_users_role_fk.sql`              |
| 3   | P4 audit gap                    | 🟡 **HELPER + 2 brand-studio writes**                                  | `services/app/src/lib/audit/auditedTransaction.ts` |
| 8   | RBP count mismatch 179 vs 326   | ✅ **CLOSED via doc**                                                  | this CLAUDE.md (rbp count = 179 canonical)         |
| 6   | P3 routes 6/36 → audit miscount | ⚖️ **MISCOUNT**: 22 hanno inline P3                                    | (S24 micro-sweep su ~4 truly unprotected)          |
| 5   | `widget_catalog_id` NULL 100%   | ✅ **CLOSED L55** (FK dropped, col retained Int?)                      | `phase16e_widget_catalog_id_decommission.sql`      |
| 7   | `rbac_role` enum drift          | ✅ **CLOSED L55** (8 canonical, SYSADMIN→SUPERUSER remap, Prisma sync) | `phase16d_rbac_role_cleanup.sql`                   |

**Audit corrections rilevate during execution**:

- Issue #1: i 6 `tenant_job_*` tables HANNO già tenant_id (audit § 2.3 false-positives). Scope reale = 24 tabelle, non 30.
- Issue #5: `widget_code` (17 distinct) NON matcha `widget_catalog.code` (0/17). Backfill impossibile.
- Issue #6: 22 routes "auth-only" hanno P3 enforcement INLINE via `cache.isAllowed()`. True unprotected = ~4.

**DBMS state post-S23**:

- `pg_policies`: 330 totali (invariato) · 0 con GUC typo · 6 nuove `tenant_isolation_*` su pilot tables
- 6 tabelle pilot con `tenant_id NOT NULL` + FK a `tenants(id)` + RLS attiva FORCE: `whistleblowing_messages` (16) · `whistleblowing_attachments` (7) · `whistleblowing_audit_log` (20) · `mentorship_sessions` (355) · `survey_questions` (31) · `survey_responses` (4482) — 4911 rows backfilled
- `users` table: FK `fk_users_role REFERENCES rbp_roles(code) ON UPDATE CASCADE` attiva. Legacy CHECK `users_role_check` rimosso.
- 265 active users intatti · login canonical 8/8 PASS post-FK
- `rbp_role_permissions` count canonical = **179** (NOT 326 come da docs pre-audit)

### ✅ S24 close (2026-05-10) — L58 forensic audit FINAL closure 95% (21/22)

**4 priorità S23-quater carry-forward tutte chiuse in singola sessione**. Phase 16.L+16.M migrations + auditedTransaction api-gateway mirror + systemd timer mat views.

| Priorità                  | Status | Deliverable                                                                                                                                                                                                                     |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 P4 sweep extended      | ✅     | `services/api-gateway/src/lib/audit/auditedTransaction.ts` mirror + 11 writes wrappati (users.ts:6 + tenants.ts:5)                                                                                                              |
| P2 GUC drift workspaces   | ✅     | `db/seeds/phase16l_user_workspaces_guc_normalization.sql` (Opzione A single-GUC)                                                                                                                                                |
| P3 310 FK ON DELETE       | ✅     | `db/seeds/phase16m_fk_ondelete_explicit.sql` + `docs/_audit/2026-05-10-fk-ondelete-review.md` decision matrix per dominio · auto-generated via `scripts/db/generate-fk-ondelete-migration.mjs` · 0 FK NO ACTION default residue |
| P4 mat views auto-refresh | ✅     | `infra/systemd/heuresys-mat-views-refresh.{service,timer}` + runbook `docs/40-operations/dbms-mat-views-refresh.md` · deployed enabled+started su oracle-vm-default                                                             |

**Bilancio FINALE audit forensic L53**:

- **22/22 issues CLOSED (100% Phase 1)**: tutti i 17 di S23-quater + #3 P4 sweep extended + § 2.5 GUC drift workspaces + § 1.5 310 FK ON DELETE + § 1.8 mat views auto-refresh systemd + § 1.2 employees vertical-split Phase 1 additive (phase16n L59)
- **1 ARCHITECTURAL PHASE 2 deferred S26+**: § 1.2 employees DROP COLUMN + Prisma schema refactor (richiede ~3-5 FTE-day refactor app code + 2-3 FTE-day test)
- **1 MISCOUNT**: #6 P3 routes (S23 audit corrections)

**DBMS state post-S24** (verified bare-metal `oracle-vm-default:5432/heuresys_platform`):

- 312 tabelle `tenant_id NOT NULL` (invariato da S23-quater)
- 367 RLS policies attive (invariato; 2 workspace policies riscritte in-place su `app.current_tenant_id`)
- **0 FK NO ACTION default** (era 310 pre-S24): 646 CASCADE · 215 SET NULL · 81 RESTRICT · 0 NO ACTION
- 5 mat views refresh schedulato systemd timer (every 4h UTC, RandomizedDelay 60s) · manual run validato 5/5
- Backup pre-phase16m: `/var/backups/heuresys-evo/heuresys_platform-pre-phase16m-20260510T014431Z.dump` (397MB)

**Test/lint state post-S24**:

- 865 test verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared) — era 860, +5 mirror helper test
- typecheck PASS tutti i workspace
- `npm run lint:tenant-id` exit 0 (5 nuove SAFE annotations su tx.users.\* in auditedTransaction callbacks)
- login canonical 8/8 PASS bcrypt match end-to-end

### 🚀 Carry-forward S25+ (architectural)

- § 1.2 employees vertical-split **Phase 2** (DROP COLUMN da employees + Prisma schema refactor + app query migration to satellites) — Phase 1 shipped L59, satellite tables `employees_pii`/`employees_hr`/`employees_payroll` populated 270 row + sync trigger + view `employees_full`. Phase 2 stima ~3-5 FTE-day refactor + 2-3 FTE-day test
- Plus carry-forward S20+S21+S22: production `/dashboard` refactor DB-driven (~6-10h), WCAG 2.2 AAA full audit (~3-5h)
- pg_cron migration future: se installato, sostituire systemd timer con `cron.schedule()` row + disable unit

## Documenti strategici

- `docs/_meta/operating-baseline.md` — **regole comportamentali complete (canonical SoT)**
- `docs/_meta/doc-architecture.md` — schema docs/ canonical
- `docs/_meta/governance-evo.md` — governance progetto
- `docs/10-strategy/migration-strategy-pet-driven.md` — strategia porting
- `docs/20-architecture/role-views-matrix.md` — Phase 14.SH FASE 3.1 inventory (scaffolded)
- `docs/40-operations/dbms-backup-restore.md` — Backup/restore governance policy (scaffolded)
- `docs/50-reference/decisions/` — 26 ADR (3 superseded · ADR-0023 SoT promotion · ADR-0024 Phase 14.SH plan · ADR-0025 brand identity cycle sealed + v1.0 promotion plan · ADR-0026 Phase 15.A brand-fedele dashboard rendering)
- `.ux-design/DECISIONS-LOG.md` — log brand identity + governance, ultime entry **L48** (theme/palette framework v1) · **L49** (process autonomous + theme prod + canonical sweep) · **L52** (`users.tenant_id` resta derivata) · **L53** (forensic DB audit baseline) · **L54** (S23 forensic audit partial closure) · **L55** (S23-bis: 3 deferred + P3 miscount) · **L56** (S23-tris: 24 tables batch + drop triggers + parametrize) · **L57** (S23-quater: residual sweep — orphan cleanup + Platform-default + bcrypt rotation + consent + mat views helper + lint rule, audit closure 77%) · **L58** (S24: P1 auditedTransaction mirror + 11 wraps · P2 GUC normalize phase16l · P3 phase16m 310 FK ON DELETE explicit · P4 systemd timer mat views refresh — audit closure 95%) · **L59** (S24 ext: § 1.2 employees vertical-split Phase 1 additive — phase16n satellite scaffold + sync trigger + view, audit closure 100% Phase 1)
- `docs/_audit/2026-05-09-forensic-db-audit.md` — audit qualitativo forense DBMS post-S22 (570 tables · 905 FK · 330 RLS policies · 22 issues prioritizzati)
- `.ux-design/09-asset-showcase/README.md` — webapp catalog locale (gitignored eccetto `_legacy/`). Tool localhost-only Express+Prisma+SQLite per gestione asset brand identity dashboard. Start: `cd .ux-design/09-asset-showcase && npm run dev` → `localhost:5174`
- `docs/30-developer/security-baseline.md` — P1-P10 enforcement details
- `~/.claude/plans/questo-quello-che-glittery-charm.md` — Plan canonical Phase 14.SH
- `.handoff/HANDOFF.md` — Fresh session input (next sprint trigger)

## Quando deragli — segnale

Se Claude over-engineered, ritualizza, multipli PR per task coerente, plan elaborati per cose banali, ADR/README/snapshot superflui:

> "stai over-engineering" → stop, riconoscere, semplificare, continuare

Vedi [`docs/_meta/operating-baseline.md`](docs/_meta/operating-baseline.md) §Anti-pattern.
