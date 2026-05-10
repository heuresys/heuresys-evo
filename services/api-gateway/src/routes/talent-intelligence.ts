import { Router, type Request, type Response, type NextFunction } from 'express';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/**
 * Talent Intelligence routes — Pack 3 (legacy import).
 *
 * Read endpoints + admin refresh over `v_employee_capability_snapshot`
 * (DB VIEW) · `mv_talent_signals` (MATERIALIZED VIEW) · `employee_timeline`.
 *
 * RBP gating: `EMPLOYEES.view` (read) · `EMPLOYEES.edit` (admin refresh MV).
 *
 * Skip dichiarato: POST /talent/ai/:promptCode/:employeeId — OpenAI integration
 * (richiede OPENAI_API_KEY wired + ai_prompt_templates seed) deferred BLOCK 11+.
 *
 * Endpoints:
 *   - GET /talent/snapshot/:employeeId   — AI-ready capability JSON snapshot
 *   - GET /talent/snapshot/me            — own snapshot (req.session.employeeId)
 *   - GET /talent/signals                — attrition risk + high-potential dashboard
 *   - GET /talent/timeline/:employeeId   — event timeline (filterable)
 *   - POST /talent/signals/refresh       — REFRESH MATERIALIZED VIEW CONCURRENTLY (admin)
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

async function checkAdmin(req: Request, res: Response): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'EMPLOYEES', 'edit')) {
    res.status(403).json({ error: 'forbidden', area: 'EMPLOYEES', action: 'edit' });
    return false;
  }
  return true;
}

export const talentIntelligenceRouter = Router();

talentIntelligenceRouter.get(
  '/snapshot/me',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const employeeId =
        (req as Request & { session?: { user?: { employeeId?: string } } }).session?.user
          ?.employeeId ?? null;
      if (!employeeId) {
        res.status(404).json({ error: 'not_found', message: 'No employee linked to user' });
        return;
      }

      const rows = (await withTenant(tenantId, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT snapshot FROM v_employee_capability_snapshot
           WHERE employee_id = $1::uuid AND tenant_id = $2::uuid`,
          employeeId,
          tenantId
        );
      })) as Array<{ snapshot: unknown }>;

      res.json({ data: rows[0]?.snapshot ?? null });
    } catch (err) {
      next(err);
    }
  }
);

talentIntelligenceRouter.get(
  '/snapshot/:employeeId',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const employeeId = req.params['employeeId'] as string;
      if (!isUUID(employeeId)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT snapshot FROM v_employee_capability_snapshot
           WHERE employee_id = $1::uuid AND tenant_id = $2::uuid`,
          employeeId,
          req.tenantId!
        );
      })) as Array<{ snapshot: unknown }>;

      if (rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Employee snapshot not found' });
        return;
      }
      res.json({ data: rows[0]!.snapshot });
    } catch (err) {
      next(err);
    }
  }
);

talentIntelligenceRouter.get(
  '/signals',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;
      const riskMin = safeParseInt(req.query['risk_min'], 0);
      const highPotOnly = req.query['high_potential'] === 'true';
      const limit = Math.min(safeParseInt(req.query['limit'], 100), 500);

      const result = await withTenant(tenantId, async (tx) => {
        const params: (string | number)[] = [tenantId];
        let sql = `SELECT * FROM mv_talent_signals WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (riskMin > 0) {
          sql += ` AND attrition_risk_score >= $${idx}`;
          params.push(riskMin);
          idx++;
        }
        if (highPotOnly) sql += ` AND is_high_potential = true`;
        sql += ` ORDER BY attrition_risk_score DESC, review_avg_12m DESC LIMIT $${idx}`;
        params.push(limit);

        const employees = await tx.$queryRawUnsafe(sql, ...params);
        const stats = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE attrition_risk_score >= 50)::int AS at_risk,
             COUNT(*) FILTER (WHERE attrition_risk_score >= 25 AND attrition_risk_score < 50)::int AS watch,
             COUNT(*) FILTER (WHERE is_high_potential)::int AS high_potentials,
             ROUND(AVG(attrition_risk_score)::numeric, 1) AS avg_risk,
             ROUND(AVG(review_avg_12m)::numeric, 2) AS avg_review
           FROM mv_talent_signals WHERE tenant_id = $1::uuid`,
          tenantId
        )) as Array<Record<string, unknown>>;
        return { employees, stats: stats[0] ?? {} };
      });

      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

talentIntelligenceRouter.get(
  '/timeline/:employeeId',
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
      const limit = Math.min(safeParseInt(req.query['limit'], 50), 200);
      const eventType = req.query['event_type'] as string | undefined;

      const data = await withTenant(tenantId, async (tx) => {
        const params: (string | number)[] = [employeeId, tenantId];
        let sql = `SELECT id, event_type, event_date, payload, ai_summary
                   FROM employee_timeline
                   WHERE employee_id = $1::uuid AND tenant_id = $2::uuid`;
        let idx = 3;
        if (eventType) {
          sql += ` AND event_type = $${idx}`;
          params.push(eventType);
          idx++;
        }
        sql += ` ORDER BY event_date DESC LIMIT $${idx}`;
        params.push(limit);
        return tx.$queryRawUnsafe(sql, ...params);
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

talentIntelligenceRouter.post(
  '/signals/refresh',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkAdmin(req, res))) return;

      const actor = buildActor(req, req.tenantId!);
      const { result } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'REPORT',
          resourceType: 'mv_talent_signals',
          resourceId: 'mv_talent_signals',
          resourceName: 'mv_talent_signals',
          newValue: { refreshed: true },
          metadata: { source: 'api-gateway:talent-intelligence.POST_signals_refresh' },
        },
        async (tx) => {
          await tx.$queryRawUnsafe(`REFRESH MATERIALIZED VIEW CONCURRENTLY mv_talent_signals`);
          const rows = (await tx.$queryRawUnsafe(
            `SELECT COUNT(*)::int AS count FROM mv_talent_signals`
          )) as Array<{ count: number }>;
          return { refreshed: true, rows: rows[0]?.count ?? 0 };
        }
      );

      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);
