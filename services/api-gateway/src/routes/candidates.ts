import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { escapeILIKE } from '../utils/sql-safety.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/**
 * Recruiting Candidates routes — Pack 5 (legacy import).
 *
 * Tenant-scoped CRUD over `recruiting_candidates`. Skip dichiarato per business
 * logic specific (advance/reject lifecycle endpoint) — può essere portato
 * successivamente se serve workflow UI.
 *
 * Endpoints:
 *   - GET /candidates              — list with stage filter
 *   - GET /candidates/stats        — stage breakdown
 *   - GET /candidates/:id          — detail
 *   - POST /candidates             — create
 *   - PATCH /candidates/:id        — update
 *   - DELETE /candidates/:id       — delete
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
  stage: z.string().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  current_company: z.string().max(255).optional(),
  job_title: z.string().max(255).optional(),
  experience_years: z.number().int().optional(),
  stage: z.string().default('new'),
  rating: z.number().optional(),
  source: z.string().max(100).optional(),
});

const UpdateBody = z
  .object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().max(255).optional(),
    phone: z.string().max(50).optional(),
    current_company: z.string().max(255).optional(),
    job_title: z.string().max(255).optional(),
    experience_years: z.number().int().optional(),
    stage: z.string().optional(),
    rating: z.number().optional(),
    source: z.string().max(100).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const candidatesRouter = Router();

candidatesRouter.get(
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
             COUNT(*) FILTER (WHERE stage = 'new')::int AS new_count,
             COUNT(*) FILTER (WHERE stage = 'screening')::int AS screening,
             COUNT(*) FILTER (WHERE stage = 'interview')::int AS interview,
             COUNT(*) FILTER (WHERE stage = 'offer')::int AS offer,
             COUNT(*) FILTER (WHERE stage = 'hired')::int AS hired,
             COUNT(*) FILTER (WHERE stage = 'rejected')::int AS rejected,
             ROUND(AVG(rating)::numeric, 1) AS avg_rating
           FROM recruiting_candidates WHERE tenant_id = $1::uuid`,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      res.json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

candidatesRouter.get(
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
      const { stage, source, search, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT id, first_name, last_name, email, phone, current_company,
                          job_title, experience_years, stage, rating, source, created_at
                   FROM recruiting_candidates WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (stage) {
          sql += ` AND stage = $${idx}`;
          params.push(stage);
          idx++;
        }
        if (source) {
          sql += ` AND source = $${idx}`;
          params.push(source);
          idx++;
        }
        if (search) {
          sql += ` AND (first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx})`;
          params.push(`%${escapeILIKE(search)}%`);
          idx++;
        }
        sql += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM recruiting_candidates WHERE tenant_id = $1::uuid`,
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

candidatesRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid candidate ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM recruiting_candidates WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Candidate not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

candidatesRouter.post(
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
          resourceType: 'recruiting_candidates',
          resourceId: 'pending',
          resourceName: `${d.first_name} ${d.last_name} (${d.email})`,
          newValue: d,
          metadata: { source: 'api-gateway:candidates.POST' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `INSERT INTO recruiting_candidates
               (tenant_id, first_name, last_name, email, phone, current_company, job_title,
                experience_years, stage, rating, source, created_at, updated_at)
             VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
             RETURNING *`,
            req.tenantId!,
            d.first_name,
            d.last_name,
            d.email,
            d.phone ?? null,
            d.current_company ?? null,
            d.job_title ?? null,
            d.experience_years ?? null,
            d.stage,
            d.rating ?? null,
            d.source ?? null
          )) as unknown[];
        }
      );
      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

candidatesRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid candidate ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'current_company',
        'job_title',
        'experience_years',
        'stage',
        'rating',
        'source',
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
          `SELECT * FROM recruiting_candidates WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Candidate not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'USER',
          resourceType: 'recruiting_candidates',
          resourceId: id,
          resourceName: `candidate:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:candidates.PATCH' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE recruiting_candidates SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
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

candidatesRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid candidate ID format' });
        return;
      }
      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM recruiting_candidates WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Candidate not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'USER',
          resourceType: 'recruiting_candidates',
          resourceId: id,
          resourceName: `candidate:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:candidates.DELETE' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM recruiting_candidates WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
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
