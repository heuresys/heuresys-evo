import { PrismaClient } from '../../prisma/generated/client/index.js';

/**
 * Prisma singleton.
 *
 * Reuses the same PrismaClient across module reloads in dev (tsx watch),
 * preventing connection pool exhaustion. In production each container has
 * its own process so the singleton check is a no-op.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Run `fn` inside a transaction with `app.current_tenant_id` set to `tenantId`.
 *
 * This is the multi-tenant access pattern paired with PostgreSQL Row-Level
 * Security. The `SET LOCAL` is scoped to the transaction, so it does not leak
 * across requests sharing the same connection.
 *
 * Defense-in-depth: this is the **DB layer**. The application layer adds a
 * second filter via `getScopeCondition()` from `middleware/rbac.ts`, which can
 * be merged into the Prisma where clause via `mergeScopedWhere()` below.
 * Both layers must independently enforce isolation.
 *
 * Status post-Cantiere-B: 605 ENABLE ROW LEVEL SECURITY + 326 CREATE POLICY
 * are present in `db/baseline/000_baseline_schema_v1_2026-04-27.sql`. RLS is
 * active. The application user (PLATFORM_DB_APP_USER) must be non-superuser
 * for RLS to take effect — see ADR-0001 + db/scripts/rls-coverage.sql.
 *
 * Usage:
 *   const employees = await withTenant(req.tenantId, (tx) =>
 *     tx.employees.findMany({ where: mergeScopedWhere(scopeCond, { is_active: true }) })
 *   );
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // The GUC name is mandated by the existing RLS function
    // public.current_tenant_id() (see baseline migration). Do not change
    // unless the SQL function is also updated.
    await tx.$executeRawUnsafe(
      `SET LOCAL app.current_tenant_id = '${tenantId.replace(/'/g, "''")}'`
    );
    return fn(tx);
  });
}

/**
 * Merge an RBP scope condition (from `getScopeCondition()`) with a caller-supplied
 * Prisma where fragment. Returns a single object suitable for `findMany({ where })`.
 *
 * Special-case: deny-all sentinel `{ id: '__deny_all__' }` from getScopeCondition
 * is preserved — Prisma matches no rows for that id, equivalent to denying access.
 *
 * Usage:
 *   const where = mergeScopedWhere(
 *     getScopeCondition(scope, { tenantId, employeeId, managedDepartmentIds }),
 *     { is_active: true, employment_status: 'active' },
 *   );
 */
export function mergeScopedWhere<T extends Record<string, unknown>>(
  scopeCond: Record<string, unknown>,
  baseWhere: T
): T & Record<string, unknown> {
  if (Object.keys(scopeCond).length === 0) return baseWhere;
  return { ...baseWhere, ...scopeCond };
}
