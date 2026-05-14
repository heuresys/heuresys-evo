/**
 * Phase 13.C — RBP resolver for dashboard elements.
 * Pure functions. No I/O. Trivial to unit-test.
 *
 * Visibility semantics:
 *   - `visibility_min_role` is the minimum role *level* required to see an element.
 *   - Lower level = higher privilege (SUPERUSER=-1 ... EMPLOYEE=6).
 *   - User can see element when userRoleLevel <= element.visibility_min_role.
 *   - Default visibility_min_role = 6 (EMPLOYEE) → visible to everyone.
 *
 * Tenant override semantics:
 *   - Loader returns platform defaults (tenant_id IS NULL) + tenant-specific
 *     overrides (tenant_id = current). When BOTH exist for the same `position`,
 *     the tenant override shadows the platform default.
 */

export const ROLE_LEVEL: Record<string, number> = {
  SUPERUSER: -1,
  TENANT_OWNER: 0,
  IT_ADMIN: 1,
  HR_DIRECTOR: 2,
  HR_MANAGER: 3,
  DEPT_HEAD: 4,
  LINE_MANAGER: 5,
  EMPLOYEE: 6,
};

export const DEFAULT_USER_LEVEL = 6;

export interface ResolverContext {
  /** Role string from session (e.g. "HR_DIRECTOR"). Unknown roles → DEFAULT_USER_LEVEL. */
  role?: string | null;
  /** Optional perspective filter (URL ?observer=PROCESS|ENTERPRISE|TALENT). */
  perspective?: string | null;
}

export interface DashboardElementShape {
  id: bigint | number | string;
  position: number;
  widget_code: string;
  widget_catalog_id: number | null;
  grid_col_start: number;
  grid_col_span: number;
  grid_row_start: number;
  grid_row_span: number;
  perspective_code: string | null;
  visibility_min_role: number;
  config_overrides: unknown;
  tenant_id: string | null;
  /** G5+ hierarchy support — parent element id for nested layout containers. */
  parent_element_id?: bigint | number | string | null;
}

export function userRoleLevel(role: string | null | undefined): number {
  if (!role) return DEFAULT_USER_LEVEL;
  const lvl = ROLE_LEVEL[role.toUpperCase()];
  return lvl ?? DEFAULT_USER_LEVEL;
}

/**
 * Apply visibility + perspective filter; merge tenant overrides over platform defaults.
 * Returns elements ordered by `position` ascending.
 */
export function resolveElements<T extends DashboardElementShape>(
  elements: T[],
  ctx: ResolverContext
): T[] {
  const level = userRoleLevel(ctx.role);
  const perspective = ctx.perspective?.toUpperCase() ?? null;

  // Step 1: visibility + perspective filter
  const visible = elements.filter((el) => {
    if (level > el.visibility_min_role) return false;
    if (perspective && el.perspective_code && el.perspective_code !== perspective) return false;
    return true;
  });

  // Step 2: merge — tenant override (tenant_id != null) shadows platform default at the same
  // (parent_element_id, position) tuple. The DB UNIQUE index is
  // `(dashboard_preset_id, COALESCE(parent_element_id, 0), position)` (see schema), so the
  // dedup key must mirror that to support hierarchical layouts (G5+). Earlier versions
  // merged by `position` alone and collapsed every child with position=1 to a single
  // element, breaking LayoutKpiRing / LayoutMainSplit / LayoutPanel hierarchies.
  const byKey = new Map<string, T>();
  const dedupKey = (el: T): string => {
    const parent = el.parent_element_id == null ? '__root__' : String(el.parent_element_id);
    return `${parent}::${el.position}`;
  };
  for (const el of visible) {
    const key = dedupKey(el);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, el);
      continue;
    }
    // Prefer tenant-specific over platform default at the same (parent, position).
    if (existing.tenant_id == null && el.tenant_id != null) {
      byKey.set(key, el);
    }
  }

  return Array.from(byKey.values()).sort((a, b) => a.position - b.position);
}
