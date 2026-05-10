import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/** Learning Paths routes — Pack 6. */

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

async function checkWrite(
  req: Request,
  res: Response,
  action: 'create' | 'edit' | 'delete'
): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'EMPLOYEES', action)) {
    res.status(403).json({ error: 'forbidden', area: 'EMPLOYEES', action });
    return false;
  }
  return true;
}

const ListQuery = z.object({
  is_active: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  estimated_duration_hours: z.number().optional(),
  difficulty_level: z.string().max(50).optional(),
  is_active: z.boolean().default(true),
});

const UpdateBody = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    estimated_duration_hours: z.number().optional(),
    difficulty_level: z.string().max(50).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const learningPathsRouter = Router();

learningPathsRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const parsed = ListQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const { is_active, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT * FROM learning_paths WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (is_active === 'true') sql += ` AND is_active = true`;
        if (is_active === 'false') sql += ` AND is_active = false`;
        sql += ` ORDER BY name LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);
        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM learning_paths WHERE tenant_id = $1::uuid`,
          req.tenantId!
        )) as Array<{ count: number }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({ data: result.rows, meta: { total: result.total, limit: lim, offset: off } });
    } catch (err) {
      next(err);
    }
  }
);

learningPathsRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid path ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM learning_paths WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Learning path not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

learningPathsRouter.post(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const parsed = CreateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const d = parsed.data;
      const actor = buildActor(req, req.tenantId!);
      const { result: rows } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'SYSTEM',
          resourceType: 'learning_paths',
          resourceId: 'pending',
          resourceName: `learning-path:${d.name}`,
          newValue: d,
          metadata: { source: 'api-gateway:learning-paths.POST' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `INSERT INTO learning_paths
               (tenant_id, name, description, estimated_duration_hours, difficulty_level, is_active, created_at, updated_at)
             VALUES ($1::uuid, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING *`,
            req.tenantId!,
            d.name,
            d.description ?? null,
            d.estimated_duration_hours ?? null,
            d.difficulty_level ?? null,
            d.is_active
          )) as unknown[];
        }
      );
      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

learningPathsRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid path ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = [
        'name',
        'description',
        'estimated_duration_hours',
        'difficulty_level',
        'is_active',
      ] as const;
      const updates: string[] = [];
      const values: unknown[] = [];
      let idx = 1;
      for (const f of allowedFields) {
        const v = (parsed.data as Record<string, unknown>)[f];
        if (v !== undefined) {
          updates.push(`${f} = $${idx}`);
          values.push(v);
          idx++;
        }
      }
      updates.push('updated_at = NOW()');

      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM learning_paths WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Learning path not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'SYSTEM',
          resourceType: 'learning_paths',
          resourceId: id,
          resourceName: `learning-path:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:learning-paths.PATCH' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE learning_paths SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
            ...values,
            id,
            req.tenantId!
          )) as unknown[];
          return updated[0] ?? null;
        }
      );
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

learningPathsRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid path ID format' });
        return;
      }
      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM learning_paths WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Learning path not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'SYSTEM',
          resourceType: 'learning_paths',
          resourceId: id,
          resourceName: `learning-path:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:learning-paths.DELETE' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM learning_paths WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
            id,
            req.tenantId!
          );
        }
      );
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);
