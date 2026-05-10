import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '../../prisma/generated/client/index.js';
import { prisma, withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { requirePermission } from '../middleware/require-permission.js';
import { isUUID } from '../utils/pagination.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor, readSession } from '../lib/audit/buildActor.js';

export const employeesRouter = Router();

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  cursor: z.string().uuid().optional(),
});

const CreateEmployeeSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  job_title: z.string().trim().max(255).optional().nullable(),
  department: z.string().trim().max(100).optional().nullable(),
  hire_date: z.coerce.date().optional().nullable(),
  manager_id: z.string().uuid().optional().nullable(),
  org_unit_id: z.string().uuid().optional().nullable(),
  cost_center_id: z.string().uuid().optional().nullable(),
  pernr: z.string().trim().max(8).optional().nullable(),
  is_active: z.boolean().optional(),
});

const UpdateEmployeeSchema = z
  .object({
    first_name: z.string().trim().min(1).max(100).optional(),
    last_name: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().email().max(255).optional(),
    job_title: z.string().trim().max(255).optional().nullable(),
    department: z.string().trim().max(100).optional().nullable(),
    hire_date: z.coerce.date().optional().nullable(),
    manager_id: z.string().uuid().optional().nullable(),
    org_unit_id: z.string().uuid().optional().nullable(),
    cost_center_id: z.string().uuid().optional().nullable(),
    job_band: z.string().trim().max(50).optional().nullable(),
    is_active: z.boolean().optional(),
    termination_reason: z.enum(['voluntary', 'involuntary', 'retirement']).optional().nullable(),
  })
  .partial();

const EMPLOYMENT_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'terminated', label: 'Terminated' },
] as const;

const TERMINATION_REASONS = [
  { value: 'voluntary', label: 'Voluntary' },
  { value: 'involuntary', label: 'Involuntary' },
  { value: 'retirement', label: 'Retirement' },
] as const;

employeesRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, cursor } = QuerySchema.parse(req.query);
      const tenantId = req.tenantId!;

      const findArgs: Prisma.employeesFindManyArgs = {
        take: limit,
        orderBy: { id: 'asc' },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      };

      const result = await withTenant(tenantId, async (tx) => {
        const [data, total] = await Promise.all([
          tx.employees.findMany(findArgs),
          tx.employees.count(),
        ]);
        return { data, total };
      });

      const nextCursor =
        result.data.length === limit ? (result.data[result.data.length - 1]?.id ?? null) : null;

      res.json({ data: result.data, nextCursor, total: result.total });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.get('/meta/employment-statuses', requireAuth, async (_req, res) => {
  res.json({ success: true, data: EMPLOYMENT_STATUSES });
});

employeesRouter.get('/meta/termination-reasons', requireAuth, async (_req, res) => {
  res.json({ success: true, data: TERMINATION_REASONS });
});

