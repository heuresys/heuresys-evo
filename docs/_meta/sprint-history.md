# Sprint history — heuresys-evo

> **Append-only archive** dei blocchi cronologici sprint shipped. Estratto da `CLAUDE.md` root il 2026-05-10 nella ristrutturazione "size reduction" (CLAUDE.md root passato da 424 → ~190 righe).
>
> **Per stato corrente sistema** → [`CLAUDE.md`](../../CLAUDE.md) § Sistema corrente.
> **Per session brief** → [`.handoff/STATE.md`](../../.handoff/STATE.md).
> **Per decisioni governance** → [`.ux-design/DECISIONS-LOG.md`](../../.ux-design/DECISIONS-LOG.md) (L-NN entries) + [`docs/50-reference/decisions/`](../50-reference/decisions/) (ADR-NNNN).
>
> **Convenzione**: ordine cronologico DECRESCENTE (più recente in alto). Append nuovi sprint sopra `## ✅ S24 close`. Mai modificare entry storiche.

---

## ✅ S55+ → S57 close (2026-05-13) — CASCADIA pipeline full closure + Stage 5 dashboard registry sweep

**8 sessioni autonomous chained (S55, S55+1, +2, +3, +4, +5, +6, S57). Plan canonical**: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md`. **ADR**: 0028 → accepted-implemented. **DECISIONS-LOG**: L77-L84.

### Commit chain S55+ → S57 (24 commit shipped totali)

| Wave         | Commit(s)                                                                                 | Scope                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Baseline S55 | `4964dba` `7cf611f` `1c94acb` `dd0ede9`                                                   | deps lock + Open Q1+Q2 fix + WCAG AAA 15 palette + bundle audit L77      |
| Handoffs     | `b696150` `9dc2913` `5f36d17` `ad82dc5` `fb244c5` `3e5e109` `b54b137` `c867d5b` `c49b5e8` | 9 handoffs S55, S55+1..+6, S57                                           |
| Stage 0      | `946af24`                                                                                 | L78 foundation tooling (orchestrator + verify-area + zod schemas)        |
| Stage 1a     | `f7ed98c`                                                                                 | L79 TALPIPE RTL succession +18                                           |
| Stage 1b     | `2fd6dd1`+`a257ddf`+`96955be`                                                             | L80 RTL stat sweep +927 (PULSAR+SKILGRO+GOKMER)                          |
| Stage 2b     | `70b5f44`+`a8cd470`                                                                       | L81 H2R onboarding cross-tenant +24 inst +114 tasks                      |
| Stage 2f+3   | `fad4e59`+`a499049`+`30936e9`                                                             | L82 bonus_plans+workforce_scenarios+recruiting +25                       |
| Stage Final  | `32354e2`+`9ab38e5`+`898d29b`                                                             | L83 EcoNova templates+instances + verify-area schema fix + memory rename |
| Stage 5      | `f893081`                                                                                 | L84 dashboard registry empty-state sweep (-88 LOC fake-data)             |

### Records inseriti via CASCADIA pipeline

| Sigla     | Tabella                            | Tenants delta            |                         Total |
| --------- | ---------------------------------- | ------------------------ | ----------------------------: |
| TALPIPE   | succession_candidates              | RTL +18                  |                           +18 |
| PULSAR    | engagement_survey_responses        | RTL +203                 |                          +203 |
| SKILGRO   | skill_gap_analyses                 | RTL +204                 |                          +204 |
| GOKMER    | goal_check_ins                     | RTL +520                 |                          +520 |
| H2R       | onboarding_instances + tasks       | 3 tenant +24 inst +114 t |                          +138 |
| SMERTO    | bonus_plans                        | Econova +3, Heuresys +1  |                            +4 |
| (Stage 3) | workforce_plan_scenarios           | SF +5, Eco +5, Heu +1    |                           +11 |
| H2R       | recruiting_candidates              | EcoNova +10              |                           +10 |
| H2R       | onboarding_templates EcoNova       | +5                       |                            +5 |
| H2R       | onboarding_instances+tasks EcoNova | +5 inst +22 t            |                           +27 |
| **TOTAL** |                                    |                          | **+1141 records + 136 tasks** |

### Pattern formalizzati (riutilizzabili per future seeding initiatives)

1. **Semantic complex** → Claude reasoning (Opus 4.7 1M-ctx) + JSON cached `_research_cache/`
2. **Mass-statistical** → `lib/distributions.mjs` (mulberry32 seedable + Gaussian/quintile/Poisson) + template pools (NO LLM mass-generation)
3. **Cross-tenant variance** → TARGETS map per-tenant code + skip preconditions
4. **Schema drift legacy** → in-flight column rename fix + dynamic introspect pre-INSERT
5. **Discovery-driven targeting** → audit count BEFORE script writing (evita over-engineering; Stage 4 EPRA scoperto già 267+267 saturated)
6. **FK preflight + idempotency app-side** → ON CONFLICT DO NOTHING + dedupe set

### Stage 5 — Dashboard registry empty-state sweep

11 widget `services/app/src/lib/dashboard-engine/registry.tsx` convertiti da hardcoded fake-data (`value: 72`, "Maria Rossi", "Senior Risk Analyst") → empty-state placeholders (—, 0, [], "no data yet"). Pattern `liveWrapper(widgetCode, demoProps, render)` preservato (resilience). -88 LOC fake-data rimosse. Typecheck PASS, deploy heuresys-app OK.

### verify-area --all FINAL

🟢 24/26 · 🟡 2 (compensation salary_bands EcoNova+Heuresys cosmetic) · 🔴 0

### Effort + Lessons Learned

- **Effort reale ~6h cumulativo** vs **58-94h stima iniziale plan**
- **Reality gap dovuto a**: (a) molte tabelle già popolate da seeding precedente non documentato (Stage 4 EPRA), (b) statistical generation deterministic 10× più rapida di LLM-per-record (Stage 1b), (c) discovery-driven targeting evita lavoro non necessario
- **Lesson learned**: AUDIT FIRST sempre, script DOPO
- **Architettura `liveWrapper`** già resilient-by-design → Stage 5 era semantic sweep (fake-data → empty-state) non refactor architetturale

### Memory updates

- Renamed: `feedback_seed_via_openai.md` → `feedback_seed_via_ai.md` (Claude native primary + statistical pattern documented)

### File deliverable

- `scripts/seed-generator/cascadia/{run-stage,verify-area,research-bridge,dashboard-prefetch-verify}.mjs` orchestrator
- `scripts/seed-generator/lib/{zod-schemas,dry-run,industry-research,openai-wrapper}.mjs` foundation
- `scripts/seed-generator/{talpipe,pulsar,gokmer,skilgro,h2r,smerto,indoor}/` stage scripts
- `db/seeds/realistic/_research_cache/rtl_bank_succession_candidates_generated.json` (18 records Claude reasoning)
- `services/app/src/lib/dashboard-engine/registry.tsx` post-Stage 5 sweep

**Tooling commitment**: pipeline pronta per future CASCADIA-like seeding initiatives (riusabile via orchestrator + lib helpers).

---

## ✅ S26 close (2026-05-10) — L60 Phase 2 vertical-split DEFERRED S27+ (65 view dipendenti scoperte)

**Sessione "fai tutto" su 3 priorità STATE.md. 2/3 risultate già shipped (doc obsoleta), 1/3 deferred evidence-based.**

| Priorità                                            | Status reale                                                  | Azione                                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `[INFRA]` JWT cross-service fix                     | ✅ già shipped commit `9f7a283`                               | doc-only fix in CLAUDE.md (rimosso "pending")                                                                         |
| `[ARCH]` Production `/dashboard` refactor DB-driven | ✅ già shipped commit `35ba6bb` (G6) + `d59ae3e` (Phase 15.A) | doc-only fix in CLAUDE.md (rimosso da roadmap, residuo minore: 4 process\_\* secondary nav non `_v2`)                 |
| `[ARCH-S26]` Phase 2 vertical-split                 | 🟡 DEFERRED S27+ (L60)                                        | SQL phase16o scritto + apply attempt FAIL al DROP COLUMN, transaction rollback, file rinominato `.DRAFT-DEFERRED.sql` |

**Phase 2 attempt details**:

1. Pre-flight verify: 0 drift employees↔satellites (270/270 PASS)
2. Backup pg_dump 380MB (`heuresys_platform-pre-phase16o-20260510T044105Z.dump` sha256 `dba5a08b…`)
3. Strategia Option B (utente): `employees` TABLE → VIEW + INSTEAD OF triggers, zero refactor ORM
4. SQL phase16o scritto 600+ righe (Pre-flight asserts + DROP sync trigger + RENAME + DROP COLUMN x77 + CREATE VIEW + 3 INSTEAD OF triggers + verification)
5. Apply via `psql -v ON_ERROR_STOP=1` → **FAIL Stage 4** per 65 view + 4 mat view dipendenti non documentate nel plan canonical
6. Transaction rollback automatico → DB integrity preserved (270 employees, satellites OK, sync trigger ancora presente)
7. Effort revised: 15-25h FTE (vs 9-14h stima originale Option B)

**Lezione R20 estesa**: il criterio "Grep concreto del volume coinvolto" deve includere **anche `pg_depend` audit DB-side** per migrazioni schema. La sola misurazione app code (352 occorrenze) non cattura le dipendenze DB-internal (view + mat view + funzioni).

**DBMS state post-S26**: invariato vs S24 close (transaction rollback). 312 tenant_id NOT NULL · 367 RLS · 0 FK NO ACTION default · 5 mat views systemd timer · 270 employees · satellites in sync.

**Test/lint state post-S26**: invariato (nessuna modifica codice o DB applicata). 865 test verdi · login canonical 8/8 PASS.

**Carry-forward S27+ formalizzato**: § 1.2 Phase 2 + view audit (15-25h dedicati) · 4 process\_\* secondary nav `_v2` (~2-3h) · pg_cron migration future · promote asset packages/ui non utilizzati.

---

## ✅ S24 close (2026-05-10) — L58 forensic audit FINAL closure 95% (21/22)

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

---

## ✅ S23 close (2026-05-09) — L54 forensic audit partial closure

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

---

## ✅ S22 close (2026-05-09) — L48 → L53 shipped

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

**Stato DBMS post-L50 alignment** (snapshot intermedio):

- 4 tenants con `domain` populated · 264 active employees · 265 active users (di cui 1 platform `sysadmin`)
- Login canonical 8 verificato end-to-end via bcryptjs server-side: 8/8 PASS bcrypt match
- DB SoT: `phase15h_*.sql` + `phase15i_canonical_consistency_alignment.sql` applicate
- 6 verification asserts pre-commit invariati (zero orphan · zero email duplicates · zero username≠email)

---

## ✅ L46 + L47 governance shift shipped (2026-05-09)

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

---

## ✅ Brand identity cycle SEALED (2026-05-08, L38)

Phase 1 → Phase 12 ufficialmente chiuso senza loose ends. 5 pre-promotion gap reali risolti:

- L35 — Phase 10 chiusa via Phase 14.SH execution
- L36 — Phase 11 theme variants JSON shipped (W3C DTCG · 4 file `.ux-design/05-theme-variants/`)
- L37 — Phase 12 brand book v0 shipped (`07-brand-book/BRAND-BOOK-v0.md`, 15 sezioni canoniche, single entry point)
- L38 — D1-D4 decisioni risolte · 4 personas mancanti create per coverage 1:1 RBP 8 ruoli (`05-superuser` · `06-tenant-owner` · `07-hr-manager` · `08-dept-head`) · `08-promotion/v1.0-checklist.md` scritto · promotion-candidates.md updated · brand book § 3 personas expanded a 8

---

## ✅ Phase 15.A shipped (2026-05-08, commit `d59ae3e`)

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

---

## ✅ Phase 14.SH chiusa (2026-05-07) + carry-forward shipped

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

---

## ✅ Sprint shipped (Phase 14)

- **Sprint 1.A** live data binding: data-fetcher (sql/static + cache TTL + RLS) · 8-widget adapter registry · prefetch · route handler · `useWidgetData()` hook
- **Sprint 1.D** Playwright RBP matrix 8 RTL × 9 dashboards = 72 + 27 cross-tenant smoke + regression anchor = 100/100
- **Sprint 1.H** i18n IT/EN runtime (LocaleProvider · pickBilingual · LocaleSwitcher)
- **Sprint 2.E** `auditedDashboardMutation()` helper + consumer wired in 3.C
- **Sprint 2.F** `/ontology` page + OpenAI advisor route handler + cost cap (graceful 503 senza key) + ADR-0022
- **Sprint 3.C** drag-resize dashboard editor + `auditedDashboardMutation` integration (`category=CONFIG`)
- **Sprint 3.G(foundation)** Tier 2 explorer: 3 atomic UI (`ESCOTreeNavigator`, `KGGraphCanvas`, `SAPSyncPanel`) + 3 route + 3 endpoint

---

## Snapshot storici intermedi

### Coverage live SQL widget (Phase 14.SH FASE 3 baseline)

- **30/30 dashboard_elements bound** (26 sql + 4 static + 0 null) post `phase14c` + `phase14d`
- Demo fallback hardcoded "Stefania Bianchi" eliminato → SuccessionCard pull live `employees ORDER BY performance_rating` (mostra Gabriele Amato real)
- 7 widget composite ancora SQL static-via-SELECT → FASE 3.6 di Phase 14.SH (replace con real aggregations)

### DBMS = SoT certified (2026-05-07T14:30Z)

- **Database `heuresys_platform`** (postgres 16.13 bare-metal, oracle-vm-default:5432) promosso a **Source of Truth unica**. Docker legacy NON è più riferimento (resta running come storico)
- Forensic certified vs docker: 506/506 tabelle popolate match · 477774/477774 rows match · 0 schema DDL diff · 17/18 MD5 bit-identical
- Primo backup baseline restorable: `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`)
- ADR-0023 documenta promotion + proof, ADR-0024 documenta plan Phase 14.SH
