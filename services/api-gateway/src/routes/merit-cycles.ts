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
 * Merit Cycles routes — Pack 4 (legacy import).
 *
 * Tenant-scoped CRUD over `merit_cycles` + lifecycle transitions
 * (planning → active → completed/cancelled).
 *
 * RBP gating: `EMPLOYEES.view` (read) · `EMPLOYEES.create | edit | delete`
 * (write). Legacy uses 'COMPENSATION' area but evo doesn't have that area
 * defined in seed yet — uses EMPLOYEES as HR-domain umbrella.
 *
 * Skip dichiarato: GET /:id/recommendations — depende su `merit_recommendations`
 * table (not in allowlist · separate model).
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
  status: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  effective_date: z.string(),
  submission_deadline: z.string().optional(),
  approval_deadline: z.string().optional(),
  total_budget: z.number().optional(),
  min_increase_percent: z.number().optional(),
  max_increase_percent: z.number().optional(),
  guideline_matrix: z.unknown().optional(),
  created_by: z.string().uuid().optional(),
});

const UpdateBody = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    effective_date: z.string().optional(),
    submission_deadline: z.string().optional(),
    approval_deadline: z.string().optional(),
    total_budget: z.number().optional(),
    min_increase_percent: z.number().optional(),
    max_increase_percent: z.number().optional(),
    guideline_matrix: z.unknown().optional(),
    status: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const meritCyclesRouter = Router();

meritCyclesRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status = 'active')::int AS active,
             COUNT(*) FILTER (WHERE status = 'planning')::int AS planning,
             COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
             COALESCE(SUM(total_budget), 0)::numeric AS total_budget,
             COALESCE(SUM(budget_spent), 0)::numeric AS total_spent
           FROM merit_cycles WHERE tenant_id = $1::uuid`,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;

      res.json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.get(
  '/current',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM merit_cycles
           WHERE tenant_id = $1::uuid AND status IN ('planning', 'active')
           ORDER BY effective_date DESC
           LIMIT 1`,
          req.tenantId!
        );
      })) as unknown[];

      res.json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.get(
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
      const { status, limit, offset } = parsed.data;
      const lim = safeParseInt(limit, 100);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT * FROM merit_cycles WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (status) {
          sql += ` AND status = $${idx}`;
          params.push(status);
          idx++;
        }
        sql += ` ORDER BY effective_date DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM merit_cycles WHERE tenant_id = $1::uuid`,
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

meritCyclesRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cycle ID format' });
        return;
      }

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM merit_cycles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Merit cycle not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.post(
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
          category: 'COMPENSATION',
          resourceType: 'merit_cycles',
          resourceId: 'pending',
          resourceName: `merit-cycle:${d.name}`,
          newValue: d,
          metadata: { source: 'api-gateway:merit-cycles.POST' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `INSERT INTO merit_cycles
               (tenant_id, name, description, effective_date, submission_deadline,
                approval_deadline, total_budget, budget_spent, min_increase_percent,
                max_increase_percent, guideline_matrix, status, created_by, created_at, updated_at)
             VALUES ($1::uuid, $2, $3, $4::date, $5::date, $6::date, $7, 0, $8, $9, $10::jsonb, 'planning', $11::uuid, NOW(), NOW())
             RETURNING *`,
            req.tenantId!,
            d.name,
            d.description ?? null,
            d.effective_date,
            d.submission_deadline ?? null,
            d.approval_deadline ?? null,
            d.total_budget ?? null,
            d.min_increase_percent ?? null,
            d.max_increase_percent ?? null,
            d.guideline_matrix ? JSON.stringify(d.guideline_matrix) : null,
            d.created_by ?? null
          )) as unknown[];
        }
      );

      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cycle ID format' });
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
        'effective_date',
        'submission_deadline',
        'approval_deadline',
        'total_budget',
        'min_increase_percent',
        'max_increase_percent',
        'status',
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
      if (parsed.data.guideline_matrix !== undefined) {
        updates.push(`guideline_matrix = $${idx}::jsonb`);
        values.push(JSON.stringify(parsed.data.guideline_matrix));
        idx++;
      }
      updates.push('updated_at = NOW()');

      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM merit_cycles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Merit cycle not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'COMPENSATION',
          resourceType: 'merit_cycles',
          resourceId: id,
          resourceName: `merit-cycle:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:merit-cycles.PATCH' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE merit_cycles SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
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

meritCyclesRouter.post(
  '/:id/activate',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cycle ID format' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result: rows } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'COMPENSATION',
          resourceType: 'merit_cycles',
          resourceId: id,
          resourceName: `merit-cycle:${id}`,
          newValue: { status: 'active' },
          metadata: { source: 'api-gateway:merit-cycles.POST_activate' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `UPDATE merit_cycles SET status = 'active', updated_at = NOW()
             WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'planning'
             RETURNING *`,
            id,
            req.tenantId!
          )) as unknown[];
        }
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        res
          .status(404)
          .json({ error: 'not_found', message: 'Merit cycle not found or not in planning status' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.post(
  '/:id/complete',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cycle ID format' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result: rows } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'COMPENSATION',
          resourceType: 'merit_cycles',
          resourceId: id,
          resourceName: `merit-cycle:${id}`,
          newValue: { status: 'completed' },
          metadata: { source: 'api-gateway:merit-cycles.POST_complete' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `UPDATE merit_cycles SET status = 'completed', updated_at = NOW()
             WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'active'
             RETURNING *`,
            id,
            req.tenantId!
          )) as unknown[];
        }
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        res
          .status(404)
          .json({ error: 'not_found', message: 'Merit cycle not found or not active' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

meritCyclesRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cycle ID format' });
        return;
      }

      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM merit_cycles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Merit cycle not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'COMPENSATION',
          resourceType: 'merit_cycles',
          resourceId: id,
          resourceName: `merit-cycle:${id}`,
          oldValue: existing[0],
          newValue: { ...existing[0], status: 'cancelled' },
          metadata: { source: 'api-gateway:merit-cycles.DELETE' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `UPDATE merit_cycles SET status = 'cancelled', updated_at = NOW()
             WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
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
