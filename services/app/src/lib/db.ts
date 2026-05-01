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
