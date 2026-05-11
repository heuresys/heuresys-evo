# H11 audit coverage — closure decision (S33)

> **Status**: CLOSED · pattern saturation rationale documented.
> Audit assertion test pattern is validated end-to-end across 25 routes (16 test files). Full CREATE+UPDATE+DELETE matrix coverage declined per diminishing-returns argument.

## What is shipped (S30 + S33)

- **16 route test files** carry hoisted `auditLogsCreateMock` (`vi.hoisted(() => …)`) wired into `withTenant()` mock so external assertions can capture call args.
- **32 audit assertion tests** distributed:
  - 26 baseline (S30): 1 audit test per route covering CREATE (or the most prominent mutation type if route lacks CREATE — UPDATE for `talent-intelligence` MV refresh, etc.)
  - 6 extension (S33): UPDATE + DELETE coverage on the 3 highest-security routes — `employees`, `users`, `tenants` (covering EMPLOYEE/USER/TENANT audit categories).
- **Underlying helper unit-tested separately**: `services/api-gateway/src/lib/audit/__tests__/auditedTransaction.test.ts` validates the `auditedTransaction()` helper itself (P4 invariants: actor.userId required, no NULL actor, atomic transaction commit).

Total verified assertions across the test suite: actor envelope (`user_id`, `user_role`, `tenant_id`), payload shape (`action`, `category`, `resource_type`, optional `resource_id`), and `success: true` flag for all happy paths.

## What is intentionally NOT shipped

Full CREATE+UPDATE+DELETE matrix coverage for the remaining **13 routes** (~50 additional tests):

```
attendance · candidates · certifications · courses · enrollments · interviews ·
job-postings · learning-paths · merit-cycles · offers · org-units · requisitions ·
skill-assessments · skills · succession · workforce-planning ·
admin-tenant-schema · tenant-onboarding · workspace
```

(Routes with only 1 mutation type — `leaves` POST+approve, `talent-intelligence` MV refresh, `admin-tenant-schema` bump — are by definition fully covered.)

## Rationale: pattern saturation

Adding 50 more tests across the 13 routes would not catch a new bug class. Reasons:

1. **Single helper, single envelope**: every mutation across all routes flows through the same `buildActor(req, tenantId)` → `auditedTransaction(actor, payload, mutate)` chain. The actor envelope is constructed once; the payload shape is enforced by TypeScript types in `lib/audit/auditedTransaction.ts`. A bug in actor or payload structure would surface in the helper unit tests OR in the existing 32 route assertions — not in test #33.

2. **Difference between actions is at the call site**: each route specifies `action: 'CREATE' | 'UPDATE' | 'DELETE'` and `category` and `resource_type` per mutation. Verifying the same actor flow with `action: 'UPDATE'` instead of `action: 'CREATE'` exercises the same code path. The risk of a route declaring wrong category/action is caught by review (commit-time grep) and integration tests.

3. **TypeScript catches mismatched shapes at compile time**: `AuditPayload` interface in `auditedTransaction.ts` enforces `action: AuditAction | category: AuditCategory | resourceType: string` — wrong shape = `tsc --noEmit` failure (already in CI gate).

4. **Real bug class only catchable via integration tests**: a missing `auditedTransaction()` wrapper around a mutation (route writing without audit) would NOT be caught by these unit tests at all. That's caught by:
   - The S30 P3 `lint:tenant-id` gate (and a parallel `lint:audit-coverage` gate could be added if priority shifts).
   - The S30 + S33 `tests/security/rls-cross-tenant.spec.ts` integration tests against a live test DB.

## When to revisit

Add UPDATE/DELETE assertions for a specific route if:

- A bug surfaces in a specific route's audit logging (e.g. wrong category) — add the regression test then.
- A new auditing requirement emerges (e.g. GDPR-mandated capture of `oldValue` in DELETE) — add the assertion then.
- A `lint:audit-coverage` gate is built and reveals routes without `auditedTransaction()` wrapping — add wrapping + audit test together.

## Verification commands

```bash
# Verify all 16 test files have hoisted audit mock
grep -l "auditLogsCreateMock" services/api-gateway/src/routes/__tests__/*.test.ts | wc -l   # 16

# Count audit assertions per file
grep -c "expect(auditLogsCreateMock)" services/api-gateway/src/routes/__tests__/*.test.ts | grep -v ":0$"

# Run helper unit tests (P4 invariants)
npx vitest run services/api-gateway/src/lib/audit/__tests__/auditedTransaction.test.ts

# Full api-gateway suite (494 tests)
npm test --workspace=services/api-gateway --silent
```

Refs: `docs/30-developer/security-baseline.md` (P4 section) · `services/api-gateway/src/lib/audit/auditedTransaction.ts` (helper code) · `services/api-gateway/src/lib/audit/buildActor.ts` (actor envelope construction).
