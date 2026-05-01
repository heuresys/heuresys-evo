import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';

/**
 * Audit logs — RTG Phase 4 task 4.10 P0 (compliance baseline).
 *
 * Read-only list scoped to TENANT level. RBP area: AUDIT.
 * Note: insert into audit_logs happens via DB-side triggers (ADR-011 task 4.13)
 * + on critical mutations server-side. This route is consumer-only.
 */

interface RbacSessionEnvelope {
  user?: { id?: string; role?: string; tenantId?: string | null };
}

const ListQuerySchema = z.object({
  category: z
    .enum([
      'AUTH',
      'USER',
      'EMPLOYEE',
      'TENANT',
      'GOAL',
      'REVIEW',
      'FEEDBACK',
      'COMPENSATION',
      'DOCUMENT',
      'REPORT',
      'CONFIG',
      'SYSTEM',
    ])
    .optional(),
  action: z
    .enum([
      'CREATE',
      'READ',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'EXPORT',
      'IMPORT',
      'PERMISSION_CHANGE',
      'CONFIG_CHANGE',
      'DATA_ACCESS',
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const auditLogsRouter = Router();

auditLogsRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const session = (req as Request & { session?: RbacSessionEnvelope }).session;
      const role = session?.user?.role ?? '';
      if (!cache.isAllowed(role, 'AUDIT', 'view')) {
        res.status(403).json({ error: 'forbidden', area: 'AUDIT', action: 'view' });
        return;
      }
      const { category, action, limit } = ListQuerySchema.parse(req.query);

      const data = await withTenant(req.tenantId!, async (tx) => {
        const params: Array<string | number> = [];
        let whereClause = 'WHERE 1=1';
        if (category) {
          params.push(category);
          whereClause += ` AND category = $${params.length}`;
        }
        if (action) {
          params.push(action);
          whereClause += ` AND action = $${params.length}`;
        }
        params.push(limit);
        return tx.$queryRawUnsafe(
          `SELECT id, "timestamp", user_id, user_email, user_role, action, category,
                  resource_type, resource_id, description, success, created_at
           FROM audit_logs
           ${whereClause}
           ORDER BY created_at DESC
           LIMIT $${params.length}`,
          ...params
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);
