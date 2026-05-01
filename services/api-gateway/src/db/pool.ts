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
 * Run `fn` inside a transaction with `app.tenant_id` set to `tenantId`.
 *
 * This is the multi-tenant access pattern that will pair with PostgreSQL
 * Row-Level Security policies once we enable RLS on domain tables. The
 * `SET LOCAL` is scoped to the transaction, so it does not leak across
 * requests sharing the same connection.
 *
 * Usage:
 *   const employees = await withTenant(req.tenantId, (tx) =>
 *     tx.employees.findMany({ take: 10 })
 *   );
 *
 * Note: in A3 RLS is not yet active on these tables, so this helper acts
 * as documentation + future-proofing. It is harmless to call now.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
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
