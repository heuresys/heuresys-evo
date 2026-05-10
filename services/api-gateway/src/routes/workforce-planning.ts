import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '../../prisma/generated/client/index.js';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { requirePermission } from '../middleware/require-permission.js';
import { isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor, readSession } from '../lib/audit/buildActor.js';

export const workforcePlanningRouter = Router();

workforcePlanningRouter.use(requireAuth, resolveTenant);

const PlanStatusSchema = z.enum(['draft', 'active', 'completed', 'archived']);
const ActionTypeSchema = z.enum(['hire', 'reskill', 'transfer', 'separate', 'promote']);
const ActionPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

const CreatePlanSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  target_date: z.coerce.date(),
  status: PlanStatusSchema.optional(),
});

const UpdatePlanSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    target_date: z.coerce.date().optional(),
    status: PlanStatusSchema.optional(),
  })
  .partial();

const CreateScenarioSchema = z.object({
  workforce_plan_id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  scenario_type: z.string().trim().max(50).optional().nullable(),
  target_date: z.coerce.date().optional().nullable(),
  status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
});

const CreateActionSchema = z.object({
  scenario_id: z.string().uuid().optional().nullable(),
  action_type: ActionTypeSchema,
  priority: ActionPrioritySchema.optional(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  target_role: z.string().trim().max(200).optional().nullable(),
  headcount: z.coerce.number().int().min(1).optional(),
  target_date: z.coerce.date().optional().nullable(),
  estimated_cost: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
  target_org_unit_id: z.string().uuid().optional().nullable(),
});

workforcePlanningRouter.get(
  '/plans',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.tenantId!;
      const status = typeof req.query['status'] === 'string' ? req.query['status'] : undefined;

      const where: Prisma.workforce_plansWhereInput = {};
      if (status) where.status = status;

      const plans = await withTenant(tenantId, (tx) =>
        tx.workforce_plans.findMany({
          where,
          orderBy: { created_at: 'desc' },
          take: 200,
        })
      );

      res.json({ success: true, data: plans, meta: { count: plans.length } });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.post(
  '/plans',
  requirePermission('EMPLOYEES', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreatePlanSchema.parse(req.body);
      const session = readSession(req);
      const userId = session.user?.id ?? null;
      const tenantId = req.tenantId!;

      const data: Prisma.workforce_plansUncheckedCreateInput = {
        tenant_id: tenantId,
        name: body.name,
        description: body.description ?? null,
        target_date: body.target_date,
        status: body.status ?? 'draft',
        created_by: isUUID(userId ?? '') ? userId : null,
        updated_by: isUUID(userId ?? '') ? userId : null,
      };

      const actor = buildActor(req, tenantId);
      const { result: created } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'REPORT',
          resourceType: 'workforce_plans',
          resourceId: 'pending',
          resourceName: body.name,
          newValue: body,
          metadata: { source: 'api-gateway:workforce-planning.POST_plans' },
        },
        (tx) => tx.workforce_plans.create({ data })
      );
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.get(
  '/plans/:id',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const plan = await withTenant(tenantId, (tx) =>
        tx.workforce_plans.findUnique({ where: { id } })
      );
      if (!plan) {
        res.status(404).json({ success: false, error: 'Workforce plan not found' });
        return;
      }
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.patch(
  '/plans/:id',
  requirePermission('EMPLOYEES', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const body = UpdatePlanSchema.parse(req.body);
      const session = readSession(req);
      const userId = session.user?.id ?? null;
      const tenantId = req.tenantId!;

      const existing = await withTenant(tenantId, (tx) =>
        tx.workforce_plans.findUnique({ where: { id } })
      );
      if (!existing) {
        res.status(404).json({ success: false, error: 'Workforce plan not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result: updated } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'REPORT',
          resourceType: 'workforce_plans',
          resourceId: id,
          resourceName: existing.name,
          oldValue: existing,
          newValue: body,
          metadata: { source: 'api-gateway:workforce-planning.PATCH_plans' },
        },
        async (tx) => {
          const data: Prisma.workforce_plansUncheckedUpdateInput = {};
          if (body.name !== undefined) data.name = body.name;
          if (body.description !== undefined) data.description = body.description;
          if (body.target_date !== undefined) data.target_date = body.target_date;
          if (body.status !== undefined) data.status = body.status;
          data.updated_at = new Date();
          if (isUUID(userId ?? '')) data.updated_by = userId;
          return tx.workforce_plans.update({ where: { id }, data });
        }
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.get(
  '/plans/:id/actions',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const actions = await withTenant(tenantId, (tx) =>
        tx.workforce_plan_actions.findMany({
          where: { workforce_plan_id: id },
          orderBy: { created_at: 'desc' },
        })
      );
      res.json({ success: true, data: actions, meta: { count: actions.length } });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.post(
  '/plans/:id/actions',
  requirePermission('EMPLOYEES', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const body = CreateActionSchema.parse(req.body);
      const tenantId = req.tenantId!;

      const plan = await withTenant(tenantId, (tx) =>
        tx.workforce_plans.findUnique({ where: { id } })
      );
      if (!plan) {
        res.status(404).json({ success: false, error: 'Workforce plan not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result: created } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'REPORT',
          resourceType: 'workforce_plan_actions',
          resourceId: 'pending',
          resourceName: `${plan.name} · ${body.title}`,
          newValue: body,
          metadata: {
            source: 'api-gateway:workforce-planning.POST_actions',
            workforce_plan_id: id,
          },
        },
        (tx) => {
          const data: Prisma.workforce_plan_actionsUncheckedCreateInput = {
            tenant_id: tenantId,
            workforce_plan_id: id,
            scenario_id: body.scenario_id ?? null,
            action_type: body.action_type,
            priority: body.priority ?? 'medium',
            title: body.title,
            description: body.description ?? null,
            target_role: body.target_role ?? null,
            headcount: body.headcount ?? 1,
            target_date: body.target_date ?? null,
            status: 'pending',
            estimated_cost:
              body.estimated_cost !== undefined && body.estimated_cost !== null
                ? new Prisma.Decimal(body.estimated_cost)
                : null,
            notes: body.notes ?? null,
            target_org_unit_id: body.target_org_unit_id ?? null,
          };
          return tx.workforce_plan_actions.create({ data });
        }
      );
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.get(
  '/scenarios',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.tenantId!;
      const planId = typeof req.query['plan_id'] === 'string' ? req.query['plan_id'] : undefined;

      const where: Prisma.workforce_plan_scenariosWhereInput = {};
      if (planId && isUUID(planId)) where.workforce_plan_id = planId;

      const scenarios = await withTenant(tenantId, (tx) =>
        tx.workforce_plan_scenarios.findMany({
          where,
          orderBy: { created_at: 'desc' },
          take: 200,
        })
      );
      res.json({ success: true, data: scenarios, meta: { count: scenarios.length } });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.post(
  '/scenarios',
  requirePermission('EMPLOYEES', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateScenarioSchema.parse(req.body);
      const session = readSession(req);
      const userId = session.user?.id ?? null;
      const tenantId = req.tenantId!;

      const plan = await withTenant(tenantId, (tx) =>
        tx.workforce_plans.findUnique({ where: { id: body.workforce_plan_id } })
      );
      if (!plan) {
        res.status(404).json({ success: false, error: 'Workforce plan not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result: created } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'REPORT',
          resourceType: 'workforce_plan_scenarios',
          resourceId: 'pending',
          resourceName: `${plan.name} · ${body.name}`,
          newValue: body,
          metadata: {
            source: 'api-gateway:workforce-planning.POST_scenarios',
            workforce_plan_id: body.workforce_plan_id,
          },
        },
        (tx) => {
          const data: Prisma.workforce_plan_scenariosUncheckedCreateInput = {
            tenant_id: tenantId,
            workforce_plan_id: body.workforce_plan_id,
            name: body.name,
            description: body.description ?? null,
            scenario_type: body.scenario_type ?? 'base',
            target_date: body.target_date ?? null,
            status: body.status ?? 'draft',
            created_by: isUUID(userId ?? '') ? userId : null,
          };
          return tx.workforce_plan_scenarios.create({ data });
        }
      );
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  }
);

workforcePlanningRouter.get(
  '/scenarios/:id',
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input' });
        return;
      }
      const tenantId = req.tenantId!;
      const scenario = await withTenant(tenantId, (tx) =>
        tx.workforce_plan_scenarios.findUnique({ where: { id } })
      );
      if (!scenario) {
        res.status(404).json({ success: false, error: 'Scenario not found' });
        return;
      }
      res.json({ success: true, data: scenario });
    } catch (err) {
      next(err);
    }
  }
);
