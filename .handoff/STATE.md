# heuresys-evo — Current State

> Updated: 2026-05-10T05:50Z · S24 closed · audit forensic L53 closure 100% Phase 1 (22/22) + governance R20/CARD-4 + handoff skill realignment

## Last session brief (S24 + S24 ext + governance + cleanup)

8 commit pushed `f505b40` → `e87ea25` → `b0a38f2` → `6f25d59` → `1cbf6d4` → `b6ca4fc` → `1d7ccab` → `0f96844`.

- **S24 P1+P2+P3+P4** (4 commit): auditedTransaction mirror api-gateway + 11 wraps · phase16l GUC normalize · phase16m 310 FK ON DELETE · systemd timer mat views.
- **S24 ext (L59)**: phase16n employees vertical-split Phase 1 additive (3 satellite tables + sync trigger + view employees_full + RLS FORCE).
- **Governance R20/CARD-4**: feasibility evidence-based + Decision Authority codified in `~/.claude/CLAUDE.md` + `docs/_meta/operating-baseline.md` + auto-memory feedback file. MAI dichiarare "non eseguibile" senza i 5 criteri obbligatori.
- **Cleanup**: skill `/handoff` riscritta v2.0 allineata realtà single-STATE.md · 5 references obsolete rimosse · HANDOFF.md stale rimosso.

865 test verdi · login canonical 8/8 PASS · typecheck PASS · lint:tenant-id exit 0.

## Top priorities (S25/S26)

1. **`[ARCH-S26]` § 1.2 vertical-split Phase 2** (~5-9 FTE-day) — refactor ~352 occorrenze col migrate (employees.ts + users.ts + ~10 files concentrati al 45% top 10) + DROP COLUMN da employees + drop sync trigger. Plan evidence-based pronto in `~/.claude/plans/parti-dall-inizio-e-esegui-peppy-dream.md` § Phase 2.
2. **`[ARCH]` Production `/dashboard` refactor DB-driven** (~6-10h) — consume `chromeStandard` + `dashboardCode` da catalog DB (post-L46+L47).
3. **`[INFRA]` API gateway cross-service JWT fix** (~2-3h) — `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode (`services/api-gateway/src/auth.ts`).

## Open questions

- nessuna

## Stack snapshot (changed this session)

- DBMS: 312 tenant_id NOT NULL · **370 RLS policies** · **0 FK NO ACTION default** · 14 SQL migrations bare-metal phase16a-n · 3 satellite tables `employees_{pii,hr,payroll}` (270 rows) + sync trigger + view employees_full
- Code: NEW `services/api-gateway/src/lib/audit/` · MOD `routes/{users,tenants}.ts` (11 auditedTransaction wraps + 5 SAFE annotations)
- Infra: NEW `infra/systemd/heuresys-mat-views-refresh.{service,timer}` deployed
- Governance: NEW R20 (FEASIBILITY EVIDENCE-BASED) + CARD-4 (PROPOSE DON'T DECIDE) + Decision Authority principle persistiti cross-machine via git
- Skill: `/handoff` v2.0 aligned real workflow (-753 lines obsolete references)
- Tests: 865 verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared)

## Verification

```bash
git log --oneline -8
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"SELECT count(*) FROM pg_constraint con JOIN pg_class t ON con.conrelid=t.oid AND t.relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public') WHERE con.contype='f' AND con.confdeltype='a';\""  # expected 0
ssh oracle-vm-default "sudo systemctl is-active heuresys-mat-views-refresh.timer"  # expected: active
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"  # expected: 8/8 pass
cd D:/evo.heuresys.com && npm run lint:tenant-id  # expected exit 0
```

Riferimenti: `~/.claude/plans/parti-dall-inizio-e-esegui-peppy-dream.md` (S24 + Phase 2 plan) · `.ux-design/DECISIONS-LOG.md` § L58+L59 · `docs/_meta/operating-baseline.md` § CARD-4 + R20.
