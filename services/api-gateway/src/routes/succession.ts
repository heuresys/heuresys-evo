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
 * Succession Planning routes — Pack 3 (legacy import).
 *
 * Tenant-scoped CRUD over `critical_roles` + nested `succession_candidates`.
 *
 * RBP gating: `EMPLOYEES.view` (read) · `EMPLOYEES.create | edit | delete`
 * (write). Talent area gates piggy-back on EMPLOYEES per coerenza con Pack 2.
 *
 * Endpoints:
 *   - GET /succession/stats                          — global stats
 *   - GET /succession/critical-roles                 — list with filters
 *   - GET /succession/critical-roles/:id             — detail with candidates
 *   - POST /succession/critical-roles                — create role
 *   - PATCH /succession/critical-roles/:id           — update role
 *   - DELETE /succession/critical-roles/:id          — delete role
 *   - GET /succession/critical-roles/:id/candidates  — candidates list
 *   - POST /succession/critical-roles/:id/candidates — add candidate
 *   - PATCH /succession/candidates/:id               — update candidate
 *   - DELETE /succession/candidates/:id              — delete candidate
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
  department: z.string().optional(),
  succession_status: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateRoleBody = z.object({
  role_name: z.string().min(1).max(255),
  department: z.string().max(255).optional(),
  current_incumbent_id: z.string().uuid().optional(),
  criticality_level: z.enum(['Low', 'Medium', 'High', 'Critical']).default('High'),
  impact_if_vacant: z.string().optional(),
  time_to_fill_estimate: z.string().max(100).optional(),
  succession_status: z.enum(['ready', 'developing', 'at_risk', 'no_successor']).default('at_risk'),
});

