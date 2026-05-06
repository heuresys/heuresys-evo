import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * Skill Analytics routes — Pack 2.3 reopen partial (Phase 13.A prerequisite).
 *
 * Scope minimo per dashboard `skills-heatmap` Tier 1: 3/8 endpoint legacy
 * portati come thin SQL inline (no SkillAnalyticsService class). Skip:
 * heatmap (CTE recursive), trends (lookback periods), ksaba (KSABA dimension),
 * emerging (AI extraction), department-comparison detail, org-units detail.
 *
 * Endpoints:
 *   - GET /skill-analytics/summary     — global tenant counts + avg proficiency
 *   - GET /skill-analytics/shortages   — critical skill shortages (CTE)
 *   - GET /skill-analytics/dashboard   — composito (summary + top 10 shortages)
 *
 * RBP gating: EMPLOYEES.view (HR domain).
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

const ShortagesQuery = z.object({
  org_unit_id: z.string().uuid().optional(),
  min_shortage: z.string().optional(),
});

async function fetchSummary(
  tenantId: string,
  tx: { $queryRawUnsafe: (sql: string, ...args: unknown[]) => Promise<unknown> }
): Promise<Record<string, unknown>> {
  const rows = (await tx.$queryRawUnsafe(
    `SELECT
       (SELECT COUNT(*)::int FROM employees WHERE tenant_id = $1::uuid AND is_active = true) AS total_employees,
       (SELECT COUNT(DISTINCT employee_id)::int FROM employee_skill_profiles WHERE tenant_id = $1::uuid) AS employees_with_profiles,
       (SELECT COUNT(DISTINCT skill_id)::int FROM employee_skill_profiles WHERE tenant_id = $1::uuid) AS total_skills_tracked,
       (SELECT COALESCE(ROUND(AVG(composite_score)::numeric, 2), 0) FROM employee_skill_profiles WHERE tenant_id = $1::uuid) AS avg_proficiency,
       (SELECT COUNT(*)::int FROM (
         SELECT 1 FROM tenant_job_skills tjs
         JOIN tenant_jobs tj ON tj.id = tjs.tenant_job_id
         WHERE tj.tenant_id = $1::uuid AND tjs.is_required = true
           AND NOT EXISTS (
             SELECT 1 FROM employee_skill_profiles esp
             WHERE esp.skill_id = tjs.source_skill_id AND esp.composite_score >= 3
           )
         LIMIT 50
       ) shortages) AS critical_shortages,
       (SELECT COUNT(*)::int FROM org_units WHERE tenant_id = $1::uuid) AS departments`,
    tenantId
  )) as Array<Record<string, unknown>>;
  return rows[0] ?? {};
}

async function fetchShortages(
  tenantId: string,
  options: { org_unit_id?: string; min_shortage?: number },
  tx: { $queryRawUnsafe: (sql: string, ...args: unknown[]) => Promise<unknown> }
): Promise<Array<Record<string, unknown>>> {
  const params: (string | number)[] = [tenantId];
  let idx = 2;
  let orgFilter = '';
  if (options.org_unit_id) {
    orgFilter = ` AND e.org_unit_id = $${idx}::uuid`;
    params.push(options.org_unit_id);
    idx++;
  }
  let minShortageFilter = '';
  if (options.min_shortage !== undefined) {
    minShortageFilter = ` AND (rs.required_positions - COALESCE(avs.available_employees, 0)) >= $${idx}`;
    params.push(options.min_shortage);
    idx++;
  }

  const sql = `
    WITH required_skills AS (
      SELECT
        COALESCE(tjs.source_skill_id, es.id) AS skill_id,
        COALESCE(es.preferred_label_en, tjs.skill_name_en, tjs.skill_name_it) AS skill_name,
        COUNT(DISTINCT e.id)::int AS required_positions,
        array_agg(DISTINCT d.name) FILTER (WHERE d.name IS NOT NULL) AS departments_affected
      FROM tenant_job_skills tjs
      JOIN tenant_jobs tj ON tj.id = tjs.tenant_job_id
      LEFT JOIN esco_skills es ON es.uri = tjs.esco_skill_uri OR es.id = tjs.source_skill_id
      LEFT JOIN employees e ON e.position_id = tj.id::text OR e.job_title = tj.title_it OR e.job_title = tj.title_en
      LEFT JOIN org_units d ON d.id = e.org_unit_id
      WHERE tj.tenant_id = $1::uuid AND tjs.is_required = true${orgFilter}
      GROUP BY COALESCE(tjs.source_skill_id, es.id), COALESCE(es.preferred_label_en, tjs.skill_name_en, tjs.skill_name_it)
    ),
    available_skills AS (
      SELECT esp.skill_id, COUNT(DISTINCT esp.employee_id)::int AS available_employees
      FROM employee_skill_profiles esp
      WHERE esp.tenant_id = $1::uuid AND esp.composite_score >= 3
      GROUP BY esp.skill_id
    )
    SELECT
      rs.skill_id, rs.skill_name,
      rs.required_positions,
      COALESCE(avs.available_employees, 0)::int AS available_employees,
      (rs.required_positions - COALESCE(avs.available_employees, 0))::int AS shortage_count,
      CASE
        WHEN rs.required_positions > 0 AND COALESCE(avs.available_employees, 0) = 0 THEN 'critical'
        WHEN (rs.required_positions - COALESCE(avs.available_employees, 0))::numeric / NULLIF(rs.required_positions, 0) > 0.5 THEN 'high'
        WHEN (rs.required_positions - COALESCE(avs.available_employees, 0))::numeric / NULLIF(rs.required_positions, 0) > 0.25 THEN 'medium'
        ELSE 'low'
      END AS severity,
      rs.departments_affected
    FROM required_skills rs
    LEFT JOIN available_skills avs ON avs.skill_id = rs.skill_id
    WHERE rs.required_positions > COALESCE(avs.available_employees, 0)${minShortageFilter}
    ORDER BY shortage_count DESC, severity
  `;

  const rows = (await tx.$queryRawUnsafe(sql, ...params)) as Array<Record<string, unknown>>;
  return rows;
}

