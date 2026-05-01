# ADR-0017: Tenant Ontology Versioning

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere A (CLI autonomous-max session)
**RTG reference**: Phase 4 task 4.12 (originally "ADR-010" — renumbered to 0017 because Cantiere B used 0010 for RLS coverage strategy)

## Context

Heuresys evo schema is multi-tenant with RLS per tenant. Each tenant can have
custom ontology extensions: industry-specific job families, custom skill
clusters, calibrated salary bands, custom dashboard widgets. As the platform
evolves and new ontology fields/structures are added, we need a way to:

1. Record which ontology version a tenant is on
2. Migrate a tenant from version N to N+1 with controlled rollout (one tenant
   may be on `ontology_v3`, another on `ontology_v2` during a phased migration)
3. Audit ontology changes for compliance
4. Support tenant-scoped backward compatibility (tenants on older versions
   continue to work even if platform default has moved on)

## Decision

Adopt a **`tenant_schema_version` table** with one row per tenant tracking the
current ontology version + history. Schema:

```sql
CREATE TABLE public.tenant_schema_version (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    version integer NOT NULL CHECK (version >= 1),
    applied_at timestamptz NOT NULL DEFAULT now(),
    applied_by uuid REFERENCES users(id),
    notes text,
    UNIQUE (tenant_id, version)
);
CREATE INDEX idx_tenant_schema_version_tenant ON tenant_schema_version (tenant_id, version DESC);
```

**Semantics**:

- A tenant's "current version" is `MAX(version)` for that `tenant_id`
- A bump = INSERT new row (never UPDATE) — preserves history immutably
- New tenants start at `version=1` on signup (auto-inserted by trigger or
  application code)
- Platform-wide ontology release notes documented in `docs/ontology/CHANGELOG.md`
  (TBD when first ontology bump happens)

**RLS**: enable + policy `tenant_isolation_tenant_schema_version USING (tenant_id = current_tenant_id())`

## Operational flow

### When platform releases ontology version N+1

1. Platform team merges schema changes (new columns, new lookup tables, etc.)
2. Migration script populates default values for existing rows where applicable
3. **Tenants are NOT auto-bumped**. They stay on version N until explicitly migrated.
4. Tenant admin (or platform team) calls `POST /admin/tenant-schema-version/bump` →
   inserts new row in `tenant_schema_version` for that tenant
5. Application reads `current_version` to decide which features/columns to expose

### When schema add a tenant-scoped column

```sql
-- Migration NNN_add_skill_clusters.sql
ALTER TABLE skills ADD COLUMN cluster_id uuid;
-- DO NOT bump versions yet. Tenants on v3 see NULL (no clusters); tenants
-- bumped to v4 get cluster assignments via separate data migration.
```

### When a query needs version-aware behavior

```ts
const v = await getCurrentTenantSchemaVersion(tenantId); // returns int
const skillsWithClusters =
  v >= 4
    ? prisma.skills.findMany({ select: { id: true, cluster_id: true } })
    : prisma.skills.findMany({ select: { id: true } }); // v3 doesn't expose cluster_id
```

## Alternatives considered

- **Single `version` column on `tenants` table** — Pro: simpler. Contro: no
  history of upgrades, no audit trail, no rollback target. **Rejected**.
- **No versioning, all tenants forced to latest schema** — Pro: simplest. Contro:
  zero ability to do phased rollout, every breaking ontology change becomes
  a coordinated multi-tenant downtime. **Rejected** for Heuresys multi-tenant model.
- **Per-tenant separate database** — Pro: ultimate isolation. Contro: 100×
  operational overhead at scale, breaks shared-schema queries
  (cross-tenant analytics for platform admin). **Rejected**.

## Consequences

**Positive**:

- Tenant migration is auditable (history of applied versions)
- Phased rollout possible (e.g. early adopters first, then GA)
- Rollback target available if version bump triggers issues
- Aligns with RBP framework (similar `rbp_*` table pattern: data + history)

**Negative**:

- Application code must consult `tenant_schema_version` for every version-gated
  query (low-effort but easy to forget — mitigation: helper function
  `getCurrentTenantSchemaVersion(tenantId)` cached per request)
- Version drift across tenants creates a long tail of legacy support — same
  problem as platform versioning in any SaaS, mitigated by deprecation policy
  (e.g. drop support for v < N-3 after 12 months)

## Phase 4 implementation

This ADR is documented now but the schema migration + endpoint are added in
the **same commit as 4.13 (ADR-0018)** since they are parallel-safe and small.

Endpoint surface (post-migration):

- `GET /admin/tenant-schema-version` — read current version for caller's tenant
- `POST /admin/tenant-schema-version/bump` — admin-only (RBP area: TENANT_ADMIN,
  action: edit), inserts new row at MAX(version)+1

## References

- Platform principle P9 (Everything data-driven) — versioning IS data-driven
- Platform principle P10 (Multi-level Platform/Tenant) — version is per-tenant
  scope, not platform scope
- ADR-0008 Multi-tenant RLS in evo — defines `current_tenant_id()` GUC pattern reused here
