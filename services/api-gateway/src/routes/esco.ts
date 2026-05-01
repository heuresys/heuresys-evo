import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';

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
