/**
 * audit-queries.ts — Role-aware audit log queries (cycle 2 Phase 2).
 *
 * Source per /admin/audit + ActivityFeed widget. P11 compliant.
 * SUPERUSER cross-tenant; tenant-scoped roles vedono solo audit del proprio tenant.
 */
import { withTenant } from '@/lib/db';
import { resolveScopeLevel, type ScopeContext } from './_role-shaper';

export interface AuditLogRow {
  id: string;
  category: string | null;
  resourceType: string | null;
  action: string;
  actorEmail: string | null;
  description: string | null;
  timestamp: Date;
}

export async function fetchAuditLogs(
  ctx: ScopeContext,
  opts: { limit?: number; category?: string | null } = {}
): Promise<AuditLogRow[] | null> {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const level = resolveScopeLevel(ctx);

  // Solo tenant-scope roles e oltre vedono audit log
  // (Phase 2 scope: SUPERUSER cross-tenant via no-wrap rimandato)
  if (level === 'self' || level === 'reports') return null;
  if (!ctx.tenantId) return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const category = opts.category ?? null;
      const rows = category
        ? await tx.$queryRaw<
            Array<{
              id: string;
              category: string | null;
              resource_type: string | null;
              action: string;
              actor_email: string | null;
              description: string | null;
              ts: Date;
            }>
          >`
            SELECT
              id::text, category, resource_type, action, actor_email, description,
              created_at AS ts
            FROM audit_logs
            WHERE tenant_id = ${ctx.tenantId}::uuid
              AND category = ${category}
            ORDER BY created_at DESC
            LIMIT ${limit}
          `
        : await tx.$queryRaw<
            Array<{
              id: string;
              category: string | null;
              resource_type: string | null;
              action: string;
              actor_email: string | null;
              description: string | null;
              ts: Date;
            }>
          >`
            SELECT
              id::text, category, resource_type, action, actor_email, description,
              created_at AS ts
            FROM audit_logs
            WHERE tenant_id = ${ctx.tenantId}::uuid
            ORDER BY created_at DESC
            LIMIT ${limit}
          `;
      return rows.map((r) => ({
        id: r.id,
        category: r.category,
        resourceType: r.resource_type,
        action: r.action,
        actorEmail: r.actor_email,
        description: r.description,
        timestamp: r.ts,
      }));
    });
  } catch {
    return null;
  }
}

export interface AuditCategoryCount {
  category: string;
  count: number;
}

export async function fetchAuditByCategory(
  ctx: ScopeContext,
  daysBack: number = 30
): Promise<AuditCategoryCount[] | null> {
  if (!ctx.tenantId) return null;
  const level = resolveScopeLevel(ctx);
  if (level === 'self' || level === 'reports') return null;

  const days = Math.min(Math.max(daysBack, 1), 365);

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<Array<{ category: string; count: number }>>`
        SELECT COALESCE(category, '(uncategorized)') AS category, COUNT(*)::int AS count
        FROM audit_logs
        WHERE tenant_id = ${ctx.tenantId}::uuid
          AND created_at > NOW() - (${days} || ' days')::interval
        GROUP BY category
        ORDER BY count DESC
      `;
      return rows;
    });
  } catch {
    return null;
  }
}
