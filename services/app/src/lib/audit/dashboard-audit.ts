/**
 * Phase 14 Sprint 2 · E — Audit log P4 wrapper for dashboard mutations.
 *
 * Wraps a Prisma mutation on dashboard_presets / dashboard_elements with an
 * atomic audit_logs insert. The combined transaction commits both rows or
 * rolls back both: the mutation never lands without an audit trail.
 *
 * Designed to be the single point of integration when Sprint 3 · C
 * (drag-resize editor) introduces user-initiated POST/PUT/DELETE on
 * dashboard_presets and dashboard_elements. Until then, no production code
 * path consumes this helper — but the contract + test suite are in place so
 * the editor route handlers can wire it in without re-deriving the schema.
 *
 * Audit row schema (`audit_logs` table):
 *   tenant_id          uuid (REQUIRED)
 *   user_id            uuid (the actor)
 *   user_role          varchar(50)
 *   action             varchar(50)   — CREATE | UPDATE | DELETE | PUBLISH
 *   category           varchar(50)   — 'CONFIG' (constrained to audit_logs.category enum
 *                                      check; dashboards live under the broader
 *                                      configuration/setup family alongside RBP roles, etc.)
 *   resource_type      varchar(100)  — 'dashboard_presets' | 'dashboard_elements'
 *   resource_id        varchar(255)  — stringified id (BigInt → string)
 *   resource_name      varchar(500)  — preset code / element widget_code
 *   description        text          — short human summary
 *   old_value          jsonb         — pre-mutation snapshot (null on CREATE)
 *   new_value          jsonb         — post-mutation snapshot (null on DELETE)
 *   metadata           jsonb         — caller hint (e.g. { source: 'editor' })
 *   success            boolean       — true when transaction committed
 */

import { prisma, withTenant } from '@/lib/db';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH';
export type AuditResourceType = 'dashboard_presets' | 'dashboard_elements';

export interface AuditActor {
  userId: string;
  userRole: string | null;
  tenantId: string;
}

export interface AuditMutationArgs<T> {
  actor: AuditActor;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string | number | bigint;
  resourceName: string;
  description: string;
  /** Snapshot BEFORE mutation. Pass null when action === 'CREATE'. */
  oldValue: unknown | null;
  /** Snapshot AFTER mutation. Pass null when action === 'DELETE'. */
  newValue: unknown | null;
  /** Optional caller hint (e.g. { source: 'editor', requestId }). */
  metadata?: Record<string, unknown>;
  /**
   * Mutation function. Receives the transactional Prisma client; must perform
   * the actual DB write. Return value is propagated unchanged.
   */
  mutate: (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => Promise<T>;
}

export interface AuditMutationResult<T> {
  result: T;
  auditId: string;
}

/**
 * Run `mutate` and the matching `audit_logs` insert in a single Prisma
 * transaction. Throws if either side fails (the caller's mutation never
 * lands without an audit trail).
 *
 * Tenant context for RLS is set via `withTenant()` so DB-level policies
 * also gate the audit_logs row.
 */
export async function auditedDashboardMutation<T>(
  args: AuditMutationArgs<T>
): Promise<AuditMutationResult<T>> {
  const {
    actor,
    action,
    resourceType,
    resourceId,
    resourceName,
    description,
    oldValue,
    newValue,
    metadata,
    mutate,
  } = args;

  if (!actor.tenantId) {
    throw new Error('auditedDashboardMutation: actor.tenantId is required');
  }
  if (!actor.userId) {
    throw new Error('auditedDashboardMutation: actor.userId is required');
  }
  if (action === 'CREATE' && oldValue !== null) {
    throw new Error('auditedDashboardMutation: CREATE requires oldValue=null');
  }
  if (action === 'DELETE' && newValue !== null) {
    throw new Error('auditedDashboardMutation: DELETE requires newValue=null');
  }

  return withTenant(actor.tenantId, async (tx) => {
    const result = await mutate(tx);

    const audit = await tx.audit_logs.create({
      // Prisma JsonValue allows nested unknowns at runtime; cast at the
      // single boundary instead of fighting the static type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        tenant_id: actor.tenantId,
        user_id: actor.userId,
        user_role: actor.userRole,
        action,
        category: 'CONFIG',
        resource_type: resourceType,
        resource_id: String(resourceId),
        resource_name: resourceName,
        description,
        old_value: oldValue === null ? undefined : (oldValue as object),
        new_value: newValue === null ? undefined : (newValue as object),
        metadata: (metadata ?? {}) as object,
        success: true,
      } as any,
      select: { id: true },
    });

    return { result, auditId: audit.id };
  });
}
