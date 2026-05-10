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
- RLS attiva DB-level (367 policies post-S24, 179 RBP role-area-permission joins canonical post-L54)

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

## Sistema corrente (snapshot 2026-05-10 · post-S24+L59)

> Per cronologia sprint shipped (Phase 14 → S24): [`docs/_meta/sprint-history.md`](docs/_meta/sprint-history.md).
> Per session brief: [`.handoff/STATE.md`](.handoff/STATE.md).

**DBMS = SoT** (`heuresys_platform` postgres 16.13 bare-metal `oracle-vm-default:5432`):

- 312 tabelle `tenant_id NOT NULL` · 367 RLS policies attive · **0 FK NO ACTION** (646 CASCADE · 215 SET NULL · 81 RESTRICT)
- 5 mat views auto-refresh systemd timer ogni 4h UTC
- Backup baseline: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`) + pre-phase16m: `heuresys_platform-pre-phase16m-20260510T014431Z.dump`
- Vertical-split satellite tables Phase 1 (additive): `employees_pii`/`employees_hr`/`employees_payroll` populated 270 row + sync trigger + view `employees_full` (Phase 2 DROP COLUMN deferred S26+)

**App runtime**:

- Pagine Next.js: 5 base (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) + 17+ viste in `(app)/` route group con AppShell role-based
- 7 view brand-fedeli `/dashboard` role-driven via `role_default_dashboards` (Phase 15.A) — preset_code → view component switch
- Login = `login-aurora` mockup promosso production · AppShell topbar con LocaleSwitcher globale + ThemeToggle + UserMenu
- API Next.js route handlers: `/api/dashboard/data/[elementId]`, `/api/dashboard/[code]/elements` (PUT), `/api/ontology/advisor`, `/api/explorer/{esco/tree,sap/status,kg/expand}`
- Endpoint Express: 30 endpoint Pack 1-8 mounted (bypassed in (app)/ via Prisma direct, JWT cross-service fix pending — `services/api-gateway/src/auth.ts`)

**Auth canonical**:

- NextAuth v4 Credentials, **8 canonical users** (`Heuresys2026!`) ristretti a `tests/.test-env` matrix (1 SUPERUSER `sysadmin` + 7 RTL Bank ruoli con username = work email canonica `firstname.lastname@rtl-bank.org` post-L50)
- `tests/.test-env` SoT autoritativa per il test environment (post-L51): ogni nuovo utente test va PRIMA in quel file, poi propagato a `apply-canonical-users.mjs` + DB + e2e helpers
- `tenants.domain` SoT esplicita (econova.org · heuresys.com · rtl-bank.org · smartfood.org). 264 active employees · 265 active users · 1 platform user
- Email canonical = `lower(strip-space-apostrophe(first.last))@<tenant.domain>`. `users` table NON ha tenant_id: legame derivato via `employee_id → employees.tenant_id` (platform users con `employee_id=NULL` usano `DEFAULT_SUPERUSER_TENANT_ID` env fallback)

**Test/lint state**:

- 865 test verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared)
- typecheck PASS tutti i workspace · `npm run lint:tenant-id` exit 0
- 100/100 Playwright RBP matrix verde · login canonical 8/8 PASS bcrypt match end-to-end

**Stack snapshot**:

- Helper cross-cutting Pack 1: `escapeILIKE`/`safeParseInt`/`isUUID`/`buildMeta`/`validatePassword`/`generateSecurePassword`/`requirePermission` lazy/`ROLES`
- `auditedTransaction()` helper attivo su `services/app` + mirror `services/api-gateway` (P4 sweep S24)
- Prisma allowlist api-gateway: 16 model
- packages/ui: ~180 component, Storybook 9 (84 stories), GH Pages
- npm audit: 0 vulnerabilities · Repo visibility: PUBLIC · Branch protection rimossa · CI minimal
- Schema docs: Diátaxis numbered + meta (`docs/_meta`, `10-strategy`, `20-architecture`, `30-developer`, `40-operations`, `50-reference`, `70-planning`, `90-archive`)
- Catalog DB asset showcase: 346 assets · 138 promoted · 81 body distribuiti su 11 dashboardCode `*_v2` (`.ux-design/09-asset-showcase/`, gitignored)

## Roadmap successiva

1. **Data binding live full** (~3-5h) — sostituisci dati hardcoded mockup-fedeli nelle 6 view non-org_systems con query Prisma reali (employees per tenant + skill_assessments + review_cycles + succession_pipeline)
2. **Production `/dashboard` refactor DB-driven** (~6-10h, carry-forward S20+S21+S22) — refactor `dashboard/page.tsx` + `BrandShell.tsx` per consumare `chromeStandard` + `dashboardCode` dal catalog DB asset showcase
3. **Estensione preset minori** (~2-3h) — view brand-fedeli per `process_recruiting_funnel` · `process_onboarding_flow` · `process_performance_cycle` · `process_learning_paths`
4. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass · ref: `docs/_meta/operating-baseline.md` §a11y
5. **Production build perf bench** (~1-2h) — `next build && next start` + autocannon su 8 viste auth-required, target P95 ≤ 500ms · ref: `scripts/perf/results/`
6. **API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode · ref: `services/api-gateway/src/auth.ts`
7. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — pre-flight checks per 8 categorie asset · ref: `.ux-design/08-promotion/v1.0-checklist.md`

Backup track parallel: cron daily/weekly/monthly · off-site Oracle bucket · restore drill mensile · `docs/40-operations/dbms-backup-restore.md` (scaffolded).

## Carry-forward S25+ (architectural)

- **§ 1.2 employees vertical-split Phase 2** (DROP COLUMN da employees + Prisma schema refactor + app query migration to satellites) — Phase 1 shipped L59, satellite tables `employees_pii`/`employees_hr`/`employees_payroll` populated 270 row + sync trigger + view `employees_full`. Phase 2 stima ~3-5 FTE-day refactor + 2-3 FTE-day test
- **pg_cron migration future**: se installato, sostituire systemd timer con `cron.schedule()` row + disable unit
- **Mapping role → dashboardCode** per i 4 process autonomi (`process_recruiting_funnel_v2` etc.) — decisione HR_MANAGER vs autonomous role
- **Promote asset packages/ui** non utilizzati nei 10 mockup (es. data-table, hero-sections) — restano `available` nel catalog

## Documenti strategici

- `docs/_meta/operating-baseline.md` — **regole comportamentali complete (canonical SoT)**
- `docs/_meta/sprint-history.md` — **archive cronologico sprint shipped Phase 14 → S24** (append-only)
- `docs/_meta/doc-architecture.md` — schema docs/ canonical
- `docs/_meta/governance-evo.md` — governance progetto
- `docs/10-strategy/migration-strategy-pet-driven.md` — strategia porting
- `docs/20-architecture/role-views-matrix.md` — Phase 14.SH FASE 3.1 inventory (scaffolded)
- `docs/40-operations/dbms-backup-restore.md` — Backup/restore governance policy (scaffolded)
- `docs/40-operations/dbms-mat-views-refresh.md` — Mat views auto-refresh runbook (S24)
- `docs/50-reference/decisions/` — 26 ADR (3 superseded · ADR-0023 SoT promotion · ADR-0024 Phase 14.SH plan · ADR-0025 brand identity cycle sealed + v1.0 promotion plan · ADR-0026 Phase 15.A brand-fedele dashboard rendering)
- `.ux-design/DECISIONS-LOG.md` — log brand identity + governance, ultime entry **L48** (theme/palette framework v1) · **L49** (process autonomous + theme prod + canonical sweep) · **L52** (`users.tenant_id` resta derivata) · **L53** (forensic DB audit baseline) · **L54** (S23 partial closure) · **L55** (S23-bis: 3 deferred + P3 miscount) · **L56** (S23-tris: 24 tables batch + drop triggers + parametrize) · **L57** (S23-quater residual sweep, audit closure 77%) · **L58** (S24: P1 auditedTransaction mirror · P2 GUC normalize phase16l · P3 phase16m FK ON DELETE · P4 systemd timer mat views — audit closure 95%) · **L59** (S24 ext: § 1.2 employees vertical-split Phase 1 additive — phase16n satellite scaffold + sync trigger + view, audit closure 100% Phase 1)
- `docs/_audit/2026-05-09-forensic-db-audit.md` — audit qualitativo forense DBMS post-S22 (570 tables · 905 FK · 330 RLS policies · 22 issues prioritizzati)
- `docs/_audit/2026-05-10-fk-ondelete-review.md` — FK ON DELETE decision matrix per dominio (S24)
- `.ux-design/09-asset-showcase/README.md` — webapp catalog locale (gitignored eccetto `_legacy/`). Tool localhost-only Express+Prisma+SQLite per gestione asset brand identity dashboard. Start: `cd .ux-design/09-asset-showcase && npm run dev` → `localhost:5174`
- `docs/30-developer/security-baseline.md` — P1-P10 enforcement details
- `~/.claude/plans/questo-quello-che-glittery-charm.md` — Plan canonical Phase 14.SH
- `.handoff/STATE.md` — Single canonical handoff file (post-S11 radical simplification): current state + top priorities + open questions + verification commands. Read first at session start.

## Quando deragli — segnale

Se Claude over-engineered, ritualizza, multipli PR per task coerente, plan elaborati per cose banali, ADR/README/snapshot superflui:

> "stai over-engineering" → stop, riconoscere, semplificare, continuare

Vedi [`docs/_meta/operating-baseline.md`](docs/_meta/operating-baseline.md) §Anti-pattern.
