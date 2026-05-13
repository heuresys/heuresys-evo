# heuresys-evo — Current State

> Updated: 2026-05-13T18:00Z · S60 closed · **ZERO CARRY-FORWARD** · HEAD pending

## Last session brief

S60 chiude tutti i 5 carry-forward S59+ in cascata. Tutti i preset G6 ora 100% live cross-tenant. RLS hardening attivo. Schema extension shipped. Legacy view cleanup. Zero residual fixture.

## Carry-forward S60+ → tutti chiusi

| CF | Item | Status |
|---|---|---|
| CF-1 | `{employeeId}` placeholder in `fetchSql` | ✅ shipped (substitution + binding param sicuro) |
| CF-1b | Migration `phase18r` unlock 8 KPI (capability_graph + employee_journey) | ✅ live (verified via {employeeId} substitution) |
| CF-2 | `ALTER ROLE heuresys NOBYPASSRLS` + risk assessment | ✅ applied + `phase18t` permissive lookup policy |
| CF-3 | Defense-in-depth audit 10 file `.tsx` residui | ✅ tutti compliant, zero changes |
| CF-4 | Schema extension REV/FTE + EQUITY + TOTAL TC | ✅ Opzione A shipped (`phase18s` + `phase18u` + CASCADIA `smerto/80`) |
| CF-5 | Legacy `_views/*View.tsx` cleanup | ✅ rimossi 7 view + switch fallback (33 LOC + 7 imports) |

## Commits cumulative S58-S60

| # | Commit | Subject |
|---|---|---|
| 1 | `e5cd4df` | feat(smerto): salary_bands closure EcoNova + Heuresys |
| 2 | `8c3ed98` | feat(smerto): salary_band_assignments closure |
| 3 | `c7fc627` | chore(perf): tenant-owners toggle for cross-tenant audit |
| 4 | `74159bd` | docs(perf): Lighthouse cross-tenant audit |
| 5 | `213dcfd` | docs(a11y): axe-core WCAG AAA audit |
| 6 | `8bf368f` | feat(p11): constraint NO-MOCK + DataNotAvailable + legacy view pilot |
| 7 | `d45f736` | chore: handoff S58 intermedio |
| 8 | `e500df3` | feat(g6): tenant_owner_overview_v2 KPI widgets → live SQL |
| 9 | `162658a` | docs(decisions): L85 |
| 10 | `a8f8f5c` | chore: handoff S58-ext |
| 11 | `a233f48` | feat(p11): S59 P1 leak fix + 5 preset _v2 live + schema proposal |
| 12 | **pending** | **feat(p11): S60 zero carry-forward — 5 CF chiusi in cascata** |

## Stato G6 preset _v2 finale (7 presets, post-S60)

| Preset | KPI live | Coverage |
|---|---|---|
| `tenant_owner_overview_v2` | HEADCOUNT, REV/FTE, RETENTION, PERFORMANCE, AVG SALARY, BONUS POOL, EQUITY, TOTAL TC, ActivityFeed, SuccessionCard | 100% live (tutti) |
| `hr_director_overview_v2` | 4 KPI + SuccessionCard | 100% live |
| `skills_heatmap_v2` | 4 KPI + Histogram | live (CERTIFICATIONS unavailable — no source) |
| `cross_tenant_overview_v2` | 4 KPI + Histogram | live (INTEGRATIONS/UPTIME unavailable — no monitoring source) |
| `org_systems_v2` | 4 KPI | live (UPTIME unavailable) |
| `capability_graph_v2` | 4 KPI (TEAM SIZE/CAPABILITY/GAP/COVERAGE) | live via `{employeeId}` |
| `employee_journey_v2` | 4 KPI (CAPABILITY/GOALS/TENURE/NEXT REVIEW) | live via `{employeeId}` |

**Totale**: ~32 KPI live · ~5 KPI unavailable letterali (no monitoring/certification source — intended P11 behavior).

## Cross-tenant variance verified (4 tenant)

| Tenant | HEADCOUNT | REV/FTE | EQUITY | TOTAL TC |
|---|---:|---:|---:|---:|
| RTL Bank | 156 | 2016k | — | 9.0M |
| SmartFood | 82 | 683k | — | 3.4M |
| EcoNova | 25 | 736k | 407k | 2.7M |
| Heuresys | 1 | 1410k | 500k | 0.8M |

## Files canonical S58+S59+S60 P11 enforcement

