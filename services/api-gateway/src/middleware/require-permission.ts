import type { Request, Response, NextFunction } from 'express';
import { buildRequirePermission } from './rbac.js';
import { getRBPCache } from '../services/rbp-cache.js';
import type { Action } from '../services/rbp-cache.js';

export function requirePermission(area: string, action: Action) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const middleware = buildRequirePermission(getRBPCache())(area, action);
    await middleware(req, res, next);
  };
}
