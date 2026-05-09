import { prisma } from '@/lib/db';

/**
 * Phase 15.A — Role → Preset code resolver.
 *
 * Reads `role_default_dashboards` to determine which dashboard preset
 * a logged-in user should see by default.
 *
 * Resolution order (per role):
 *   1. Tenant override row matching the user's tenant_id (priority ASC).
 *   2. Platform default row (tenant_id IS NULL).
 *
 * Returns null when neither exists for the given role.
 */

interface ResolverRow {
  preset_code: string;
}

interface ResolverRowWithPriority {
  preset_code: string;
  priority: number;
}

export interface ResolvePresetForRoleOptions {
  /** RBP role name (e.g. "HR_DIRECTOR"). Case sensitive. */
  role: string;
  /** Caller's tenant UUID. Pass null for platform users (SUPERUSER). */
  tenantId: string | null;
}

export async function resolvePresetCodeForRole(
  opts: ResolvePresetForRoleOptions
): Promise<string | null> {
  const { role, tenantId } = opts;

  const rows = tenantId
    ? await prisma.$queryRaw<ResolverRow[]>`
        SELECT preset_code
        FROM role_default_dashboards
        WHERE role = ${role}
          AND (tenant_id = ${tenantId}::uuid OR tenant_id IS NULL)
        ORDER BY tenant_id NULLS LAST, priority ASC
        LIMIT 1
      `
    : await prisma.$queryRaw<ResolverRow[]>`
        SELECT preset_code
        FROM role_default_dashboards
        WHERE role = ${role}
          AND tenant_id IS NULL
        ORDER BY priority ASC
        LIMIT 1
      `;

  return rows[0]?.preset_code ?? null;
}

/**
 * Phase 15.H — Returns ALL preset codes assigned to a role, ordered by
 * priority (primary at priority=0 first, then secondary). Tenant overrides
 * win over platform defaults for the same preset_code.
 *
 * Used by the navigation system to surface multiple dashboards per role
 * (e.g. HR_DIRECTOR sees primary `hr_director_overview` + 4 process
 * dashboards as secondary nav links).
 */
export async function resolveAllPresetsForRole(
  opts: ResolvePresetForRoleOptions
): Promise<string[]> {
  const { role, tenantId } = opts;

  const rows = tenantId
    ? await prisma.$queryRaw<ResolverRowWithPriority[]>`
        SELECT DISTINCT ON (preset_code) preset_code, priority
        FROM role_default_dashboards
        WHERE role = ${role}
          AND (tenant_id = ${tenantId}::uuid OR tenant_id IS NULL)
        ORDER BY preset_code, tenant_id NULLS LAST, priority ASC
      `
    : await prisma.$queryRaw<ResolverRowWithPriority[]>`
        SELECT preset_code, priority
        FROM role_default_dashboards
        WHERE role = ${role}
          AND tenant_id IS NULL
        ORDER BY priority ASC, preset_code ASC
      `;

  if (tenantId) {
    return [...rows].sort((a, b) => a.priority - b.priority).map((r) => r.preset_code);
  }
  return rows.map((r) => r.preset_code);
}
