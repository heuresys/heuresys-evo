import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Prisma } from '../../prisma/generated/client/index.js';
import { prisma } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/require-permission.js';
import { ROLES, ROLE_DESCRIPTIONS, type Role } from '../middleware/roles.js';
import { isUUID, buildMeta } from '../utils/pagination.js';
import { validatePassword, generateSecurePassword } from '../utils/password-policy.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

interface SessionEnvelope {
  user?: { id?: string; role?: string; tenantId?: string | null };
}

function readSession(req: Request): SessionEnvelope {
  return (req as Request & { session?: SessionEnvelope | null }).session ?? {};
}

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  role: z.string().trim().max(50).optional(),
  is_active: z.enum(['true', 'false']).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  sort_by: z.enum(['username', 'role', 'last_login', 'first_name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

const CreateUserSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().max(200).optional(),
  role: z.string().trim().max(50).optional(),
  permissions: z.array(z.string().trim().max(100)).optional(),
  employee_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional(),
  generate_password: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
});

const UpdateUserSchema = z
  .object({
    username: z.string().trim().min(1).max(100).optional(),
    role: z.string().trim().max(50).optional(),
    permissions: z.array(z.string().trim().max(100)).optional(),
    employee_id: z.string().uuid().optional().nullable(),
    is_active: z.boolean().optional(),
    password: z.string().max(200).optional(),
  })
  .partial();

const ResetPasswordSchema = z.object({
  new_password: z.string().min(1).max(200),
});

const BulkCreateSchema = z.object({
  employee_ids: z.array(z.string().uuid()).min(1).max(100),
  role: z.string().trim().max(50).optional(),
  send_welcome_emails: z.boolean().optional(),
});

const PUBLIC_PERMISSIONS = {
  employees: [
    'employees:view:own',
    'employees:view:team',
    'employees:view:all',
    'employees:create',
    'employees:update',
    'employees:delete',
  ],
  leave: [
    'leave:view:own',
    'leave:view:team',
    'leave:view:all',
    'leave:request',
    'leave:approve',
    'leave:configure',
  ],
  reports: ['reports:view:own', 'reports:view:team', 'reports:view:all', 'reports:export'],
  tenant: ['tenant:configure', 'tenant:manage_users'],
  audit: ['audit:view', 'audit:export'],
  ai: ['ai:query', 'ai:configure'],
};

function isValidRole(role: string): role is Role {
  return Object.prototype.hasOwnProperty.call(ROLES, role);
}

function roleLevel(role: string): number {
  return isValidRole(role) ? ROLES[role] : Number.MAX_SAFE_INTEGER;
}

interface UserRowWithEmployee {
  id: string;
  username: string;
  role: string | null;
  permissions: string[];
  is_active: boolean | null;
  last_login: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  employee_id: string | null;
  totp_enabled?: boolean | null;
  employees?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    job_title?: string | null;
    tenant_id: string;
    tenants?: { id: string; code: string; name: string };
  } | null;
}

function presentUser(u: UserRowWithEmployee, includeDetails = false) {
  const base = {
    id: u.id,
    username: u.username,
    role: u.role,
    permissions: u.permissions ?? [],
    isActive: u.is_active,
    lastLogin: u.last_login,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    employeeId: u.employee_id,
    firstName: u.employees?.first_name ?? null,
    lastName: u.employees?.last_name ?? null,
    email: u.employees?.email ?? null,
    tenantId: u.employees?.tenant_id ?? null,
    tenantName: u.employees?.tenants?.name ?? null,
  };
  if (includeDetails) {
    return {
      ...base,
      jobTitle: u.employees?.job_title ?? null,
      totpEnabled: u.totp_enabled ?? false,
    };
  }
  return base;
}

usersRouter.get('/meta/roles', async (_req: Request, res: Response) => {
  const roles = (Object.entries(ROLES) as [Role, number][]).map(([name, level]) => ({
    name,
    level,
    description: ROLE_DESCRIPTIONS[name],
  }));
  res.json({ success: true, data: roles });
});

usersRouter.get(
  '/permissions/available',
  requirePermission('SECURITY', 'view'),
  async (_req: Request, res: Response) => {
    res.json({ success: true, data: PUBLIC_PERMISSIONS });
  }
);