export const skillAnalyticsRouter = Router();

skillAnalyticsRouter.get(
  '/summary',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => fetchSummary(req.tenantId!, tx));
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

skillAnalyticsRouter.get(
  '/shortages',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const parsed = ShortagesQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const minShortage =
        parsed.data.min_shortage !== undefined
          ? safeParseInt(parsed.data.min_shortage, 0)
          : undefined;

      const shortages = await withTenant(req.tenantId!, async (tx) =>
        fetchShortages(
          req.tenantId!,
          {
            ...(parsed.data.org_unit_id ? { org_unit_id: parsed.data.org_unit_id } : {}),
            ...(minShortage !== undefined ? { min_shortage: minShortage } : {}),
          },
          tx
        )
      );

      const summary = {
        critical: shortages.filter((s) => s['severity'] === 'critical').length,
        high: shortages.filter((s) => s['severity'] === 'high').length,
        medium: shortages.filter((s) => s['severity'] === 'medium').length,
        low: shortages.filter((s) => s['severity'] === 'low').length,
      };

      res.json({ data: shortages, count: shortages.length, summary });
    } catch (err) {
      next(err);
    }
  }
);

skillAnalyticsRouter.get(
  '/dashboard',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const tenantId = req.tenantId!;

      const result = await withTenant(tenantId, async (tx) => {
        const [summary, shortages] = await Promise.all([
          fetchSummary(tenantId, tx),
          fetchShortages(tenantId, {}, tx),
        ]);
        return {
          summary,
          critical_shortages: shortages.slice(0, 10),
          shortages_summary: {
            critical: shortages.filter((s) => s['severity'] === 'critical').length,
            high: shortages.filter((s) => s['severity'] === 'high').length,
            medium: shortages.filter((s) => s['severity'] === 'medium').length,
            low: shortages.filter((s) => s['severity'] === 'low').length,
          },
        };
      });

      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

skillAnalyticsRouter.get(
  '/skill/:id/coverage',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid skill ID format' });
        return;
      }

      const data = await withTenant(req.tenantId!, async (tx) => {
        const rows = (await tx.$queryRawUnsafe(
          `SELECT
             $1::uuid AS skill_id,
             COUNT(DISTINCT esp.employee_id)::int AS employees_with_skill,
             COALESCE(ROUND(AVG(esp.composite_score)::numeric, 2), 0) AS avg_proficiency,
             MIN(esp.composite_score)::int AS min_proficiency,
             MAX(esp.composite_score)::int AS max_proficiency,
             COUNT(*) FILTER (WHERE esp.composite_score >= 4)::int AS expert_level_count
           FROM employee_skill_profiles esp
           WHERE esp.tenant_id = $2::uuid AND esp.skill_id = $1::uuid`,
          id,
          req.tenantId!
        )) as Array<Record<string, unknown>>;
        return rows[0] ?? {};
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);
