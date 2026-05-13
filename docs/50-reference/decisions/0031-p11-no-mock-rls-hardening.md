# ADR-0031: P11 NO-MOCK constraint + RLS hardening (heuresys-evo case study)

- **Status**: Accepted-implemented (S60 close, 2026-05-13)
- **Deciders**: Enzo Spenuso (sole coder, case study owner)
- **Consulted**: S58/S59/S60 audit findings (Phase A/A2 inventory, P1 leak diagnosis, schema extension proposal)
- **Date**: 2026-05-13
- **Supersedes**: nessuno (estende P1-P10 in `security-baseline.md`)
- **Superseded by**: nessuno

## Context

heuresys-evo è case study production-grade con **RTL Bank come tenant di riferimento**. Trattamento da piattaforma in produzione, non da playground. Pre-S58, il codebase conteneva:

1. **~180 fixture hardcoded** in 7 dashboard view legacy + G6 widget seed (config_overrides `type:'static'` con value letterali identici cross-tenant: HEADCOUNT 86, REV/FTE 142, ecc.)
2. **Cross-tenant data leak** su `/compensation` + `/employees` (TENANT_OWNER RTL Bank vedeva bonus_plans EcoNova/Heuresys + employees SmartFood/EcoNova mescolati)
3. **RLS architettonicamente corretto ma silentemente bypassed** dal user `heuresys` con `rolbypassrls=true` (367+ policies disabilitate)
4. **`employees` table è VIEW** post phase16o vertical-split S52 → RLS non si applica a VIEW (Postgres design)

Constraint utente esplicitato S58:

> Tutto va fatto con riferimento a dati live del db e e2e. SEMPRE. NO MOCK, NO PLACEHOLDERS, NO HARDCODED, NO DEMO, NO RANDOM, NO INVENZIONI, NO HALLUCINATIONS. SOLO DATI REALI LIVE E2E DA DBMS. QUANDO I DATI NON SONO DISPONIBILI DEVE ESSERE RIPORTATO "Dati Non Disponibili" E NON DEVE ESSERE OFFERTO NESSUN DATO FITTIZIO IN SOSTITUZIONE.

**Eccezione esplicita**: CASCADIA seeding tools (`scripts/seed-generator/*`) restano legittimi (loro scope è popolare DBMS quando vuoto; post-INSERT i record sono dato live).

## Decision

### Codification P11 sopraordinato

P11 in tabella P1-P11 (`CLAUDE.md` root + `docs/30-developer/security-baseline.md`):

> **P11 Production data fidelity**: UI/mockup/test/brand-studio usano solo query Prisma live. Mai mock/hardcoded/random. Dato assente → "Dati Non Disponibili" via `<DataNotAvailable />`.

Enforcement quadrupla:

1. `CLAUDE.md` root §REGOLA NON NEGOZIABILE (testo letterale costraint)
2. `.claude/CLAUDE.md`: CARD-4 + R18
3. `.claude/skills/studio/references/promote-flow.md`: **Gate D.2 NO-FIXTURE** con error code `PROMOTE_E309_FIXTURE` blocker
4. Component `<DataNotAvailable />` shared + adapter `unavailable` flag

### RLS hardening

`ALTER ROLE heuresys NOBYPASSRLS` applied via postgres superuser. 367+ policies attive ora effettivamente enforced.

Permissive lookup policies aggiunte per bootstrap flow (chicken-egg context):

- `tenants.tenant_lookup_when_no_context`: `USING (current_tenant_id() IS NULL)` per CASCADIA `getTenantIdByCode` lookup pre-context
- `users.user_auth_lookup_when_no_context`: idem per NextAuth Credentials login (SELECT username pre-tenant)

### Defense in depth obbligatorio

`employees` è VIEW (no RLS applicabile). Tutte le 6 query Prisma su `employees`/`bonus_plans`/`performance_reviews`/`goals`/`learning_paths`/`course_enrollments`/`audit_logs` aggiornate con `WHERE tenant_id: tenantId` esplicito (defense in depth):

- `services/app/src/app/(app)/compensation/page.tsx`
- `services/app/src/app/(app)/employees/page.tsx`
- `services/app/src/app/(app)/reviews/page.tsx`
- `services/app/src/app/(app)/goals/page.tsx`
- `services/app/src/app/(app)/learning/page.tsx`
- `services/app/src/app/(app)/admin/integrations/page.tsx`

### Schema extension per case study production-grade

Tre source mancanti per KPI `tenant_owner_overview_v2` documentati come unavailable, poi shipped via:

- `tenant_revenue_periods` (monthly per tenant, RLS, FK tenants CASCADE)
- `equity_grants` (per-employee, RLS, FK employees_core CASCADE)
- `total_compensation_tenant_aggregated` view (derived: base + bonus + equity)

CASCADIA seed `smerto/80_revenue_equity.mjs` realistic benchmark Italia (RTL banking €460M revenue 2025, Heuresys SaaS €2M ARR, ecc.).

### G6 dashboard engine `{employeeId}` placeholder

`fetchSql` esteso con safe placeholder substitution → `$1` binding parametrico via `$queryRawUnsafe(sql, ...params)`. Sblocca 8 KPI personal-scope precedentemente unavailable (capability_graph_v2 + employee_journey_v2).

## Consequences

### Positive

