/**
 * rbac-queries.ts — RBP/RBAC matrix queries (cycle 2 Phase 2).
 *
 * Source per /admin/rbac + RbacMatrix widget. P11 compliant.
 * RBP data is platform-level: stesso set di role × area × permission cross-tenant.
 */
import { withTenant } from '@/lib/db';
import { resolveScopeLevel, type ScopeContext } from './_role-shaper';

export interface RbacMatrixCell {
  roleCode: string;
  roleName: string;
  areaCode: string;
  areaName: string;
  action: string;
  allowed: boolean;
}

export interface RbacRoleSummary {
  roleCode: string;
  roleName: string;
  level: number;
  totalAreas: number;
  allowedAreas: number;
}

export async function fetchRbacMatrix(ctx: ScopeContext): Promise<RbacMatrixCell[] | null> {
  const level = resolveScopeLevel(ctx);
  if (level === 'self' || level === 'reports') return null;
  if (!ctx.tenantId) return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          role_code: string;
          role_name: string;
          area_code: string;
          area_name: string;
          action: string;
          allowed: boolean;
        }>
      >`
        SELECT
          r.code AS role_code,
          COALESCE(r.name_it, r.name_en, r.code) AS role_name,
          a.code AS area_code,
          COALESCE(a.name_it, a.name_en, a.code) AS area_name,
          rap.action,
          rap.allowed
        FROM rbp_role_area_permissions rap
        JOIN rbp_roles r ON r.id = rap.role_id
        JOIN rbp_functional_areas a ON a.id = rap.functional_area_id
        ORDER BY r.level, a.code, rap.action
      `;
      return rows.map((r) => ({
        roleCode: r.role_code,
        roleName: r.role_name,
        areaCode: r.area_code,
        areaName: r.area_name,
        action: r.action,
        allowed: r.allowed,
      }));
    });
  } catch {
    return null;
  }
}

export async function fetchRbacRoleSummary(ctx: ScopeContext): Promise<RbacRoleSummary[] | null> {
  const level = resolveScopeLevel(ctx);
  if (level === 'self' || level === 'reports') return null;
  if (!ctx.tenantId) return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          role_code: string;
          role_name: string;
          level: number;
          total_areas: number;
          allowed_areas: number;
        }>
      >`
        SELECT
          r.code AS role_code,
          COALESCE(r.name_it, r.name_en, r.code) AS role_name,
          r.level,
          COUNT(DISTINCT a.id)::int AS total_areas,
          COUNT(DISTINCT a.id) FILTER (WHERE rap.allowed = true)::int AS allowed_areas
        FROM rbp_roles r
        CROSS JOIN rbp_functional_areas a
        LEFT JOIN rbp_role_area_permissions rap ON rap.role_id = r.id AND rap.functional_area_id = a.id
        GROUP BY r.code, r.name_it, r.name_en, r.level
        ORDER BY r.level
      `;
      return rows.map((r) => ({
        roleCode: r.role_code,
        roleName: r.role_name,
        level: r.level,
        totalAreas: r.total_areas,
        allowedAreas: r.allowed_areas,
      }));
    });
  } catch {
    return null;
  }
}
