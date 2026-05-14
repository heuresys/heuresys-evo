# heuresys-evo — Project Instructions

> **Operating Baseline** (regole comportamentali complete): [`docs/_meta/operating-baseline.md`](docs/_meta/operating-baseline.md). SoT cross-machine via git.
>
> Repo: `heuresys-evo` (greenfield rewrite di `heuresys.com.evo` legacy). Solo coder = Enzo Spenuso. No PR-driven default.

## Session start protocol

1. Leggi `.handoff/STATE.md` **completo** (sezione "Sessione corrente" + "Debt attivo" + "Follow-up tracciabili" + "Flussi di attività suggeriti"). Vedi `docs/_meta/operating-baseline.md` § CARD-5 (reform L19 2026-05-14).
2. `git status -sb` (clean? in sync con `origin/main`?)
3. Saluta:
   - 1-line recap **sessione precedente** (dalla sezione "Sessione corrente" di STATE.md)
   - Stato Debt (vuoto vs N items, con titolo dei più rilevanti)
   - Top 3 **follow-up tracciabili** (cited in 1 riga ciascuno, con effort se disponibile)
   - Top 2 **flussi suggeriti** (se applicable)
   - Open questions se rilevanti (omettere sezione se vuota)
4. Aspetta direzione esplicita prima di toccare codice.

### Trigger "continuazione" (L20 reform 2026-05-14)

Se l'utente apre la sessione (o risponde al saluto) con frase semantica di continuazione — **"proseguiamo"**, **"continuiamo"**, **"andiamo avanti"**, **"riprendiamo"**, **"da dove eravamo rimasti"**, **"cosa facciamo"**, **"next"**, **"vai avanti"**, **"ok"** in risposta diretta al saluto, o equivalenti — NON aspettare direzione esplicita su singolo task. Invece:

1. Apri l'ultimo piano referenziato in STATE.md § Sessione corrente (es. `~/.claude/plans/<latest>.md`)
2. Compila una **lista ordinata** che combina:
   - **Debt attivo** (priorità massima, anche se vuoto va dichiarato)
   - **Follow-up tracciabili** ordinati per priority field (H > M > L)
   - **Flussi di attività suggeriti** (multi-step, citati per nome ciascuno)
   - **Carry-forward dal piano canonico** (se applicabile, dalle sezioni "Phase successive" / "Roadmap")
3. Presenta la lista come **menu di selezione numerato** (1-N) con: titolo · effort · 1-frase descrizione · dipendenze se esistenti
4. Chiedi all'utente quale procedere (singolo numero, oppure "tutti", oppure "altro" se vuole proporne uno fuori lista)
5. Aspetta decisione esplicita prima di iniziare l'esecuzione

**Ordinamento canonico** (cross-list):

1. Debt H (bloccanti) — sempre primo se presenti
2. Debt M — secondo
3. Debt L — terzo
4. Follow-up H — quarto
5. Flussi suggeriti (multi-step) — quinto-sesto
6. Follow-up M — settimo+
7. Follow-up L — ultimo

**Format menu suggerito**:

```
Proseguiamo da dove eravamo. Lista ordinata per priorità:

1. [Debt H · ~Xh] <titolo> — <1-frase descrizione>
2. [Follow-up H · ~Xh] <titolo> — <descrizione>
3. [Flusso · ~Xh] <nome flusso> — <descrizione multi-step>
4. [Follow-up M · ~Xh] ...
...

Quale procediamo? (numero · "tutti" · "altro")
```

Eccezione: skip se utente apre con comando diretto self-contained (es. "fix bug X", "applica Y") che NON è continuazione semantica.

A fine sessione, `/handoff` aggiorna `.handoff/STATE.md` (aggiorna "Sessione corrente" + accoda eventuali nuovi follow-up/flussi) + commit + push direct main.

**Policy audit/handoff (S61 reform + L19 revert parziale, vedi `docs/_meta/operating-baseline.md` § CARD-5)**:

- Audit doc autonomi chiudono su findings effettivi senza next-steps inline
- STATE.md è single SoT che ospita Sessione corrente + Debt + Follow-up + Flussi (sezioni separate, semanticamente distinte ma fisicamente colocate)
- `BACKLOG.md` rimane come archive overflow per items voluminosi che inquinerebbero STATE.md (es. legacy import registry 100+ entries). NON è più "menu separato mai aprire" — è "container archive consultabile su richiesta"

