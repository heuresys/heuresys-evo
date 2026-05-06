import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * Skill Taxonomy routes — Pack 2.6 reopen partial (Phase 13.A prerequisite).
 *
 * Scope minimo per dashboard `capability-graph` Tier 1: 4/31 endpoint legacy
 * portati come thin SQL inline (no SkillClassificationService /
 * SkillRelationshipService). Skip: classification CRUD + cluster CRUD +
 * relations CRUD + adjacencies CRUD (read-only browse sufficiente per
 * capability-graph dashboard).
 *
 * Endpoints:
 *   - GET /skill-taxonomy/stats                    — classification counts breakdown
 *   - GET /skill-taxonomy/classifications          — paginated list with filters
 *   - GET /skill-taxonomy/skills/:id/classification — single classification per skill
 *   - GET /skill-taxonomy/clusters                 — cluster hierarchy browse
 *
 * RBP gating: ESCO_KG.view fallback EMPLOYEES.view (cross-tenant taxonomy).
 */

async function checkRead(req: Request, res: Response): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'ESCO_KG', 'view') && !cache.isAllowed(role, 'EMPLOYEES', 'view')) {
    res.status(403).json({ error: 'forbidden', area: 'ESCO_KG', action: 'view' });
    return false;
  }
  return true;
}

const ListClassificationsQuery = z.object({
  primary_category: z.string().optional(),
  cognitive_level: z.string().optional(),
  transferability: z.string().optional(),
  cluster_id: z.string().uuid().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const ListClustersQuery = z.object({
  parent_cluster_id: z.string().uuid().optional(),
  cluster_level: z.string().optional(),
  is_active: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

export const skillTaxonomyRouter = Router();

skillTaxonomyRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        const totals = (await tx.$queryRawUnsafe(
          `SELECT
             COUNT(*)::int AS total_classifications,
             COUNT(*) FILTER (WHERE needs_review = true)::int AS needs_review,
             COUNT(DISTINCT skill_cluster_id)::int AS unique_clusters
           FROM skill_classifications`
        )) as Array<Record<string, number>>;

        const byCategory = await tx.$queryRawUnsafe(
          `SELECT primary_category, COUNT(*)::int AS count
           FROM skill_classifications
           GROUP BY primary_category
           ORDER BY count DESC`
        );

        const byCognitive = await tx.$queryRawUnsafe(
          `SELECT cognitive_level, cognitive_level_label, COUNT(*)::int AS count
           FROM skill_classifications
           WHERE cognitive_level IS NOT NULL
           GROUP BY cognitive_level, cognitive_level_label
           ORDER BY cognitive_level`
        );

        const byTransferability = await tx.$queryRawUnsafe(
          `SELECT transferability, COUNT(*)::int AS count
           FROM skill_classifications
           GROUP BY transferability
           ORDER BY count DESC`
        );

        return {
          ...(totals[0] ?? {}),
          by_category: byCategory,
          by_cognitive_level: byCognitive,
          by_transferability: byTransferability,
        };
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

skillTaxonomyRouter.get(
  '/classifications',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const parsed = ListClassificationsQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const { primary_category, cognitive_level, transferability, cluster_id, limit, offset } =
        parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT
                     sc.id, sc.esco_skill_id,
                     sc.primary_category, sc.primary_category_confidence,
                     sc.cognitive_level, sc.cognitive_level_label,
                     sc.social_dimension, sc.transferability, sc.transferability_score,
                     sc.skill_cluster_id, sc.classification_source, sc.needs_review,
                     es.preferred_label_en, es.preferred_label_it, es.skill_type,
                     cl.code AS cluster_code, cl.name_en AS cluster_name_en
                   FROM skill_classifications sc
                   LEFT JOIN esco_skills es ON es.id = sc.esco_skill_id
                   LEFT JOIN skill_clusters cl ON cl.id = sc.skill_cluster_id
                   WHERE 1=1`;
        let idx = 1;
        if (primary_category) {
          sql += ` AND sc.primary_category = $${idx}`;
          params.push(primary_category);
          idx++;
        }
        if (cognitive_level !== undefined) {
          sql += ` AND sc.cognitive_level = $${idx}`;
          params.push(safeParseInt(cognitive_level, 0));
          idx++;
        }
        if (transferability) {
          sql += ` AND sc.transferability = $${idx}`;
          params.push(transferability);
          idx++;
        }
        if (cluster_id) {
          sql += ` AND sc.skill_cluster_id = $${idx}::uuid`;
          params.push(cluster_id);
          idx++;
        }
        sql += ` ORDER BY es.preferred_label_en LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM skill_classifications`
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

skillTaxonomyRouter.get(
  '/skills/:id/classification',
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

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT sc.*,
                  es.preferred_label_en, es.preferred_label_it, es.skill_type,
                  cl.code AS cluster_code, cl.name_en AS cluster_name_en, cl.name_it AS cluster_name_it
           FROM skill_classifications sc
           LEFT JOIN esco_skills es ON es.id = sc.esco_skill_id
           LEFT JOIN skill_clusters cl ON cl.id = sc.skill_cluster_id
           WHERE sc.esco_skill_id = $1::uuid`,
          id
        );
      })) as unknown[];

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Classification not found for skill' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

skillTaxonomyRouter.get(
  '/clusters',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const parsed = ListClustersQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const { parent_cluster_id, cluster_level, is_active, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT
                     cl.*,
                     (SELECT COUNT(*)::int FROM skill_classifications sc WHERE sc.skill_cluster_id = cl.id) AS skills_count,
                     (SELECT COUNT(*)::int FROM skill_clusters child WHERE child.parent_cluster_id = cl.id) AS children_count
                   FROM skill_clusters cl
                   WHERE 1=1`;
        let idx = 1;
        if (parent_cluster_id) {
          sql += ` AND cl.parent_cluster_id = $${idx}::uuid`;
          params.push(parent_cluster_id);
          idx++;
        } else if (parent_cluster_id === undefined && cluster_level === undefined) {
          // Default browse: top-level clusters only
        }
        if (cluster_level !== undefined) {
          sql += ` AND cl.cluster_level = $${idx}`;
          params.push(safeParseInt(cluster_level, 1));
          idx++;
        }
        if (is_active === 'true') sql += ` AND cl.is_active = true`;
        if (is_active === 'false') sql += ` AND cl.is_active = false`;
        sql += ` ORDER BY cl.sort_order, cl.code LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM skill_clusters`
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

skillTaxonomyRouter.get(
  '/clusters/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid cluster ID format' });
        return;
      }

      const result = await withTenant(req.tenantId!, async (tx) => {
        const clusterRows = (await tx.$queryRawUnsafe(
          `SELECT * FROM skill_clusters WHERE id = $1::uuid`,
          id
        )) as Array<Record<string, unknown>>;
        if (clusterRows.length === 0) return null;

        const skills = await tx.$queryRawUnsafe(
          `SELECT sc.id, sc.esco_skill_id, sc.primary_category, sc.cognitive_level,
                  es.preferred_label_en, es.preferred_label_it
           FROM skill_classifications sc
           LEFT JOIN esco_skills es ON es.id = sc.esco_skill_id
           WHERE sc.skill_cluster_id = $1::uuid
           ORDER BY es.preferred_label_en
           LIMIT 100`,
          id
        );

        const children = await tx.$queryRawUnsafe(
          `SELECT id, code, name_en, name_it, cluster_level
           FROM skill_clusters WHERE parent_cluster_id = $1::uuid
           ORDER BY sort_order, code`,
          id
        );

        return { ...clusterRows[0], skills, children };
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Cluster not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);
