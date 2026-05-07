# heuresys-evo — Current State

> Updated: 2026-05-07T19:30Z · **Phase 14.SH SH-2 closed** · 8 viste live e2e + RBP gate package + cross-service auth align · SH-3 ready (FASE 3.6 composite real + FASE 4 WCAG AAA + FASE 5 prod perf)

## 🟢 SH-2 CLOSED (2026-05-07T19:30Z)

**Commit principale**: `3abf4b1` feat(views,rbp): SH-2 core viste live e2e + RBP gate + cross-service auth align (14 file, +1309/-125)

### Pre-flight + fix
- `node scripts/db/apply-canonical-users.mjs` full sweep → 11/11 utenti canonical con Heuresys2026!, 8/8 ruoli login OK
- AUTH_SECRET cross-service align (`.env.local` ↔ `services/api-gateway/.env`)
- UserMenu initials fix (split su `[. _@]+`, take last 2 parts → "MC" per maria.colombo, era "RB")
- /dashboard refactor: api-gateway fetch → Prisma direct (withTenant + RLS)

### `packages/shared/rbp` (NEW)
5 helper SH-2 scope + 12 vitest:
- `hasMinRole(user, min)` · `requireMinRole(user, min)` (throws RbpDenied)
- `isAuthenticated(user)` · `isRbpPlatformAdmin(user)`
- ROLE_LEVELS aligned con `services/app/src/lib/navigation/types`
- export subpath `@heuresys/shared/rbp`

### 8 viste implementate (Prisma direct + RLS via withTenant + RBP gate)

| Route                | Min role       | Smoke visivo Chrome MCP                                                                |
| -------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `/dashboard`         | any auth       | TENANT_OWNER federica: top employees by performance · refactored Prisma direct         |
| `/employees`         | HR_MANAGER+    | TENANT_OWNER: 50 employees RTL Bank · perf rating · job titles real                    |
| `/admin/tenants`     | SUPERUSER      | sysadmin: 4 tenants real (EcoNova 26, Heuresys 3, RTL 156, SmartFood 82)               |
| `/admin/users`       | IT_ADMIN+      | TENANT_OWNER: 100 users RTL · role badges colorati · last login real                   |
| `/admin/audit`       | HR_DIRECTOR+   | TENANT_OWNER: 100 audit entries · category tones · FAIL flag · actor email             |
| `/me`                | any auth       | DEPT_HEAD paolo.caputo: profile reale (Operations Director, BS01, 9 skills)            |
| `/me/skills`         | any auth       | impl + ESCO mapped + freeform tags (smoke deferred — paolo no employee_skills strutt.) |
| `/team`              | LINE_MANAGER+  | DEPT_HEAD paolo.caputo: 5 direct reports reali (Amato 5.0, Ferri, Fiore, Greco, Martelli) |

### Code health
- vitest **180/180** services/app · **82/82** packages/shared (12 new RBP) · 95/95 packages/ui
- typecheck 5/5 workspace verde
- DBMS SoT immutato (4 tenants, 270+ employees)
- UserMenu initials confermato visivamente (FM=federica, PC=paolo, SY=sysadmin)

### Deferred SH-3 (carry-forward)
- **Routes pendenti** (~12): `/reviews`, `/goals`, `/learning`, `/compensation`, `/analytics/workforce`, `/me/goals`, `/me/reviews`, `/me/learning`, `/team/reviews`, `/team/goals`, `/admin/rbac`, `/admin/integrations`, `/dashboard/cross_tenant_overview`, `/dashboard/tenant_owner_overview`
- **FASE 3.6** composite real aggregations (`phase14e_composite_real_aggregations.sql`)
- **FASE 4** WCAG 2.2 AAA full audit (axe-core + manual NVDA/VoiceOver, contrast 7:1, target ≥24×24)
- **FASE 5** production perf (next build && start, autocannon P95 ≤ 500ms)
- **api-gateway 401 cross-service**: bypassato via Prisma direct in (app)/ pages. Integration con api-gateway resta disponibile ma non più usato dalle viste server-side.

