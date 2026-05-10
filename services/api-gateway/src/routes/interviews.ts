import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/**
 * Interviews routes — Pack 5 (legacy import).
 *
 * Tenant-scoped CRUD over `interviews`. Skip dichiarato per scheduling logic
 * (slot management, calendar integration) — può essere portato successivamente.
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
  interview_type: z.string().max(50),
  scheduled_at: z.string(),
  duration_minutes: z.number().int().optional(),
  interviewer_id: z.string().uuid().optional(),
  status: z.string().default('scheduled'),
  notes: z.string().optional(),
});

const UpdateBody = z
  .object({
    interview_type: z.string().max(50).optional(),
    scheduled_at: z.string().optional(),
    duration_minutes: z.number().int().optional(),
    interviewer_id: z.string().uuid().nullable().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
    rating: z.number().optional(),
    feedback: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const interviewsRouter = Router();

interviewsRouter.get(
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
        let sql = `SELECT * FROM interviews WHERE tenant_id = $1::uuid`;
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
        sql += ` ORDER BY scheduled_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM interviews WHERE tenant_id = $1::uuid`,
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

interviewsRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid interview ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM interviews WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Interview not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

interviewsRouter.post(
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
          category: 'USER',
          resourceType: 'interviews',
          resourceId: 'pending',
          resourceName: `interview:${d.candidate_id}:${d.scheduled_at}`,
          newValue: d,
          metadata: { source: 'api-gateway:interviews.POST' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `INSERT INTO interviews
               (tenant_id, candidate_id, interview_type, scheduled_at, duration_minutes,
                interviewer_id, status, notes, created_at, updated_at)
             VALUES ($1::uuid, $2::uuid, $3, $4::timestamptz, $5, $6::uuid, $7, $8, NOW(), NOW())
             RETURNING *`,
            req.tenantId!,
            d.candidate_id,
            d.interview_type,
            d.scheduled_at,
            d.duration_minutes ?? null,
            d.interviewer_id ?? null,
            d.status,
            d.notes ?? null
          )) as unknown[];
        }
      );
      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

interviewsRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid interview ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = [
        'interview_type',
        'scheduled_at',
        'duration_minutes',
        'interviewer_id',
        'status',
        'notes',
        'rating',
        'feedback',
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
          `SELECT * FROM interviews WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Interview not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'USER',
          resourceType: 'interviews',
          resourceId: id,
          resourceName: `interview:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:interviews.PATCH' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE interviews SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
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

interviewsRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid interview ID format' });
        return;
      }
      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM interviews WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Interview not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'USER',
          resourceType: 'interviews',
          resourceId: id,
          resourceName: `interview:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:interviews.DELETE' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM interviews WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
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
