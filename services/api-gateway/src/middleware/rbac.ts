/**
 * RBP authorization middleware (P0 scope-cut port from legacy
 * `services/api-gateway/src/middleware/rbac.ts`, commit `26a8fe3`).
 *
 * Two surfaces:
 *
 * 1. `requirePermission(area, action)` — express middleware that rejects with
 *    403 if the caller's role lacks the requested permission. Reads from
 *    RBPCacheService (DB-backed, TTL-cached).
 *
 * 2. `getScopeCondition(scope, ctx)` — pure function that returns a Prisma
 *    `where` fragment to scope a query to the caller's authority. Caller
 *    spreads it into a findMany/findFirst args. Used post-`requirePermission`
 *    when the row visibility depends on scope (HIERARCHY, DEPARTMENT, SELF, etc.).
 *
 * Note: this is NOT a DAC layer; the database RLS (303 policies present in evo
 * baseline) is the authoritative defense. requirePermission is the application-
 * layer **fast-deny** so we don't even hit the DB if the role lacks permission.
 */
import type { Request, Response, NextFunction } from 'express';
import type { Action, ScopeType, RBPCacheService } from '../services/rbp-cache.js';

export interface SessionUserShape {
  id?: string;
  role?: string;
  tenantId?: string | null;
  employeeId?: string | null;
  managedDepartmentIds?: string[];
}

interface RbacSessionEnvelope {
  user?: SessionUserShape;
}

/**
 * Build a requirePermission middleware bound to a cache. Factory pattern so
 * tests can inject a mock cache without touching the module-level singleton.
 *
 * The session is read off `req.session` via a structural cast — Express's own
 * `Request.session` (typed by Auth.js v5) has a `Session | null` shape that
 * intersects loosely with the `{ user?: SessionUserShape }` we need, so we
 * narrow at the read site instead of merging interfaces.
 */
export function buildRequirePermission(cache: RBPCacheService) {
  return function requirePermission(area: string, action: Action) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const session = (req as Request & { session?: RbacSessionEnvelope | null }).session;
      const role = session?.user?.role;
      if (!role) {
        res.status(401).json({ error: 'unauthorized', reason: 'no_session' });
        return;
      }

      try {
        await cache.ensureLoaded();
      } catch (err) {
        res.status(503).json({ error: 'rbac_unavailable', reason: (err as Error).message });
        return;
      }

      if (!cache.isAllowed(role, area, action)) {
        res.status(403).json({ error: 'forbidden', area, action, role });
        return;
      }

      next();
    };
  };
}

/**
 * Scope context: who is asking, with what authority. Caller resolves this
 * from the session + DB lookups (e.g. managedDepartmentIds via org_units).
 */
export interface ScopeContext {
  userId?: string;
  employeeId?: string | null;
  tenantId?: string | null;
  managedDepartmentIds?: string[];
}

/**
 * Prisma-style where fragment. We use a permissive structural type (Record)
 * because the actual Prisma input type depends on the model — caller composes
 * with their own `where`.
 */
export type ScopeCondition = Record<string, unknown>;

/**
 * Return a Prisma `where` fragment that limits rows to what `scope` allows
 * for the given context. Returns `{}` for PLATFORM (no filter), or a never-match
 * sentinel `{ id: '__deny_all__' }` if context is missing required fields.
 */
export function getScopeCondition(scope: ScopeType, ctx: ScopeContext): ScopeCondition {
  switch (scope) {
    case 'PLATFORM':
      return {};
    case 'TENANT':
      if (!ctx.tenantId) return { id: '__deny_all__' };
      return { tenant_id: ctx.tenantId };
    case 'DEPARTMENT':
      if (!ctx.managedDepartmentIds || ctx.managedDepartmentIds.length === 0) {
        return { id: '__deny_all__' };
      }
      return { department_id: { in: ctx.managedDepartmentIds } };
    case 'HIERARCHY':
      if (!ctx.employeeId) return { id: '__deny_all__' };
      return { manager_id: ctx.employeeId };
    case 'TEAM':
      if (!ctx.employeeId) return { id: '__deny_all__' };
      return { team_lead_id: ctx.employeeId };
    case 'SELF':
      if (!ctx.employeeId) return { id: '__deny_all__' };
      return { id: ctx.employeeId };
  }
}
