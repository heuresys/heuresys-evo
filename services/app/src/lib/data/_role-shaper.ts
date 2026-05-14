/**
 * _role-shaper.ts — Role-aware Prisma `where` clause shaper.
 *
 * Cycle 2 Phase 0 T0.9. Maps the 8 canonical evo roles to scope predicates
 * applicable to common entity types (employees, reviews, goals, learning,
 * compensation). Returns a typed scope descriptor plus the Prisma `where`
 * fragment ready to merge into a query.
 *
 * Scope semantics:
 *   - SUPERUSER   → platform (cross-tenant): no filter
 *   - TENANT_OWNER → tenant: tenant_id = ctx.tenantId
 *   - IT_ADMIN    → tenant: same as TENANT_OWNER (admin functions)
 *   - HR_DIRECTOR → tenant: full HR perimeter
 *   - HR_MANAGER  → team (tenant + dept perimeter); falls back to tenant if no perimeter
 *   - DEPT_HEAD   → dept: tenant + employees in own department
 *   - LINE_MANAGER → reports: tenant + direct reports of ctx.employeeId
 *   - EMPLOYEE    → self: tenant + employee = ctx.employeeId
 *
 * RLS at DB-level (P5) remains the source of truth. This helper provides an
 * additional in-Prisma filter so explicit queries do not over-fetch and
 * domain-specific filters (e.g. manager_id chain) are encoded uniformly.
 *
 * Reference: ~/.claude/plans/c-stata-una-continua-indexed-cocke.md §0.13.
 */
import type { UserRole } from '@/lib/navigation/types';

export type ScopeLevel = 'platform' | 'tenant' | 'team' | 'dept' | 'reports' | 'self';

export interface ScopeContext {
  /** Canonical evo role. Must be one of the 8 normalized values. */
  role: UserRole;
  /** Authenticated user's tenant id. `null` for platform users (SUPERUSER pre-impersonation). */
  tenantId: string | null;
  /** Authenticated user's employee id (FK to employees.id). `null` for platform users without employee link. */
  employeeId?: string | null;
  /** Optional org_unit / department id used by HR_MANAGER + DEPT_HEAD perimeters. */
  orgUnitId?: string | null;
}

export type EntityKind = 'employees' | 'reviews' | 'goals' | 'learning' | 'compensation';

export interface ScopeResult {
  /** Coarse scope label. Useful for telemetry + UI hint. */
  level: ScopeLevel;
  /** Prisma `where` fragment for the requested entity. Merge with caller-specific filters. */
  where: Record<string, unknown>;
  /** True if the caller should also wrap the call in withTenant(tenantId, ...). */
  requiresTenantWrap: boolean;
}

/** Resolve scope label from role + context only (entity-agnostic). */
export function resolveScopeLevel(ctx: ScopeContext): ScopeLevel {
  switch (ctx.role) {
    case 'SUPERUSER':
      return ctx.tenantId ? 'tenant' : 'platform';
    case 'TENANT_OWNER':
    case 'IT_ADMIN':
    case 'HR_DIRECTOR':
      return 'tenant';
    case 'HR_MANAGER':
      return ctx.orgUnitId ? 'team' : 'tenant';
    case 'DEPT_HEAD':
      return ctx.orgUnitId ? 'dept' : 'tenant';
    case 'LINE_MANAGER':
      return ctx.employeeId ? 'reports' : 'self';
    case 'EMPLOYEE':
      return 'self';
  }
}

/**
 * Build the Prisma `where` fragment for a given entity kind under the user's scope.
 *
 * Caller pattern:
 *   const scope = resolveScope({ role, tenantId, employeeId }, 'reviews');
 *   if (scope.requiresTenantWrap && tenantId) {
 *     return withTenant(tenantId, (tx) => tx.performance_reviews.findMany({ where: scope.where }));
 *   }
 */
export function resolveScope(ctx: ScopeContext, entity: EntityKind): ScopeResult {
  const level = resolveScopeLevel(ctx);
  const where: Record<string, unknown> = {};
  const requiresTenantWrap = level !== 'platform';

  if (level === 'platform') {
    return { level, where, requiresTenantWrap };
  }

  // tenant scope is the floor for everything below platform
  if (ctx.tenantId) {
    where.tenant_id = ctx.tenantId;
  }

  switch (entity) {
    case 'employees':
      if (level === 'dept' && ctx.orgUnitId) {
        where.org_unit_id = ctx.orgUnitId;
      } else if (level === 'team' && ctx.orgUnitId) {
        where.org_unit_id = ctx.orgUnitId;
      } else if (level === 'reports' && ctx.employeeId) {
        where.manager_id = ctx.employeeId;
      } else if (level === 'self' && ctx.employeeId) {
        where.id = ctx.employeeId;
      }
      // employees rows always carry `deleted_at IS NULL` for active set — leave to caller
      break;

    case 'reviews':
      if (level === 'dept' || level === 'team') {
        if (ctx.orgUnitId) {
          where.employees = { org_unit_id: ctx.orgUnitId };
        }
      } else if (level === 'reports' && ctx.employeeId) {
        where.employees = { manager_id: ctx.employeeId };
      } else if (level === 'self' && ctx.employeeId) {
        where.employee_id = ctx.employeeId;
      }
      break;

    case 'goals':
      if (level === 'dept' || level === 'team') {
        if (ctx.orgUnitId) {
          where.org_unit_id = ctx.orgUnitId;
        }
      } else if (level === 'reports' && ctx.employeeId) {
        where.owner_employee = { manager_id: ctx.employeeId };
      } else if (level === 'self' && ctx.employeeId) {
        where.owner_employee_id = ctx.employeeId;
      }
      break;

    case 'learning':
      if (level === 'dept' || level === 'team') {
        if (ctx.orgUnitId) {
          where.employees = { org_unit_id: ctx.orgUnitId };
        }
      } else if (level === 'reports' && ctx.employeeId) {
        where.employees = { manager_id: ctx.employeeId };
      } else if (level === 'self' && ctx.employeeId) {
        where.employee_id = ctx.employeeId;
      }
      break;

    case 'compensation':
      if (level === 'dept' || level === 'team') {
        if (ctx.orgUnitId) {
          where.employees = { org_unit_id: ctx.orgUnitId };
        }
      } else if (level === 'reports' && ctx.employeeId) {
        where.employees = { manager_id: ctx.employeeId };
      } else if (level === 'self' && ctx.employeeId) {
        where.employee_id = ctx.employeeId;
      }
      break;
  }

  return { level, where, requiresTenantWrap };
}
