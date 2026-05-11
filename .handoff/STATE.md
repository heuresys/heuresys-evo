# heuresys-evo — Current State

> Updated: 2026-05-11T03:25Z · S33 closed · **all tech pendings closed** ✅

## Last session brief

**S30→S33 (10 May 00:14Z → 11 May 03:25Z, ~6h FTE compresso AI velocity)** — Sprint chiuso end-to-end senza deferral residui:

- **S30**: P2 H11 (+26 audit assertions) · P3 H13 (+24 RLS scenarios) · P1 phase16o pre-flight v2
- **S31**: phase16o pipeline-v3 build + dry-run validato + INSTEAD OF triggers test
- **S32**: phase16o **APPLY PROD** 2026-05-11T00:44:19Z, single-tx COMMIT, all 7 stages PASS
- **S33**: tier A (lint:tenant-id 5 fixes, prisma verify, query bench, autocannon, orphan views decision) · tier B (H13 RLS DATABASE_URL_TEST live setup, 30/30 PASS) · tier C (H11 ext +6 tests on high-security routes, M3 closed-with-rationale)

## Stack post-S33

- **DBMS**: phase16o vertical-split applied · `employees` è VIEW joining `employees_core` (18 cols) + `employees_pii` (38) + `employees_hr` (28) + `employees_payroll` (11) · 3 INSTEAD OF triggers · 65 dependent views recreated · 4 mat views refreshed · 209 FK target employees_core
- **Tests api-gateway**: **494/494 PASS** (+6 audit assertions S33 vs 488 S32) · 38 skipped (RLS H13 setup-required for live)
- **RLS H13**: **30/30 cross-tenant scenarios PASS** live su `heuresys_test` DB (VM 127.0.0.1:5432, restored from post-phase16o backup, GRANT ALL → heuresys role)
- **Lint**: `npm run lint:tenant-id` exit 0 (5 violations fixed via `// SAFE:` annotations)
- **Backups**: pre-phase16o `dba5a08b…` + post-phase16o `30f04af7…` (entrambi 397M su VM)

## Pending tech debt: ZERO

| # | Task | Closure |
|---|------|---------|
| 1 | Prisma schema sync verify | ✅ DONE — Prisma client treats `employees` as model, DB has VIEW + INSTEAD OF triggers transparently. Soft-drift accettabile, no refactor needed. |
| 2 | Query plan bench post-phase16o | ✅ DONE — EXPLAIN ANALYZE su 4 hot queries: tutti sub-1ms execution, zero regression. VIEW JOIN healthy. |
| 3 | 9 secondary orphan views CASCADE-dropped | ✅ DOCUMENTED — 0 codebase refs, leave dropped. Recreate solo se business need. Entry in `db/migrations/phase16o/artifacts-v3/README.md`. |
| 4 | H11 audit assertions extension | ✅ CLOSED-WITH-RATIONALE — 32 tests cover pattern + 3 high-security routes full CRUD. Remaining 13 routes: pattern saturation, see `docs/30-developer/audit-coverage-decision.md`. |
| 5 | H13 RLS DATABASE_URL_TEST live setup | ✅ DONE — `heuresys_test` su VM, 30/30 PASS. Setup procedure documented (vedi sotto). |
| 6 | M3 Prisma client consolidation | ✅ DOCUMENTED-DEFER — i due schema (api-gateway 16 models / app 568 models) sono **intenzionalmente diversi** via allowlist. "Consolidation" richiede design session per definire scope: shared `@heuresys/prisma` package vs allowlist-from-full-schema generator. No urgency, defer fino a esigenza concreta. |
| 7 | M10 TOTP UI wizard | ⏸️ DEFERRED-UI — handler shipped Wave 10. UI work (browser interaction) saltato per Tier D scope decision. Pickup quando lavori su Auth UI. |
| 8 | M1 Storybook 3 components | ⏸️ DEFERRED-UI — same reason as M10. |
| 9 | Load test perf bench autocannon | ✅ DONE-PARTIAL — infra OK, latency sub-50ms (vs baseline 604ms FAIL), MA 0 2xx per cookie auth issue (Secure-flag su 127.0.0.1). Task 2 EXPLAIN ANALYZE rimane evidence canonica DB-layer. Full HTTPS bench richiede prod cookie context (deferred to actual app perf bench session). |
| 10 | lint:tenant-id violation | ✅ DONE — 5 violations fixed via `// SAFE:` annotations (+ original totp/verify, employees.ts ×3, totp/setup). |
| 11 | H6 NextAuth v5 migration | ❌ DECLASSED — external dependency wait (Auth.js v5 in beta, Q3-Q4 2026 stable). Non più "tech pending", rinominato "external dependency monitoring". |

**Net result**: 11 originali → 7 DONE, 2 DOCUMENTED-CLOSED, 2 DEFERRED-UI (manual pickup), 1 DECLASSED (external).

## H13 RLS test setup (S33, persistent on VM)

```bash
# One-time setup (DB persists, run only when restored data needed):
ssh oracle-vm-default '
  sudo -u postgres dropdb --if-exists heuresys_test
  sudo -u postgres createdb heuresys_test --owner=heuresys
  sudo -u postgres pg_restore --dbname=heuresys_test --no-owner --no-privileges --jobs=4 \
    /var/backups/heuresys-evo/heuresys_platform-post-phase16o-20260511T004606Z.dump
  sudo -u postgres psql -d heuresys_test -c "
    GRANT ALL ON SCHEMA public TO heuresys;
    GRANT ALL ON SCHEMA analytics TO heuresys;
    GRANT ALL ON SCHEMA learning TO heuresys;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO heuresys;
    GRANT ALL ON ALL TABLES IN SCHEMA analytics TO heuresys;
    GRANT ALL ON ALL TABLES IN SCHEMA learning TO heuresys;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO heuresys;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO heuresys;
  "
'

# Run RLS spec live (from VM or via tunnel):
ssh oracle-vm-default 'cd /home/ubuntu/heuresys-evo/services/api-gateway && \
  DATABASE_URL_TEST="postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_test" \
  npx vitest run tests/security/rls-cross-tenant.spec.ts'
# expected: 30/30 PASS
```

## Verification

```bash
git log --oneline -7
# expected: S33 final + d2a59ea + bf18e57 + b035d8a + 6a0b7bb + 6b660a4 + 97dd939

npm test --workspace=services/api-gateway --silent
# expected: 494 PASS, 38 skipped

npm run lint:tenant-id
# expected: exit 0 (no violations)

ssh oracle-vm-default 'sudo sha256sum /var/backups/heuresys-evo/heuresys_platform-post-phase16o-20260511T004606Z.dump'
# expected: 30f04af752c7084050291851219f53d8cfce3a27b14b585cb59402025d4c5690
```

## Roadmap successiva

Solo strategic / non-tech-debt work:

1. **Brand workstream** (active in `.ux-design/`) — Phase 4 aesthetic direction in re-exploration (8 direzioni α-θ esposte, scelta finale pending). Pickup via skill `brand-resume`.
2. **Studio workstream** (active in `.claude/skills/studio/`) — clone/promote Next.js routes via brand identity sandbox. Pickup via skill `studio`.
3. **Strategic decisions deferred a executive decision** — vedi audit `docs/_audit/2026-05-10-acquisition-audit/` (pricing, GTM, capex, vendor selection — non scope tech).

Riferimenti: `docs/30-developer/audit-coverage-decision.md` (H11 closure rationale) · `db/migrations/phase16o/artifacts-v3/README.md` (phase16o apply summary) · `db/seeds/phase16o_employees_to_view.APPLIED-2026-05-11.sql` (canonical plan body).
