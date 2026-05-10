import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '../../prisma/generated/client/index.js';
import { prisma } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/require-permission.js';
import { isUUID, buildMeta } from '../utils/pagination.js';
import { auditedTransaction, type AuditActor } from '../lib/audit/auditedTransaction.js';

const DEFAULT_SUPERUSER_TENANT_ID =
  process.env['DEFAULT_SUPERUSER_TENANT_ID'] ?? '00000000-0000-0000-0000-000000000001';

function buildActor(req: Request, targetTenantId: string | null): AuditActor {
  const session = (req as Request & { session?: SessionEnvelope | null }).session ?? null;
  const userId = session?.user?.id ?? '';
  const callerTenantId = session?.user?.tenantId ?? null;
  const tenantId = targetTenantId ?? callerTenantId ?? DEFAULT_SUPERUSER_TENANT_ID;
  return {
    tenantId,
    userId,
    userRole: session?.user?.role ?? null,
    ipAddress: req.ip ?? null,
    userAgent: req.get('user-agent') ?? null,
  };
}

export const tenantsRouter = Router();

const VALID_STATUSES = ['active', 'inactive', 'suspended', 'pending', 'configuring'] as const;
const VALID_PLANS = ['free', 'starter', 'professional', 'enterprise'] as const;

type TenantStatus = (typeof VALID_STATUSES)[number];
type SubscriptionPlan = (typeof VALID_PLANS)[number];

const ListQuerySchema = z.object({
  status: z.enum(VALID_STATUSES).optional(),
  plan: z.enum(VALID_PLANS).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

const CreateTenantSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .regex(/^[a-z0-9-]+$/, 'Code must be lowercase alphanumeric with hyphens only'),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  region: z.string().trim().max(100).optional().nullable(),
  status: z.enum(VALID_STATUSES).optional(),
  subscription_plan: z.enum(VALID_PLANS).optional(),
  industry_type: z.string().trim().max(100).optional().nullable(),
  sap_company_code: z.string().trim().max(4).optional().nullable(),
  annual_revenue_eur: z.coerce.number().int().min(0).optional().nullable(),
});

const verifiedWebsiteSchema = z
  .string()
  .trim()
  .max(255)
  .transform((v) =>
    v
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
  )
  .refine((v) => v === '' || /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(v), {
    message: 'Invalid domain format',
  })
  .optional()
  .nullable();

const taxIdSchema = z
  .string()
  .trim()
  .max(20)
  .transform((v) => v.toUpperCase().replace(/\s+/g, ''))
  .refine((v) => v === '' || /^[A-Z0-9]{8,20}$/.test(v), {
    message: 'Invalid tax ID format (8-20 alphanumeric characters)',
  })
  .optional()
  .nullable();

const UpdateTenantSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    region: z.string().trim().max(100).optional().nullable(),
    status: z.enum(VALID_STATUSES).optional(),
    subscription_plan: z.enum(VALID_PLANS).optional(),
    industry_type: z.string().trim().max(100).optional().nullable(),
    sap_company_code: z.string().trim().max(4).optional().nullable(),
    annual_revenue_eur: z.coerce.number().int().min(0).optional().nullable(),
    verified_website: verifiedWebsiteSchema,
    tax_id: taxIdSchema,
  })
  .partial();

const PLAN_DESCRIPTIONS: Record<
  SubscriptionPlan,
  { label: string; description: string; maxEmployees: number }
> = {
  free: { label: 'Free', description: 'Basic features for small teams', maxEmployees: 10 },
  starter: { label: 'Starter', description: 'Essential HR tools', maxEmployees: 50 },
  professional: {
    label: 'Professional',
    description: 'Advanced features for growing companies',
    maxEmployees: 500,
  },
  enterprise: {
    label: 'Enterprise',
    description: 'Full platform with custom integrations',
    maxEmployees: -1,
  },
};

interface SessionEnvelope {
  user?: { id?: string; role?: string; tenantId?: string | null };
}

