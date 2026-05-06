import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { escapeILIKE } from '../utils/sql-safety.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * ESCO Skills routes — Pack 2.2 (legacy import).
 *
 * Backed by `esco_skills` (global taxonomy/reference table — no tenant_id
 * column). Read endpoints gated by RBP `ESCO_KG.view` with `EMPLOYEES.view`
 * fallback (same pattern as /esco, /nace). Write endpoints (POST/PATCH/DELETE)
 * gated by `ESCO_KG.create | edit | delete` for custom-skill management.
 *
 * Endpoints:
 *   - GET /skills/stats        — global counts + reuse level breakdown
 *   - GET /skills/types        — skill_type breakdown
 *   - GET /skills/digital      — paginated digital skills
 *   - GET /skills/green        — paginated green skills
 *   - GET /skills/search       — search by label/description with filters
 *   - GET /skills              — list with filters
 *   - GET /skills/:id          — single skill (full field set)
 *   - POST /skills             — create custom skill
 *   - PATCH /skills/:id        — update skill
 *   - DELETE /skills/:id       — delete skill
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

async function checkWrite(
  req: Request,
  res: Response,
  action: 'create' | 'edit' | 'delete'
): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'ESCO_KG', action)) {
    res.status(403).json({ error: 'forbidden', area: 'ESCO_KG', action });
    return false;
  }
  return true;
}

