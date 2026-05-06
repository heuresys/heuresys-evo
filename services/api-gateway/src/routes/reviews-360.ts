import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * 360-Degree Reviews routes — Pack 4 (legacy import).
 *
 * Tenant-scoped CRUD over `feedback_360` + 2 view aggregates
 * (v_360_feedback_summary, v_360_response_rates). RBP gating via EMPLOYEES area.
 *
 * NOTE: legacy mounts at `/360-reviews` but evo uses `/reviews-360` (Express
 * route segments cannot start with a number safely in some configs · see
 * router export name below).
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
  target_employee_id: z.string().uuid().optional(),
  reviewer_employee_id: z.string().uuid().optional(),
  status: z.string().optional(),
  review_cycle_id: z.string().uuid().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  target_employee_id: z.string().uuid(),
  reviewer_employee_id: z.string().uuid(),
  review_cycle_id: z.string().uuid().optional(),
  relationship_type: z.string().optional(),
  overall_rating: z.number().optional(),
  strengths: z.string().optional(),
  areas_for_improvement: z.string().optional(),
  is_anonymous: z.boolean().optional(),
  status: z.string().optional(),
  questionnaire_id: z.string().uuid().optional(),
  performance_review_id: z.string().uuid().optional(),
  request_id: z.string().uuid().optional(),
  question_responses: z.record(z.unknown()).optional(),
  sentiment_score: z.number().optional(),
  submission_time_seconds: z.number().int().optional(),
});

const UpdateBody = z
  .object({
    relationship_type: z.string().optional(),
    overall_rating: z.number().optional(),
    strengths: z.string().optional(),
    areas_for_improvement: z.string().optional(),
    is_anonymous: z.boolean().optional(),
    status: z.string().optional(),
    completed_at: z.string().optional(),
    question_responses: z.record(z.unknown()).optional(),
    sentiment_score: z.number().optional(),
    submission_time_seconds: z.number().int().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const reviews360Router = Router();

reviews360Router.get(
  '/summary',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM v_360_feedback_summary WHERE tenant_id = $1::uuid`,
          req.tenantId!
        );
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

reviews360Router.get(
  '/response-rates',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM v_360_response_rates WHERE tenant_id = $1::uuid`,
          req.tenantId!
        );
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

reviews360Router.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const parsed = ListQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const { target_employee_id, reviewer_employee_id, status, review_cycle_id, limit, offset } =
        parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 500);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(tenantId, async (tx) => {
        const params: (string | number)[] = [tenantId];
        let sql = `SELECT f.*,
                          te.first_name || ' ' || te.last_name AS target_employee_name,
                          re.first_name || ' ' || re.last_name AS reviewer_employee_name
                   FROM feedback_360 f
                   LEFT JOIN employees te ON f.target_employee_id = te.id
                   LEFT JOIN employees re ON f.reviewer_employee_id = re.id
                   WHERE f.tenant_id = $1::uuid`;
        let idx = 2;
        if (target_employee_id) {
          sql += ` AND f.target_employee_id = $${idx}::uuid`;
          params.push(target_employee_id);
          idx++;
        }
        if (reviewer_employee_id) {
          sql += ` AND f.reviewer_employee_id = $${idx}::uuid`;
          params.push(reviewer_employee_id);
          idx++;
        }
        if (status) {
          sql += ` AND f.status = $${idx}`;
          params.push(status);
          idx++;
        }
        if (review_cycle_id) {
          sql += ` AND f.review_cycle_id = $${idx}::uuid`;
          params.push(review_cycle_id);
          idx++;
        }
        sql += ` ORDER BY f.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM feedback_360 WHERE tenant_id = $1::uuid`,
          tenantId
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

reviews360Router.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid review ID format' });
        return;
      }

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT f.*,
                  te.first_name || ' ' || te.last_name AS target_employee_name,
                  re.first_name || ' ' || re.last_name AS reviewer_employee_name
           FROM feedback_360 f
           LEFT JOIN employees te ON f.target_employee_id = te.id
           LEFT JOIN employees re ON f.reviewer_employee_id = re.id
           WHERE f.id = $1::uuid AND f.tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: '360 review not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

reviews360Router.post(
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
          `INSERT INTO feedback_360 (
             tenant_id, target_employee_id, reviewer_employee_id,
             review_cycle_id, relationship_type, overall_rating,
             strengths, areas_for_improvement, is_anonymous, status,
             questionnaire_id, performance_review_id, request_id,
             question_responses, sentiment_score, submission_time_seconds
           ) VALUES ($1::uuid, $2::uuid, $3::uuid, $4::uuid, $5, $6, $7, $8, $9, $10, $11::uuid, $12::uuid, $13::uuid, $14::jsonb, $15, $16)
           RETURNING *`,
          req.tenantId!,
          d.target_employee_id,
          d.reviewer_employee_id,
          d.review_cycle_id ?? null,
          d.relationship_type ?? null,
          d.overall_rating ?? null,
          d.strengths ?? null,
          d.areas_for_improvement ?? null,
          d.is_anonymous ?? false,
          d.status ?? 'pending',
          d.questionnaire_id ?? null,
          d.performance_review_id ?? null,
          d.request_id ?? null,
          d.question_responses ? JSON.stringify(d.question_responses) : null,
          d.sentiment_score ?? null,
          d.submission_time_seconds ?? null
        );
      })) as unknown[];

      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

reviews360Router.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid review ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }

      const allowedFields = [
        'relationship_type',
        'overall_rating',
        'strengths',
        'areas_for_improvement',
        'is_anonymous',
        'status',
        'completed_at',
        'sentiment_score',
        'submission_time_seconds',
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
      if (parsed.data.question_responses !== undefined) {
        updates.push(`question_responses = $${idx}::jsonb`);
        values.push(JSON.stringify(parsed.data.question_responses));
        idx++;
      }
      if (updates.length === 0) {
        res.status(400).json({ error: 'invalid_input', message: 'No fields to update' });
        return;
      }

      const result = await withTenant(req.tenantId!, async (tx) => {
        const existing = (await tx.$queryRawUnsafe(
          `SELECT id FROM feedback_360 WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        )) as Array<{ id: string }>;
        if (existing.length === 0) return null;
        const updated = (await tx.$queryRawUnsafe(
          `UPDATE feedback_360 SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
          ...values,
          id,
          req.tenantId!
        )) as unknown[];
        return updated[0] ?? null;
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: '360 review not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

reviews360Router.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid review ID format' });
        return;
      }

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `DELETE FROM feedback_360 WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
          id,
          req.tenantId!
        );
      })) as Array<{ id: string }>;

      if (rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: '360 review not found' });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);
