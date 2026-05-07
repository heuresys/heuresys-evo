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

## Stato attuale (2026-05-08T01:00Z · DBMS bare-metal SoT certified + Phase 14.SH closed + carry-forward shipped + brand identity cycle SEALED L38)

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
- Auth: NextAuth v4 Credentials, 11 canonical users (Heuresys2026!) cross-tenant
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

### ✅ Brand identity cycle SEALED (2026-05-08, L38)

Phase 1 → Phase 12 ufficialmente chiuso senza loose ends. 5 pre-promotion gap reali risolti:

- L35 — Phase 10 chiusa via Phase 14.SH execution
- L36 — Phase 11 theme variants JSON shipped (W3C DTCG · 4 file `.ux-design/05-theme-variants/`)
- L37 — Phase 12 brand book v0 shipped (`07-brand-book/BRAND-BOOK-v0.md`, 15 sezioni canoniche, single entry point)
- L38 — D1-D4 decisioni risolte · 4 personas mancanti create per coverage 1:1 RBP 8 ruoli (`05-superuser` · `06-tenant-owner` · `07-hr-manager` · `08-dept-head`) · `08-promotion/v1.0-checklist.md` scritto · promotion-candidates.md updated · brand book § 3 personas expanded a 8

### 🚀 Roadmap successiva (post-cycle close)

1. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass · ref: `docs/_meta/operating-baseline.md` §a11y
2. **Production build perf bench** (~1-2h) — `next build && next start` + autocannon su 8 viste auth-required, target P95 ≤ 500ms · ref: `scripts/perf/results/`
3. **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode · ref: `services/api-gateway/src/auth.ts`
4. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — pre-flight checks per 8 categorie asset · ref: `.ux-design/08-promotion/v1.0-checklist.md`

Backup track parallel: cron daily/weekly/monthly · off-site Oracle bucket · restore drill mensile · `docs/40-operations/dbms-backup-restore.md` (scaffolded).

## Documenti strategici

- `docs/_meta/operating-baseline.md` — **regole comportamentali complete (canonical SoT)**
- `docs/_meta/doc-architecture.md` — schema docs/ canonical
- `docs/_meta/governance-evo.md` — governance progetto
- `docs/10-strategy/migration-strategy-pet-driven.md` — strategia porting
- `docs/20-architecture/role-views-matrix.md` — Phase 14.SH FASE 3.1 inventory (scaffolded)
- `docs/40-operations/dbms-backup-restore.md` — Backup/restore governance policy (scaffolded)
- `docs/50-reference/decisions/` — 25 ADR (3 superseded · ADR-0023 SoT promotion · ADR-0024 Phase 14.SH plan · ADR-0025 brand identity cycle sealed + v1.0 promotion plan)
- `docs/30-developer/security-baseline.md` — P1-P10 enforcement details
- `~/.claude/plans/questo-quello-che-glittery-charm.md` — Plan canonical Phase 14.SH
- `.handoff/HANDOFF.md` — Fresh session input (next sprint trigger)

## Quando deragli — segnale

Se Claude over-engineered, ritualizza, multipli PR per task coerente, plan elaborati per cose banali, ADR/README/snapshot superflui:

> "stai over-engineering" → stop, riconoscere, semplificare, continuare

Vedi [`docs/_meta/operating-baseline.md`](docs/_meta/operating-baseline.md) §Anti-pattern.