usersRouter.get(
  '/',
  requirePermission('SECURITY', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ListQuerySchema.parse(req.query);
      const page = parsed.page ?? 1;
      const limit = parsed.limit ?? 20;
      const offset = (page - 1) * limit;
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;

      const where: Prisma.usersWhereInput = {};
      if (parsed.role) where.role = parsed.role;
      if (parsed.is_active !== undefined) where.is_active = parsed.is_active === 'true';
      if (parsed.search) {
        where.OR = [
          { username: { contains: parsed.search, mode: 'insensitive' } },
          { employees: { is: { first_name: { contains: parsed.search, mode: 'insensitive' } } } },
          { employees: { is: { last_name: { contains: parsed.search, mode: 'insensitive' } } } },
        ];
      }
      if (callerRole !== 'SUPERUSER' && callerTenantId) {
        where.OR = [
          ...((where.OR as Prisma.usersWhereInput[]) ?? []),
          { employee_id: null },
          { employees: { is: { tenant_id: callerTenantId } } },
        ];
      }

      const sortColumn = parsed.sort_by ?? 'username';
      const sortOrder = parsed.sort_order ?? 'asc';
      let orderBy: Prisma.usersOrderByWithRelationInput;
      if (sortColumn === 'first_name') {
        orderBy = { employees: { first_name: sortOrder } };
      } else {
        orderBy = { [sortColumn]: sortOrder } as Prisma.usersOrderByWithRelationInput;
      }

      const [rows, total] = await Promise.all([
        prisma.users.findMany({
          where,
          include: {
            employees: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                tenant_id: true,
                tenants: { select: { id: true, code: true, name: true } },
              },
            },
          },
          orderBy,
          take: limit,
          skip: offset,
        }),
        prisma.users.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          users: rows.map((u) => presentUser(u as UserRowWithEmployee)),
          meta: buildMeta({ totalCount: total, limit, offset, rowCount: rows.length }),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.get(
  '/:id',
  requirePermission('SECURITY', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid user ID format' });
        return;
      }
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;

      const user = await prisma.users.findUnique({
        where: { id },
        include: {
          employees: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              job_title: true,
              tenant_id: true,
              tenants: { select: { id: true, code: true, name: true } },
            },
          },
        },
      });
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      if (
        callerRole !== 'SUPERUSER' &&
        user.employees?.tenant_id &&
        user.employees.tenant_id !== callerTenantId
      ) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      res.json({ success: true, data: presentUser(user as UserRowWithEmployee, true) });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/',
  requirePermission('SECURITY', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateUserSchema.parse(req.body);
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;
      if (!callerRole) {
        res.status(401).json({ error: 'unauthorized' });
        return;
      }

      let userPassword = body.password;
      let isTemporaryPassword = false;
      if (body.generate_password) {
        userPassword = generateSecurePassword(16);
        isTemporaryPassword = true;
      } else if (!userPassword) {
        res.status(400).json({
          error: 'validation_failed',
          message: 'Password is required (or use generate_password: true)',
        });
        return;
      } else {
        const validation = validatePassword(userPassword);
        if (!validation.valid) {
          res.status(400).json({
            error: 'validation_failed',
            message: `Password does not meet policy requirements: ${validation.errors.join('; ')}`,
          });
          return;
        }
      }

      const userRole: Role = (body.role && isValidRole(body.role) ? body.role : 'USER') as Role;
      if (!isValidRole(userRole)) {
        res.status(400).json({ error: 'validation_failed', message: 'Invalid role' });
        return;
      }
      if (userRole === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
        res.status(403).json({ error: 'forbidden', reason: 'only_superuser_can_create_superuser' });
        return;
      }
      if (roleLevel(userRole) < roleLevel(callerRole)) {
        res.status(403).json({ error: 'forbidden', reason: 'higher_privileges' });
        return;
      }

      const existingUsername = await prisma.users.findUnique({
        where: { username: body.username },
      });
      if (existingUsername) {
        res.status(409).json({ success: false, error: 'Username already exists' });
        return;
      }

      if (body.employee_id) {
        const employee = await prisma.employees.findUnique({
          where: { id: body.employee_id },
          select: { id: true, tenant_id: true },
        });
        if (!employee) {
          res.status(404).json({ success: false, error: 'Employee not found' });
          return;
        }
        if (callerRole !== 'SUPERUSER' && employee.tenant_id !== callerTenantId) {
          res.status(403).json({ error: 'forbidden', reason: 'cross_tenant_employee_link' });
          return;
        }
        const linked = await prisma.users.findFirst({ where: { employee_id: body.employee_id } });
        if (linked) {
          res.status(409).json({ success: false, error: 'Employee already has a user account' });
          return;
        }
      }

      if (!['SUPERUSER', 'TENANT_OWNER', 'DEMO'].includes(userRole) && !body.employee_id) {
        res.status(400).json({
          error: 'validation_failed',
          message: 'Non-system users must be linked to an employee',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(userPassword!, 12);
      const created = await prisma.users.create({
        data: {
          username: body.username,
          password_hash: passwordHash,
          role: userRole,
          permissions: body.permissions ?? [],
          employee_id: body.employee_id ?? null,
          is_active: body.is_active ?? true,
        },
        select: {
          id: true,
          username: true,
          role: true,
          permissions: true,
          is_active: true,
          employee_id: true,
          created_at: true,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: created.id,
          username: created.username,
          role: created.role,
          permissions: created.permissions,
          isActive: created.is_active,
          employeeId: created.employee_id,
          createdAt: created.created_at,
          temporaryPassword: isTemporaryPassword ? userPassword : undefined,
          welcomeEmailSent: Boolean(body.send_welcome_email && body.employee_id),
        },
        message: 'User created successfully',
      });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.patch(
  '/:id',
  requirePermission('SECURITY', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid user ID format' });
        return;
      }
      const body = UpdateUserSchema.parse(req.body);
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;
      if (!callerRole) {
        res.status(401).json({ error: 'unauthorized' });
        return;
      }

      const existing = await prisma.users.findUnique({
        where: { id },
        include: { employees: { select: { tenant_id: true } } },
      });
      if (!existing) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      if (
        callerRole !== 'SUPERUSER' &&
        existing.employees?.tenant_id &&
        existing.employees.tenant_id !== callerTenantId
      ) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      if (existing.role === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
        res.status(403).json({ error: 'forbidden', reason: 'cannot_modify_superuser' });
        return;
      }
      if (existing.role && roleLevel(existing.role) < roleLevel(callerRole)) {
        res.status(403).json({ error: 'forbidden', reason: 'higher_privileges' });
        return;
      }

      const data: Prisma.usersUpdateInput = {};
      if (body.username !== undefined) data.username = body.username;
      if (body.is_active !== undefined) data.is_active = body.is_active;
      if (body.permissions !== undefined) data.permissions = body.permissions;
      if (body.role !== undefined) {
        if (!isValidRole(body.role)) {
          res.status(400).json({ error: 'validation_failed', message: 'Invalid role' });
          return;
        }
        if (body.role === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
          res.status(403).json({ error: 'forbidden' });
          return;
        }
        if (roleLevel(body.role) < roleLevel(callerRole)) {
          res.status(403).json({ error: 'forbidden', reason: 'higher_privileges' });
          return;
        }
        data.role = body.role;
      }
      if (body.employee_id !== undefined) {
        data.employees = body.employee_id
          ? { connect: { id: body.employee_id } }
          : { disconnect: true };
      }
      if (body.password !== undefined) {
        const validation = validatePassword(body.password);
        if (!validation.valid) {
          res.status(400).json({
            error: 'validation_failed',
            message: `Password does not meet policy requirements: ${validation.errors.join('; ')}`,
          });
          return;
        }
        data.password_hash = await bcrypt.hash(body.password, 12);
      }
      if (Object.keys(data).length === 0) {
        res.status(400).json({ error: 'validation_failed', message: 'No fields to update' });
        return;
      }
      data.updated_at = new Date();

      const updated = await prisma.users.update({
        where: { id },
        data,
        select: {
          id: true,
          username: true,
          role: true,
          permissions: true,
          is_active: true,
          employee_id: true,
          updated_at: true,
        },
      });

      res.json({
        success: true,
        data: {
          id: updated.id,
          username: updated.username,
          role: updated.role,
          permissions: updated.permissions,
          isActive: updated.is_active,
          employeeId: updated.employee_id,
          updatedAt: updated.updated_at,
        },
        message: 'User updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.delete(
  '/:id',
  requirePermission('SECURITY', 'delete'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid user ID format' });
        return;
      }
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;
      const callerId = session.user?.id ?? null;
      const hardDelete = String(req.query['hard'] ?? '') === 'true';

      if (id === callerId) {
        res
          .status(400)
          .json({ error: 'validation_failed', message: 'Cannot delete your own account' });
        return;
      }

      const existing = await prisma.users.findUnique({
        where: { id },
        include: { employees: { select: { tenant_id: true } } },
      });
      if (!existing) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      if (
        callerRole !== 'SUPERUSER' &&
        existing.employees?.tenant_id &&
        existing.employees.tenant_id !== callerTenantId
      ) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      if (existing.role === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
        res.status(403).json({ error: 'forbidden', reason: 'cannot_delete_superuser' });
        return;
      }
      if (existing.role && roleLevel(existing.role) < roleLevel(callerRole ?? '')) {
        res.status(403).json({ error: 'forbidden', reason: 'higher_privileges' });
        return;
      }

      if (hardDelete && callerRole === 'SUPERUSER') {
        await prisma.users.delete({ where: { id } });
        res.json({ success: true, message: 'User permanently deleted' });
        return;
      }

      await prisma.users.update({
        where: { id },
        data: { is_active: false, updated_at: new Date() },
      });
      res.json({ success: true, message: 'User deactivated successfully' });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/:id/reset-password',
  requirePermission('SECURITY', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params['id'] ?? '');
      if (!isUUID(id)) {
        res.status(400).json({ error: 'invalid_input', message: 'Invalid user ID format' });
        return;
      }
      const body = ResetPasswordSchema.parse(req.body);
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;

      const validation = validatePassword(body.new_password);
      if (!validation.valid) {
        res.status(400).json({
          error: 'validation_failed',
          message: `Password does not meet policy requirements: ${validation.errors.join('; ')}`,
        });
        return;
      }

      const existing = await prisma.users.findUnique({
        where: { id },
        include: { employees: { select: { tenant_id: true } } },
      });
      if (!existing) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      if (
        callerRole !== 'SUPERUSER' &&
        existing.employees?.tenant_id &&
        existing.employees.tenant_id !== callerTenantId
      ) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      if (existing.role === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
        res.status(403).json({ error: 'forbidden', reason: 'cannot_reset_superuser_password' });
        return;
      }

      const passwordHash = await bcrypt.hash(body.new_password, 12);
      await prisma.users.update({
        where: { id },
        data: { password_hash: passwordHash, updated_at: new Date() },
      });
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.post(
  '/bulk',
  requirePermission('SECURITY', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = BulkCreateSchema.parse(req.body);
      const session = readSession(req);
      const callerRole = session.user?.role ?? null;
      const callerTenantId = session.user?.tenantId ?? null;

      const userRole: Role = (body.role && isValidRole(body.role) ? body.role : 'USER') as Role;
      if (!isValidRole(userRole)) {
        res.status(400).json({ error: 'validation_failed', message: 'Invalid role' });
        return;
      }
      if (userRole === 'SUPERUSER' && callerRole !== 'SUPERUSER') {
        res.status(403).json({ error: 'forbidden', reason: 'only_superuser_can_create_superuser' });
        return;
      }

      const tenant = callerTenantId
        ? await prisma.tenants.findUnique({
            where: { id: callerTenantId },
            select: { code: true, name: true },
          })
        : null;
      const tenantCode = tenant?.code ?? 'sys';

      const employees = await prisma.employees.findMany({
        where: { id: { in: body.employee_ids } },
        select: { id: true, first_name: true, last_name: true, email: true, tenant_id: true },
      });

      const results: {
        created: { employeeId: string; username: string; temporaryPassword: string }[];
        skipped: { employeeId: string; reason: string }[];
        failed: { employeeId: string; error: string }[];
      } = { created: [], skipped: [], failed: [] };

      for (const employeeId of body.employee_ids) {
        try {
          const employee = employees.find((e) => e.id === employeeId);
          if (!employee) {
            results.skipped.push({ employeeId, reason: 'Employee not found' });
            continue;
          }
          if (callerRole !== 'SUPERUSER' && employee.tenant_id !== callerTenantId) {
            results.skipped.push({ employeeId, reason: 'Employee from different tenant' });
            continue;
          }
          const linked = await prisma.users.findFirst({ where: { employee_id: employeeId } });
          if (linked) {
            results.skipped.push({ employeeId, reason: 'User already exists' });
            continue;
          }

          const baseUsername = `${tenantCode}.${(employee.first_name ?? '').toLowerCase()}.${(
            employee.last_name ?? ''
          ).toLowerCase()}`.replace(/[^a-z0-9.]/g, '');

          let username = baseUsername || `${tenantCode}.user.${employeeId.slice(0, 8)}`;
          let suffix = 1;
          // eslint-disable-next-line no-await-in-loop
          while (await prisma.users.findUnique({ where: { username } })) {
            username = `${baseUsername}${suffix}`;
            suffix++;
            if (suffix > 100) {
              throw new Error('Could not allocate unique username');
            }
          }

          const temporaryPassword = generateSecurePassword(16);
          const passwordHash = await bcrypt.hash(temporaryPassword, 12);

          await prisma.users.create({
            data: {
              username,
              password_hash: passwordHash,
              role: userRole,
              permissions: [],
              employee_id: employeeId,
              is_active: true,
            },
          });
          results.created.push({ employeeId, username, temporaryPassword });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          results.failed.push({ employeeId, error: errorMessage });
        }
      }

      res.status(201).json({
        success: true,
        data: {
          summary: {
            total: body.employee_ids.length,
            created: results.created.length,
            skipped: results.skipped.length,
            failed: results.failed.length,
          },
          results,
        },
        message: `Bulk user creation completed: ${results.created.length} created, ${results.skipped.length} skipped, ${results.failed.length} failed`,
      });
    } catch (err) {
      next(err);
    }
  }
);
