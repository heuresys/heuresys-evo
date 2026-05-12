import { cache } from 'react';
import { prisma } from '@/lib/db';

/**
 * Per-request shared query memoization (React 19 cache()).
 *
 * Use cases: queries called by multiple fetchers within the same render request
 * (e.g. tenant.findUnique to resolve tenant name in dashboard page + view).
 * React `cache()` deduplicates within a single request only. For cross-request
 * caching, fetchers themselves use `unstable_cache` (60s revalidate).
 *
 * S45 perf optimization batch.
 */

/**
 * Resolve a tenant row by id — memoized per request.
 * Used by dashboard page.tsx + multiple view fetchers.
 */
export const getTenantById = cache(async (tenantId: string | null) => {
  if (!tenantId) return null;
  try {
    return await prisma.tenants.findUnique({
      where: { id: tenantId },
      select: { id: true, code: true, name: true, industry_type: true, status: true },
    });
  } catch {
    return null;
  }
});

/**
 * List all tenants — memoized per request.
 * Used by org-systems + cross-tenant fetchers (both SUPERUSER scope).
 */
export const getAllTenants = cache(async () => {
  try {
    return await prisma.tenants.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        status: true,
        industry_type: true,
      },
      orderBy: { created_at: 'asc' },
    });
  } catch {
    return [];
  }
});