- **Zero fixture hardcoded** in code + DB seed (post-S60)
- **7 preset G6 \_v2 tutti 100% live** cross-tenant verified browser
- **Cross-tenant variance verificata**: RTL 156 emp / Heuresys 1 emp / ecc. mostrati onestamente
- **Sicurezza tenant**: RLS effettivamente enforced (era bypass silente)
- **Brand promise allineato**: case study production-grade dimostra dati live, non hardcoded fakery
- **Pattern riutilizzabile**: `<DataNotAvailable />` + `unavailable` flag adapter per ogni futuro widget
- **Gate D.2** blocca promotion staging con fixture (prevenzione regressioni future)

### Negative / costs

- **Ops complexity**: migration DDL su tabelle RLS richiede `sudo -u postgres psql` (heuresys non bypass)
- **Auth lookup permissive policy** espone username + password_hash a `current_tenant_id()=NULL` connection — accettabile trade-off (auth è il moment di lookup naturale, no alternative pulite)
- **CASCADIA scripts** richiedono `tenant_lookup_when_no_context` policy per bootstrap — minor RLS surface
- **Schema seed banking benchmark** realistic ma synthetic — case study disclaim necessario per investor pitch (non confondere con production data reale)

### Alternative considerate

**Alt-A: Skip P11, mantenere fixture** — Brand promise broken, demo identico cross-tenant cosmeticamente. Rejected: viola costraint utente esplicito.

**Alt-B: P11 senza RLS hardening** — Defense-in-depth ma security architecturalmente debole. Rejected: NOBYPASSRLS è prerequisito di security claim heuresys-evo.

**Alt-C: P11 + RLS hardening + no schema extension** — REV/FTE/EQUITY/TOTAL TC restano unavailable permanentemente. Rejected dopo decisione Opzione A in schema-extension-proposal: case study perde 3 KPI brand-promise.

**Alt-D: synthetic CASCADIA seed PRO + P11** — Rejected sui dati financial (revenue/equity) perché creerebbero false claim brand pitch. Solo defensive seed CASCADIA (employees/skills/bonus_plans) accettabile.

## Implementation

| Step                                | Files                                                                 | Status                              |
| ----------------------------------- | --------------------------------------------------------------------- | ----------------------------------- |
| 1. Codify P11                       | `CLAUDE.md`, `.claude/CLAUDE.md`, brand workstream                    | ✅ S58 commit `8bf368f`             |
| 2. Component `<DataNotAvailable />` | `services/app/src/components/data/DataNotAvailable.tsx` + CSS         | ✅ S58 commit `8bf368f`             |
| 3. G6 tenant_owner pilot live       | `phase18p` migration + adapter + BrandKpiCard/CompCard `unavailable`  | ✅ S58 commit `e500df3`             |
| 4. P1 leak fix 6 page.tsx           | compensation, employees, reviews, goals, learning, admin/integrations | ✅ S59 commit `a233f48`             |
| 5. Bonifica 5 preset \_v2           | `phase18q` migration                                                  | ✅ S59 commit `a233f48`             |
| 6. `{employeeId}` fetchSql          | `data-fetcher.ts` + `phase18r` migration                              | ✅ S60 commit `0985a1a`             |
| 7. RLS hardening                    | `ALTER ROLE` + `phase18t` + `phase18v` permissive lookup policies     | ✅ S60 commit `0985a1a` + `d7d8d2f` |
| 8. Schema extension                 | `phase18s` + `phase18u` + CASCADIA seed `smerto/80`                   | ✅ S60 commit `0985a1a`             |
| 9. Legacy view cleanup              | 7 file `_views/*View.tsx` + switch fallback removed                   | ✅ S60 commit `0985a1a`             |

## Verification

```bash
# 7 preset _v2 tutti live (zero static)
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT dp.code, COUNT(*) FILTER (WHERE de.config_overrides->'\''data_source'\''->>'\''type'\'' = '\''static'\'') AS static_n, COUNT(*) FILTER (WHERE de.config_overrides->'\''data_source'\''->>'\''type'\'' = '\''sql'\'') AS sql_n FROM dashboard_elements de JOIN dashboard_presets dp ON dp.id=de.dashboard_preset_id WHERE dp.code LIKE '\''%_v2'\'' GROUP BY dp.code ORDER BY dp.code;"'

# heuresys user NOBYPASSRLS
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT rolname, rolbypassrls FROM pg_roles WHERE rolname=\"heuresys\";"'
# expected: f

# Cross-tenant variance live
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-variance.mjs'
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-revenue-equity.mjs'

# Browser e2e
# Login federica.marchetti@rtl-bank.org / Heuresys2026!
# /dashboard → HEADCOUNT 156 (era 86) · REV/FTE 2016k (era 142) · TOTAL TC 9M (era 7.4M) · EQUITY "Dati Non Disponibili"
# /compensation → SOLO 5 bonus_plans RTL (era 14 cross-tenant)
# /employees → 50 RTL employees (banking roles, era mescolato Food/Electrical/Quality)
```

## References

- `.ux-design/DECISIONS-LOG.md` L85 + L86 + L87 (session-level audit trail)
- `docs/_meta/sprint-history.md` § S58 → S60 close
- `docs/_audit/2026-05-13-no-mock-inventory.md` (Phase A baseline)
- `docs/_audit/2026-05-13-no-mock-inventory-G6.md` (Phase A2 G6 layer)
- `docs/_audit/2026-05-13-schema-extension-proposal-revfte-equity-totaltc.md` (S59 proposal)
- `~/.claude/plans/i-dati-attuali-che-gentle-church.md` (approved S58 plan)
- ADR-0008 (multi-tenant RLS) — relates: defense-in-depth pattern
- ADR-0012 (security baseline) — relates: P-rules framework
