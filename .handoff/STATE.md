# heuresys-evo — Current State

> Updated: 2026-05-11T02:00Z · S30 closed · P2+P3 shipped, P1 pre-flight complete (apply deferred)

## Last session brief

**S30 (00:14Z → 02:00Z)** — Tre priorities executed in single session:
- **P2 H11**: 26 audit assertion tests added across 16 test files (vi.hoisted pattern). All 488 api-gateway tests PASS.
- **P3 H13**: 24 RLS cross-tenant scenarios added (parametric over 8 representative tables); total 30, was 6.
- **P1 ARCH** (opzione B, prod-safe): full pre-flight artifacts generated + dry-run validated on `heuresys_phase16o_test` (restored from 397M backup); production untouched. Artifacts in `db/migrations/phase16o/` ready for apply session.

Commits: `6b660a4` (P2+P3 tests) + final S30 commit (P1 artifacts + STATE.md).

## Top priorities S31+ (tech-only)

1. **`[ARCH-S31]` C1 Phase 2 vertical-split — APPLY ON PROD** (~3-5h, dedicated session). All pre-flight done in S30 (`db/migrations/phase16o/`). Required additions before apply (see `README.md` checklist):
   - Add INSTEAD OF triggers to step 3 (replace placeholder VIEW with full satellite JOIN)
   - Add explicit `ALTER TABLE employees_core DROP COLUMN…` after RENAME
   - Audit RLS policies on the 65 recreated views (CASCADE drops them)
   - Re-run dry-run on temp DB with the additions
   - Apply on prod within transaction; ROLLBACK on any error
   - Maintenance window coordinated with mat view auto-refresh systemd timer (4h UTC)

2. **`[TEST-S31]` H11 audit assertions — coverage extension** (~6-10h optional). Current S30 coverage: 1 audit test per route (CREATE most prominent). Full coverage = 1 test per mutation type per route (CREATE+UPDATE+DELETE) ≈ 75 tests instead of 26. Diminishing returns — current already validates the pattern + actor envelope across all 25 audited routes.

3. **`[TEST-S31]` H13 RLS cross-tenant — DATABASE_URL_TEST setup** (~1-2h). 30 scenarios written but skipped without test DB. Need: create heuresys_test bare-metal + seed 2 tenants A/B + set `DATABASE_URL_TEST` in CI/local, then 30 scenarios become live.

## Other tech pending (non-priority, unchanged from S29)

- **M3** Prisma client consolidation (~2-3h refactor cross-workspace)
- **M10** TOTP UI wizard + login signIn step-up integration (~4-6h, handler already shipped Wave 10)
- **M1** Storybook 3 component data-heavy (~1-2h)
- **LOW** Load test perf bench autocannon 8 viste (~30 min)
- **lint:tenant-id violation**: `services/app/src/app/api/auth/totp/verify/route.ts:72` — pre-existing S28-bis Wave 10
- **H6** NextAuth v5 migration — force-wait Q3-Q4 2026 stable

## Stack snapshot

- Code S30: services/api-gateway tests/ · 16 test files extended with hoisted audit mock + 26 audit assertion tests · 1 RLS spec extended with 24 parametric scenarios · 0 production code changes
- Tests: **488/488 api-gateway PASS** (+26 audit assertions vs S29 baseline 462) · 38 skipped (30 RLS H13 incl. 24 new + 8 pre-existing) · typecheck PASS
- DBMS: invariato (P1 deferred, dry-run su DB temp validato e cleaned up)
- Pre-flight artifacts: `db/migrations/phase16o/` — 65 view DAG + topo-ordered apply pipeline + README checklist + Python regenerator

## Verification

```bash
git log --oneline -3                                              # 6b660a4 + S30 final + handoff
npm test --workspace=services/api-gateway --silent                # 488 PASS
ls db/migrations/phase16o/artifacts/                              # 4 files
ssh oracle-vm-default 'sudo sha256sum /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump'
# expected: dba5a08b0fba34b61fa2ed5b6152d31ea0d1ab58ad27519487956e356a1157b1
```

Riferimenti: commit `6b660a4` (P2+P3 tests) · commit S30 final (P1 artifacts + STATE.md) · `db/migrations/phase16o/README.md` (apply session checklist).
