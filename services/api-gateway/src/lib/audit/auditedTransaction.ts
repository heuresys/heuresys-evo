/**
 * Phase 16 · L58 · S24 — P4 audit logging generalized helper (api-gateway mirror).
 *
 * Mirror of `services/app/src/lib/audit/auditedTransaction.ts` adapted to the
 * api-gateway workspace boundary (imports `prisma` + `withTenant` from the
 * local db pool). Same semantics, same types, same hard-fail invariant.
 *
 *   1) `auditedTransaction()` — wraps a Prisma mutation in a single
 *      transaction with an atomic `audit_logs` insert (mutation never
 *      lands without an audit row). Use for DB writes.
 *
 *   2) `auditEvent()` — fire-and-log-error standalone audit row insert,
 *      for writes that don't involve Prisma (filesystem actions, cookie
 *      mutations, external API calls). Caller passes `success` flag.
 *
 * Both enforce P4 invariant: actor user_id is REQUIRED — no NULL actor.
 * Both set the RLS GUC via `withTenant()` so the audit_logs row itself
 * is tenant-scoped.
 */

import { prisma, withTenant } from '../../db/pool';

/**
 * audit_logs.category CHECK constraint canonical values (DB-enforced):
 *   AUTH, USER, EMPLOYEE, TENANT, GOAL, REVIEW, FEEDBACK, COMPENSATION,
 *   DOCUMENT, REPORT, CONFIG, SYSTEM
 */
export type AuditCategory =
  | 'AUTH'
  | 'USER'
  | 'EMPLOYEE'
  | 'TENANT'
  | 'GOAL'
  | 'REVIEW'
  | 'FEEDBACK'
  | 'COMPENSATION'
  | 'DOCUMENT'
  | 'REPORT'
  | 'CONFIG'
  | 'SYSTEM';

/**
 * audit_logs.action CHECK constraint canonical values (DB-enforced):
 *   CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT,
 *   PERMISSION_CHANGE, CONFIG_CHANGE, DATA_ACCESS
 */
export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'PERMISSION_CHANGE'
  | 'CONFIG_CHANGE'
  | 'DATA_ACCESS';

export interface AuditActor {
  tenantId: string;
  userId: string;
  userEmail?: string | null;
  userRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditPayload {
  action: AuditAction;
  category: AuditCategory;
  resourceType: string;
  resourceId: string | number | bigint;
  resourceName?: string | null;
  description?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}

function assertActor(actor: AuditActor, helper: string): void {
  if (!actor.tenantId) throw new Error(`${helper}: actor.tenantId is required`);
  if (!actor.userId) throw new Error(`${helper}: actor.userId is required (P4: no NULL actor)`);
}

function buildAuditData(actor: AuditActor, payload: AuditPayload, success: boolean) {
  // Prisma JsonValue accepts unknown shapes at runtime; cast at boundary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    tenant_id: actor.tenantId,
    user_id: actor.userId,
    user_email: actor.userEmail ?? null,
    user_role: actor.userRole ?? null,
    action: payload.action,
    category: payload.category,
    resource_type: payload.resourceType,
    resource_id: String(payload.resourceId),
    resource_name: payload.resourceName ?? null,
    description:
      payload.description ??
      `${payload.action} ${payload.resourceType}/${String(payload.resourceId)}`,
    old_value: payload.oldValue === undefined ? undefined : (payload.oldValue as object),
    new_value: payload.newValue === undefined ? undefined : (payload.newValue as object),
    ip_address: actor.ipAddress ?? null,
    user_agent: actor.userAgent ?? null,
    metadata: (payload.metadata ?? {}) as object,
    success,
  } as any;
}

/**
 * DB mutation wrapped in a single Prisma transaction with an atomic
 * audit_logs insert. The mutation function receives the transactional
 * Prisma client; both sides commit together or roll back together.
 */
export async function auditedTransaction<T>(
  actor: AuditActor,
  payload: AuditPayload,
  mutate: (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => Promise<T>
): Promise<{ result: T; auditId: string }> {
  assertActor(actor, 'auditedTransaction');

  return withTenant(actor.tenantId, async (tx) => {
    const result = await mutate(tx);
    const audit = await tx.audit_logs.create({
      data: buildAuditData(actor, payload, true),
      select: { id: true },
    });
    return { result, auditId: audit.id };
  });
}

/**
 * Standalone audit row insert for non-DB writes (filesystem, cookies,
 * external APIs). Errors are caught and logged — never propagate to
 * caller (audit MUST NOT block the write). Returns auditId on success
 * or null on internal failure.
 */
export async function auditEvent(
  actor: AuditActor,
  payload: AuditPayload,
  options: { success?: boolean; errorMessage?: string } = {}
): Promise<string | null> {
  try {
    assertActor(actor, 'auditEvent');
    const success = options.success ?? true;
    const audit = await withTenant(actor.tenantId, async (tx) =>
      tx.audit_logs.create({
        data: {
          ...buildAuditData(actor, payload, success),
          error_message: options.errorMessage ?? null,
        },
        select: { id: true },
      })
    );
    return audit.id;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[auditEvent] failed to record audit row: ${detail}`, {
      action: payload.action,
      category: payload.category,
      resourceType: payload.resourceType,
    });
    return null;
  }
}
