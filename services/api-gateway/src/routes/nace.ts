import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';

/**
 * NACE / ATECO industry classification routes — Pack 2.1 (legacy import).
 *
 * Read-only endpoints over the unified hierarchy in `industry_classifications`
 * (level 1=section, level 2=division, level 3=group) plus `company_sizes`
 * reference. Cross-tenant data — same RBP gating as /esco (ESCO_KG view, with
 * EMPLOYEES.view fallback).
 *
 * Endpoints:
 *   - GET /nace/sections                 — level 1 (sections, e.g. "A")
 *   - GET /nace/divisions?section=X      — level 2 (divisions, e.g. "01")
 *   - GET /nace/groups?division=X        — level 3 (groups, e.g. "01.1")
 *   - GET /nace/size-classes             — company size brackets
 *   - GET /nace/hierarchy                — full sections + divisions + groups
 */

const DivisionsQuery = z.object({
  section: z.string().min(1).max(10).optional(),
});

const GroupsQuery = z.object({
  division: z.string().min(1).max(10).optional(),
});

async function checkRBP(req: Request, res: Response): Promise<boolean> {
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

export const naceRouter = Router();

naceRouter.get(
  '/sections',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRBP(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT code, name_it, name_en, description_it AS description, icon, color, is_active
           FROM industry_classifications
           WHERE level = 1 AND is_active = true
           ORDER BY code`
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

naceRouter.get(
  '/divisions',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRBP(req, res))) return;
      const { section } = DivisionsQuery.parse(req.query);

      const data = await withTenant(req.tenantId!, async (tx) => {
        if (section) {
          return tx.$queryRawUnsafe(
            `SELECT code, parent_code AS section_code, name_it, name_en, description_it AS description, is_active
             FROM industry_classifications
             WHERE level = 2 AND is_active = true AND parent_code = $1
             ORDER BY code`,
            section
          );
        }
        return tx.$queryRawUnsafe(
          `SELECT code, parent_code AS section_code, name_it, name_en, description_it AS description, is_active
           FROM industry_classifications
           WHERE level = 2 AND is_active = true
           ORDER BY code`
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

naceRouter.get(
  '/groups',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRBP(req, res))) return;
      const { division } = GroupsQuery.parse(req.query);

      const data = await withTenant(req.tenantId!, async (tx) => {
        if (division) {
          return tx.$queryRawUnsafe(
            `SELECT code, parent_code AS division_code, name_it, name_en, description_it AS description, is_active
             FROM industry_classifications
             WHERE level = 3 AND is_active = true AND parent_code = $1
             ORDER BY code`,
            division
          );
        }
        return tx.$queryRawUnsafe(
          `SELECT code, parent_code AS division_code, name_it, name_en, description_it AS description, is_active
           FROM industry_classifications
           WHERE level = 3 AND is_active = true
           ORDER BY code`
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

naceRouter.get(
  '/size-classes',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRBP(req, res))) return;

      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT code, name_it, name_en, min_employees, max_employees, sort_order
           FROM company_sizes
           WHERE is_active = true
           ORDER BY sort_order`
        );
      });

      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);

naceRouter.get(
  '/hierarchy',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRBP(req, res))) return;

      const result = await withTenant(req.tenantId!, async (tx) => {
        const [sections, divisions, groups] = await Promise.all([
          tx.$queryRawUnsafe(
            `SELECT code, name_it, name_en, icon, color
             FROM industry_classifications
             WHERE level = 1 AND is_active = true
             ORDER BY code`
          ),
          tx.$queryRawUnsafe(
            `SELECT code, parent_code AS section_code, name_it, name_en
             FROM industry_classifications
             WHERE level = 2 AND is_active = true
             ORDER BY code`
          ),
          tx.$queryRawUnsafe(
            `SELECT code, parent_code AS division_code, name_it, name_en
             FROM industry_classifications
             WHERE level = 3 AND is_active = true
             ORDER BY code`
          ),
        ]);
        return { sections, divisions, groups };
      });

      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);
