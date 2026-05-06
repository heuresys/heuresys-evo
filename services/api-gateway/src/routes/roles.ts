import { Router, type Request, type Response, type NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/require-permission.js';
import { buildRoleHierarchy } from '../middleware/roles.js';

export const rolesRouter = Router();

rolesRouter.get(
  '/',
  requireAuth,
  requirePermission('SECURITY', 'view'),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ success: true, data: buildRoleHierarchy() });
    } catch (err) {
      next(err);
    }
  }
);
