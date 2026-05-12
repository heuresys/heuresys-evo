/**
 * S48 G6 — cold-data cache for dashboard meta resolution.
 *
 * Tenant names + preset metadata change rarely (admin edits, days/weeks
 * interval). The default DashboardPage path hits both per-request via
 * separate Prisma queries; cache them at 300s TTL to remove 2 DB
 * round-trips from the cached-warm path.
 *
 * Returns plain serializable shapes (no BigInt) so unstable_cache's
 * internal JSON.stringify works without the loader.ts blocker.
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

const CACHE_TTL_SECONDS = 300;

export interface CachedPresetMeta {
  name_it: string | null;
  name_en: string | null;
  perspective_code: string | null;
  persona_label: string | null;
  /** Index signature for compat with pickBilingual<T extends Record<string, unknown>>. */
  [key: string]: unknown;
}

async function fetchTenantName(tenantId: string): Promise<string | null> {
  const t = await prisma.tenants.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });
  return t?.name ?? null;
}

async function fetchPresetMeta(presetCode: string): Promise<CachedPresetMeta | null> {
  const p = await prisma.dashboard_presets.findFirst({
    where: { code: presetCode },
    select: {
      name_it: true,
      name_en: true,
      perspective_code: true,
      persona_label: true,
    },
  });
  return p
    ? {
        name_it: p.name_it ?? null,
        name_en: p.name_en ?? null,
        perspective_code: p.perspective_code ?? null,
        persona_label: p.persona_label ?? null,
      }
    : null;
}

/** Cached tenant.name lookup. Returns null when tenant absent. */
export function getCachedTenantName(tenantId: string): Promise<string | null> {
  return unstable_cache(() => fetchTenantName(tenantId), ['dashboard-tenant-name', tenantId], {
    revalidate: CACHE_TTL_SECONDS,
    tags: ['dashboard-meta'],
  })();
}

/** Cached dashboard_presets metadata lookup keyed by preset code. */
export function getCachedPresetMeta(presetCode: string): Promise<CachedPresetMeta | null> {
  return unstable_cache(() => fetchPresetMeta(presetCode), ['dashboard-preset-meta', presetCode], {
    revalidate: CACHE_TTL_SECONDS,
    tags: ['dashboard-meta'],
  })();
}
