import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getScopeCondition } from '../middleware/rbac.js';
import { getRBPCache } from '../services/rbp-cache.js';
import type { ScopeType } from '../services/rbp-cache.js';

/**
 * Performance reviews — RTG Phase 4 task 4.10 P0.
 *
 * Read-only list scoped by RBP. Editing/calibration/360 reviews come post-MVP
 * (currently legacy-only domain in scope decision H Hybrid).
 */

interface RbacSessionEnvelope {
  user?: {
    id?: string;
    role?: string;
    tenantId?: string | null;
    employeeId?: string | null;
    managedDepartmentIds?: string[];
  };
}

function getCtx(req: Request) {
  const session = (req as Request & { session?: RbacSessionEnvelope }).session;
  return {
    role: session?.user?.role ?? '',
    employeeId: session?.user?.employeeId ?? null,
    tenantId: req.tenantId ?? null,
    managedDepartmentIds: session?.user?.managedDepartmentIds ?? [],
  };
}

const ListQuerySchema = z.object({
  status: z.enum(['draft', 'submitted', 'approved', 'acknowledged']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const performanceReviewsRouter = Router();

performanceReviewsRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const ctx = getCtx(req);
      if (!cache.isAllowed(ctx.role, 'PERFORMANCE_REVIEWS', 'view')) {
        res.status(403).json({ error: 'forbidden', area: 'PERFORMANCE_REVIEWS', action: 'view' });
        return;
      }
      const { status, limit } = ListQuerySchema.parse(req.query);
      const perm = cache.getPermission(ctx.role, 'PERFORMANCE_REVIEWS');
      const scope = (perm?.scopeType ?? 'SELF') as ScopeType;
      const scopeCond = getScopeCondition(scope, ctx);

      const data = await withTenant(req.tenantId!, async (tx) => {
        if ('id' in scopeCond && scopeCond['id'] === '__deny_all__') return [];
        const params: Array<string | null | number> = [];
        let whereClause = 'WHERE 1=1';
        if (scope === 'SELF' && ctx.employeeId) {
          params.push(ctx.employeeId);
          whereClause += ` AND employee_id = $${params.length}::uuid`;
        } else if (scope === 'HIERARCHY' && ctx.employeeId) {
          params.push(ctx.employeeId);
          whereClause += ` AND reviewer_id = $${params.length}::uuid`;
        }
        if (status) {
          params.push(status);
          whereClause += ` AND status = $${params.length}`;
        }
        params.push(limit);
        return tx.$queryRawUnsafe(
          `SELECT id, employee_id, reviewer_id, review_period_start, review_period_end,
                  review_type, overall_rating, status, submitted_at, created_at
           FROM performance_reviews
           ${whereClause}
           ORDER BY review_period_end DESC
           LIMIT $${params.length}`,
          ...params
        );
      });

      res.json({ data, scope });
    } catch (err) {
      next(err);
    }
  }
);
