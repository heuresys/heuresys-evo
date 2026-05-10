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
 * Skill Assessments routes — Pack 2.4 (legacy import).
 *
 * Tenant-scoped CRUD over `employee_skill_assessments` (joined with
 * `employees` for tenant filter via `e.tenant_id = $tenantId`).
 *
 * RBP gating: `EMPLOYEES.view` (read), `EMPLOYEES.create | edit | delete`
 * (write). Assessment data is HR-domain bound to employees, so it shares
 * the EMPLOYEES area enforcement.
 *
 * Endpoints:
 *   - GET /skill-assessments/stats             — global counts + method/level breakdown
 *   - GET /skill-assessments                   — list with filters
 *   - GET /skill-assessments/employee/:id      — assessments per employee + summary
 *   - GET /skill-assessments/gaps              — assessments with gap >= min_gap
 *   - GET /skill-assessments/skills/summary    — group by skill_name
 *   - GET /skill-assessments/:id               — single detail
 *   - POST /skill-assessments                  — create assessment
 *   - PATCH /skill-assessments/:id             — update assessment
 *   - DELETE /skill-assessments/:id            — delete assessment
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
  employee_id: z.string().optional(),
  skill_name: z.string().optional(),
  method: z.string().optional(),
  has_gap: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateBody = z.object({
  employee_id: z.string().uuid(),
  skill_name: z.string().min(1).max(255),
  esco_skill_uri: z.string().max(255).optional(),
  assessed_level: z.number().int().min(0).max(10),
  required_level: z.number().int().min(0).max(10).optional(),
  assessment_date: z.string().optional(),
  assessment_method: z.string().max(50).optional(),
  assessed_by: z.string().uuid().optional(),
  evidence_notes: z.string().optional(),
  certification_url: z.string().max(255).optional(),
});

