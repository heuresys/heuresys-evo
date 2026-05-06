import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';

/**
 * Tenant Onboarding routes — Pack 7.
 *
 * Read-only profile of tenant-level onboarding setup. Cross-tenant gated by
 * TENANT_ADMIN area.
 */

async function checkRead(req: Request, res: Response): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (
    !cache.isAllowed(role, 'TENANT_ADMIN', 'view') &&
    !cache.isAllowed(role, 'EMPLOYEES', 'view')
  ) {
    res.status(403).json({ error: 'forbidden', area: 'TENANT_ADMIN', action: 'view' });
    return false;
  }
  return true;
}

async function checkAdmin(req: Request, res: Response): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'TENANT_ADMIN', 'edit')) {
    res.status(403).json({ error: 'forbidden', area: 'TENANT_ADMIN', action: 'edit' });
    return false;
  }
  return true;
}

const UpdateBody = z
  .object({
    company_name: z.string().min(1).max(255).optional(),
    industry: z.string().max(100).optional(),
    size_class: z.string().max(50).optional(),
    setup_completed: z.boolean().optional(),
    onboarding_data: z.record(z.unknown()).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const tenantOnboardingRouter = Router();

tenantOnboardingRouter.get(
  '/profile',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM tenant_onboarding_profiles WHERE tenant_id = $1::uuid LIMIT 1`,
          req.tenantId!
        );
      })) as unknown[];
      res.json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

tenantOnboardingRouter.patch(
  '/profile',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkAdmin(req, res))) return;
      const parsed = UpdateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = ['company_name', 'industry', 'size_class', 'setup_completed'] as const;
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
      if (parsed.data.onboarding_data !== undefined) {
        updates.push(`onboarding_data = $${idx}::jsonb`);
        values.push(JSON.stringify(parsed.data.onboarding_data));
        idx++;
      }
      updates.push('updated_at = NOW()');

      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `UPDATE tenant_onboarding_profiles SET ${updates.join(', ')} WHERE tenant_id = $${idx}::uuid RETURNING *`,
          ...values,
          req.tenantId!
        );
      })) as unknown[];

      res.json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

tenantOnboardingRouter.get(
  '/status',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT setup_completed, created_at, updated_at
           FROM tenant_onboarding_profiles WHERE tenant_id = $1::uuid LIMIT 1`,
          req.tenantId!
        );
      })) as Array<Record<string, unknown>>;
      const profile = rows[0] ?? null;
      res.json({
        data: {
          completed: profile ? Boolean(profile['setup_completed']) : false,
          profile_exists: profile !== null,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);
