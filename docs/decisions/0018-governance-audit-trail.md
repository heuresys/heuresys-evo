# ADR-0018: Governance Audit Trail Strategy

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere A (CLI autonomous-max session)
**RTG reference**: Phase 4 task 4.13 (originally "ADR-011" — renumbered to 0018 because Cantiere B used 0011 for test coverage strategy)

## Context

Compliance + governance require an immutable audit trail for sensitive mutations:

- RBP role-permission changes (who granted/revoked what, when)
- Tenant configuration changes (plan upgrade, RLS policy adjustments)
- Ontology version bumps (per ADR-0017)
- User role changes
- Sensitive data access (export operations, admin reads of employee PII)

The legacy `.com.evo` schema includes `audit_logs` table + dedicated triggers
(`trg_audit_employee_permission_overrides`, `trg_audit_role_permissions`,
`audit_permission_changes()` function). These are present in evo baseline
(SQL dump 2026-04-27).

**Decision required**: how should evo implement the governance audit trail?
Reuse legacy `audit_logs` + triggers, or rebuild?

## Decision

**Reuse the existing `audit_logs` table + triggers** present in evo baseline.
No new table needed. Add:

1. **Filtered consumer endpoint** in api-gateway (`GET /audit-logs`, already
   shipped in task 4.10) with mandatory RBP `AUDIT.view` permission and
   tenant-scoped via withTenant + RLS.

2. **Category-based view** for governance subset:
   - `category IN ('CONFIG', 'PERMISSION_CHANGE', 'TENANT')` = governance changes
   - `category = 'EMPLOYEE'` + `action IN ('UPDATE', 'DELETE')` = employee data mutation
   - `category = 'AUTH'` + `action = 'PERMISSION_CHANGE'` = role grant/revoke

3. **Server-side audit emit** on high-value mutations (when adding new endpoints
   that modify governance state, the route handler must INSERT into `audit_logs`
   in the same transaction as the mutation).

4. **Document trigger inventory**: trigger functions in baseline that auto-emit
   audit records:
   - `audit_permission_changes()` — fires on `employee_permission_overrides`
     - `role_permissions` (INSERT/UPDATE/DELETE) → emits to `audit_logs` with
       category=`PERMISSION_CHANGE`
   - (Other triggers in baseline TBD — full inventory `find ... TRIGGER` shows
     30+ business-domain triggers; not all are audit-related)

## Schema reference

`audit_logs` table (excerpt from baseline):

```sql
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "timestamp" timestamp,
    user_id uuid,
    user_email varchar(255),
    user_role varchar(50),
    action varchar(50) NOT NULL CHECK (action IN ('CREATE','READ','UPDATE','DELETE',
                                                   'LOGIN','LOGOUT','EXPORT','IMPORT',
                                                   'PERMISSION_CHANGE','CONFIG_CHANGE',
                                                   'DATA_ACCESS')),
    category varchar(50) NOT NULL CHECK (category IN ('AUTH','USER','EMPLOYEE','TENANT',
                                                       'GOAL','REVIEW','FEEDBACK',
                                                       'COMPENSATION','DOCUMENT','REPORT',
                                                       'CONFIG','SYSTEM')),
    resource_type varchar(100),
    resource_id varchar(255),
    description text NOT NULL,
    old_value jsonb,
    new_value jsonb,
    ip_address inet,
    tenant_id uuid NOT NULL,
    success boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);
```

**Append-only**: enforce via trigger (deferred — `BEFORE UPDATE/DELETE` raise
exception, except for sysadmin-level data corrections). Currently the table
allows updates/deletes; the constraint enforcement is added in a follow-up
migration when first non-immutability incident happens (YAGNI for cutover MVP).

**RLS active**: `tenant_isolation_audit_logs` policy filters by
`tenant_id = current_tenant_id()` per `withTenant()` GUC.

## Alternatives considered

- **Separate `governance_audit_log` table** — Pro: cleaner separation, simpler
  schema. Contro: duplicates `audit_logs` 80% of columns, requires syncing
  category enums, fragments query for compliance reports. **Rejected**.
- **External audit service** (e.g. AWS CloudTrail, Datadog audit logs) — Pro:
  battle-tested. Contro: adds external dependency, breaks tenant isolation
  (logs leave VM = data residency issue for EU customers), multiplies cost
  per row. **Rejected** for Heuresys multi-tenant on-prem-friendly model.
- **Event sourcing on a dedicated stream** (e.g. Kafka topic) — Pro: scalable.
  Contro: massively over-engineered for current scale (we ship N×100 audit rows/day,
  not N×1M). **Rejected** as premature optimization.

## Consequences

**Positive**:

- Zero new schema work — `audit_logs` already exists in baseline with all needed columns + RLS
- Trigger-driven emission means routes can't accidentally skip audit (e.g.
  `employee_permission_overrides` updates always trigger `audit_permission_changes()`)
- Single table = simple compliance query: "who changed what for tenant T in last 90 days?"

**Negative**:

- `audit_logs` grows unbounded — partitioning by month + retention policy
  (e.g. drop > 7 years) deferred to BLOCK 13 (Phase 5 cutover prep) when
  growth metrics are observable. For MVP, single table works (current legacy
  has ~few-thousand rows total in 8+ months operation).
- Append-only enforcement is application-trust today (no DB-level immutability
  trigger). Addressable when first incident requires it; YAGNI for cutover.
- Emission depends on triggers being synced across all tables that need audit
  — manual review needed for new tables (mitigation: add to PR template
  checklist).

## Phase 4 implementation

This ADR is documentation only. The actual capabilities (table + RLS + trigger

- consumer endpoint) are already in place from baseline (table + triggers) +
  task 4.10 (read endpoint). No code changes in this commit beyond this doc.

Future audit emit by application code — when a route mutates governance state
(e.g. role grant) — follows pattern:

```ts
await withTenant(tenantId, async (tx) => {
  await tx.role_permissions.update({ ... });
  await tx.$executeRawUnsafe(
    `INSERT INTO audit_logs (tenant_id, user_id, action, category, resource_type,
                              resource_id, description, old_value, new_value)
     VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)`,
    tenantId, callerId, 'UPDATE', 'PERMISSION_CHANGE', 'role_permissions',
    rpId, 'Role permission changed', oldJson, newJson,
  );
});
```

Pattern captured here so future endpoint authors follow it.

## References

- Phase 4 task 4.10 — already shipped `GET /audit-logs` endpoint with RBP gate
- ADR-0008 Multi-tenant RLS — `current_tenant_id()` GUC + RLS policy template
- ADR-0017 Tenant ontology versioning — version bumps emit audit_logs entries
- Compliance basis: GDPR right-to-explanation requires showing data access
  history; SOC 2 audit scope mandates change tracking on access controls
