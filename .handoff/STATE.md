# heuresys-evo — Current State

> Updated: 2026-05-09T20:45Z · S22 chiusa · L48-L53 shipped (theme/palette + canonical consistency + DBMS forensic audit baseline)

## Last session brief (S22)

**6 ADR-level decisions, 10 commit pushed direct main, 391 → 848 test verdi.**

| Step | Commit | Sintesi |
|------|--------|---------|
| L48 | `11df303` | Theme/palette framework v1 in `.ux-design/02-aesthetic/theme-framework/` (17 palette × 2 mode CSS framework + JS switcher zero deps + playground HTML). Wordmark body canonical `var(--primary)` palette-aware |
| L49 | `7cb25e8` | (1) 4 process_* assegnati come secondary nav HR_DIRECTOR + HR_MANAGER via `role_default_dashboards` priority 10..40. (2) Theme-framework portato in `services/app/src/{styles,lib}/theme-framework/`. `BrandStudioClient` con tab `Palette Presets` + `Token Editor`. Root layout async legge `active-palette.json` SSR. (3) Mockup canonical sweep `--brand-blue` → `--primary` (17 file, 98→0) |
| S22 cleanup | `1ee7b65` + `a7f0a68` | Restringimento canonical demo users a `tests/.test-env` matrix (8 active: 1 SUPERUSER `sysadmin` + 7 RTL Bank email-format). Soft-delete `admin`/`smartfood-admin`/`econova-admin`. Rinaming `USER_ECONOVA`/`USER_RTL` → `USER_EMPLOYEE`/`USER_TENANT_OWNER` |
| L50 | `9f5569c` | DBMS canonical consistency alignment: `tenants.domain` SoT NOT NULL UNIQUE · `employees.email` canonical `lower(strip(first.last))@domain` · 264 username allineati a email · 5 orphan + 3 retired soft-deleted · 6 SQL asserts pre-commit |
| L51 | `3f19a21` | `tests/.test-env` SoT formalization: regola operativa cronologica vincolante. Edit `.test-env` PRIMA → `apply-canonical-users.mjs` + SQL → DB → e2e helpers |
| L52 | `f14f63a` | `users.tenant_id` resta derivata: NO denormalizzazione, legame via `users.employee_id → employees.tenant_id`. 3 trigger di rivisitazione futura documentati |
| DRY refactor | `293e3eb` | `tests/parse-test-env.mjs` + `.d.ts` come parser ESM condiviso. Zero duplicazione username/password tra file |
| Legacy purge | `074fe7d` | 9 file source legacy aggiornati + 5 mockup HTML + cache wipe (`.next/` + 4 `*.tsbuildinfo`). 15 match restanti tutti legitimati |
| L53 audit | `c5150c4` | Forensic DBMS audit via subagent `database-admin`: 5 critical / 7 high / 12 lower issues. Report `docs/_audit/2026-05-09-forensic-db-audit.md` (423 righe) |

## Top priorities (S23 — driven by L53 audit)

**`[CRITICAL]` (~6 FTE-day)**:

1. **ADD COLUMN `tenant_id` + RLS policies** a ~30 tabelle employee/payroll/whistleblowing senza `tenant_id` (`employee_certifications`, `employee_skill_assessments`, `employee_pay_stubs`, `merit_recommendations`, `whistleblowing_*`, `salary_band_assignments`, `succession_candidates`, `bonus_allocations`, `tenant_job_*`, ecc.). Backfill da `employees.tenant_id` via `employee_id` join. RLS standard idiom `tenant_id = current_setting(...)`. Cross-tenant leak prevented oggi solo da app-level join. (4-6 FTE-day)
2. **Fix 13 RLS policies GUC typo** `app.current_tenant` → `app.current_tenant_id` su `analytics_events`, `dashboards`, `dashboard_widgets`, `export_*`, `report_*`, `model_predictions`, `predictive_models`, `turnover_risk_scores`, `widget_templates`. Singolo migration ALTER POLICY × 13. (1 FTE-hour)

**`[HIGH]` (~2-3 FTE-day)**:

3. **P4 enforcement gap audit**: solo 6 audit_logs ultimi 30 giorni · 4/5 con NULL actor. Audit dei write path che bypassano `auditedTransaction()` / `auditedDashboardMutation()`. (1-2 FTE-day)
4. **P3 audit api-gateway**: 30/36 route files NON usano `requirePermission` middleware. Verifica auth alternativa o gap. (1 FTE-day)
5. **`users.role` FK constraint** a `rbp_roles(code)` dopo verifica dati esistenti. (1 FTE-hour)
6. **`widget_catalog_id` cleanup**: NULL su 100% dei `dashboard_elements`. Decommissiona FK o backfill da `widget_code`. (1-2 FTE-hour)
7. **`rbac_role` enum drift**: drop `SYSADMIN`/`TENANT_ADMIN` o allinea con `rbp_roles`. (1-2 FTE-hour)
8. **Doc fix**: `rbp_role_permissions` actual 179 vs CLAUDE.md dichiarato 326. (30 min)