employeesRouter.get(
  '/me',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = readSession(req);
      const employeeId = session.user?.employeeId ?? null;
      if (!employeeId) {
        res.status(404).json({ success: false, error: 'No employee linked to this user' });
        return;
      }
      const tenantId = req.tenantId!;
      const employee = await withTenant(tenantId, (tx) =>
        tx.employees.findUnique({ where: { id: employeeId } })
      );
      if (!employee) {
        res.status(404).json({ success: false, error: 'Employee not found' });
        return;
      }
      res.json({ success: true, data: employee });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.get(
  '/me/skills',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = readSession(req);
      const employeeId = session.user?.employeeId ?? null;
      if (!employeeId) {
        res.status(404).json({ success: false, error: 'No employee linked to this user' });
        return;
      }
      const tenantId = req.tenantId!;
      const skills = await withTenant(tenantId, (tx) =>
        tx.employee_skills.findMany({
          where: { employee_id: employeeId },
          orderBy: { created_at: 'desc' },
        })
      );
      res.json({ success: true, data: skills });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.get(
  '/:id',
  requireAuth,
  resolveTenant,
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }
      const tenantId = req.tenantId!;
      const employee = await withTenant(tenantId, (tx) =>
        tx.employees.findUnique({ where: { id } })
      );
      if (!employee) {
        res.status(404).json({ success: false, error: 'Employee not found' });
        return;
      }
      res.json({ success: true, data: employee });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.get(
  '/:id/skills',
  requireAuth,
  resolveTenant,
  requirePermission('EMPLOYEES', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }
      const tenantId = req.tenantId!;
      const skills = await withTenant(tenantId, (tx) =>
        tx.employee_skills.findMany({
          where: { employee_id: id },
          orderBy: { created_at: 'desc' },
        })
      );
      res.json({ success: true, data: skills });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.post(
  '/',
  requireAuth,
  resolveTenant,
  requirePermission('EMPLOYEES', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateEmployeeSchema.parse(req.body);
      const tenantId = req.tenantId!;

      // Pre-check email uniqueness outside auditedTransaction (read-only).
      const existing = await withTenant(tenantId, (tx) =>
        tx.employees.findFirst({ where: { email: body.email }, select: { id: true } })
      );
      if (existing) {
        res.status(409).json({ success: false, error: 'Employee with this email already exists' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result: created } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'EMPLOYEE',
          resourceType: 'employees',
          resourceId: 'pending', // updated post-create via newValue
          resourceName: `${body.first_name} ${body.last_name}`,
          newValue: body,
          metadata: { source: 'api-gateway:employees.POST' },
        },
        async (tx) => {
          const data: Prisma.employeesUncheckedCreateInput = {
            tenant_id: tenantId,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            job_title: body.job_title ?? null,
            department: body.department ?? null,
            hire_date: body.hire_date ?? null,
            manager_id: body.manager_id ?? null,
            org_unit_id: body.org_unit_id ?? null,
            cost_center_id: body.cost_center_id ?? null,
            pernr: body.pernr ?? null,
            is_active: body.is_active ?? true,
          };
          return tx.employees.create({ data });
        }
      );

      res.status(201).json({
        success: true,
        data: created,
        message: 'Employee created successfully',
      });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.patch(
  '/:id',
  requireAuth,
  resolveTenant,
  requirePermission('EMPLOYEES', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }
      const body = UpdateEmployeeSchema.parse(req.body);
      const tenantId = req.tenantId!;

      // Pre-fetch existing for oldValue snapshot (outside auditedTransaction).
      const existing = await withTenant(tenantId, (tx) =>
        tx.employees.findUnique({ where: { id } })
      );
      if (!existing) {
        res.status(404).json({ success: false, error: 'Employee not found' });
        return;
      }

      const actor = buildActor(req, tenantId);
      const { result: updated } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'EMPLOYEE',
          resourceType: 'employees',
          resourceId: id,
          resourceName: `${existing.first_name} ${existing.last_name}`,
          oldValue: existing,
          newValue: body,
          metadata: { source: 'api-gateway:employees.PATCH' },
        },
        async (tx) => {
          const data: Prisma.employeesUncheckedUpdateInput = {};
          if (body.first_name !== undefined) data.first_name = body.first_name;
          if (body.last_name !== undefined) data.last_name = body.last_name;
          if (body.email !== undefined) data.email = body.email;
          if (body.job_title !== undefined) data.job_title = body.job_title;
          if (body.department !== undefined) data.department = body.department;
          if (body.hire_date !== undefined) data.hire_date = body.hire_date;
          if (body.manager_id !== undefined) data.manager_id = body.manager_id;
          if (body.org_unit_id !== undefined) data.org_unit_id = body.org_unit_id;
          if (body.cost_center_id !== undefined) data.cost_center_id = body.cost_center_id;
          if (body.is_active !== undefined) data.is_active = body.is_active;
          data.updated_at = new Date();
          return tx.employees.update({ where: { id }, data });
        }
      );

      res.json({ success: true, data: updated, message: 'Employee updated successfully' });
    } catch (err) {
      next(err);
    }
  }
);

employeesRouter.delete(
  '/:id',
  requireAuth,
  resolveTenant,
  requirePermission('EMPLOYEES', 'delete'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid employee ID format' });
        return;
      }
      const hardDelete = String(req.query['hard'] ?? '') === 'true';
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const tenantId = req.tenantId!;

      // Pre-fetch existing for oldValue + 404 short-circuit (outside transaction).
      const existing = await withTenant(tenantId, (tx) =>
        tx.employees.findUnique({ where: { id } })
      );
      if (!existing) {
        res.status(404).json({ success: false, error: 'Employee not found' });
        return;
      }

      const isHardDelete = hardDelete && callerRole === 'SUPERUSER';
      const actor = buildActor(req, tenantId);
      await auditedTransaction(
        actor,
        {
          action: 'DELETE',
          category: 'EMPLOYEE',
          resourceType: 'employees',
          resourceId: id,
          resourceName: `${existing.first_name} ${existing.last_name}`,
          oldValue: existing,
          newValue: isHardDelete ? null : { ...existing, is_active: false },
          metadata: {
            source: 'api-gateway:employees.DELETE',
            hardDelete: isHardDelete,
          },
        },
        async (tx) => {
          if (isHardDelete) {
            await tx.employees.delete({ where: { id } });
            return { kind: 'deleted' as const };
          }
          await tx.employees.update({
            where: { id },
            data: { is_active: false, updated_at: new Date() },
          });
          return { kind: 'archived' as const };
        }
      );

      res.json({
        success: true,
        message: isHardDelete
          ? 'Employee permanently deleted'
          : 'Employee archived (is_active=false)',
      });
    } catch (err) {
      next(err);
    }
  }
);
