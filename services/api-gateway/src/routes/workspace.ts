import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { safeParseInt, isUUID } from '../utils/pagination.js';

/**
 * Workspace routes — Pack 8.
 *
 * Read+write su workspace_templates + workspace_widgets. RBP gating
 * TENANT_ADMIN per write, EMPLOYEES.view per read.
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

async function checkAdmin(
  req: Request,
  res: Response,
  action: 'create' | 'edit' | 'delete'
): Promise<boolean> {
  const cache = getRBPCache();
  await cache.ensureLoaded();
  const role =
    (req as Request & { session?: { user?: { role?: string } } }).session?.user?.role ?? '';
  if (!cache.isAllowed(role, 'TENANT_ADMIN', action)) {
    res.status(403).json({ error: 'forbidden', area: 'TENANT_ADMIN', action });
    return false;
  }
  return true;
}

const ListQuery = z.object({
  is_active: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

const CreateTemplateBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  layout: z.unknown().optional(),
  is_active: z.boolean().default(true),
});

const UpdateTemplateBody = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    layout: z.unknown().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

export const workspaceRouter = Router();

workspaceRouter.get(
  '/templates',
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
      const { is_active, limit, offset } = parsed.data;
      const lim = Math.min(safeParseInt(limit, 50), 200);
      const off = safeParseInt(offset, 0);

      const result = await withTenant(req.tenantId!, async (tx) => {
        const params: (string | number)[] = [req.tenantId!];
        let sql = `SELECT * FROM workspace_templates WHERE tenant_id = $1::uuid`;
        let idx = 2;
        if (is_active === 'true') sql += ` AND is_active = true`;
        if (is_active === 'false') sql += ` AND is_active = false`;
        sql += ` ORDER BY name LIMIT $${idx} OFFSET $${idx + 1}`;
        params.push(lim, off);
        const rows = await tx.$queryRawUnsafe(sql, ...params);
        const totalRows = (await tx.$queryRawUnsafe(
          `SELECT COUNT(*)::int AS count FROM workspace_templates WHERE tenant_id = $1::uuid`,
          req.tenantId!
        )) as Array<{ count: number }>;
        return { rows, total: totalRows[0]?.count ?? 0 };
      });

      res.json({ data: result.rows, meta: { total: result.total, limit: lim, offset: off } });
    } catch (err) {
      next(err);
    }
  }
);

workspaceRouter.get(
  '/templates/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid template ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM workspace_templates WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        );
      })) as unknown[];
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Workspace template not found' });
        return;
      }
      res.json({ data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

workspaceRouter.post(
  '/templates',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkAdmin(req, res, 'create'))) return;
      const parsed = CreateTemplateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const d = parsed.data;
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `INSERT INTO workspace_templates
             (tenant_id, name, description, layout, is_active, created_at, updated_at)
           VALUES ($1::uuid, $2, $3, $4::jsonb, $5, NOW(), NOW())
           RETURNING *`,
          req.tenantId!,
          d.name,
          d.description ?? null,
          d.layout ? JSON.stringify(d.layout) : null,
          d.is_active
        );
      })) as unknown[];
      res.status(201).json({ data: rows[0] ?? null });
    } catch (err) {
      next(err);
    }
  }
);

workspaceRouter.patch(
  '/templates/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkAdmin(req, res, 'edit'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid template ID format' });
        return;
      }
      const parsed = UpdateTemplateBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_input', issues: parsed.error.issues });
        return;
      }
      const allowedFields = ['name', 'description', 'is_active'] as const;
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
      if (parsed.data.layout !== undefined) {
        updates.push(`layout = $${idx}::jsonb`);
        values.push(JSON.stringify(parsed.data.layout));
        idx++;
      }
      updates.push('updated_at = NOW()');

      const result = await withTenant(req.tenantId!, async (tx) => {
        const existing = (await tx.$queryRawUnsafe(
          `SELECT id FROM workspace_templates WHERE id = $1::uuid AND tenant_id = $2::uuid`,
          id,
          req.tenantId!
        )) as Array<{ id: string }>;
        if (existing.length === 0) return null;
        const updated = (await tx.$queryRawUnsafe(
          `UPDATE workspace_templates SET ${updates.join(', ')} WHERE id = $${idx}::uuid AND tenant_id = $${idx + 1}::uuid RETURNING *`,
          ...values,
          id,
          req.tenantId!
        )) as unknown[];
        return updated[0] ?? null;
      });
      if (result === null) {
        res.status(404).json({ error: 'not_found', message: 'Workspace template not found' });
        return;
      }
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

workspaceRouter.delete(
  '/templates/:id',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkAdmin(req, res, 'delete'))) return;
      const id = req.params['id'] as string;
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid template ID format' });
        return;
      }
      const rows = (await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `DELETE FROM workspace_templates WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
          id,
          req.tenantId!
        );
      })) as Array<{ id: string }>;
      if (rows.length === 0) {
        res.status(404).json({ error: 'not_found', message: 'Workspace template not found' });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

workspaceRouter.get(
  '/widgets',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!(await checkRead(req, res))) return;
      const data = await withTenant(req.tenantId!, async (tx) => {
        return tx.$queryRawUnsafe(
          `SELECT * FROM workspace_widgets WHERE tenant_id = $1::uuid ORDER BY name`,
          req.tenantId!
        );
      });
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
);