function readSession(req: Request): SessionEnvelope | null {
  return (req as Request & { session?: SessionEnvelope | null }).session ?? null;
}

const PUBLIC_TENANT_FIELDS = {
  id: true,
  code: true,
  name: true,
  description: true,
  region: true,
  status: true,
  subscription_plan: true,
  industry_type: true,
  employee_count: true,
  created_at: true,
  updated_at: true,
} as const;

const FULL_TENANT_FIELDS = {
  ...PUBLIC_TENANT_FIELDS,
  sap_company_code: true,
  annual_revenue_eur: true,
  verified_website: true,
  tax_id: true,
  contact_email: true,
  contact_phone: true,
  industry_profile_id: true,
  setup_completed: true,
  setup_step: true,
  settings: true,
} as const;

function serializeTenant<T extends Record<string, unknown>>(row: T): T {
  if (row && typeof row === 'object' && 'annual_revenue_eur' in row) {
    const v = (row as Record<string, unknown>)['annual_revenue_eur'];
    if (typeof v === 'bigint') {
      return { ...row, annual_revenue_eur: Number(v) } as T;
    }
  }
  return row;
}

tenantsRouter.get(
  '/',
  requireAuth,
  requirePermission('PLATFORM', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ListQuerySchema.parse(req.query);
      const limit = parsed.limit ?? 50;
      const offset = parsed.offset ?? 0;

      const where: Prisma.tenantsWhereInput = {};
      if (parsed.status) where.status = parsed.status;
      if (parsed.plan) where.subscription_plan = parsed.plan;
      if (parsed.search) {
        where.OR = [
          { name: { contains: parsed.search, mode: 'insensitive' } },
          { code: { contains: parsed.search, mode: 'insensitive' } },
        ];
      }

      const [rows, totalCount] = await Promise.all([
        prisma.tenants.findMany({
          where,
          select: PUBLIC_TENANT_FIELDS,
          orderBy: { name: 'asc' },
          take: limit,
          skip: offset,
        }),
        prisma.tenants.count({ where }),
      ]);

      res.json({
        success: true,
        data: rows.map(serializeTenant),
        meta: buildMeta({ totalCount, limit, offset, rowCount: rows.length }),
      });
    } catch (err) {
      next(err);
    }
  }
);

tenantsRouter.get('/meta/statuses', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: VALID_STATUSES.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    })),
  });
});

tenantsRouter.get('/meta/plans', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: VALID_PLANS.map((plan) => ({ value: plan, ...PLAN_DESCRIPTIONS[plan] })),
  });
});

tenantsRouter.get(
  '/current',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = readSession(req);
      const tenantId = session?.user?.tenantId ?? null;
      const role = session?.user?.role ?? null;

      if (!tenantId) {
        res.json({
          success: true,
          data: {
            id: null,
            name: 'Heuresys Platform',
            code: 'platform',
            status: 'active',
            role: role ?? 'SUPERUSER',
          },
        });
        return;
      }

      const tenant = await prisma.tenants.findUnique({
        where: { id: tenantId },
        select: { ...FULL_TENANT_FIELDS, settings: true },
      });

      if (!tenant) {
        res.status(404).json({ success: false, error: 'Tenant not found' });
        return;
      }

      res.json({ success: true, data: serializeTenant(tenant) });
    } catch (err) {
      next(err);
    }
  }
);

async function findTenantByIdentifier(identifier: string) {
  if (isUUID(identifier)) {
    return prisma.tenants.findUnique({
      where: { id: identifier },
      select: FULL_TENANT_FIELDS,
    });
  }
  return prisma.tenants.findUnique({
    where: { code: identifier },
    select: FULL_TENANT_FIELDS,
  });
}

