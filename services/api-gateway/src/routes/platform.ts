import { Router, type Request, type Response, type NextFunction } from 'express';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';

/**
 * Platform routes — Pack 8.
 *
 * Read-only platform-level configuration (cross-tenant reference data).
 * Gated by EMPLOYEES.view (tenant users can read available platform features).
 *
 * Skip dichiarato: cached() helper TTL deferred (stesso Pack 1c · ROI senza
 * load testing).
 */

async function checkRead(req: Request, res: Response): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'EMPLOYEES', 'view')) {
    res.status(403).json({ error: 'forbidden', area: 'EMPLOYEES', action: 'view' });
    return false;
  }
  return true;
}

export const platformRouter = Router();

platformRouter.get(
  '/features',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM platform_features WHERE is_active = true ORDER BY name`
        );
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

platformRouter.get(
  '/pages',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM platform_pages WHERE is_active = true ORDER BY sort_order, name`
        );
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

platformRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        const rows = (await tx.$queryRawUnsafe(
          `SELECT
             (SELECT COUNT(*)::int FROM platform_features WHERE is_active = true) AS active_features,
             (SELECT COUNT(*)::int FROM platform_pages WHERE is_active = true) AS active_pages`
        )) as Array<Record<string, number>>;
        return rows[0] ?? {};
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);
