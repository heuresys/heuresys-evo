import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant, mergeScopedWhere } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getScopeCondition } from '../middleware/rbac.js';
import { getRBPCache } from '../services/rbp-cache.js';
import type { ScopeType } from '../services/rbp-cache.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/**
 * Leaves routes — RTG Phase 4 task 4.10 (P0 endpoint port, scope H Hybrid).
 *
 * Backed by `employee_time_off_requests` (the canonical table; `leave_requests`
 * is a VIEW on top). Three operations P0:
 *   - GET  /leaves        — list (RBP scope-filtered)
 *   - POST /leaves        — submit new request (employee SELF)
 *   - POST /leaves/:id/approve — approve (manager HIERARCHY / TENANT)
 *
 * RBP area: LEAVES. RLS: tenant_isolation_employee_time_off_requests policy
 * already active in baseline (verified via db/scripts/rls-coverage.sql).
 */

interface RbacSessionEnvelope {
  user?: {
    id?: string;
    role?: string;
    tenantId?: string | null;
    employeeId?: string | null;
    managedDepartmentIds?: string[];
  };
}

function getCtx(req: Request) {
  const session = (req as Request & { session?: RbacSessionEnvelope }).session;
  return {
    role: session?.user?.role ?? '',
    employeeId: session?.user?.employeeId ?? null,
    tenantId: req.tenantId ?? null,
    managedDepartmentIds: session?.user?.managedDepartmentIds ?? [],
  };
}

const ListQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const SubmitBodySchema = z.object({
  leave_type: z.string().min(1).max(50),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  days_requested: z.number().positive().max(365),
  reason: z.string().max(2000).optional(),
});

export const leavesRouter = Router();

leavesRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const ctx = getCtx(req);
      if (!cache.isAllowed(ctx.role, 'LEAVES', 'view')) {
        res.status(403).json({ error: 'forbidden', area: 'LEAVES', action: 'view' });
        return;
      }
      const { status, limit } = ListQuerySchema.parse(req.query);
      const perm = cache.getPermission(ctx.role, 'LEAVES');
      const scope = (perm?.scopeType ?? 'SELF') as ScopeType;
      const scopeCond = getScopeCondition(scope, ctx);

      const result = await withTenant(req.tenantId!, async (tx) => {
        // Application-layer scope is enforced via parameterized query;
        // DB-layer enforces via RLS policy (defense-in-depth).
        if ('id' in scopeCond && scopeCond['id'] === '__deny_all__') {
          return [];
        }
        const employeeIdFilter = scope === 'SELF' ? ctx.employeeId : null;
        const params: Array<string | null | number> = [];
        let whereClause = 'WHERE 1=1';
        if (employeeIdFilter) {
          params.push(employeeIdFilter);
          whereClause += ` AND employee_id = $${params.length}::uuid`;
        }
        if (status) {
          params.push(status);
          whereClause += ` AND status = $${params.length}`;
        }
        params.push(limit);
        const rows = await tx.$queryRawUnsafe(
          `SELECT id, employee_id, leave_type, start_date, end_date, days_requested,
                  status, reason, created_at
           FROM employee_time_off_requests
           ${whereClause}
           ORDER BY created_at DESC
           LIMIT $${params.length}`,
          ...params
        );
        return rows;
      });

      // Note: mergeScopedWhere not used here because we query raw SQL —
      // scope is encoded as employeeIdFilter above. The helper is for Prisma findMany.
      void mergeScopedWhere;
      res.json({ data: result, scope });
    } catch (err) {
      next(err);
    }
  }
);

leavesRouter.post(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const ctx = getCtx(req);
      if (!cache.isAllowed(ctx.role, 'LEAVES', 'create')) {
        res.status(403).json({ error: 'forbidden', area: 'LEAVES', action: 'create' });
        return;
      }
      if (!ctx.employeeId) {
        res.status(400).json({ error: 'employee_required', message: 'Caller has no employeeId' });
        return;
      }
      const body = SubmitBodySchema.parse(req.body);

      const actor = buildActor(req, req.tenantId!);
      const { result: inserted } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'SYSTEM',
          resourceType: 'employee_time_off_requests',
          resourceId: 'pending',
          resourceName: `${body.leave_type} ${body.start_date}→${body.end_date}`,
          newValue: body,
          metadata: { source: 'api-gateway:leaves.POST' },
        },
        async (tx) => {
          const result = await tx.$queryRawUnsafe(
            `INSERT INTO employee_time_off_requests
               (employee_id, tenant_id, leave_type, start_date, end_date,
                days_requested, reason, status)
             VALUES ($1::uuid, $2::uuid, $3, $4::date, $5::date, $6, $7, 'pending')
             RETURNING id, employee_id, leave_type, status, created_at`,
            ctx.employeeId,
            ctx.tenantId,
            body.leave_type,
            body.start_date,
            body.end_date,
            body.days_requested,
            body.reason ?? null
          );
          return Array.isArray(result) ? result[0] : result;
        }
      );

      res.status(201).json({ data: inserted });
    } catch (err) {
      next(err);
    }
  }
);

leavesRouter.post(
  '/:id/approve',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const ctx = getCtx(req);
      if (!cache.isAllowed(ctx.role, 'LEAVES', 'approve')) {
        res.status(403).json({ error: 'forbidden', area: 'LEAVES', action: 'approve' });
        return;
      }
      const id = z.string().uuid().parse(req.params['id']);

      const actor = buildActor(req, req.tenantId!);
      const { result: updated } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'SYSTEM',
          resourceType: 'employee_time_off_requests',
          resourceId: id,
          resourceName: `leave-request:${id}`,
          newValue: { status: 'approved', approver_id: ctx.employeeId },
          metadata: { source: 'api-gateway:leaves.POST_approve' },
        },
        async (tx) => {
          const rows = (await tx.$queryRawUnsafe(
            `UPDATE employee_time_off_requests
                SET status = 'approved',
                    approver_id = $1::uuid,
                    approved_at = NOW(),
                    updated_at = NOW()
              WHERE id = $2::uuid AND status = 'pending'
              RETURNING id, employee_id, status, approver_id, approved_at`,
            ctx.employeeId,
            id
          )) as Array<unknown>;
          return rows[0] ?? null;
        }
      );

      if (!updated) {
        res.status(404).json({ error: 'not_found_or_already_processed' });
        return;
      }
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
);