## Brand workstream (cycle 2 — post-S62 reset 2026-05-13)

> **Cycle 2 protocol** — ADR-0032 charter. Cycle 1 (S22→S61, 10 giorni, 87 decisioni) archiviato in [`.ux-design-archive-2026-05-13/`](.ux-design-archive-2026-05-13/) come reference immutabile.

Workstream parallelo per ridefinizione brand identity Heuresys, segregato in [`.ux-design/`](.ux-design/) (escluso da build pipeline, niente import in production code).

**Trigger di attivazione**: se Enzo dice "lavoriamo sul brand", "ux-design", "logo", "palette", "tipografia", "dashboard design", "riprendiamo il design", "definiamo l'identity" — segui il protocollo cycle 2 in [`.claude/skills/brand-resume/SKILL.md`](.claude/skills/brand-resume/SKILL.md) prima di rispondere.

**Attivazione esplicita** (3 modi ridondanti):

- Slash command `/brand` (vedi [`.claude/commands/brand.md`](.claude/commands/brand.md))
- Skill `brand-resume` (vedi [`.claude/skills/brand-resume/SKILL.md`](.claude/skills/brand-resume/SKILL.md))
- Trigger keyword detection via auto-memory `~/.claude/projects/D--evo-heuresys-com/memory/feedback_brand_workstream.md`

| File                                                               | Scopo                                                                                                                                                                            |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`.ux-design/README.md`](.ux-design/README.md)                     | Policy segregazione cycle 2 + protocollo migration                                                                                                                               |
| [`.ux-design/SESSION-RESUME.md`](.ux-design/SESSION-RESUME.md)     | Protocollo 4-step cycle 2 (semplificato vs 8-step cycle 1)                                                                                                                       |
| [`.ux-design/BRAND-STATE.md`](.ux-design/BRAND-STATE.md)           | SoT consolidato cycle 2: phase corrente, canonical SoT attivi, decisioni pending                                                                                                 |
| [`.ux-design/DECISIONS-LOG-v2.md`](.ux-design/DECISIONS-LOG-v2.md) | Log append-only cycle 2 (L1-LN). Migration selettiva da cycle 1 documentata in [`04-promotion/decision-migration-audit.md`](.ux-design/04-promotion/decision-migration-audit.md) |
| [`.ux-design/01-canonical/`](.ux-design/01-canonical/)             | SoT vincolanti cycle 2 (semantically versioned, NON append-only)                                                                                                                 |

**Phase corrente cycle 2**: Phase 1 — assessment iniziale post-reset. Nessuna canonical decision ancora firmata. Archive cycle 1 disponibile come materia prima su richiesta esplicita.

**Reference archive cycle 1**: [`.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`](.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md) (read-only, 1027 file, 87 DECISIONS-LOG entry, 32 direzioni Set 1-4 scartate, 5 mockup dashboard canonici, brand book v0, asset DB SQLite 346 entry).

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

## Lexicon canonical (16 sigle) + CASCADIA pipeline (S35+)

Vocabolario controllato delle catene relazionali dell'universo dati (568 modelli Prisma, 25 aree funzionali). SoT: [`docs/_meta/lexicon.md`](docs/_meta/lexicon.md). Adottato S35.2 (ADR-0029 TBD S35.7).