### Constraints + governance
- `CLAUDE.md` (root): §REGOLA NON NEGOZIABILE + P11
- `.claude/CLAUDE.md`: CARD-4 + R18
- `.claude/skills/studio/references/promote-flow.md`: Gate D.2 NO-FIXTURE
- `.ux-design/{BRAND-STATE, SESSION-RESUME, 08-promotion/v1.0-checklist}.md`: disclaimer

### Audit + docs
- `docs/_audit/2026-05-13-no-mock-inventory.md`: Phase A
- `docs/_audit/2026-05-13-no-mock-inventory-G6.md`: Phase A2 G6 layer
- `docs/_audit/2026-05-13-schema-extension-proposal-revfte-equity-totaltc.md`: S59 proposal (closed by S60)

### App code
- `services/app/src/components/data/DataNotAvailable.tsx` (+ CSS AA-compliant)
- `services/app/src/lib/data/tenant-owner-queries.ts` (reference)
- `services/app/src/lib/dashboard-engine/data-fetcher.ts`: `{employeeId}` substitution
- `services/app/src/lib/dashboard-engine/adapters.ts`: `kpiRingAdapter` unavailable flag
- `services/app/src/components/widgets/brand/BrandKpiCard.tsx`: DataNotAvailable rendering
- `services/app/src/components/widgets/brand/BrandCompCard.tsx`: per-item unavailable

### Database
- `db/migrations/phase18p`: tenant_owner_overview_v2 live SQL
- `db/migrations/phase18q`: 5 preset _v2 bulk
- `db/migrations/phase18r`: capability_graph + employee_journey {employeeId}
- `db/migrations/phase18s`: tenant_revenue_periods + equity_grants + total_compensation_view
- `db/migrations/phase18t`: tenants_lookup_policy (permissive)
- `db/migrations/phase18u`: REV/FTE + EQUITY + TOTAL TC live

### Seeding
- `scripts/seed-generator/smerto/60_salary_bands.mjs` (S58)
- `scripts/seed-generator/smerto/70_salary_band_assignments.mjs` (S58)
- `scripts/seed-generator/smerto/80_revenue_equity.mjs` (S60)
- `scripts/perf/test-tenant-owner-v2-variance.mjs` (verification harness)
- `scripts/perf/test-tenant-owner-v2-revenue-equity.mjs` (S60 verification)

### Database role hardening
- `heuresys` user: NOBYPASSRLS active (S60 CF-2)
- `tenants` table: dual policy (tenant_self_access + tenant_lookup_when_no_context)
- `tenant_revenue_periods`, `equity_grants`: RLS + force + tenant_isolation policy

### Cleanup
- `services/app/src/app/(app)/dashboard/_views/` → **DELETED** (7 files)

## Verifica handoff

```bash
# 7 preset _v2 tutti live (zero static)
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT dp.code, COUNT(*) FILTER (WHERE de.config_overrides->'\''data_source'\''->>'\''type'\'' = '\''static'\'') AS static_n, COUNT(*) FILTER (WHERE de.config_overrides->'\''data_source'\''->>'\''type'\'' = '\''sql'\'') AS sql_n FROM dashboard_elements de JOIN dashboard_presets dp ON dp.id=de.dashboard_preset_id WHERE dp.code LIKE '\''%_v2'\'' GROUP BY dp.code ORDER BY dp.code;"'

# Variance test
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-variance.mjs'
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-revenue-equity.mjs'

# RLS hardening verified
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT rolname, rolbypassrls FROM pg_roles WHERE rolname=\"heuresys\";"'
# expected: f

# Production live
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://evo.heuresys.com/login

# Typecheck
cd services/app && npx tsc --noEmit

# Legacy views deleted
ls services/app/src/app/\(app\)/dashboard/_views 2>&1
# expected: No such file or directory
```

## Reference plan

`~/.claude/plans/i-dati-attuali-che-gentle-church.md` (approved 2026-05-13) — completato e oltrepassato (5 CF S60 chiusi cumulative).

## Operating regola appresa S60

`ALTER ROLE heuresys NOBYPASSRLS` ha effetto collaterale: ogni migration DDL/UPDATE che tocca tabelle con RLS attivo (dashboard_elements, ecc.) richiede `sudo -u postgres` per bypass. Pattern ops: migration platform-wide tramite postgres superuser; migration tenant-scoped tramite app user con set_config.