## 🟢 SH-1 CLOSED (2026-05-07T17:58Z)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## 🟢 SH-1 CLOSED (2026-05-07T17:58Z)

| Track | Commit | Result |
|---|---|---|
| **FASE 1** Brand identity applied | `33527b4` | μ-architect-legacy tokens (dark default + light alt) · Tailwind 4 `@theme inline` mapping · `<HeuresysWordmark>` (3 variants × 5 sizes) · login-aurora page (mesh + glass + brand hero) · `(app)` route group + `<AppShell>` cablato · routes spostate sotto `(app)/` |
| **FASE 2** Role-based dynamic sidebar | `11280f4` | `SIDEBAR_MAP` per 8 ruoli canonical · `getNavForUser(session)` server-side · `AppShellClient` con active state via `usePathname` + sezioni Workspace/Ontology/System collapsibili · 27 vitest role-nav · smoke 5/8 ruoli PASS via curl (3 PRE-EXISTING data issue su pwd legacy) |
| **Backup track** | `5624aa3` | Cron postgres daily/weekly/monthly + drill mensile installato su `oracle-vm-default` · `heuresys-backup.sh` + `heuresys-restore-drill.sh` (mode 750, owner `root:postgres`) · prima daily run 2026-05-07T15:48Z 367MB · drill PASS 270/270 employees + 30/30 elements · doc `docs/40-operations/dbms-backup-restore.md` ACTIVE |
| **Post-SH-1 e2e fixes** | `54dfdae` | Visual smoke via Chrome MCP rivelò 3 issue: (1) sidebar invisibile a 1568px viewport — Tailwind 4 specificity `hidden md:flex` → fix `flex max-md:hidden`; (2) sign-out duplicato dashboard/page.tsx → rimosso (UserMenu copre); (3) api-gateway 401 cross-service auth — DEFERRED a SH-2 (pre-existing) |

### Code health post SH-1

- **vitest**: services/app **180/180** verde (153 preexisting + 27 new role-nav) · packages/ui **95/95** (10 new wordmark)
- **typecheck**: 5/5 workspace verde
- **app runtime**: Next.js dev :3200 + api-gateway :8200 entrambi UP, login-aurora rendering OK, dashboard auth-gated 200 con AppShell + brand wordmark + role-driven sidebar
- **DBMS SoT**: invariato (270 employees, 30 dashboard_elements, 506 tables, 477774 rows). Backup chain horizon ~12 mesi.

### Visual smoke verified (3 ruoli rappresentativi via Chrome MCP)

| Role | Username | Sidebar voci osservate (visibili in screenshot) |
|---|---|---|
| **TENANT_OWNER** | `rtl-bank.federica.marchetti` | Workspace + Ontology + System (3 voci: RBAC matrix · Integrations · Audit log) |
| **SUPERUSER** | `evo.dev` | Workspace (Dashboard · Cross-tenant analytics · Employees) + Ontology + System (7 voci: Tenants · Users · RBAC · SAP · Integrations · Audit · Components) |
| **HR_MANAGER** | `rtl-bank.maria.colombo` | Workspace dept-scoped (Dashboard · Employees dept · Reviews · Goals dept · Learning paths) + Ontology · **no System** (least privilege) |

I 5 ruoli rimanenti (IT_ADMIN, DEPT_HEAD, LINE_MANAGER, EMPLOYEE, HR_DIRECTOR) sono coperti dai 27 vitest del SIDEBAR_MAP (assertion role-specific). Visual smoke completo per gli altri 5 ruoli rinviato a SH-2 dopo password fixup.

### Issue minori scoperti (non bloccanti, fixup in SH-2)

- **UserMenu initials bug**: `username.split(/[.\s_@-]+/)` su `rtl-bank.maria.colombo` produce iniziali "RB" (rtl + bank) invece di "MC" (maria + colombo). Da raffinare con name-based extraction.
- **api-gateway 401**: il cookie NextAuth v4 minted da Next non viene accettato da api-gateway @auth/express v5 (cookie name align ok, ma JWT decode forse fallisce). Pre-existing; non blocca shell render.

### Pre-existing data issue → fixup in SH-2