| Sigla           | Significato                                                               | Stato                      |
| --------------- | ------------------------------------------------------------------------- | -------------------------- |
| **OPOURSKA** ✅ | Organization-Process-OrgUnit-Role-Skill-KPI-Assessment (7-layer ontology) | base attiva                |
| **PET** ✅      | Process/Enterprise/Talent (3 access perspectives)                         | base attiva                |
| **INDOOR** ✅   | Industry-NACE-Domain-Org-OrgUnit-Roles (industry cascade)                 | shipped S35.3 (4 profili)  |
| **TALPIPE** ✅  | Talent Pipeline (Career/Succession/9Box/TalentPool/Mobility)              | shipped S55+ L79+L82       |
| **H2R** ✅      | Hire-to-Retire (recruiting + onboarding)                                  | shipped S55+ L81+L82+L83   |
| **SKILGRO** ✅  | Skill-Learning loop (gap→recommend→cert→reassess)                         | shipped S55+ L80           |
| **GOKMER** ✅   | Goal-KPI-Measurement-Evaluation-Review (performance cycle)                | shipped S55+ L80           |
| **PROGOV** ⏳   | Process Governance (workflow/approval/audit/compliance)                   | deferred S58+ (secondary)  |
| **ESKAP** ✅    | ESCO + Knowledge graph Application Projection                             | shipped S35 phase18f       |
| **ITLAB** ✅    | Italian Labor (CCNL/INPS/sindacati/holidays)                              | shipped S35.1 phase18d     |
| **RBP** ✅      | Role-Based Permissions matrix                                             | base attiva                |
| **DGOV** ✅     | Data Governance (multi-tenant + RLS + audit + GDPR)                       | base attiva (367 RLS)      |
| **SMERTO** ✅   | Salary-Merit-Equity-Reward-Total (compensation cycle)                     | shipped S55+ L82           |
| **PULSAR** ✅   | Pulse-LinkedScore-Action-Retention (engagement loop)                      | shipped S55+ L80           |
| **EPRA** ✅     | Embedding-Prediction-Recommendation-Action (AI stack)                     | shipped pre-S55+ (267+267) |
| **CASCADIA** ✅ | Catena seeding realistic end-to-end (pipeline self-ref)                   | **CLOSURE S57 L78-L84**    |

Naming convention:

- Directory pipeline: `scripts/seed-generator/<sigla-minuscola>/` (es. `eskap/`, `itlab/`)
- Commit scope: `<type>(<sigla>): <subject>` (es. `migration(itlab): ...`, `feat(eskap): ...`)
- ADR title: `ADR-NNNN: <SIGLA>[+<SIGLA>] <topic>`
- Audit cell criteria: "OPOURSKA coverage", "INDOOR coherence", "ESKAP completeness", ecc.

**CASCADIA pipeline (Realistic Industry-Flavored Seeding) — ✅ CLOSED S57 (2026-05-13)**: piattaforma scheletrica 25 aree → case-study coerente per 4 tenant (RTL Bank banking K.64.19 · SmartFood food C.10 · EcoNova green-tech D.35 · Heuresys SaaS J.62). Shipped attraverso S35.0-S35.7 (baseline) + S55+1→S57 (final closure autonomous mode).

**Effort reale**: ~6h cumulativo (vs 58-94h stima iniziale plan). **Records inseriti**: +1141 + 136 tasks via pipeline. **Coverage verify-area**: 🟢 24/26 · 🟡 2 (cosmetic) · 🔴 0.