const ListQuery = z.object({
  skill_type: z.string().optional(),
  reuse_level: z.string().optional(),
  is_digital: z.string().optional(),
  is_green: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const SearchQuery = ListQuery.extend({
  q: z.string().min(1).max(200),
});

const CreateSkillBody = z.object({
  uri: z.string().min(1).max(255),
  preferred_label_en: z.string().min(1).max(500),
  description_en: z.string().optional(),
  skill_type: z.string().min(1).max(50),
  reuse_level: z.string().max(50).optional(),
  is_digital: z.boolean().optional(),
  is_green: z.boolean().optional(),
});

const UpdateSkillBody = z
  .object({
    uri: z.string().min(1).max(255).optional(),
    preferred_label_en: z.string().min(1).max(500).optional(),
    description_en: z.string().optional(),
    skill_type: z.string().min(1).max(50).optional(),
    reuse_level: z.string().max(50).optional(),
    is_digital: z.boolean().optional(),
    is_green: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const skillsRouter = Router();

skillsRouter.get(
  '/stats',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        const totals = (await tx.$queryRawUnsafe(`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE skill_type = 'skill')::int AS skills,
            COUNT(*) FILTER (WHERE skill_type = 'knowledge')::int AS knowledge,
            COUNT(*) FILTER (WHERE skill_type = 'competence')::int AS competences,
            COUNT(*) FILTER (WHERE is_digital = true)::int AS digital_skills,
            COUNT(*) FILTER (WHERE is_green = true)::int AS green_skills
          FROM esco_skills
        `)) as Array<Record<string, number>>;

        const reuseLevels = await tx.$queryRawUnsafe(`
          SELECT reuse_level, COUNT(*)::int AS count
          FROM esco_skills
          WHERE reuse_level IS NOT NULL
          GROUP BY reuse_level
          ORDER BY count DESC
        `);

        return { ...(totals[0] ?? {}), reuse_levels: reuseLevels };
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

skillsRouter.get(
  '/types',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(`
          SELECT skill_type, COUNT(*)::int AS count
          FROM esco_skills
          GROUP BY skill_type
          ORDER BY count DESC
        `);
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

async function flagPaginatedHandler(
  req: Request,
  res: Response,
  next: NextFunction,
  flag: 'is_digital' | 'is_green'
): Promise<void> {
  try {
    if (!(await checkRead(req, res))) return;
    const limit = safeParseInt(req.query['limit'], 100);
    const offset = safeParseInt(req.query['offset'], 0);

    const result = await withTenant(req.tenantId!, async (tx) => {
      const rows = await tx.$queryRawUnsafe(
        `SELECT id, uri, preferred_label_en, description_en, skill_type,
                reuse_level, is_digital, is_green, primary_category, is_transversal,
                created_at, updated_at
         FROM esco_skills
         WHERE ${flag} = true
         ORDER BY preferred_label_en
         LIMIT $1 OFFSET $2`,
        limit,
        offset
      );
      const totalRows = (await tx.$queryRawUnsafe(
        `SELECT COUNT(*)::int AS count FROM esco_skills WHERE ${flag} = true`
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

skillsRouter.get('/digital', requireAuth, resolveTenant, async (req, res, next) =>
  flagPaginatedHandler(req, res, next, 'is_digital')
);

skillsRouter.get('/green', requireAuth, resolveTenant, async (req, res, next) =>
  flagPaginatedHandler(req, res, next, 'is_green')
);

skillsRouter.get(
  '/search',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const parsed = SearchQuery.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const { q, skill_type, reuse_level, is_digital, is_green, limit } = parsed.data;
      const lim = safeParseInt(limit, 50);

      const data = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [`%${escapeILIKE(q)}%`];
        let sql = `
          SELECT id, uri, preferred_label_en, description_en, skill_type,
                 reuse_level, is_digital, is_green, primary_category, is_transversal,
                 created_at, updated_at
          FROM esco_skills
          WHERE (preferred_label_en ILIKE $1 OR description_en ILIKE $1)`;
        let idx = 2;
        if (skill_type) {
          sql += ` AND skill_type = $${idx}`;
          params.push(skill_type);
          idx++;
        }
        if (reuse_level) {
          sql += ` AND reuse_level = $${idx}`;
          params.push(reuse_level);
          idx++;
        }
        if (is_digital === 'true') sql += ` AND is_digital = true`;
        if (is_green === 'true') sql += ` AND is_green = true`;
        sql += ` ORDER BY preferred_label_en LIMIT $${idx}`;
        params.push(lim);

        return tx.$queryRawUnsafe(sql, ...params);
      });

      res.json({ data, count: Array.isArray(data) ? data.length : 0 });
    } catch (err) {
      next(err);
    }
  }
);

skillsRouter.get(
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
      const { skill_type, reuse_level, is_digital, is_green, limit, offset } = parsed.data;
      const lim = safeParseInt(limit, 100);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [];
        let sql = `SELECT id, uri, preferred_label_en, description_en, skill_type,
                          reuse_level, is_digital, is_green, primary_category, is_transversal,
                          created_at, updated_at
                   FROM esco_skills WHERE 1=1`;
        let idx = 1;
        if (skill_type) {
          sql += ` AND skill_type = $${idx}`;
          params.push(skill_type);
          idx++;
        }
        if (reuse_level) {
          sql += ` AND reuse_level = $${idx}`;
          params.push(reuse_level);
          idx++;
        }
        if (is_digital === 'true') sql += ` AND is_digital = true`;
        if (is_green === 'true') sql += ` AND is_green = true`;
        sql += ` ORDER BY preferred_label_en LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);

        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM esco_skills`
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

skillsRouter.get(
  '/:id',
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
          `SELECT id, uri, preferred_label, description, skill_type, reuse_level,
                  is_digital, is_green, created_at, alt_labels, broader_uri,
                  narrower_uris, related_uris, isco_groups, updated_at,
                  primary_category, cognitive_level, is_classified,
                  skill_group_uri, preferred_label_en, preferred_label_it,
                  is_transversal, description_en, description_it, alt_labels_it
           FROM esco_skills WHERE id = $1`,
          id
        );
      })) as unknown[];

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Skill not found' });
        return;
      }

      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

skillsRouter.post(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'create'))) return;
      const parsed = CreateSkillBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const {
        uri,
        preferred_label_en,
        description_en,
        skill_type,
        reuse_level,
        is_digital,
        is_green,
      } = parsed.data;

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `INSERT INTO esco_skills
             (uri, preferred_label_en, description_en, skill_type, reuse_level, is_digital, is_green, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          uri,
          preferred_label_en,
          description_en ?? null,
          skill_type,
          reuse_level ?? null,
          is_digital ?? false,
          is_green ?? false
        );
      })) as unknown[];

      res.status(201).json({ data: Array.isArray(rows) ? rows[0] : null });
    } catch (err) {
      next(err);
    }
  }
);

skillsRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid skill ID format' });
        return;
      }
      const parsed = UpdateSkillBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }

      const allowedFields = [
        'uri',
        'preferred_label_en',
        'description_en',
        'skill_type',
        'reuse_level',
        'is_digital',
        'is_green',
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

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        const existing = (await tx.$queryRawUnsafe(
          `SELECT id FROM esco_skills WHERE id = $1`,
          id
        )) as Array<{ id: string }>;
        if (!Array.isArray(existing) || existing.length === 0) return null;
        return tx.$queryRawUnsafe(
          `UPDATE esco_skills SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
          ...values,
          id
        );
      })) as unknown;

      if (rows === null) {
        res.status(404).json({ error: 'not_found', message: 'Skill not found' });
        return;
      }
      res.json({ data: Array.isArray(rows) ? rows[0] : null });
    } catch (err) {
      next(err);
    }
  }
);

skillsRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkWrite(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid skill ID format' });
        return;
      }

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(`DELETE FROM esco_skills WHERE id = $1 RETURNING id`, id);
      })) as Array<{ id: string }>;

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Skill not found' });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);