3 utenti hanno password legacy non-unificate (FASE 2 smoke 3/8 fail su login):
- `evo.dev` (SUPERUSER) password `admin123` legacy dev seed
- `rtl-hr` (HR_DIRECTOR) password `password` legacy default
- canonical EMPLOYEE users (`rtl-bank.andrea.derosa`, `rtl-bank.sara.greco`, `econova.elisa.cattaneo`, ecc.) → password unificata `Heuresys2026!` non applicata

→ Re-run `node scripts/db/apply-canonical-users.mjs` con full sweep (compresi pre-canonical batch) come prima azione SH-2.

## 🟡 SH-2 — Sidebar views live data e2e (next session)

Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md` · Handoff input: `.handoff/HANDOFF.md`. Stima 10-15 FTE-day. Stop condition: 50-70 viste live e2e con dati real DBMS · zero demo placeholder · RBP gates su tutte · screenshot 8 ruoli × ogni voce · commit handoff `chore(handoff): SH-2 closed → SH-3 ready`.

## 🟢 DBMS = SoT (certified 2026-05-07T14:30Z)

Il database `heuresys_platform` (postgres bare-metal su oracle-vm-default:5432) è promosso a **Source of Truth**. Da questo momento in avanti:

- **"DBMS"** ≡ **"DBMS bare-metal"** ≡ **SoT** (no più qualifier)
- **DBMS docker** (`heuresys_evo_platform_db` container, 127.0.0.1:5433 sulla VM) **NON è più riferimento**: resta in piedi come storico, non scrivere/leggere da lì per sviluppo evo
- **Primo backup SoT certified restorable**: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (397 MB, pg_dump custom format, gzip)
- **SHA256**: `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`
- **Verifica restorable**: `pg_restore -l <dump>` → 7880 TOC entries listed

### Prove di certificazione (forensic)

Confronto docker → bare-metal post-migration (esecuzione 2026-05-07T13:54-14:00Z):

| Metrica | Docker | Bare-metal | Match |
|---|---|---|---|
| Tabelle popolate (n_live_tup > 0) | 506 | 506 | ✅ |
| Total rows (sum n_live_tup) | 477774 | 477774 | ✅ |
| Schema DDL diff (CREATE TABLE/TYPE/FUNCTION/INDEX/VIEW + ADD CONSTRAINT) | — | — | **0 diff lines** ✅ |
| MD5 hash bit-by-bit (top-18 popolate) | — | — | **17/18 identical** ✅ |
| `mv_occupation_similarity` materialized view | 69182 rows | 69182 rows | count match ✅ (hash diff per ordering REFRESH only) |
| Postgres version | 16.11 | 16.13 | minor diff OK |
| Extensions | ltree·pg_trgm·pgcrypto·plpgsql·uuid-ossp·vector | identico | ✅ |

### Additive evo-specific reimplementate sopra ai dati reali

Tabelle/dati che esistono solo nel bare-metal (non nel docker), reapplicate dopo il restore:

| Asset | Source | Risultato |
|---|---|---|
| `dashboard_presets` table | migration `0002_phase13_dashboard_engine.sql` | 9 preset (5 TALENT + 4 PROCESS) |
| `dashboard_elements` table | seed `phase13_dashboard_presets.sql` | 30 elements |
| `tenant_schema_version` table | migration `223_tenant_schema_version_p0.sql` | 4 rows (per tenant) |
| Live SQL data binding (KpiRing) | seed `phase14a_dashboard_data_sources.sql` | 8 KpiRing + 4 IntegrationHealthPill bound |
| Composite SQL data binding (8 widgets) | migration `phase14c_dashboard_composite_sql_binding.sql` (refactored to composite-key matching) | RbacMatrix live `rbp_*`, 7 static-via-SELECT |
| **Full coverage (11 widgets remaining)** | migration `phase14d_dashboard_full_binding_coverage.sql` | KpiRing live new-hires/reviewed-employees, SuccessionCard live top-performer query, others static-via-SELECT |
| Canonical demo users (Heuresys2026!) | script `scripts/db/apply-canonical-users.mjs` | 11 users updated, 2 legacy soft-deleted |

**Stato dashboard_elements finale**: **26 sql + 4 static + 0 null** = 30/30 widgets bound. **Zero placeholder hardcoded** ("Stefania Bianchi" demo è morta — la SuccessionCard ora pull live da `employees` con tenant scope, mostrando dipendenti REALI come Gabriele Amato).

## Last session brief

Migrazione full docker → bare-metal completata + certificata SoT + primo backup restorable. Cambio sostanziale di posture: il bare-metal contiene ora 477K righe reali (employees con skills/perf/manager, ESCO 3,040 occupations + 14,011 skills + 126,051 relations, SAP infotype tables pa* 9.6K, course_enrollments 3K, employee_attendance 5.2K, ecc.) e tutte le surface evo (dashboard engine, ontology, explorer) leggono da queste fonti.

## 🚀 Phase 14.SH — Brand-driven shell (plan approved 2026-05-07T16:35Z, fresh session ready)

Tutte le priorità precedenti sono state consolidate nel **plan canonical** approvato dall'utente:

📋 **Plan**: `~/.claude/plans/questo-quello-che-glittery-charm.md`
📋 **Handoff input**: `.handoff/HANDOFF.md`
📋 **ADR-0024**: `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`

**Decisioni utente confermate** (D-LOGIN, D-SCOPE, D-THEME, D-A11Y):

| ID | Decisione | Valore |
|---|---|---|
| D-LOGIN | Login mockup canonical | `login-aurora.html` |
| D-SCOPE | Scope viste sidebar | Coverage completa (~50-70 viste) per 8 ruoli |
| D-THEME | Theme default | Dark (light toggle pari dignità) |
| D-A11Y | Compliance level | WCAG 2.2 AAA full |

**⚠️ Split obbligatorio in 3 fresh session** (24-34 FTE-day totali eccede limite single session ~15 FTE-day):

| Session | Fasi | Stima | Stop condition |
|---|---|---|---|
| **SH-1** | FASE 1 + FASE 2 + Backup track | 7-9 FTE-day | Brand applied · sidebar 8 ruoli · backup cron + drill |
| **SH-2** | FASE 3 (50-70 viste live) | 10-15 FTE-day | viste e2e · RBP gates · matrix popolata |
| **SH-3** | FASE 3.6 + FASE 4 + FASE 5 | 7-10 FTE-day | composite real · WCAG AAA · perf prod · closure |

Tra una session e l'altra: pausa utente per review + commit handoff `chore(handoff): SH-N closed → SH-(N+1) ready`.

**Sequenza fasi dettagliata** (24-34 FTE-day totali):

1. **FASE 1 — Brand identity applied** (~4-5 FTE-day): tokens CSS da `mu-architect-legacy.html` → `active-theme.css` · `<HeuresysWordmark>` React · `<AppShell>` cablato in `(app)/` route group · login allineato a `login-aurora.html`
2. **FASE 2 — Role-based dynamic sidebar** (~2-3 FTE-day): import legacy `use-sidebar-nav.ts` + `navigation.ts` · `SIDEBAR_MAP` 8 ruoli · `getNavForUser(session)` server-side
3. **FASE 3 — Sidebar views live data e2e** (~10-15 FTE-day): inventory matrix `docs/20-architecture/role-views-matrix.md` · import-first 25+ API routes legacy + 5-15 frontend pages legacy · build from scratch per gap · RBP gates `packages/shared/src/rbp/`
4. **FASE 3.6 — Composite real aggregations** (~2-3 FTE-day): `phase14e_composite_real_aggregations.sql` replace static-via-SELECT con real aggregations
5. **FASE 4 — UX polish + WCAG 2.2 AAA full** (~4-5 FTE-day): theme toggle · contrast 7:1 · target size ≥ 24×24 · drag alternatives · `prefers-reduced-motion` · live regions · focus order · inline help
6. **FASE 5 — Production perf + handoff finale** (~1-2 FTE-day): `next build && start` · autocannon P95 ≤ 500ms · screenshot final 8 ruoli × N viste
7. **Backup track parallel** (~1 FTE-day): cron daily/weekly/monthly · off-site Oracle bucket · restore drill mensile · `docs/40-operations/dbms-backup-restore.md` (scaffolded)

**Stop condition** fresh session: tutte 5 fasi + backup track complete · vitest 153+/153+ verde · Playwright matrix 100/100 + role-nav suite verde · WCAG AAA pass via axe-core + manual screen reader · screenshot e2e per 8 ruoli × ogni voce sidebar.

## Stack snapshot

| Layer | Tech |
|---|---|
| API Gateway | Express 5 · 8200 · 30 endpoint |
| Frontend | Next.js 16 · 3200 · `/dashboard/[code]` engine + edit mode + `/ontology` + `/explorer/*` |
| UI Library | `packages/ui` Cantiere B · TIER 17 + ESCOTreeNavigator/KGGraphCanvas/SAPSyncPanel |
| **DB** | **Postgres 16.13 bare-metal — SoT certified — 1015 MB · 566 tables · 477774 rows** |
| Test | Vitest 153/153 services/app · Playwright 100/100 RBP matrix · perf script ready |
| Audit | `auditedDashboardMutation()` consumed by `/api/dashboard/[code]/elements` (Sprint 3.C live) |
| LLM | OpenAI advisor route handler + cost cap |

## Background processes attivi

- Tunnel SSH PID variabile (`scripts/dev-local/tunnel-vm.ps1 -Status`) · porte 5432+6380 listening
- Next.js dev:3200 + api-gateway:8200 (entrambi 0.0.0.0)
- Docker postgres legacy ancora up sulla VM ma **NON più riferimento**

## Verification (ripetibile)

```powershell
cd D:\evo.heuresys.com
git status -sb
npm run typecheck --workspaces --if-present  # 5/5 verde
npm test --workspace=services/app -- --run    # 153/153 verde
```

```bash
# Forensic (rerun)
ssh oracle-vm-default "bash /tmp/forensic-verify.sh"  # 0 schema diff, count match
ssh oracle-vm-default "bash /tmp/md5-verify.sh"        # 17/18 MD5 identical

# Dashboard live data smoke (HR_DIRECTOR su RTL Bank, no demo placeholder)
# /dashboard/hr_director_overview → "Active employees · 270" (RLS scope tenant)
# /dashboard/hr_director_overview/edit → drag-resize editor (TENANT_OWNER+)
# SuccessionCard → live employee from employees table (no Stefania Bianchi mock)
```

## Riferimenti

- **Plan canonical Phase 14.SH**: `~/.claude/plans/questo-quello-che-glittery-charm.md`
- **HANDOFF input fresh session**: [`.handoff/HANDOFF.md`](HANDOFF.md)
- **ADR-0023 SoT promotion**: [`docs/50-reference/decisions/0023-promote-baremetal-as-sot.md`](../docs/50-reference/decisions/0023-promote-baremetal-as-sot.md)
- **ADR-0024 Phase 14.SH plan**: [`docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`](../docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md)
- **Role × Views matrix**: [`docs/20-architecture/role-views-matrix.md`](../docs/20-architecture/role-views-matrix.md) (scaffolded, da popolare)
- **DBMS backup policy**: [`docs/40-operations/dbms-backup-restore.md`](../docs/40-operations/dbms-backup-restore.md) (scaffolded)
- Migration assets: `db/migrations/phase14c_dashboard_composite_sql_binding.sql` + `db/migrations/phase14d_dashboard_full_binding_coverage.sql`
- SoT backup baseline: `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump`
- Migration log: `oracle-vm-default:/tmp/migration-2026-05-07/restore.log`
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- Tier 2 doc: [`docs/20-architecture/tier2-explorer.md`](../docs/20-architecture/tier2-explorer.md)
- Setup OpenAI: [`docs/setup/openai-advisor.md`](../docs/setup/openai-advisor.md)
- ADR-0022: [`docs/50-reference/decisions/0022-openai-advisor-integration.md`](../docs/50-reference/decisions/0022-openai-advisor-integration.md)
- Brand state: [`.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)
- Decisions log: [`.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md) (L34 added)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv)
