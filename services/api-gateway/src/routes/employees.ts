import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import type { Prisma } from '../../prisma/generated/client/index.js';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';

export const employeesRouter = Router();

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  cursor: z.string().uuid().optional(),
});

employeesRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, cursor } = QuerySchema.parse(req.query);
      const tenantId = req.tenantId!;

      const findArgs: Prisma.employeesFindManyArgs = {
        take: limit,
        orderBy: { id: 'asc' },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      };

      const result = await withTenant(tenantId, async (tx) => {
        const [data, total] = await Promise.all([
          tx.employees.findMany(findArgs),
          tx.employees.count(),
        ]);
        return { data, total };
      });

      const nextCursor =
        result.data.length === limit
          ? result.data[result.data.length - 1]?.id ?? null
          : null;

      res.json({ data: result.data, nextCursor, total: result.total });
    } catch (err) {
      next(err);
    }
  }
);