const UpdateRoleBody = z
  .object({
    role_name: z.string().min(1).max(255).optional(),
    department: z.string().max(255).optional(),
    current_incumbent_id: z.string().uuid().nullable().optional(),
    criticality_level: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    impact_if_vacant: z.string().optional(),
    time_to_fill_estimate: z.string().max(100).optional(),
    succession_status: z.enum(['ready', 'developing', 'at_risk', 'no_successor']).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

const CreateCandidateBody = z.object({
  candidate_employee_id: z.string().uuid(),
  readiness_level: z.enum(['ready_now', '1_2_years', '3_5_years', 'long_term']),
  rank_order: z.number().int().min(1).max(10).optional(),
  development_plan: z.string().optional(),
});

const UpdateCandidateBody = z
  .object({
    readiness_level: z.enum(['ready_now', '1_2_years', '3_5_years', 'long_term']).optional(),
    rank_order: z.number().int().min(1).max(10).optional(),
    development_plan: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const successionRouter = Router();

successionRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;

      const data = await withTenant(tenantId, async (tx) => {
        const roleRows = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total_critical_roles,
             COUNT(DISTINCT department)::int AS departments_covered
           FROM critical_roles WHERE tenant_id = $1::uuid`,
          tenantId
        )) as Array<Record<string, number>>;
        const candidateRows = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total_candidates,
             COUNT(DISTINCT sc.candidate_employee_id)::int AS unique_candidates,
             COUNT(DISTINCT sc.critical_role_id)::int AS roles_with_candidates
           FROM succession_candidates sc
           JOIN critical_roles cr ON sc.critical_role_id = cr.id
           WHERE cr.tenant_id = $1::uuid`,
          tenantId
        )) as Array<Record<string, number>>;
        return { ...(roleRows[0] ?? {}), ...(candidateRows[0] ?? {}) };
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

successionRouter.get(
  '/critical-roles',
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
      const { department, succession_status, limit, offset } = parsed.data;
      const lim = safeParseInt(limit, 100);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(tenantId, async (tx) => {
        const params: (string | number)[] = [tenantId];
        let sql = `SELECT cr.*,
                          e.first_name || ' ' || e.last_name AS current_incumbent_name,
                          (SELECT COUNT(*)::int FROM succession_candidates sc WHERE sc.critical_role_id = cr.id) AS candidate_count
                   FROM critical_roles cr
                   LEFT JOIN employees e ON cr.current_incumbent_id = e.id
                   WHERE cr.tenant_id = $1::uuid`;
        let idx = 2;
        if (department) {
          sql += ` AND cr.department = $${idx}`;
          params.push(department);
          idx++;
        }
        if (succession_status) {
          sql += ` AND cr.succession_status = $${idx}`;
          params.push(succession_status);
          idx++;
        }
        sql += ` ORDER BY cr.role_name LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM critical_roles WHERE tenant_id = $1::uuid`,
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

successionRouter.get(
  '/critical-roles/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid role ID format' });
        return;
      }

      const result = await withTenant(req.tenantId!, async (tx) => {
        const roleRows = (await tx.$queryRawUnsafe(
          `SELECT cr.*,
                  e.first_name || ' ' || e.last_name AS current_incumbent_name,
                  e.email AS current_incumbent_email
           FROM critical_roles cr
           LEFT JOIN employees e ON cr.current_incumbent_id = e.id
           WHERE cr.id = $1::uuid AND cr.tenant_id = $2::uuid`,
          id,
          req.tenantId!
        )) as Array<Record<string, unknown>>;
        if (roleRows.length === 0) return null;

        const candidates = await tx.$queryRawUnsafe(
          `SELECT sc.*,
                  e.first_name || ' ' || e.last_name AS candidate_name,
                  e.job_title AS candidate_current_role
           FROM succession_candidates sc
           JOIN employees e ON sc.candidate_employee_id = e.id
           WHERE sc.critical_role_id = $1::uuid
           ORDER BY sc.rank_order, sc.readiness_level DESC`,
          id
        );

        return { ...roleRows[0], candidates };
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Critical role not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

successionRouter.post(
  '/critical-roles',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const parsed = CreateRoleBody.safeParse(req.body);
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
          resourceType: 'critical_roles',
          resourceId: 'pending',
          resourceName: `critical-role:${d.role_name}`,
          newValue: d,
          metadata: { source: 'api-gateway:succession.POST_critical-roles' },
        },
        async (tx) => {
          return (await tx.$queryRawUnsafe(
            `INSERT INTO critical_roles
               (tenant_id, role_name, department, current_incumbent_id, criticality_level,
                impact_if_vacant, time_to_fill_estimate, succession_status, created_at, updated_at)
             VALUES ($1::uuid, $2, $3, $4::uuid, $5, $6, $7, $8, NOW(), NOW())
             RETURNING *`,
            req.tenantId!,
            d.role_name,
            d.department ?? null,
            d.current_incumbent_id ?? null,
            d.criticality_level,
            d.impact_if_vacant ?? null,
            d.time_to_fill_estimate ?? null,
            d.succession_status
          )) as unknown[];
        }
      );

      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

successionRouter.patch(
  '/critical-roles/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid role ID format' });
        return;
      }
      const parsed = UpdateRoleBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }

      const allowedFields = [
        'role_name',
        'department',
        'current_incumbent_id',
        'criticality_level',
        'impact_if_vacant',
        'time_to_fill_estimate',
        'succession_status',
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
          `SELECT * FROM critical_roles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Critical role not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'USER',
          resourceType: 'critical_roles',
          resourceId: id,
          resourceName: `critical-role:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:succession.PATCH_critical-roles' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE critical_roles SET ${updates.join(', ')} WHERE id = $${idx}::uuid RETURNING *`,
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

successionRouter.delete(
  '/critical-roles/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid role ID format' });
        return;
      }

      const existing = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM critical_roles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Critical role not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'USER',
          resourceType: 'critical_roles',
          resourceId: id,
          resourceName: `critical-role:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:succession.DELETE_critical-roles' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM critical_roles WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
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

successionRouter.get(
  '/critical-roles/:id/candidates',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid role ID format' });
        return;
      }

      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT sc.*,
                  e.first_name || ' ' || e.last_name AS candidate_name,
                  e.job_title
           FROM succession_candidates sc
           JOIN employees e ON sc.candidate_employee_id = e.id
           JOIN critical_roles cr ON sc.critical_role_id = cr.id
           WHERE sc.critical_role_id = $1::uuid AND cr.tenant_id = $2::uuid
           ORDER BY sc.rank_order, sc.readiness_level DESC`,
          id,
          req.tenantId!
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

successionRouter.post(
  '/critical-roles/:id/candidates',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const roleId = req.params['id'] as string;
      if (!isUUID(roleId)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid role ID format' });
        return;
      }
      const parsed = CreateCandidateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const d = parsed.data;

      const roleRows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT id FROM critical_roles WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          roleId,
          req.tenantId!
        );
      })) as Array<{ id: string }>;
      if (roleRows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Critical role not found' });
        return;
      }

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'USER',
          resourceType: 'succession_candidates',
          resourceId: 'pending',
          resourceName: `candidate:${roleId}:${d.candidate_employee_id}`,
          newValue: { critical_role_id: roleId, ...d },
          metadata: { source: 'api-gateway:succession.POST_candidates' },
        },
        async (tx) => {
          const created = (await tx.$queryRawUnsafe(
            `INSERT INTO succession_candidates
               (critical_role_id, candidate_employee_id, readiness_level, rank_order, development_plan, created_at, updated_at)
             VALUES ($1::uuid, $2::uuid, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            roleId,
            d.candidate_employee_id,
            d.readiness_level,
            d.rank_order ?? null,
            d.development_plan ?? null
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

successionRouter.patch(
  '/candidates/:id',
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
      const parsed = UpdateCandidateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }

      const allowedFields = ['readiness_level', 'rank_order', 'development_plan'] as const;
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
          `SELECT sc.* FROM succession_candidates sc
           JOIN critical_roles cr ON sc.critical_role_id = cr.id
           WHERE sc.id = $1::uuid AND cr.tenant_id = $2::uuid`,
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
          resourceType: 'succession_candidates',
          resourceId: id,
          resourceName: `candidate:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:succession.PATCH_candidates' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE succession_candidates SET ${updates.join(', ')} WHERE id = $${idx}::uuid RETURNING *`,
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

successionRouter.delete(
  '/candidates/:id',
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
          `SELECT sc.* FROM succession_candidates sc
           JOIN critical_roles cr ON sc.critical_role_id = cr.id
           WHERE sc.id = $1::uuid AND cr.tenant_id = $2::uuid`,
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
          resourceType: 'succession_candidates',
          resourceId: id,
          resourceName: `candidate:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:succession.DELETE_candidates' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM succession_candidates sc
             USING critical_roles cr
             WHERE sc.critical_role_id = cr.id
               AND sc.id = $1::uuid AND cr.tenant_id = $2::uuid
             RETURNING sc.id`,
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