tenantsRouter.get(
  '/:identifier',
  requireAuth,
  requirePermission('PLATFORM', 'view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = String(req.params['identifier'] ?? '');
      const tenant = await findTenantByIdentifier(identifier);
      if (!tenant) {
        res.status(404).json({ success: false, error: `Tenant '${identifier}' not found` });
        return;
      }
      res.json({
        success: true,
        data: serializeTenant(tenant),
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
);

// /:identifier/stats endpoint deferred — requires expanding api-gateway Prisma
// allowlist with locations, goals, performance_reviews (currently pruned out).
// See `.handoff/legacy-mining-log.md` Pack 1a · /tenants notes.

tenantsRouter.post(
  '/',
  requireAuth,
  requirePermission('PLATFORM', 'create'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateTenantSchema.parse(req.body);
      const existing = await prisma.tenants.findUnique({ where: { code: body.code } });
      if (existing) {
        res
          .status(409)
          .json({ success: false, error: `Tenant with code '${body.code}' already exists` });
        return;
      }

      const data: Prisma.tenantsCreateInput = {
        code: body.code,
        name: body.name,
        description: body.description ?? null,
        region: body.region ?? null,
        status: body.status ?? 'pending',
        subscription_plan: body.subscription_plan ?? 'free',
        industry_type: body.industry_type ?? null,
        sap_company_code: body.sap_company_code ?? null,
        annual_revenue_eur:
          body.annual_revenue_eur !== undefined && body.annual_revenue_eur !== null
            ? BigInt(body.annual_revenue_eur)
            : null,
        employee_count: 0,
      };

      const actor = buildActor(req, null);
      const { result: created } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'TENANT',
          resourceType: 'tenant',
          resourceId: body.code,
          newValue: {
            code: body.code,
            name: body.name,
            status: body.status ?? 'pending',
            subscription_plan: body.subscription_plan ?? 'free',
          },
        },
        (tx) => tx.tenants.create({ data, select: FULL_TENANT_FIELDS })
      );

      res.status(201).json({
        success: true,
        data: serializeTenant(created),
        message: 'Tenant created successfully',
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
);

tenantsRouter.patch(
  '/:identifier',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = String(req.params['identifier'] ?? '');
      const session = readSession(req);
      const role = session?.user?.role;
      if (!role) {
        res.status(401).json({ error: 'unauthorized' });
        return;
      }

      const body = UpdateTenantSchema.parse(req.body);

      const existing = await prisma.tenants.findUnique({
        where: isUUID(identifier) ? { id: identifier } : { code: identifier },
        select: { id: true, code: true },
      });
      if (!existing) {
        res.status(404).json({ success: false, error: `Tenant '${identifier}' not found` });
        return;
      }

      const isSuperuser = role === 'SUPERUSER';
      const isOwnTenant = session?.user?.tenantId === existing.id;
      if (!isSuperuser && !isOwnTenant) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      if (!isSuperuser && (body.status !== undefined || body.subscription_plan !== undefined)) {
        res.status(403).json({
          error: 'forbidden',
          reason: 'only_superuser_can_change_status_or_plan',
        });
        return;
      }

      const data: Prisma.tenantsUpdateInput = {};
      if (body.name !== undefined) data.name = body.name;
      if (body.description !== undefined) data.description = body.description;
      if (body.region !== undefined) data.region = body.region;
      if (body.status !== undefined && isSuperuser) data.status = body.status;
      if (body.subscription_plan !== undefined && isSuperuser) {
        data.subscription_plan = body.subscription_plan;
      }
      if (body.industry_type !== undefined) data.industry_type = body.industry_type;
      if (body.sap_company_code !== undefined) data.sap_company_code = body.sap_company_code;
      if (body.annual_revenue_eur !== undefined) {
        data.annual_revenue_eur =
          body.annual_revenue_eur === null ? null : BigInt(body.annual_revenue_eur);
      }
      if (body.verified_website !== undefined) {
        data.verified_website = body.verified_website === '' ? null : body.verified_website;
      }
      if (body.tax_id !== undefined) {
        data.tax_id = body.tax_id === '' ? null : body.tax_id;
      }
      data.updated_at = new Date();

      if (Object.keys(data).length === 1 /* only updated_at */) {
        res.status(400).json({ error: 'validation_failed', message: 'No valid fields to update' });
        return;
      }

      const actor = buildActor(req, existing.id);
      const { result: updated } = await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'TENANT',
          resourceType: 'tenant',
          resourceId: existing.id,
          oldValue: { code: existing.code },
          newValue: { ...body, updated_at: new Date().toISOString() },
        },
        (tx) =>
          tx.tenants.update({
            where: { id: existing.id },
            data,
            select: FULL_TENANT_FIELDS,
          })
      );

      res.json({
        success: true,
        data: serializeTenant(updated),
        message: 'Tenant updated successfully',
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
);

tenantsRouter.delete(
  '/:identifier',
  requireAuth,
  requirePermission('PLATFORM', 'delete'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = String(req.params['identifier'] ?? '');
      const permanent = String(req.query['permanent'] ?? '') === 'true';

      const tenant = await prisma.tenants.findUnique({
        where: isUUID(identifier) ? { id: identifier } : { code: identifier },
        select: { id: true, code: true, status: true },
      });
      if (!tenant) {
        res.status(404).json({ success: false, error: `Tenant '${identifier}' not found` });
        return;
      }
      if (tenant.code === 'heuresys') {
        res.status(400).json({ success: false, error: 'Cannot deactivate the system tenant' });
        return;
      }

      const actor = buildActor(req, tenant.id);

      if (permanent) {
        const employeeCount = await prisma.employees.count({ where: { tenant_id: tenant.id } });
        if (employeeCount > 0) {
          res.status(400).json({
            success: false,
            error: 'Cannot permanently delete tenant with existing employees. Deactivate instead.',
          });
          return;
        }
        await auditedTransaction(
          actor,
          {
            action: 'DELETE',
            category: 'TENANT',
            resourceType: 'tenant',
            resourceId: tenant.id,
            oldValue: { code: tenant.code, status: tenant.status },
            metadata: { delete_kind: 'hard' },
          },
          (tx) => tx.tenants.delete({ where: { id: tenant.id } })
        );
        res.json({
          success: true,
          message: `Tenant '${tenant.code}' permanently deleted`,
          meta: { timestamp: new Date().toISOString() },
        });
        return;
      }

      await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'TENANT',
          resourceType: 'tenant',
          resourceId: tenant.id,
          oldValue: { status: tenant.status },
          newValue: { status: 'inactive' },
          metadata: { delete_kind: 'soft', deactivation_reason: 'admin_action' },
        },
        (tx) =>
          tx.tenants.update({
            where: { id: tenant.id },
            data: { status: 'inactive', updated_at: new Date() },
          })
      );
      res.json({
        success: true,
        message: `Tenant '${tenant.code}' deactivated`,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
);

tenantsRouter.post(
  '/:identifier/activate',
  requireAuth,
  requirePermission('PLATFORM', 'edit'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = String(req.params['identifier'] ?? '');
      const tenant = await prisma.tenants.findUnique({
        where: isUUID(identifier) ? { id: identifier } : { code: identifier },
        select: { id: true, code: true, status: true },
      });
      if (!tenant) {
        res.status(404).json({ success: false, error: `Tenant '${identifier}' not found` });
        return;
      }
      if (tenant.status === 'active') {
        res.status(400).json({ success: false, error: 'Tenant is already active' });
        return;
      }
      const actor = buildActor(req, tenant.id);
      await auditedTransaction(
        actor,
        {
          action: 'UPDATE',
          category: 'TENANT',
          resourceType: 'tenant',
          resourceId: tenant.id,
          oldValue: { status: tenant.status },
          newValue: { status: 'active' },
          metadata: { reason: 'tenant_reactivation' },
        },
        (tx) =>
          tx.tenants.update({
            where: { id: tenant.id },
            data: { status: 'active', updated_at: new Date() },
          })
      );
      res.json({
        success: true,
        message: `Tenant '${tenant.code}' activated`,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  }
);
