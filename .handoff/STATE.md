# heuresys-evo — Current State

> Updated: 2026-05-10T03:55Z · S24 closed · audit forensic L53 closure 95% (21/22)

## Last session brief (S24 — P1 + P2 + P3 + P4 in singola sessione)

3 commit pushed `f505b40` → `e87ea25` → `b0a38f2`. 4 priorità S23-quater carry-forward TUTTE chiuse.

- **P1** P4 sweep extended: mirror `auditedTransaction()` in `services/api-gateway/src/lib/audit/` + 11 write Prisma wrappati (users.ts:6 + tenants.ts:5 — incluso reset-password line 648). audit_logs aggiunto allowlist+schema.
- **P2** GUC drift workspaces (Opzione A): `phase16l_user_workspaces_guc_normalization.sql` — 2 policies normalizzate su `app.current_tenant_id`.
- **P3** 310 FK ON DELETE explicit: `phase16m_fk_ondelete_explicit.sql` (auto-generated via `scripts/db/generate-fk-ondelete-migration.mjs`) + decision matrix doc per dominio. 0 FK NO ACTION default residue.
- **P4** mat views auto-refresh: `infra/systemd/heuresys-mat-views-refresh.{service,timer}` + runbook · enabled+started su oracle-vm-default · manual run 5/5 PASS.

865 test verdi · login canonical 8/8 PASS · typecheck PASS tutti workspace · `lint:tenant-id` exit 0.

## Top priorities (S25 — solo 1 carry-forward residuo + backlog architectural)

1. **`[LOW]` § 1.2 employees vertical-split** — `employees` 95 col / 19 idx. Out-of-scope deliberato a > 100k rows (oggi 264 active).
2. **`[ARCH]` Production `/dashboard` refactor DB-driven** (~6-10h) — consume `chromeStandard` + `dashboardCode` da catalog DB (post-L46+L47).
3. **`[ARCH]` WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass.
4. **`[INFRA]` API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode (`services/api-gateway/src/auth.ts`).

## Open questions

- nessuna (carry-forward S24 chiuso senza decisioni pending)

## Stack snapshot (changed this session)

- DBMS: 312 tenant_id NOT NULL (invariato) · 367 RLS policies (invariato) · **0 FK NO ACTION default** (era 310) · 646 CASCADE / 215 SET NULL / 81 RESTRICT
- Code: NEW `services/api-gateway/src/lib/audit/{auditedTransaction.ts,__tests__/}` · MOD `services/api-gateway/src/routes/{users,tenants}.ts` (11 wraps + 5 SAFE annotations) · MOD `services/api-gateway/prisma/{allowlist.txt,schema.prisma}` (audit_logs added)
- Infra: NEW `infra/systemd/heuresys-mat-views-refresh.{service,timer}` deployed
- Docs: NEW `docs/_audit/2026-05-10-fk-ondelete-review.md` (310 FK decision matrix) · NEW `docs/40-operations/dbms-mat-views-refresh.md` runbook
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
