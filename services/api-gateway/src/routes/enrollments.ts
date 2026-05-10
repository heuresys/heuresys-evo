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
 * Enrollments routes — Pack 6.
 *
 * Tenant-scoped via JOIN courses (course_enrollments has no tenant_id direct).
 * Two-resource: course_enrollments + learning_path_enrollments.
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
  employee_id: z.string().uuid().optional(),
  status: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateCourseEnrollmentBody = z.object({
  course_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  status: z.string().default('enrolled'),
  enrolled_at: z.string().optional(),
});

const UpdateBody = z
  .object({
    status: z.string().optional(),
    progress_percent: z.number().optional(),
    completed_at: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const enrollmentsRouter = Router();

enrollmentsRouter.get(
  '/courses',
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
      const { employee_id, status, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT ce.*, c.title AS course_title
                   FROM course_enrollments ce
                   JOIN courses c ON ce.course_id = c.id
                   WHERE c.tenant_id = $1::uuid`;
        let idx = 2;
        if (employee_id) {
          sql += ` AND ce.employee_id = $${idx}::uuid`;
          params.push(employee_id);
          idx++;
        }
        if (status) {
          sql += ` AND ce.status = $${idx}`;
          params.push(status);
          idx++;
        }
        sql += ` ORDER BY ce.enrolled_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);
        const rows = await tx.$queryRawUnsafe(sql, ...params);
        return rows;
      });

      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

enrollmentsRouter.post(
  '/courses',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const parsed = CreateCourseEnrollmentBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const d = parsed.data;
      const courseRows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT id FROM courses WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          d.course_id,
          req.tenantId!
        );
      })) as Array<{ id: string }>;
      if (courseRows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Course not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'USER',
          resourceType: 'course_enrollments',
          resourceId: 'pending',
          resourceName: `enrollment:${d.course_id}:${d.employee_id}`,
          newValue: d,
          metadata: { source: 'api-gateway:enrollments.POST_courses' },
        },
        async (tx) => {
          const created = (await tx.$queryRawUnsafe(
            `INSERT INTO course_enrollments
               (course_id, employee_id, status, enrolled_at, created_at, updated_at)
             VALUES ($1::uuid, $2::uuid, $3, $4::timestamptz, NOW(), NOW())
             RETURNING *`,
            d.course_id,
            d.employee_id,
            d.status,
            d.enrolled_at ?? new Date().toISOString()
          )) as unknown[];
          return created[0] ?? null;
        }
      );
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

enrollmentsRouter.patch(
  '/courses/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid enrollment ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = ['status', 'progress_percent', 'completed_at'] as const;
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
          `SELECT ce.* FROM course_enrollments ce
           JOIN courses c ON ce.course_id = c.id
           WHERE ce.id = $1::uuid AND c.tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Enrollment not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'USER',
          resourceType: 'course_enrollments',
          resourceId: id,
          resourceName: `enrollment:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:enrollments.PATCH_courses' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE course_enrollments SET ${updates.join(', ')} WHERE id = $${idx}::uuid RETURNING *`,
            ...values,
            id
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

enrollmentsRouter.delete(
  '/courses/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid enrollment ID format' });
        return;
      }
      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT ce.* FROM course_enrollments ce
           JOIN courses c ON ce.course_id = c.id
           WHERE ce.id = $1::uuid AND c.tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Enrollment not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'USER',
          resourceType: 'course_enrollments',
          resourceId: id,
          resourceName: `enrollment:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:enrollments.DELETE_courses' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM course_enrollments ce
             USING courses c
             WHERE ce.course_id = c.id
               AND ce.id = $1::uuid AND c.tenant_id = $2::uuid
             RETURNING ce.id`,
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
