import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { escapeILIKE } from '../utils/sql-safety.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

async function checkEscoRead(req: Request, res: Response): Promise<boolean> {
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

/**
 * ESCO Knowledge Graph route — RTG Phase 4 task 4.11.
 *
 * GET /esco/occupations/search?q=<text>&lang=en|it&limit=N
 *
 * Backed by `esco_occupations` (3.040 rows in legacy, schema present in evo
 * baseline). Two retrieval modes:
 *
 *   - **keyword** (default): ILIKE on `preferred_label_<lang>` + `alt_labels_<lang>`.
 *     Always available, no LLM dependency.
 *   - **vector** (when query embedding provided as base64 / TODO): pgvector
 *     cosine on `embedding_<lang>` column (1536-dim, text-embedding-3-small).
 *     Currently keyword-only — vector path requires the API gateway to embed
 *     the query, deferred to BLOCK 11+ when OpenAI key is wired in this service.
 *
 * RBP area: ESCO_KG (read-only, cross-tenant). Scope: PLATFORM (no tenant filter
 * needed — ESCO data is shared knowledge graph). Returns top-N matches sorted
 * by relevance.
 */

const SearchQuerySchema = z.object({
  q: z.string().min(2).max(200),
  lang: z.enum(['en', 'it']).default('en'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const escoRouter = Router();

escoRouter.get(
  '/occupations/search',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const role =
        (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
      // ESCO area covers cross-tenant read; check ESCO_KG.view (or fall back
      // to EMPLOYEES.view since ESCO is consumed in employee skills lookup).
      if (
        !cache.isAllowed(role, 'ESCO_KG', 'view') &&
        !cache.isAllowed(role, 'EMPLOYEES', 'view')
      ) {
        res.status(403).json({ error: 'forbidden', area: 'ESCO_KG', action: 'view' });
        return;
      }
      const { q, lang, limit } = SearchQuerySchema.parse(req.query);

      const labelCol = lang === 'it' ? 'preferred_label_it' : 'preferred_label_en';
      const altCol = lang === 'it' ? 'alt_labels_it' : 'alt_labels';

      // Keyword search via ILIKE — case-insensitive, supports multi-word
      // (split on whitespace, AND them). Sorted by code (deterministic) +
      // limit. Vector cosine path deferred (see route docstring).
      const result = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT id, uri, code, ${labelCol} AS preferred_label, isco_code, level
           FROM esco_occupations
           WHERE ${labelCol} ILIKE $1
              OR ${altCol} ILIKE $1
           ORDER BY level NULLS LAST, code NULLS LAST
           LIMIT $2`,
          `%${q}%`,
          limit
        );
      });

      res.json({
        data: result,
        query: { q, lang, limit, mode: 'keyword' },
      });
    } catch (err) {
      next(err);
    }
  }
);

// =============================================================================
// Pack 2.7 extension — 7 endpoint legacy ported from heuresys.com.evo
// =============================================================================

escoRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        const rows = (await tx.$queryRawUnsafe(
          `SELECT
             (SELECT COUNT(*)::int FROM esco_isco_groups) AS isco_groups,
             (SELECT COUNT(*)::int FROM esco_occupations) AS occupations,
             (SELECT COUNT(*)::int FROM esco_skills) AS skills,
             (SELECT COUNT(*)::int FROM esco_skills WHERE skill_type = 'skill') AS skills_count,
             (SELECT COUNT(*)::int FROM esco_skills WHERE skill_type = 'knowledge') AS knowledge_count,
             (SELECT COUNT(*)::int FROM esco_skills WHERE is_digital = true) AS digital_skills,
             (SELECT COUNT(*)::int FROM esco_skills WHERE is_green = true) AS green_skills,
             (SELECT COUNT(*)::int FROM esco_skills WHERE is_transversal = true) AS transversal_skills,
             (SELECT COUNT(*)::int FROM esco_skill_groups) AS skill_groups,
             (SELECT COUNT(*)::int FROM esco_occupation_skills) AS occupation_skill_relations,
             (SELECT COUNT(*)::int FROM esco_skill_relations) AS skill_skill_relations`
        )) as Array<Record<string, number>>;
        return rows[0] ?? {};
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/isco-groups',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const level = req.query['level'] ? safeParseInt(req.query['level'], 0) : null;
      const parentUri = (req.query['parent_uri'] as string | undefined) ?? null;

      const data = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT
                     g.id, g.uri, g.code,
                     g.preferred_label_en, g.preferred_label_it,
                     g.description_en, g.description_it,
                     g.parent_uri, g.level,
                     (SELECT COUNT(*)::int FROM esco_isco_groups c WHERE c.parent_uri = g.uri) AS children_count,
                     (SELECT COUNT(*)::int FROM esco_occupations o WHERE o.isco_code = g.code) AS occupations_count
                   FROM esco_isco_groups g
                   WHERE 1=1`;
        let idx = 1;
        if (level !== null) {
          sql += ` AND g.level = $${idx}`;
          params.push(level);
          idx++;
        }
        if (parentUri) {
          sql += ` AND g.parent_uri = $${idx}`;
          params.push(parentUri);
          idx++;
        }
        sql += ` ORDER BY g.code`;
        return tx.$queryRawUnsafe(sql, ...params);
      });

      res.json({ data, count: Array.isArray(data) ? data.length : 0 });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/isco-groups/:code',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const code = req.params['code'] as string;

      const result = await withTenant(req.tenantId!, async (tx) => {
        const groupRows = (await tx.$queryRawUnsafe(
          `SELECT id, uri, code, preferred_label_en, preferred_label_it,
                  description_en, description_it, parent_uri, level
           FROM esco_isco_groups WHERE code = $1`,
          code
        )) as Array<Record<string, unknown>>;
        if (groupRows.length === 0) return null;
        const group = groupRows[0]!;

        const children = await tx.$queryRawUnsafe(
          `SELECT code, preferred_label_en, preferred_label_it, level
           FROM esco_isco_groups
           WHERE parent_uri = $1
           ORDER BY code`,
          group['uri']
        );

        const occupations = await tx.$queryRawUnsafe(
          `SELECT id, uri, code, isco_code, preferred_label_en, preferred_label_it
           FROM esco_occupations
           WHERE isco_code = $1
           ORDER BY preferred_label_en
           LIMIT 50`,
          code
        );

        return { ...group, children, occupations };
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'ISCO group not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/occupations',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const search = req.query['search'] as string | undefined;
      const iscoCode = req.query['isco_code'] as string | undefined;
      const lang = req.query['lang'] === 'it' ? 'it' : 'en';
      const limit = safeParseInt(req.query['limit'], 50);
      const offset = safeParseInt(req.query['offset'], 0);
      const labelCol = lang === 'it' ? 'preferred_label_it' : 'preferred_label_en';

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT
                     o.id, o.uri, o.code, o.isco_code,
                     o.preferred_label_en, o.preferred_label_it,
                     o.description_en, o.description_it,
                     o.parent_uri,
                     g.preferred_label_en AS isco_group_name,
                     (SELECT COUNT(*)::int FROM esco_occupation_skills os WHERE os.occupation_id = o.id) AS skills_count
                   FROM esco_occupations o
                   LEFT JOIN esco_isco_groups g ON o.isco_code = g.code
                   WHERE 1=1`;
        let idx = 1;
        if (search) {
          const pat = `%${escapeILIKE(search)}%`;
          sql += ` AND (o.preferred_label_en ILIKE $${idx} OR o.preferred_label_it ILIKE $${idx} OR o.description_en ILIKE $${idx} OR o.description_it ILIKE $${idx} OR o.code ILIKE $${idx})`;
          params.push(pat);
          idx++;
        }
        if (iscoCode) {
          sql += ` AND o.isco_code = $${idx}`;
          params.push(iscoCode);
          idx++;
        }
        sql += ` ORDER BY o.${labelCol} LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(limit, offset);

        const rows = await tx.$queryRawUnsafe(sql, ...params);

        const countParams: (string | number)[] = [];
        let countSql = `SELECT COUNT(*)::int AS count FROM esco_occupations o WHERE 1=1`;
        let cIdx = 1;
        if (search) {
          countSql += ` AND (o.preferred_label_en ILIKE $${cIdx} OR o.preferred_label_it ILIKE $${cIdx} OR o.code ILIKE $${cIdx})`;
          countParams.push(`%${escapeILIKE(search)}%`);
          cIdx++;
        }
        if (iscoCode) {
          countSql += ` AND o.isco_code = $${cIdx}`;
          countParams.push(iscoCode);
          cIdx++;
        }
        const totalRows = (await tx.$queryRawUnsafe(countSql, ...countParams)) as Array<{
          count: number;
        }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({
        data: result.rows,
        meta: { total: result.total, limit, offset },
      });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/occupations/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid occupation ID format' });
        return;
      }

      const result = await withTenant(req.tenantId!, async (tx) => {
        const occRows = (await tx.$queryRawUnsafe(
          `SELECT
             o.id, o.uri, o.code, o.isco_code,
             o.preferred_label_en, o.preferred_label_it,
             o.description_en, o.description_it,
             o.alt_labels, o.alt_labels_it,
             o.parent_uri,
             g.preferred_label_en AS isco_group_name,
             g.preferred_label_it AS isco_group_name_it
           FROM esco_occupations o
           LEFT JOIN esco_isco_groups g ON o.isco_code = g.code
           WHERE o.id = $1::uuid`,
          id
        )) as Array<Record<string, unknown>>;
        if (occRows.length === 0) return null;

        const essential = await tx.$queryRawUnsafe(
          `SELECT s.id, s.uri, s.skill_type,
                  s.preferred_label_en, s.preferred_label_it,
                  s.is_digital, s.is_green, s.is_transversal
           FROM esco_occupation_skills os
           JOIN esco_skills s ON s.id = os.skill_id
           WHERE os.occupation_id = $1::uuid AND os.relation_type = 'essential'
           ORDER BY s.preferred_label_en`,
          id
        );

        const optional = await tx.$queryRawUnsafe(
          `SELECT s.id, s.uri, s.skill_type,
                  s.preferred_label_en, s.preferred_label_it,
                  s.is_digital, s.is_green, s.is_transversal
           FROM esco_occupation_skills os
           JOIN esco_skills s ON s.id = os.skill_id
           WHERE os.occupation_id = $1::uuid AND os.relation_type = 'optional'
           ORDER BY s.preferred_label_en`,
          id
        );

        return { ...occRows[0], essential_skills: essential, optional_skills: optional };
      });

      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Occupation not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/skills',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const search = req.query['search'] as string | undefined;
      const skillType = req.query['skill_type'] as string | undefined;
      const isDigital = req.query['is_digital'] === 'true';
      const isGreen = req.query['is_green'] === 'true';
      const isTransversal = req.query['is_transversal'] === 'true';
      const reuseLevel = req.query['reuse_level'] as string | undefined;
      const lang = req.query['lang'] === 'it' ? 'it' : 'en';
      const limit = safeParseInt(req.query['limit'], 50);
      const offset = safeParseInt(req.query['offset'], 0);
      const labelCol = lang === 'it' ? 'preferred_label_it' : 'preferred_label_en';

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT
                     s.id, s.uri, s.skill_type, s.reuse_level,
                     s.preferred_label_en, s.preferred_label_it,
                     s.description_en, s.description_it,
                     s.is_digital, s.is_green, s.is_transversal,
                     s.broader_uri,
                     (SELECT COUNT(*)::int FROM esco_occupation_skills os WHERE os.skill_id = s.id) AS occupations_count,
                     (SELECT COUNT(*)::int FROM esco_skill_relations sr WHERE sr.skill_uri = s.uri) AS related_skills_count
                   FROM esco_skills s
                   WHERE 1=1`;
        let idx = 1;
        if (search) {
          sql += ` AND (s.preferred_label_en ILIKE $${idx} OR s.preferred_label_it ILIKE $${idx} OR s.description_en ILIKE $${idx} OR s.description_it ILIKE $${idx})`;
          params.push(`%${escapeILIKE(search)}%`);
          idx++;
        }
        if (skillType) {
          sql += ` AND s.skill_type = $${idx}`;
          params.push(skillType);
          idx++;
        }
        if (isDigital) sql += ` AND s.is_digital = true`;
        if (isGreen) sql += ` AND s.is_green = true`;
        if (isTransversal) sql += ` AND s.is_transversal = true`;
        if (reuseLevel) {
          sql += ` AND s.reuse_level = $${idx}`;
          params.push(reuseLevel);
          idx++;
        }
        sql += ` ORDER BY s.${labelCol} LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(limit, offset);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM esco_skills`
        )) as Array<{ count: number }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({
        data: result.rows,
        meta: { total: result.total, limit, offset },
      });
    } catch (err) {
      next(err);
    }
  }
);

escoRouter.get(
  '/skill-groups',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkEscoRead(req, res))) return;
      const limit = safeParseInt(req.query['limit'], 100);
      const offset = safeParseInt(req.query['offset'], 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const rows = await tx.$queryRawUnsafe(
          `SELECT id, uri, code, preferred_label_en, preferred_label_it,
                  description_en, description_it
           FROM esco_skill_groups
           ORDER BY code
           LIMIT $1 OFFSET $2`,
          limit,
          offset
        );
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM esco_skill_groups`
        )) as Array<{ count: number }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({
        data: result.rows,
        meta: { total: result.total, limit, offset },
      });
    } catch (err) {
      next(err);
    }
  }
);
