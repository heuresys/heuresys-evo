# heuresys-evo — Current State

> Updated: 2026-05-07 · **DBMS bare-metal promosso SoT** + Phase 14 Bundle F shipped

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

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

## Top priorities (next session)

1. **Sistema governato di backup/restore** (~1-2 FTE-day) — definire policy: cron daily incremental + weekly full, retention 30/90/365, restore drill, off-site (S3 oracle bucket). Path bucket policy: `/var/backups/heuresys-evo/`.
2. **AppShell brandizzato** (~3-4 FTE-day) — cablare `<AppShell>` da `packages/ui` (sidebar nav + topbar + footer) + popolare `services/app/src/styles/active-theme.css` con tokens da `mu-architect-legacy.html` + creare `<HeuresysWordmark>` React + login allineato a `06-mockups/auth/login.html`.
3. **Composite SQL real (replace static-via-SELECT)** (~2-3 FTE-day) — migrare 7 widget composite static-via-SELECT a SQL aggregations vere su employee_skills × department, esco_skill_relations, performance_reviews.
4. **Process preset 14.D backfill** (~2 FTE-day) — process_onboarding_flow + process_performance_cycle + process_learning_paths sono ora bound ma con SQL static-via-SELECT, da rendere semantici.
5. **Tier 2 advanced** — vedi piano fase 14 Sprint 3.G full scope (saved views, ESCO crosswalk, SAP infotype matrix, ecc.)

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

- Plan execution: `~/.claude/plans/questo-quello-che-glittery-charm.md`
- Migration assets: `db/migrations/phase14c_dashboard_composite_sql_binding.sql` + `db/migrations/phase14d_dashboard_full_binding_coverage.sql`
- SoT backup: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sulla VM)
- Migration log: `/tmp/migration-2026-05-07/restore.log` (su VM)
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- Tier 2 doc: [`docs/20-architecture/tier2-explorer.md`](../docs/20-architecture/tier2-explorer.md)
- Setup OpenAI: [`docs/setup/openai-advisor.md`](../docs/setup/openai-advisor.md)
- ADR-0022: [`docs/50-reference/decisions/0022-openai-advisor-integration.md`](../docs/50-reference/decisions/0022-openai-advisor-integration.md)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv)
