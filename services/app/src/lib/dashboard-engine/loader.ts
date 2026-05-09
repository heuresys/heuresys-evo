import { prisma } from '@/lib/db';
import type { Prisma } from '../../../prisma/generated/client/index.js';

/**
 * Phase 13.C — Dashboard engine loader.
 * Server-only. Reads dashboard_presets + dashboard_elements via Prisma.
 *
 * Element selection rules:
 *   - Always include platform defaults (tenant_id IS NULL).
 *   - Include tenant-specific overrides only for the current tenant.
 *     When an override exists at the same `position` slot, it shadows
 *     the platform default (handled in the resolver).
 */

export type DashboardPresetWithElements = Prisma.dashboard_presetsGetPayload<{
  include: { dashboard_elements: true };
}>;

export interface LoadPresetOptions {
  /** Current tenant UUID, derived from the session. Pass null for platform-only view. */
  tenantId: string | null;
  /** When false, unpublished preset returns null (used to gate Phase 13.D pending mockups). */
  requirePublished?: boolean;
}

async function loadDashboardPresetUncached(
  code: string,
  tenantId: string | null,
  requirePublished: boolean
): Promise<DashboardPresetWithElements | null> {
  const preset = await prisma.dashboard_presets.findUnique({
    where: { code },
    include: {
      dashboard_elements: {
        where: tenantId
          ? { OR: [{ tenant_id: null }, { tenant_id: tenantId }] }
          : { tenant_id: null },
        orderBy: [{ position: 'asc' }],
      },
    },
  });
  if (!preset) return null;
  if (requirePublished && !preset.is_published) return null;
  return preset;
}

/**
 * Preset loader. Phase 15.A — direct DB read (cache temporarily bypassed).
 * Next.js `unstable_cache` calls JSON.stringify on cached return values,
 * which fails on BigInt fields (preset.id, dashboard_elements[].id,
 * dashboard_preset_id). Hot path is ~30-100ms; preset definitions change
 * rarely. Caching can be reintroduced after refactoring loader to return
 * a serialized BigInt-stripped shape.
 */
export async function loadDashboardPreset(
  code: string,
  opts: LoadPresetOptions
): Promise<DashboardPresetWithElements | null> {
  return loadDashboardPresetUncached(code, opts.tenantId, opts.requirePublished ?? true);
}

/**
 * Lists all preset codes published (used by index/menu UI to discover dashboards).
 */
export async function listPublishedPresets(): Promise<
  Array<{
    code: string;
    name_it: string;
    name_en: string;
    perspective_code: string;
    sort_order: number;
  }>
> {
  // SAFE: dashboard_presets is Platform-default (tenant_id NULLABLE, P10)
  return prisma.dashboard_presets.findMany({
    where: { is_published: true },
    select: {
      code: true,
      name_it: true,
      name_en: true,
      perspective_code: true,
      sort_order: true,
    },
    orderBy: [{ sort_order: 'asc' }, { code: 'asc' }],
  });
}
