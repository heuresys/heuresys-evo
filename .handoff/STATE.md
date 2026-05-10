# heuresys-evo — Current State

> Updated: 2026-05-10T04:15Z · S24 closed · audit forensic L53 closure 100% Phase 1 (22/22)

## Last session brief (S24 — P1 + P2 + P3 + P4 + § 1.2 vertical-split Phase 1)

5 commit pushed `f505b40` → `e87ea25` → `b0a38f2` → `6f25d59` → `<phase16n>`. Tutti i 5 items audit chiusi.

- **P1** P4 sweep extended: mirror `auditedTransaction()` in `services/api-gateway/src/lib/audit/` + 11 write Prisma wrappati (users.ts:6 + tenants.ts:5).
- **P2** GUC drift workspaces (Opzione A): `phase16l_*` — 2 policies normalizzate su `app.current_tenant_id`.
- **P3** 310 FK ON DELETE explicit: `phase16m_*` (auto-generated via script) + decision matrix doc. **0 FK NO ACTION default**.
- **P4** mat views auto-refresh: systemd timer su oracle-vm-default · manual run 5/5 PASS.
- **§ 1.2** employees vertical-split Phase 1 (additive): `phase16n_*` — 3 satellite tables (PII/HR/Payroll) + populate 270×3 + sync trigger + view `employees_full` + RLS FORCE. Phase 2 (DROP COLUMN + Prisma refactor) deferred S26+.

865 test verdi · login canonical 8/8 PASS · typecheck PASS · `lint:tenant-id` exit 0 · audit closure **22/22 Phase 1**.

## Top priorities (S25/S26)

1. **`[ARCH-S26]` § 1.2 vertical-split Phase 2** — refactor ~100+ Prisma+raw SQL queries to read from `employees_pii/_hr/_payroll` satellites + `phase16o_drop_redundant_cols.sql` + drop sync trigger. Stima 5-8 FTE-day.
2. **`[ARCH]` Production `/dashboard` refactor DB-driven** (~6-10h) — consume `chromeStandard` + `dashboardCode` da catalog DB (post-L46+L47).
3. **`[ARCH]` WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass.
4. **`[INFRA]` API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode (`services/api-gateway/src/auth.ts`).

## Open questions

- nessuna (carry-forward S24 chiuso senza decisioni pending)

## Stack snapshot (changed this session)

- DBMS: 312 tenant_id NOT NULL · **370 RLS policies** (era 367; +3 satellite isolation) · **0 FK NO ACTION default** (era 310) · 646 CASCADE / 215 SET NULL / 81 RESTRICT
- DBMS NEW: 3 satellite tables `employees_{pii,hr,payroll}` (270 rows each, RLS FORCE attiva) · 1 sync trigger `trg_sync_employees_to_satellites` · 1 view `employees_full` · 1 helper fn `refresh_all_mat_views()`
- Code: NEW `services/api-gateway/src/lib/audit/{auditedTransaction.ts,__tests__/}` · MOD `services/api-gateway/src/routes/{users,tenants}.ts` (11 wraps + 5 SAFE annotations) · MOD `services/api-gateway/prisma/{allowlist.txt,schema.prisma}` (audit_logs added)
- Infra: NEW `infra/systemd/heuresys-mat-views-refresh.{service,timer}` deployed
- Docs: NEW `docs/_audit/2026-05-10-fk-ondelete-review.md` (310 FK decision matrix) · NEW `docs/40-operations/dbms-mat-views-refresh.md` runbook
- 14 SQL migrations bare-metal phase16a-n
- Tests: 865 verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared)

## Verification

```bash
git log --oneline -6
ssh oracle-vm-default 'sudo -n -u postgres psql -d heuresys_platform -tAc "SELECT '\''fk_no_action'\'', count(*) FROM pg_constraint con JOIN pg_class t ON con.conrelid=t.oid AND t.relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='\''public'\'') WHERE con.contype='\''f'\'' AND con.confdeltype='\''a'\'';"'  # expected 0
ssh oracle-vm-default "sudo systemctl list-timers heuresys-mat-views-refresh*"  # expected: timer active, next within 4h
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"  # expected: 8/8 pass
cd D:/evo.heuresys.com && npm run lint:tenant-id  # expected exit 0
cd D:/evo.heuresys.com && npm test --workspaces --if-present  # expected 865+ green
```

Riferimenti: `~/.claude/plans/parti-dall-inizio-e-esegui-peppy-dream.md` · `.ux-design/DECISIONS-LOG.md` § L58 · `docs/_audit/2026-05-09-forensic-db-audit.md` (baseline) · `docs/_audit/2026-05-10-fk-ondelete-review.md` (P3 decision matrix) · 13 SQL migrations bare-metal phase16a-m.
