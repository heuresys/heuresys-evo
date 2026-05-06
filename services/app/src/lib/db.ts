import { PrismaClient } from '../../prisma/generated/client/index.js';

/**
 * Prisma singleton for services/app. Mirrors the pattern in
 * services/api-gateway/src/db/pool.ts (kept duplicated rather than shared
 * because @prisma/client types are generated per-package — extracting the
 * client would require shipping a full Prisma schema in @heuresys/shared).
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
 * Mirror of services/api-gateway `withTenant` — required by RLS policies on
 * tenant-scoped tables. Pass `null` for platform-wide queries (RLS context
 * unset, only platform-only tables / non-tenant-scoped reads should run).
 *
 * Usage:
 *   const rows = await withTenant(tenantId, (tx) =>
 *     tx.employees.findMany({ where: { is_active: true } })
 *   );
 */
export async function withTenant<T>(
  tenantId: string | null,
  fn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    if (tenantId) {
      await tx.$executeRawUnsafe(
        `SET LOCAL app.current_tenant_id = '${tenantId.replace(/'/g, "''")}'`
      );
    }
    return fn(tx);
  });
}