const UpdateBody = z
  .object({
    assessed_level: z.number().int().min(0).max(10).optional(),
    required_level: z.number().int().min(0).max(10).optional(),
    assessment_method: z.string().max(50).optional(),
    evidence_notes: z.string().optional(),
    certification_url: z.string().max(255).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const skillAssessmentsRouter = Router();

skillAssessmentsRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;

      const data = await withTenant(tenantId, async (tx) => {
        const totals = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total_assessments,
             COUNT(DISTINCT esa.employee_id)::int AS employees_assessed,
             COUNT(DISTINCT esa.skill_name)::int AS unique_skills,
             ROUND(AVG(esa.assessed_level)::numeric, 2) AS avg_level,
             COUNT(*) FILTER (WHERE esa.gap > 0)::int AS with_gaps,
             ROUND(AVG(CASE WHEN esa.gap > 0 THEN esa.gap END)::numeric, 2) AS avg_gap
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE e.tenant_id = $1::uuid`,
          tenantId
        )) as Array<Record<string, number>>;

        const methodDist = await tx.$queryRawUnsafe(
          `SELECT assessment_method, COUNT(*)::int AS count
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE e.tenant_id = $1::uuid
           GROUP BY assessment_method
           ORDER BY count DESC`,
          tenantId
        );

        const levelDist = await tx.$queryRawUnsafe(
          `SELECT assessed_level, COUNT(*)::int AS count
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE e.tenant_id = $1::uuid
           GROUP BY assessed_level
           ORDER BY assessed_level`,
          tenantId
        );

        return { ...(totals[0] ?? {}), by_method: methodDist, by_level: levelDist };
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

skillAssessmentsRouter.get(
  '/skills/summary',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;

      const data = await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT
             esa.skill_name,
             COUNT(DISTINCT esa.employee_id)::int AS employees_with_skill,
             ROUND(AVG(esa.assessed_level)::numeric, 2) AS avg_level,
             MIN(esa.assessed_level)::int AS min_level,
             MAX(esa.assessed_level)::int AS max_level,
             COUNT(*) FILTER (WHERE esa.gap > 0)::int AS with_gaps,
             ROUND(AVG(CASE WHEN esa.gap > 0 THEN esa.gap END)::numeric, 2) AS avg_gap
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE e.tenant_id = $1::uuid
           GROUP BY esa.skill_name
           ORDER BY employees_with_skill DESC
           LIMIT 50`,
          tenantId
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

skillAssessmentsRouter.get(
  '/gaps',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const minGap = safeParseInt(req.query['min_gap'], 1);
      const limit = safeParseInt(req.query['limit'], 50);

      const result = await withTenant(tenantId, async (tx) => {
        const rows = await tx.$queryRawUnsafe(
          `SELECT
             esa.id, esa.employee_id,
             e.first_name || ' ' || e.last_name AS employee_name,
             e.job_title,
             d.name AS department,
             esa.skill_name, esa.assessed_level, esa.required_level, esa.gap,
             esa.assessment_date
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           LEFT JOIN org_units d ON d.id = e.org_unit_id
           WHERE e.tenant_id = $1::uuid AND esa.gap >= $2
           ORDER BY esa.gap DESC, esa.skill_name
           LIMIT $3`,
          tenantId,
          minGap,
          limit
        );
        const gapDist = await tx.$queryRawUnsafe(
          `SELECT gap, COUNT(*)::int AS count
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE e.tenant_id = $1::uuid AND esa.gap > 0
           GROUP BY gap
           ORDER BY gap`,
          tenantId
        );
        return { rows, gapDist };
      });

      res.json({ data: result.rows, gap_distribution: result.gapDist });
    } catch (err) {
      next(err);
    }
  }
);

skillAssessmentsRouter.get(
  '/employee/:employeeId',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const employeeId = req.params['employeeId'] as string;
      if (!isUUID(employeeId)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }

      const result = await withTenant(tenantId, async (tx) => {
        const empRows = (await tx.$queryRawUnsafe(
          `SELECT id, first_name, last_name, job_title
           FROM employees WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          employeeId,
          tenantId
        )) as Array<Record<string, unknown>>;
        if (empRows.length === 0) return null;

        const assessments = await tx.$queryRawUnsafe(
          `SELECT esa.*,
                  assessor.first_name || ' ' || assessor.last_name AS assessor_name
           FROM employee_skill_assessments esa
           LEFT JOIN employees assessor ON assessor.id = esa.assessed_by
           WHERE esa.employee_id = $1::uuid
           ORDER BY esa.skill_name, esa.assessment_date DESC`,
          employeeId
        );

        const summaryRows = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total_skills,
             ROUND(AVG(assessed_level)::numeric, 2) AS avg_level,
             COUNT(*) FILTER (WHERE gap > 0)::int AS skills_with_gaps,
             COALESCE(SUM(gap) FILTER (WHERE gap > 0), 0)::int AS total_gap
           FROM employee_skill_assessments
           WHERE employee_id = $1::uuid`,
          employeeId
        )) as Array<Record<string, unknown>>;

        return { employee: empRows[0], assessments, summary: summaryRows[0] };
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Employee not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

skillAssessmentsRouter.get(
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
      const { employee_id, skill_name, method, has_gap, limit, offset } = parsed.data;
      const lim = safeParseInt(limit, 50);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(tenantId, async (tx) => {
        const params: (string | number)[] = [tenantId];
        let sql = `SELECT
                     esa.id, esa.employee_id,
                     e.first_name || ' ' || e.last_name AS employee_name,
                     e.job_title,
                     esa.skill_name, esa.esco_skill_uri,
                     esa.assessed_level, esa.required_level, esa.gap,
                     esa.assessment_date, esa.assessment_method,
                     esa.evidence_notes, esa.certification_url, esa.created_at
                   FROM employee_skill_assessments esa
                   JOIN employees e ON e.id = esa.employee_id
                   WHERE e.tenant_id = $1::uuid`;
        let idx = 2;
        if (employee_id) {
          sql += ` AND esa.employee_id = $${idx}::uuid`;
          params.push(employee_id);
          idx++;
        }
        if (skill_name) {
          sql += ` AND esa.skill_name ILIKE $${idx}`;
          params.push(`%${escapeILIKE(skill_name)}%`);
          idx++;
        }
        if (method) {
          sql += ` AND esa.assessment_method = $${idx}`;
          params.push(method);
          idx++;
        }
        if (has_gap === 'true') sql += ` AND esa.gap > 0`;
        sql += ` ORDER BY esa.assessment_date DESC, esa.skill_name LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);

        const countParams: (string | number)[] = [tenantId];
        let countSql = `SELECT COUNT(*)::int AS count
                        FROM employee_skill_assessments esa
                        JOIN employees e ON e.id = esa.employee_id
                        WHERE e.tenant_id = $1::uuid`;
        let cIdx = 2;
        if (employee_id) {
          countSql += ` AND esa.employee_id = $${cIdx}::uuid`;
          countParams.push(employee_id);
          cIdx++;
        }
        if (skill_name) {
          countSql += ` AND esa.skill_name ILIKE $${cIdx}`;
          countParams.push(`%${escapeILIKE(skill_name)}%`);
          cIdx++;
        }
        if (method) {
          countSql += ` AND esa.assessment_method = $${cIdx}`;
          countParams.push(method);
          cIdx++;
        }
        if (has_gap === 'true') countSql += ` AND esa.gap > 0`;

        const totalRows = (await tx.$queryRawUnsafe(countSql, ...countParams)) as Array<{
          count: number;
        }>;
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

skillAssessmentsRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid assessment ID format' });
        return;
      }

      const rows = (await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT esa.*,
                  e.first_name || ' ' || e.last_name AS employee_name,
                  e.job_title,
                  assessor.first_name || ' ' || assessor.last_name AS assessor_name
           FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           LEFT JOIN employees assessor ON assessor.id = esa.assessed_by
           WHERE esa.id = $1::uuid AND e.tenant_id = $2::uuid`,
          id,
          tenantId
        );
      })) as unknown[];

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Assessment not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

skillAssessmentsRouter.post(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const tenantId = req.tenantId!;
      const parsed = CreateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const data = parsed.data;

      const empRows = (await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT id FROM employees WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          data.employee_id,
          tenantId
        );
      })) as Array<{ id: string }>;
      if (empRows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Employee not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'REVIEW',
          resourceType: 'employee_skill_assessments',
          resourceId: 'pending',
          resourceName: `assessment:${data.employee_id}:${data.skill_name}`,
          newValue: data,
          metadata: { source: 'api-gateway:skill-assessments.POST' },
        },
        async (tx) => {
          const created = (await tx.$queryRawUnsafe(
            `INSERT INTO employee_skill_assessments
               (employee_id, skill_name, esco_skill_uri, assessed_level, required_level,
                assessment_date, assessment_method, assessed_by, evidence_notes, certification_url)
             VALUES ($1::uuid, $2, $3, $4, $5, $6::date, $7, $8::uuid, $9, $10)
             RETURNING *`,
            data.employee_id,
            data.skill_name,
            data.esco_skill_uri ?? null,
            data.assessed_level,
            data.required_level ?? null,
            data.assessment_date ?? new Date().toISOString().slice(0, 10),
            data.assessment_method ?? null,
            data.assessed_by ?? null,
            data.evidence_notes ?? null,
            data.certification_url ?? null
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

skillAssessmentsRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const tenantId = req.tenantId!;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid assessment ID format' });
        return;
      }
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }

      const allowedFields = [
        'assessed_level',
        'required_level',
        'assessment_method',
        'evidence_notes',
        'certification_url',
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
      if (updates.length === 0) {
        res.status(400).json({ error: 'invalid_input', message: 'No fields to update' });
        return;
      }
      updates.push('updated_at = NOW()');

      const existing = (await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT esa.* FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE esa.id = $1::uuid AND e.tenant_id = $2::uuid`,
          id,
          tenantId
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Assessment not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'REVIEW',
          resourceType: 'employee_skill_assessments',
          resourceId: id,
          resourceName: `assessment:${id}`,
          oldValue: existing[0],
          newValue: parsed.data,
          metadata: { source: 'api-gateway:skill-assessments.PATCH' },
        },
        async (tx) => {
          const updated = (await tx.$queryRawUnsafe(
            `UPDATE employee_skill_assessments SET ${updates.join(', ')} WHERE id = $${idx}::uuid RETURNING *`,
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

skillAssessmentsRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const tenantId = req.tenantId!;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid assessment ID format' });
        return;
      }

      const existing = (await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT esa.* FROM employee_skill_assessments esa
           JOIN employees e ON e.id = esa.employee_id
           WHERE esa.id = $1::uuid AND e.tenant_id = $2::uuid`,
          id,
          tenantId
        );
      })) as Array<Record<string, unknown>>;
      if (existing.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Assessment not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'REVIEW',
          resourceType: 'employee_skill_assessments',
          resourceId: id,
          resourceName: `assessment:${id}`,
          oldValue: existing[0],
          newValue: null,
          metadata: { source: 'api-gateway:skill-assessments.DELETE' },
        },
        async (tx) => {
          return tx.$queryRawUnsafe(
            `DELETE FROM employee_skill_assessments esa
             USING employees e
             WHERE esa.employee_id = e.id
               AND esa.id = $1::uuid AND e.tenant_id = $2::uuid
             RETURNING esa.id`,
            id,
            tenantId
          );
        }
      );
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);
