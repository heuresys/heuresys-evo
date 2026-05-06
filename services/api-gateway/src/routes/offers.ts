import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * Recruiting Offers routes — Pack 5 (legacy import).
 *
 * Tenant-scoped CRUD over `recruiting_offers`. Skip dichiarato per approval
 * workflow (multi-stage signoff) — può essere portato successivamente.
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
  candidate_id: z.string().uuid().optional(),
  status: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  candidate_id: z.string().uuid(),
  position_title: z.string().min(1).max(255),
  base_salary: z.number(),
  start_date: z.string(),
  status: z.string().default('draft'),
  bonus: z.number().optional(),
  equity: z.string().optional(),
  benefits: z.string().optional(),
  expires_at: z.string().optional(),
});

const UpdateBody = z
  .object({
    position_title: z.string().min(1).max(255).optional(),
    base_salary: z.number().optional(),
    start_date: z.string().optional(),
    status: z.string().optional(),
    bonus: z.number().optional(),
    equity: z.string().optional(),
    benefits: z.string().optional(),
    expires_at: z.string().optional(),
    accepted_at: z.string().optional(),
    declined_at: z.string().optional(),
    decline_reason: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const offersRouter = Router();

offersRouter.get(
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
      const { candidate_id, status, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT * FROM recruiting_offers WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (candidate_id) {
          sql += ` AND candidate_id = $${idx}::uuid`;
          params.push(candidate_id);
          idx++;
        }
        if (status) {
          sql += ` AND status = $${idx}`;
          params.push(status);
          idx++;
        }
        sql += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM recruiting_offers WHERE tenant_id = $1::uuid`,
          req.tenantId!
        )) as Array<{ count: number }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({
        data: result.rows,
        meta: { total: result.total, limit: lim, offset: off },
      });
    } catch (err) {
      next(err);
    }
  }
);

offersRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid offer ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM recruiting_offers WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Offer not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

offersRouter.post(
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
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `INSERT INTO recruiting_offers
             (tenant_id, candidate_id, position_title, base_salary, start_date, status,
              bonus, equity, benefits, expires_at, created_at, updated_at)
           VALUES ($1::uuid, $2::uuid, $3, $4, $5::date, $6, $7, $8, $9, $10::timestamptz, NOW(), NOW())
           RETURNING *`,
          req.tenantId!,
          d.candidate_id,
          d.position_title,
          d.base_salary,
          d.start_date,
          d.status,
          d.bonus ?? null,
          d.equity ?? null,
          d.benefits ?? null,
          d.expires_at ?? null
        );
      })) as unknown[];
      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

offersRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid offer ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = [
        'position_title',
        'base_salary',
        'start_date',
        'status',
        'bonus',
        'equity',
        'benefits',
        'expires_at',
        'accepted_at',
        'declined_at',
        'decline_reason',
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

      const result = await withTenant(req.tenantId!, async (tx) => {
        const existing = (await tx.$queryRawUnsafe(
          `SELECT id FROM recruiting_offers WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        )) as Array<{ id: string }>;
        if (existing.length === 0) return null;
        const updated = (await tx.$queryRawUnsafe(
          `UPDATE recruiting_offers SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
          ...values,
          id,
          req.tenantId!
        )) as unknown[];
        return updated[0] ?? null;
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Offer not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

offersRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid offer ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `DELETE FROM recruiting_offers WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
          id,
          req.tenantId!
        );
      })) as Array<{ id: string }>;
      if (rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Offer not found' });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);
