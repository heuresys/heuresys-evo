import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '../../prisma/generated/client/index.js';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { requirePermission } from '../middleware/require-permission.js';
import { isUUID } from '../utils/pagination.js';

export const orgUnitsRouter = Router();

orgUnitsRouter.use(requireAuth, resolveTenant);

const ListQuerySchema = z.object({
  is_active: z.enum(['true', 'false']).optional(),
  org_type: z.string().trim().max(30).optional(),
  parent_id: z.string().optional(),
  search: z.string().trim().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

const TreeQuerySchema = z.object({
  is_active: z.enum(['true', 'false']).optional(),
});

const CreateOrgUnitSchema = z.object({
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().min(1).max(150),
  name_en: z.string().trim().max(150).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  org_type: z.string().trim().max(30).optional().nullable(),
  manager_id: z.string().uuid().optional().nullable(),
  default_location_id: z.string().uuid().optional().nullable(),
  headcount_budget: z.coerce.number().int().min(0).optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().optional(),
  description: z.string().trim().max(2000).optional().nullable(),
});

const UpdateOrgUnitSchema = z
  .object({
    name: z.string().trim().min(1).max(150).optional(),
    name_en: z.string().trim().max(150).optional().nullable(),
    parent_id: z.string().uuid().optional().nullable(),
    org_type: z.string().trim().max(30).optional().nullable(),
    manager_id: z.string().uuid().optional().nullable(),
    default_location_id: z.string().uuid().optional().nullable(),
    headcount_budget: z.coerce.number().int().min(0).optional().nullable(),
    is_active: z.boolean().optional(),
    sort_order: z.coerce.number().int().optional(),
    description: z.string().trim().max(2000).optional().nullable(),
  })
  .partial();

orgUnitsRouter.get(
  '/',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ListQuerySchema.parse(req.query);
      const limit = parsed.limit ?? 100;
      const offset = parsed.offset ?? 0;
      const tenantId = req.tenantId!;

      const where: Prisma.org_unitsWhereInput = {};
      if (parsed.is_active !== undefined) where.is_active = parsed.is_active === 'true';
      if (parsed.org_type) where.org_type = parsed.org_type;
      if (parsed.parent_id === 'null') where.parent_id = null;
      else if (parsed.parent_id) where.parent_id = parsed.parent_id;
      if (parsed.search) {
        where.OR = [
          { name: { contains: parsed.search, mode: 'insensitive' } },
          { code: { contains: parsed.search, mode: 'insensitive' } },
        ];
      }

      const result = await withTenant(tenantId, async (tx) => {
        const [rows, total] = await Promise.all([
          tx.org_units.findMany({
            where,
            orderBy: [{ org_level: 'asc' }, { sort_order: 'asc' }, { name: 'asc' }],
            take: limit,
            skip: offset,
          }),
          tx.org_units.count({ where: {} }),
        ]);
        const employeeCounts = await Promise.all(
          rows.map((r) => tx.employees.count({ where: { org_unit_id: r.id, is_active: true } }))
        );
        return {
          rows: rows.map((r, i) => ({ ...r, employee_count: employeeCounts[i] })),
          total,
        };
      });

      res.json({
        success: true,
        data: result.rows,
        meta: { total: result.total, limit, offset },
      });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.get(
  ['/tree', '/hierarchy'],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = TreeQuerySchema.parse(req.query);
      const tenantId = req.tenantId!;

      const where: Prisma.org_unitsWhereInput = {};
      if (parsed.is_active !== undefined) where.is_active = parsed.is_active === 'true';

      const rows = await withTenant(tenantId, (tx) =>
        tx.org_units.findMany({
          where,
          select: {
            id: true,
            code: true,
            name: true,
            parent_id: true,
            org_level: true,
            org_type: true,
            is_active: true,
            sort_order: true,
          },
          orderBy: [{ org_level: 'asc' }, { sort_order: 'asc' }, { name: 'asc' }],
        })
      );

      interface TreeNode {
        id: string;
        code: string;
        name: string;
        parent_id: string | null;
        org_level: number;
        org_type: string | null;
        is_active: boolean | null;
        sort_order: number | null;
        children: TreeNode[];
      }

      const nodeMap = new Map<string, TreeNode>();
      const roots: TreeNode[] = [];

      for (const row of rows) {
        nodeMap.set(row.id, { ...row, children: [] });
      }
      for (const row of rows) {
        const node = nodeMap.get(row.id)!;
        if (row.parent_id && nodeMap.has(row.parent_id)) {
          nodeMap.get(row.parent_id)!.children.push(node);
        } else {
          roots.push(node);
        }
      }

      res.json({ success: true, data: roots });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.get('/types', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.tenantId!;
    const types = await withTenant(tenantId, (tx) =>
      tx.org_units.findMany({
        where: { org_type: { not: null } },
        select: { org_type: true },
        distinct: ['org_type'],
        orderBy: { org_type: 'asc' },
        take: 100,
      })
    );
    res.json({
      success: true,
      data: types.map((t) => t.org_type).filter((v): v is string => v !== null),
    });
  } catch (err) {
    next(err);
  }
});

orgUnitsRouter.get(
  '/:id',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const ou = await withTenant(tenantId, (tx) => tx.org_units.findUnique({ where: { id } }));
      if (!ou) {
        res.status(404).json({ success: false, error: 'Org unit not found' });
        return;
      }
      res.json({ success: true, data: ou });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.get(
  '/:id/employees',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const employees = await withTenant(tenantId, (tx) =>
        tx.employees.findMany({
          where: { org_unit_id: id, is_active: true },
          orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
        })
      );
      res.json({ success: true, data: employees });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.get(
  '/:id/children',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const children = await withTenant(tenantId, (tx) =>
        tx.org_units.findMany({
          where: { parent_id: id },
          orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
        })
      );
      res.json({ success: true, data: children });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.post(
  '/',
  requirePermission('EMPLOYEES', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateOrgUnitSchema.parse(req.body);
      const tenantId = req.tenantId!;

      const created = await withTenant(tenantId, async (tx) => {
        const dup = await tx.org_units.findFirst({ where: { code: body.code } });
        if (dup) return null;
        let orgLevel = 1;
        if (body.parent_id) {
          const parent = await tx.org_units.findUnique({ where: { id: body.parent_id } });
          if (!parent) {
            return { error: 'parent_not_found' as const };
          }
          orgLevel = (parent.org_level ?? 0) + 1;
        }
        const data: Prisma.org_unitsUncheckedCreateInput = {
          tenant_id: tenantId,
          code: body.code,
          name: body.name,
          name_en: body.name_en ?? null,
          parent_id: body.parent_id ?? null,
          org_level: orgLevel,
          org_type: body.org_type ?? null,
          manager_id: body.manager_id ?? null,
          default_location_id: body.default_location_id ?? null,
          headcount_budget: body.headcount_budget ?? null,
          is_active: body.is_active ?? true,
          sort_order: body.sort_order ?? 0,
          description: body.description ?? null,
        };
        return tx.org_units.create({ data });
      });

      if (!created) {
        res.status(409).json({ success: false, error: 'Org unit code already exists' });
        return;
      }
      if (typeof created === 'object' && 'error' in created) {
        res.status(400).json({ success: false, error: 'Parent org unit not found' });
        return;
      }
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.patch(
  '/:id',
  requirePermission('EMPLOYEES', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const body = UpdateOrgUnitSchema.parse(req.body);
      const tenantId = req.tenantId!;

      const updated = await withTenant(tenantId, async (tx) => {
        const existing = await tx.org_units.findUnique({ where: { id } });
        if (!existing) return null;
        const data: Prisma.org_unitsUncheckedUpdateInput = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.name_en !== undefined) data.name_en = body.name_en;
        if (body.org_type !== undefined) data.org_type = body.org_type;
        if (body.manager_id !== undefined) data.manager_id = body.manager_id;
        if (body.default_location_id !== undefined)
          data.default_location_id = body.default_location_id;
        if (body.headcount_budget !== undefined) data.headcount_budget = body.headcount_budget;
        if (body.is_active !== undefined) data.is_active = body.is_active;
        if (body.sort_order !== undefined) data.sort_order = body.sort_order;
        if (body.description !== undefined) data.description = body.description;
        if (body.parent_id !== undefined) {
          if (body.parent_id === null) {
            data.parent_id = null;
            data.org_level = 1;
          } else {
            const parent = await tx.org_units.findUnique({ where: { id: body.parent_id } });
            if (!parent) return { error: 'parent_not_found' as const };
            data.parent_id = body.parent_id;
            data.org_level = (parent.org_level ?? 0) + 1;
          }
        }
        data.updated_at = new Date();
        return tx.org_units.update({ where: { id }, data });
      });

      if (!updated) {
        res.status(404).json({ success: false, error: 'Org unit not found' });
        return;
      }
      if (typeof updated === 'object' && 'error' in updated) {
        res.status(400).json({ success: false, error: 'Parent org unit not found' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

orgUnitsRouter.delete(
  '/:id',
  requirePermission('EMPLOYEES', 'delete'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;

      const result = await withTenant(tenantId, async (tx) => {
        const existing = await tx.org_units.findUnique({ where: { id } });
        if (!existing) return { kind: 'not_found' as const };
        const childCount = await tx.org_units.count({ where: { parent_id: id } });
        if (childCount > 0) return { kind: 'has_children' as const };
        const employeeCount = await tx.employees.count({ where: { org_unit_id: id } });
        if (employeeCount > 0) {
          await tx.org_units.update({
            where: { id },
            data: { is_active: false, updated_at: new Date() },
          });
          return { kind: 'archived' as const };
        }
        await tx.org_units.delete({ where: { id } });
        return { kind: 'deleted' as const };
      });

      if (result.kind === 'not_found') {
        res.status(404).json({ success: false, error: 'Org unit not found' });
        return;
      }
      if (result.kind === 'has_children') {
        res.status(400).json({ success: false, error: 'Cannot delete org unit with children' });
        return;
      }
      res.json({
        success: true,
        message:
          result.kind === 'archived' ? 'Org unit archived (has employees)' : 'Org unit deleted',
      });
    } catch (err) {
      next(err);
    }
  }
);