**Plan canonical**: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` (S57) + `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` (S35 baseline). **DECISIONS-LOG**: L78-L84. **ADR**: 0028 (accepted-implemented) + 0030 lexicon canonical.

**Research engine**: Claude native (WebFetch+WebSearch+reasoning Opus 4.7) PRIMARY · OpenAI gpt-4o-mini FALLBACK · `lib/distributions.mjs` statistical deterministic per mass-data. Vincolo memory `feedback_seed_via_ai.md` cross-session.

**Pattern formalizzati riutilizzabili**:

1. Semantic complex → Claude reasoning + JSON cached `_research_cache/`
2. Mass-statistical → `lib/distributions.mjs` + template pools (RNG seedable)
3. Cross-tenant variance → TARGETS map per-tenant + skip preconditions
4. Schema drift → in-flight column rename fix + dynamic introspect pre-INSERT
5. Discovery-driven targeting (audit BEFORE script writing)
6. FK preflight + idempotency app-side (`ON CONFLICT DO NOTHING`)

**Stages reali**: S35.0 forensic ✅ · S35.1 ITLAB ✅ · S35.2 Foundation tooling ✅ · S35.3 RTL pilot ✅ (1a+1b) · S35.4 cross-tenant sweep ✅ (2b+2f+3) · S35.5 ESKAP ✅ · S35.6 dashboard binding sweep ✅ (Stage 5 L84) · S35.7 verification ✅. Scripts: `scripts/seed-generator/{cascadia,talpipe,pulsar,gokmer,skilgro,h2r,smerto,dgov,indoor}/`.

## Mission

Piattaforma SaaS B2B di Organizational Intelligence & Workforce Orchestration. Layer ontologico tra ERP/HR/BI per governare processi, struttura, ruoli, competenze e performance via Knowledge Graph ESCO bilingue (IT/EN).

## REGOLA NON NEGOZIABILE — DATI LIVE (P0 sopraordinato)

> Tutto va fatto con riferimento a dati live del db e e2e. SEMPRE.
> NO MOCK, NO PLACEHOLDERS, NO HARDCODED, NO DEMO, NO RANDOM, NO INVENZIONI, NO HALLUCINATIONS.
> SOLO DATI REALI LIVE E2E DA DBMS.
> QUANDO I DATI NON SONO DISPONIBILI DEVE ESSERE RIPORTATO "Dati Non Disponibili"
> E NON DEVE ESSERE OFFERTO NESSUN DATO FITTIZIO IN SOSTITUZIONE.

heuresys-evo è case study production-grade con **RTL Bank come tenant di riferimento**. Trattamento da piattaforma in produzione, non da playground.

**Scope applicazione**:

- UI prod (`services/app/src/app/(app)/*`, dashboard views) → solo query Prisma live
- Mockup brand `.ux-design/06-mockups/` → da bonificare tutti (tradurre o archiviare come legacy NOT promotable)
- Brand/studio sperimentale (anche non destinato a produzione) → dati live obbligatori
- Test e2e → dati live, no fixtures
- CASCADIA `scripts/seed-generator/*` → **ESCLUSO** (è il tool che popola DBMS, post-INSERT i record sono dato live)

**Quando source non esiste**: CREARE prima (query/route Prisma in `services/app/src/lib/data/*.ts`), poi data fetching. **MAI dedurre/interpretare/inventare**. Le interpretazioni passate di stack/dati/logiche vanno **trasformate in oggetti reali** (query/routes/sources).

**Enforcement**:

- `P11` (tabella P1-P11 sotto)
- `CARD-4` (`.claude/CLAUDE.md` behavioral defaults)
- Gate F NO-FIXTURE in `/studio:promote` (`.claude/skills/studio/references/promote-flow.md`)
- Component shared `<DataNotAvailable />` (`services/app/src/components/data/DataNotAvailable.tsx`)
- Inventory baseline: [`docs/_audit/2026-05-13-no-mock-inventory.md`](docs/_audit/2026-05-13-no-mock-inventory.md)

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

| Dominio                                    | Repo                      | Stack          | FE port | API port | DB port           |
| ------------------------------------------ | ------------------------- | -------------- | ------- | -------- | ----------------- |
| `evo.heuresys.com` (HTTPS)                 | questo                    | systemd        | 3200    | 8200     | 5432 (bare-metal) |
| `www.heuresys.com`, `heuresys.com` (HTTPS) | `heuresys.com.evo` legacy | Docker compose | 3012    | 8012     | 5433 (bare-metal) |

VM: `oracle-vm-default` (IP 80.225.82.207). nginx vhosts in `/etc/nginx/sites-available/`.

## Principi P1-P11 (vincolanti)

| #   | Principio                      | Enforcement                                                                                                                                                                         |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | Multi-tenant always            | `tenantId` in ogni query Prisma su tabelle tenant-scoped                                                                                                                            |
| P2  | Auth-required default          | Endpoint pubblici = eccezioni esplicite                                                                                                                                             |
| P3  | RBP enforced                   | `requirePermission(area, action)` middleware. Mai `requireRole`                                                                                                                     |
| P4  | Audit logged                   | `audit_logs` insert per ogni write, atomico via `auditedTransaction()`                                                                                                              |
| P5  | RLS DB-level                   | Policy attiva su tabelle tenant-scoped + `SET LOCAL app.current_tenant_id`                                                                                                          |
| P6  | No raw SQL injection + secrets | Prisma + tagged template `$queryRaw`. No hardcode                                                                                                                                   |
| P7  | Validated input                | Zod schema su ogni boundary HTTP/file/IPC                                                                                                                                           |
| P8  | Error logged                   | Pino + Sentry. No `console.log` in prod path                                                                                                                                        |
| P9  | Everything data-driven         | Ruoli/permessi/navigazione/perspective in DB                                                                                                                                        |
| P10 | Multi-level Platform/Tenant    | Config supporta `tenantId NULL` (Platform) e `tenantId <uuid>`                                                                                                                      |
| P11 | Production data fidelity       | UI/mockup/test/brand-studio usano solo query Prisma live. Mai mock/hardcoded/random. Dato assente → "Dati Non Disponibili" via `<DataNotAvailable />`. Vedi §REGOLA NON NEGOZIABILE |

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

## Sistema corrente (snapshot 2026-05-14 · post-S63 investor-ready rebuild close)

> Per cronologia sprint shipped (Phase 14 → S60): [`docs/_meta/sprint-history.md`](docs/_meta/sprint-history.md).
> Per session brief: [`.handoff/STATE.md`](.handoff/STATE.md).

**DBMS = SoT** (`heuresys_platform` postgres 16.13 bare-metal `oracle-vm-default:5432`):

- 314+ tabelle · **370+ RLS policies attive** · `heuresys` user **NOBYPASSRLS** (S60 hardening)
- 5 mat views auto-refresh systemd timer ogni 4h UTC + 1 view derived `total_compensation_tenant_aggregated`
- Backup baseline: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump`
- Vertical-split satellite tables Phase 1 (additive): `employees_pii`/`employees_hr`/`employees_payroll` (Phase 2 DROP COLUMN deferred S26+) — `employees` ora VIEW post phase16o (S52)
- Migration S58→S60 shipped: phase18p/q/r/s/t/u/v (6 DDL applied via `sudo -u postgres psql` post-NOBYPASSRLS)
- **Migration S63 cycle 2 shipped (7 hotfix iterativi)**: phase19a/b/c/d/e/f/g — re-seed 4 process\_\*\_v2 + 8 nuovi preset \_v2 + adapter shape json_agg + schema column fix (`hire_date`/`user_email`/`rbp_role_permissions`)

**App runtime** (post-S63):

- Pagine Next.js: 5 base (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) + 17+ viste in `(app)/` route group con AppShell role-based
- **19 preset `_v2` published** (era 11 pre-S63): 7 originali G6 (tenant*owner_overview · hr_director_overview · skills_heatmap · capability_graph · employee_journey · cross_tenant_overview · org_systems) + 4 process*\*\_v2 reseeded Phase 1 (recruiting_funnel · onboarding_flow · performance_cycle · learning_paths) + 8 nuovi Phase 4 (employees_directory · reviews_cycle · goals_cascade · learning_paths_overview · compensation_overview · workforce_analytics · admin_audit · admin_rbac)
- **12 preset cycle 2 browser-verificati live** come HR_DIRECTOR `valentina.conti@rtl-bank.org`: 4 process + 8 Phase 4 (commit `d322ed3` post 7 hotfix)
- Legacy `_views/*View.tsx` fallback **rimosso S60 CF-5**. Reference P11 pattern in `services/app/src/lib/data/tenant-owner-queries.ts` + 8 query modules role-aware Phase 2
- Login = `login-aurora` mockup promosso production · AppShell topbar con LocaleSwitcher globale + ThemeToggle + UserMenu + scope-pill `scope · rtl bank · hr_director` (post-L16 UUID leak fix)
- API Next.js route handlers: `/api/dashboard/data/[elementId]`, `/api/dashboard/[code]/elements` (PUT), `/api/ontology/advisor`, `/api/explorer/{esco/tree,sap/status,kg/expand}`
- G6 data-fetcher (`services/app/src/lib/dashboard-engine/data-fetcher.ts`) supports `type:'sql'` con `{employeeId}` placeholder binding parametrico sicuro (S60 CF-1)
- **Resolver hierarchy fix (S63 L16)**: `resolveElements` deduplica by `(parent_element_id, position)` tuple (era solo `position` → collassava children con stesso position)
- Shared component `<DataNotAvailable />` (variant inline/block/tile, AA-compliant) per render letterale "Dati Non Disponibili"
- **Hover pattern L18**: `.kpi-card`, `.matrix-wrap`, `.skill-gap`, `.activity`, `.succession-card` con `transition: border-color 0.15s` + hover state `border-color: var(--accent)` (research artifact pattern §Motion)

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
- **packages widget brand**: 27 component (21 pre-S63 + 6 nuovi Phase 3: `BrandEmployeeDirectoryGrid`, `BrandOkrCascadeTree`, `BrandReviewKanbanBoard`, `BrandWorkforceTrendLine`, `BrandCalibrationCard`, `BrandBonusPlanCard`)
- **8 query modules role-aware** in `services/app/src/lib/data/` Phase 2: employees · reviews · goals · learning · compensation · workforce-analytics · audit · rbac. Pattern: `ScopeContext → resolveScope (8 ruoli × 5 entities) → withTenant → $queryRaw → null o EMPTY sentinel → <DataNotAvailable />` (P11)
- **Role-shaper canonical**: `services/app/src/lib/data/_role-shaper.ts` + 42 unit test PASS
- **i18n widget-strings**: 31 keys IT/EN per i 6 widget brand nuovi (`services/app/src/lib/i18n/widget-strings.ts`)
- **Base adapter framework**: `services/app/src/lib/dashboard-engine/adapters/_base-adapter.ts` (typed `WidgetAdapter<TConfig, TData>` opt-in per Phase 3)
- npm audit: 0 vulnerabilities · Repo visibility: PUBLIC · Branch protection rimossa · CI minimal
- Schema docs: Diátaxis numbered + meta (`docs/_meta`, `10-strategy`, `20-architecture`, `30-developer`, `40-operations`, `50-reference`, `70-planning`, `90-archive`)
- Catalog DB asset showcase: archiviato cycle 1 post-S62 reset (1027 file in `.ux-design-archive-2026-05-13/`)
- **Brand workstream cycle 2 post-S62 (ADR-0032)**: production CSS consolidato — `services/app/src/styles/tokens-foundation.css` (palette-agnostic) + `theme-framework/palette-core.css` (root fallback) + `palette-variants.css` (17 palette runtime switchable) + `active-theme.css` stub + `dashboard-brand.css` + `motion.css`. Runtime palette switching feature attiva preservata
- **10 canonical files cycle 2 in `.ux-design/01-canonical/`** (S63 Phase 0 + L17): `trend-research-2026.md` · `inspirations-extracted.md` · `moodboard.md` (Calm Cockpit Decisionale — Linear-meets-Stripe-meets-Visier) · `layout-pattern.md` · `role-data-matrix.md` · `widget-vocabulary.md` · `i18n-policy.md` · `header-footer-anatomy.md` · `anti-patterns.md` · `research-artifact-pattern.md` (L17 pattern de reference da `icon-libraries-showcase.html` archive)
- Skill `/studio2:*` (4 sub-comandi, 3-gate) sostituisce `/studio:*` (DEPRECATED)

## Roadmap successiva

> **Follow-up tracciabili + Flussi suggeriti** completi sono in [`.handoff/STATE.md`](./.handoff/STATE.md) § Follow-up tracciabili + § Flussi di attività suggeriti. Sintesi qui sotto.

### Follow-up tracciabili (10 items)

1. **Cycle 2 directory `05-research/`** (~30min · M) — Folder per ospitare nuovi artefatti research cycle 2. Oggi `01-canonical/`, `02-tokens/`, `03-mockups/`, `04-promotion/` sono le 4 sub-dirs esistenti
2. **Skill `/research-artifact-new <topic>`** (~2-3h · M) — Scaffold automatizzato che crea nuovo HTML cycle 2 dal pattern L17 + placeholder content
3. **Phase 5 sidebar refactor opzione A** (~4-6h · L) — Promote sidebar PrimaryNav link a `/dashboard/<preset_v2>` (cockpit-first navigation). Decision in `.ux-design/04-promotion/phase5-route-migration-decision.md`
4. **Phase 6.2 i18n sweep widget legacy** (~3-5h · L) — Refactor 21 widget brand pre-S63 per usare `pickWidgetString` o constants
5. **Phase 7 investor demo Chrome MCP** (~6-10h · M) — 4 ruoli × 14 voci sidebar = ~56 screenshot + Lighthouse audit 5 preset + brand:audit cross-route (target avg ≥ 8)
6. **Storybook stories 6 widget brand nuovi** (~4-6h · M) — TDD-first per audit pre-promotion
7. **Phase 3.2 widget brand residui** (~3-5h · L) — `LearningProgress` + `CertificationBadgeGrid`
8. **`role_default_dashboards` mapping** (~1-2h · L) — Aggiungere row per 8 nuovi preset \_v2 se servono come default
9. **Promozione altri esempi vincenti** (~1-2h · L) — Audit archive `.ux-design-archive-2026-05-13/02-aesthetic/*.html` per benchmark candidates
10. **Catalog DB `09-asset-showcase/` reactivation** (~3-5h · L) — Reattivazione SQLite tool su richiesta

### Flussi di attività suggeriti (5 multi-step)

| #     | Flusso                                             | Effort | Outcome atteso                                                                                       |
| ----- | -------------------------------------------------- | -----: | ---------------------------------------------------------------------------------------------------- |
| **A** | **Drilldown slide-over pattern su preset cycle 2** | ~6-10h | KPI click → trend → record list → record detail (Linear-style)                                       |
| **B** | **AI insight card su `/dashboard` HR_DIRECTOR**    |  ~4-6h | Card narrative AI-generated che traduce KPI in 1 frase decisionale italiana                          |
| **C** | **Sparkline accanto a KpiRing**                    |  ~3-5h | KpiRing widget esteso con mini-sparkline 12pt (trend 12-week)                                        |
| **D** | **Comparative research artifact #2 cycle 2**       |  ~4-6h | Primo artefatto cycle 2 che applica L17 pattern (typography-stacks-showcase o color-palette-options) |
| **E** | **Cross-tenant SUPERUSER cockpit polish**          |  ~5-8h | Browser-verify `cross_tenant_overview_v2` come `sysadmin` + sweep drift dal pattern                  |

### Shipped cycle 1 (storico, già chiuso)

- ~~Production `/dashboard` refactor DB-driven~~ ✅ G6 Adoption + Phase 15.A
- ~~WCAG 2.2 AA audit~~ ✅ S53 L66
- ~~Production build perf bench~~ ✅ S53 L67 partial
- ~~API gateway cross-service JWT~~ ✅ `9f7a283`
- ~~Brand v1.0 promotion~~ ✅ cycle 1 archived S62 reset
- ~~Cycle 2 brand foundations (Phase 0)~~ ✅ S63 (commit `0ebf49e`) — 9 canonical + role-shaper + base-adapter
- ~~Cycle 2 Phase 1-4 rebuild~~ ✅ S63 (commits `114d228` → `3707997`) — 12 preset \_v2 + 8 query modules + 6 widget brand nuovi + 84 elements
- ~~Browser verification 12 preset~~ ✅ S63 (commit `d322ed3`) — HR_DIRECTOR live test + 7 hotfix iterativi
- ~~L17 pattern de reference promotion~~ ✅ S63 (commit `08b2eff`)
- ~~L18 hover transition pattern applied~~ ✅ S63 (commit `baaa12d`)
- ~~L19+L20 session start protocol reform~~ ✅ S63 (commits `d8d0aa7` + `0861370` + `223f02c`)

Backup track parallel: cron daily/weekly/monthly · off-site Oracle bucket · restore drill mensile · `docs/40-operations/dbms-backup-restore.md` (scaffolded).

## Carry-forward S27+ (architectural)

- ~~**§ 1.2 employees vertical-split Phase 2 + view audit**~~ ✅ **SHIPPED** (verified retroactively S52, L63). `employees` ora VIEW (95 col) su `employees_core` (18 col TABLE, 209 FK) + 3 satellite tables popolate. 3 INSTEAD OF triggers attached. 65 dependent views + 6 mat views functional. Backup chain preservata in `/var/backups/heuresys-evo/heuresys_platform-pre-{phase16o-20260510T044105Z, S52-phase16o-redo-20260512T163646Z}.dump`. Archive locale: `db/migrations/phase16o-pre-state/`.
- **`/dashboard` 4 process\_\* secondary nav** (HR_DIRECTOR/HR_MANAGER) — mancano suffix `_v2` + elements seedati. Refactor incrementale ~2-3h, non-blocking.
- **pg_cron migration future**: se installato, sostituire systemd timer con `cron.schedule()` row + disable unit.
- **Promote asset packages/ui** non utilizzati nei 10 mockup (es. data-table, hero-sections) — restano `available` nel catalog.

## Documenti strategici

- `docs/_meta/operating-baseline.md` — **regole comportamentali complete (canonical SoT)**
- `docs/_meta/lexicon.md` — **vocabolario canonical 16 sigle catene relazionali** (S35.2)
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