**`[MEDIUM]` (~1 FTE-day)**:

9. App-level `tenant_id` filter consistency: lint rule + pre-commit grep per ogni `prisma.X.findMany` non-platform. (2-4 FTE-hour)
10. Bcrypt rotation: 256/265 active password con cost <12. One-shot rehash al next login o batch script. (2-3 FTE-day o on-demand)

**Carry-forward S20-S21-S22 (non audit-driven)**:

11. Production `/dashboard` refactor DB-driven (`chromeStandard` + `dashboardCode='*_v2'` da catalog DB invece di hardcoded views). ~6-10h
12. WCAG 2.2 AAA full audit (axe-core CI + manual NVDA/VoiceOver). ~3-5h
13. Mockup `var(--brand-blue)` → `var(--primary)` production CSS sweep (opzionale, alias attivo). ~2-3h

## Open questions

- (S23) Strategia tenant_id backfill per ~30 tabelle: migration unica monolitica o batch per dominio (compensation/career/recruiting/learning/whistleblowing)?
- (S23) Audit logs sparse: feature flag temporaneo `AUDIT_OFF=true` attivo in dev? O auditedTransaction() mancante systematicamente?

## Stack snapshot post-S22

**DBMS**:
- 4 tenants con `domain` populated · 264 active employees · 265 active users (1 platform `sysadmin`)
- 570 base tables · 905 FK · 2297 indici · 330 RLS policies (13 con GUC typo) · 354 trigger
- 18 dashboard_presets (11 v1 + 7 v2) · 115 dashboard_elements · 16 role_default_dashboards
- 8 canonical demo users + `canonical_demo_users` registry

**Files chiave**:
- NEW `db/seeds/phase15h_*.sql` + `phase15i_canonical_consistency_alignment.sql` (applied bare-metal SoT)
- NEW `services/app/src/{styles,lib,app/brand-studio}/theme-framework/` (production framework)
- NEW `tests/parse-test-env.mjs` + `.d.ts` (DRY parser)
- NEW `docs/_audit/2026-05-09-forensic-db-audit.md` (baseline audit)
- UPDATED `services/app/src/lib/{authorize,dashboard-engine/role-preset-resolver,navigation/role-nav-map}.ts`
- UPDATED `services/app/src/app/{layout,brand-studio/{actions,BrandStudioClient,page,PalettePresetsTab}}.tsx`
- UPDATED `services/app/src/styles/active-theme.css` (--primary alias)
- UPDATED `services/app/src/app/(app)/_components/UserMenu.tsx` (computeInitials dual-pattern)
- UPDATED 9 file source legacy login (test fixtures · scripts · docs · CI seed) + 5 mockup HTML auth
- UPDATED `tests/.test-env` SoT formalization + `services/app/tests/e2e/{helpers/auth.ts,dashboard-rbp-matrix.spec.ts,auth.spec.ts}`
- UPDATED docs globali: `CLAUDE.md` (Stato attuale + S22 close section + S23 priorities) · `.ux-design/{BRAND-STATE,DECISIONS-LOG}.md`

## Verification

```bash
# Git state
git log --oneline -10
# Expected: c5150c4 (audit) ↑ 074fe7d (purge) ↑ 293e3eb (DRY) ↑ f14f63a (L52) ↑ 3f19a21 (L51) ↑ 9f5569c (L50) ↑ a7f0a68 (rename) ↑ 1ee7b65 (S22 cleanup) ↑ 7cb25e8 (L49) ↑ 11df303 (L48)

# DB state
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c 'SELECT COUNT(*) FROM users WHERE is_active AND deleted_at IS NULL'"
# Expected: 265

# Login canonical 8 verification
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"

# Tests
cd services/app && npx tsc --noEmit && npm test --silent
# Expected: 214/214 PASS
npm test --workspace=services/api-gateway --silent
# Expected: 457/457 PASS
npm test --workspace=packages/shared --silent
# Expected: 82/82 PASS
npm test --workspace=packages/ui --silent
# Expected: 95/95 PASS
```

## Riferimenti chiave

- `docs/_audit/2026-05-09-forensic-db-audit.md` — audit baseline 22 issues
- `.ux-design/DECISIONS-LOG.md` § L48-L53 — log decisioni S22
- `tests/.test-env` — SoT canonical demo users (1 SUPERUSER + 7 RTL email-format)
- `db/seeds/phase15i_canonical_consistency_alignment.sql` — migration consistency idempotente
- `tests/parse-test-env.mjs` — parser DRY condiviso
- `CLAUDE.md` § Stato attuale (S22 close + S23 priorities)
