# heuresys-evo — Current State

> Updated: 2026-05-11T01:20Z · S29 closed · F0+F2 shipped, F1 deferred, F3 pending

## Last session brief

**S29 (20:55Z → 23:20Z)** — 2 commit pushed `b90b5dc` (F2 chunk 1 Prisma) + `90ea214` (F2 chunk 2 raw SQL). F0 verify: postgres drift inesistente (server 16.13 OK, solo client psql 18.3 binary). F2 H4 sweep completo: **21 routes / 57 mutations wrapped** in `auditedTransaction`. F1 C1 Phase 2 deferito: 3 bloccanti pre-flight (defs incomplete, script apostrofi, backup 0 byte). 462/462 api-gateway test PASS.

## Top priorities S30+ (tech-only)

1. **`[ARCH-S30]` C1 Phase 2 vertical-split — RIGENERAZIONE + APPLY** (~2-3h, era 1-2h). Pre-flight S29 ha trovato 3 bloccanti: (a) `/tmp/employees-views-defs.sql` ha 52 CREATE VIEW senza schema qualifier ma ne servono 65 (50 public.v + 4 public.m + 9 analytics.v + 2 learning.v); (b) script `/tmp/phase16o-execute-pipeline.sh` ha apostrofi strippati nei letterali SQL DO block (syntax error a esecuzione); (c) backup target `pre-phase16o-20260510T043706Z.dump` è 0 byte — usare `043823Z` o `044105Z` (entrambi 397M). Steps S30: rigenerare defs schema-qualified con `pg_get_viewdef` + topological order · rewrite script con quoting corretto + sha256 verify backup + ON_ERROR_STOP · apply 5-step guidato · verify post (test + mat view refresh).

2. **`[TEST-S30]` H11 integration suite full** (~8-12h AI velocity, oltre 5 example Wave 9 + 11 mock estensioni S29). Pattern reference: `services/api-gateway/src/routes/__tests__/employees-extended.test.ts`. Target coverage: tutte le 21 routes ora auditedTransaction-enabled meritano un test che verifichi `audit_logs.create` chiamato con `actor` corretto.

3. **`[TEST-S30]` H13 RLS cross-tenant test extension** (~4-8h AI velocity, oltre 6 scenari shipped Wave 5+9). Estendere matrix UPDATE/DELETE/audit_logs/BYPASSRLS a tutte le tabelle tenant-scoped 312, target: ~30 scenari ben distribuiti.

## Other tech pending (non-priority)

- **M3** Prisma client consolidation (~2-3h refactor cross-workspace)
- **M10** TOTP UI wizard + login signIn step-up integration (~4-6h, handler già shipped Wave 10)
- **M1** Storybook 3 component data-heavy (~1-2h)
- **LOW** Load test perf bench autocannon 8 viste (~30 min)
- **lint:tenant-id violation**: `services/app/src/app/api/auth/totp/verify/route.ts:72` `prisma.users.update` senza `withTenant`/tenantId where — pre-existing S28-bis Wave 10, da fixare in chunk M10 UI wizard.
- **H6** NextAuth v5 migration — force-wait Q3-Q4 2026 stable

## Open questions

- ~~postgres VM 18.3 vs ADR-0023 16.13~~ — **RESOLVED S29 F0**: drift inesistente, server resta 16.13, solo client binary aggiornato.

## Stack snapshot

- Code S29: services/api-gateway · +21 routes auditedTransaction adoption (57 mutations wrapped: 6 employees existing + 7 Prisma chunk 1 + 49 raw SQL + 2 leaves + 2 chunk 1 hidden) · +1 helper `lib/audit/buildActor.ts` (DRY extraction from employees.ts) · 11 test files extended con `audit_logs.create` mock
- auditedTransaction call sites api-gateway: 22 → **65** (S28-bis Wave 8 + S29 F2)
- Tests: **462/462 api-gateway PASS** (no delta vs baseline; pre-existing 14 skip) · typecheck PASS
- Repo: 2 commit aggiunti su origin/main (S29)
- DBMS: invariato (F1 deferred, no migration applicata)

## Verification

```bash
git log --oneline -3                                    # b90b5dc + 90ea214 + handoff
grep -rln 'auditedTransaction' services/api-gateway/src/routes/ | wc -l   # expected: 21
npm test --workspace=services/api-gateway --silent      # expected: 462 PASS
npx tsc --noEmit -p services/api-gateway/tsconfig.json  # expected: clean
```

Riferimenti: commit `b90b5dc` chunk 1 (Prisma routes + buildActor helper) · commit `90ea214` chunk 2 (19 raw SQL routes + 11 test mock extensions) · pattern reference `services/api-gateway/src/routes/leaves.ts` (raw SQL) + `services/api-gateway/src/routes/org-units.ts` (Prisma with archive-vs-delete branch).
