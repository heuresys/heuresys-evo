import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

type MockSession = {
  expires: string;
  user?: { id?: string; role?: string; tenantId?: string | null };
};
const FAR_FUTURE = '2099-12-31T23:59:59Z';
let mockSession: MockSession | null = null;

vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!mockSession?.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    (req as express.Request & { session?: MockSession }).session = mockSession;
    next();
  },
}));

const cacheMock = {
  ensureLoaded: vi.fn().mockResolvedValue(undefined),
  isAllowed: vi.fn().mockReturnValue(true),
};

vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheMock,
}));

const HEURESYS_ID = '00000000-0000-0000-0000-000000000001';
const RTL_BANK_ID = '11111111-1111-1111-1111-111111111111';
const SMARTFOOD_ID = '22222222-2222-2222-2222-222222222222';
const ECONOVA_ID = '33333333-3333-3333-3333-333333333333';

type Tenant = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  region: string | null;
  status: string;
  subscription_plan: string;
  industry_type: string | null;
  employee_count: number;
  created_at: Date;
  updated_at: Date;
  sap_company_code: string | null;
  annual_revenue_eur: bigint | null;
  verified_website: string | null;
  tax_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  industry_profile_id: string | null;
  setup_completed: boolean;
  setup_step: number;
  settings: Record<string, unknown>;
};

function makeTenant(overrides: Partial<Tenant>): Tenant {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    id: HEURESYS_ID,
    code: 'heuresys',
    name: 'Heuresys',
    description: null,
    region: null,
    status: 'active',
    subscription_plan: 'enterprise',
    industry_type: null,
    employee_count: 0,
    created_at: now,
    updated_at: now,
    sap_company_code: null,
    annual_revenue_eur: null,
    verified_website: null,
    tax_id: null,
    contact_email: null,
    contact_phone: null,
    industry_profile_id: null,
    setup_completed: true,
    setup_step: 0,
    settings: {},
    ...overrides,
  };
}

let tenants: Tenant[] = [];
let employeeCountByTenant: Map<string, number> = new Map();

const { auditLogsCreateMock } = vi.hoisted(() => ({
  auditLogsCreateMock: vi.fn(async () => ({ id: 'audit-id-mock' })),
}));

function findById(id: string): Tenant | null {
  return tenants.find((t) => t.id === id) ?? null;
}
function findByCode(code: string): Tenant | null {
  return tenants.find((t) => t.code === code) ?? null;
}

vi.mock('../../db/pool.js', () => ({
  prisma: {
    tenants: {
      findMany: vi.fn(
        async (args: { where?: Record<string, unknown>; take?: number; skip?: number }) => {
          let rows = [...tenants];
          const where = args.where ?? {};
          if (typeof where['status'] === 'string') {
            rows = rows.filter((r) => r.status === where['status']);
          }
          if (typeof where['subscription_plan'] === 'string') {
            rows = rows.filter((r) => r.subscription_plan === where['subscription_plan']);
          }
          if (Array.isArray(where['OR'])) {
            const search = (where['OR'][0] as { name?: { contains: string } }).name?.contains ?? '';
            rows = rows.filter(
              (r) =>
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.code.toLowerCase().includes(search.toLowerCase())
            );
          }
          rows.sort((a, b) => a.name.localeCompare(b.name));
          const skip = args.skip ?? 0;
          const take = args.take ?? rows.length;
          return rows.slice(skip, skip + take);
        }
      ),
      count: vi.fn(async (args?: { where?: Record<string, unknown> }) => {
        const where = args?.where ?? {};
        let rows = [...tenants];
        if (typeof where['status'] === 'string') {
          rows = rows.filter((r) => r.status === where['status']);
        }
        if (typeof where['subscription_plan'] === 'string') {
          rows = rows.filter((r) => r.subscription_plan === where['subscription_plan']);
        }
        return rows.length;
      }),
      findUnique: vi.fn(async (args: { where: { id?: string; code?: string } }) => {
        if (args.where.id) return findById(args.where.id);
        if (args.where.code) return findByCode(args.where.code);
        return null;
      }),
      create: vi.fn(async (args: { data: Record<string, unknown> }) => {
        const t = makeTenant({
          id: `00000000-aaaa-${String(tenants.length).padStart(4, '0')}-0000-000000000000`,
          code: args.data['code'] as string,
          name: args.data['name'] as string,
          description: (args.data['description'] as string | null) ?? null,
          region: (args.data['region'] as string | null) ?? null,
          status: (args.data['status'] as string) ?? 'pending',
          subscription_plan: (args.data['subscription_plan'] as string) ?? 'free',
          industry_type: (args.data['industry_type'] as string | null) ?? null,
          sap_company_code: (args.data['sap_company_code'] as string | null) ?? null,
          annual_revenue_eur: (args.data['annual_revenue_eur'] as bigint | null) ?? null,
          employee_count: (args.data['employee_count'] as number) ?? 0,
        });
        tenants.push(t);
        return t;
      }),
      update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
        const t = findById(args.where.id);
        if (!t) throw new Error('not found');
        Object.assign(t, args.data, { updated_at: new Date() });
        return t;
      }),
      delete: vi.fn(async (args: { where: { id: string } }) => {
        tenants = tenants.filter((t) => t.id !== args.where.id);
        return { id: args.where.id };
      }),
    },
    employees: {
      count: vi.fn(async (args: { where: { tenant_id: string } }) => {
        return employeeCountByTenant.get(args.where.tenant_id) ?? 0;
      }),
    },
    audit_logs: {
      create: auditLogsCreateMock,
    },
  },
  withTenant: vi.fn(async (_tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      tenants: {
        create: vi.fn(async (args: { data: Record<string, unknown>; select?: unknown }) => {
          const t = makeTenant({
            id: `00000000-aaaa-${String(tenants.length).padStart(4, '0')}-0000-000000000000`,
            code: args.data['code'] as string,
            name: args.data['name'] as string,
            description: (args.data['description'] as string | null) ?? null,
            region: (args.data['region'] as string | null) ?? null,
            status: (args.data['status'] as string) ?? 'pending',
            subscription_plan: (args.data['subscription_plan'] as string) ?? 'free',
            industry_type: (args.data['industry_type'] as string | null) ?? null,
            sap_company_code: (args.data['sap_company_code'] as string | null) ?? null,
            annual_revenue_eur: (args.data['annual_revenue_eur'] as bigint | null) ?? null,
            employee_count: (args.data['employee_count'] as number) ?? 0,
          });
          tenants.push(t);
          return t;
        }),
        update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
          const t = findById(args.where.id);
          if (!t) throw new Error('not found');
          Object.assign(t, args.data, { updated_at: new Date() });
          return t;
        }),
        delete: vi.fn(async (args: { where: { id: string } }) => {
          tenants = tenants.filter((t) => t.id !== args.where.id);
          return { id: args.where.id };
        }),
      },
      audit_logs: {
        create: auditLogsCreateMock,
      },
    };
    return fn(tx);
  }),
}));

import { tenantsRouter } from '../tenants.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/tenants', tenantsRouter);
  app.use((_req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'not_found' });
  });
  app.use(errorHandler);
  return app;
}

beforeEach(() => {
  mockSession = null;
  cacheMock.ensureLoaded.mockReset().mockResolvedValue(undefined);
  cacheMock.isAllowed.mockReset().mockReturnValue(true);
  auditLogsCreateMock.mockClear();
  employeeCountByTenant = new Map();
  tenants = [
    makeTenant({
      id: HEURESYS_ID,
      code: 'heuresys',
      name: 'Heuresys Platform',
      status: 'active',
      subscription_plan: 'enterprise',
    }),
    makeTenant({
      id: RTL_BANK_ID,
      code: 'rtl-bank',
      name: 'RTL Bank',
      status: 'active',
      subscription_plan: 'enterprise',
      employee_count: 1200,
    }),
    makeTenant({
      id: SMARTFOOD_ID,
      code: 'smartfood',
      name: 'SmartFood',
      status: 'active',
      subscription_plan: 'professional',
      employee_count: 280,
    }),
    makeTenant({
      id: ECONOVA_ID,
      code: 'econova',
      name: 'EcoNova',
      status: 'inactive',
      subscription_plan: 'starter',
      employee_count: 45,
    }),
  ];
});

describe('GET /tenants list', () => {
  it('returns 401 without session', async () => {
    const res = await request(buildApp()).get('/tenants');
    expect(res.status).toBe(401);
  });

  it('returns 403 when role not allowed', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'EMPLOYEE' } };
    cacheMock.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/tenants');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'forbidden', area: 'PLATFORM', action: 'view' });
  });

  it('returns full list with pagination meta when authorized', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(4);
    expect(res.body.meta).toMatchObject({
      totalCount: 4,
      limit: 50,
      offset: 0,
      hasMore: false,
    });
  });

  it('filters by status', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants?status=inactive');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].code).toBe('econova');
  });

  it('filters by plan', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants?plan=enterprise');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

describe('GET /tenants/meta/* (public)', () => {
  it('exposes statuses without auth', async () => {
    const res = await request(buildApp()).get('/tenants/meta/statuses');
    expect(res.status).toBe(200);
    const values = (res.body.data as { value: string }[]).map((d) => d.value);
    expect(values).toEqual(
      expect.arrayContaining(['active', 'inactive', 'suspended', 'pending', 'configuring'])
    );
  });

  it('exposes plans without auth', async () => {
    const res = await request(buildApp()).get('/tenants/meta/plans');
    expect(res.status).toBe(200);
    const values = (res.body.data as { value: string }[]).map((d) => d.value);
    expect(values).toEqual(['free', 'starter', 'professional', 'enterprise']);
  });
});

describe('GET /tenants/current', () => {
  it('returns 401 without session', async () => {
    const res = await request(buildApp()).get('/tenants/current');
    expect(res.status).toBe(401);
  });

  it('returns platform-level when session has no tenantId', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants/current');
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: null, code: 'platform', role: 'SUPERUSER' });
  });

  it('returns tenant data when session has tenantId', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: RTL_BANK_ID },
    };
    const res = await request(buildApp()).get('/tenants/current');
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: RTL_BANK_ID, code: 'rtl-bank' });
  });
});

describe('GET /tenants/:identifier', () => {
  it('finds by UUID', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get(`/tenants/${RTL_BANK_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe('rtl-bank');
  });

  it('finds by code', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants/smartfood');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(SMARTFOOD_ID);
  });

  it('returns 404 when not found', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/tenants/unknown-code');
    expect(res.status).toBe(404);
  });
});

describe('POST /tenants', () => {
  it('creates tenant with valid body', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/tenants')
      .send({ code: 'newco', name: 'NewCo S.p.A.' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('newco');
  });

  it('rejects 409 on duplicate code', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/tenants')
      .send({ code: 'rtl-bank', name: 'Duplicate' });
    expect(res.status).toBe(409);
  });

  it('rejects invalid code format', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).post('/tenants').send({ code: 'Bad Code!', name: 'X' });
    expect(res.status).toBe(400);
  });

  it('audits CREATE tenant with TENANT category', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    await request(buildApp()).post('/tenants').send({ code: 'auditco', name: 'Audit Co' });
    expect(auditLogsCreateMock).toHaveBeenCalled();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'CREATE',
          category: 'TENANT',
          resource_type: 'tenant',
          user_id: 'u1',
          user_role: 'SUPERUSER',
          success: true,
        }),
      })
    );
  });
});

describe('PATCH /tenants/:identifier', () => {
  it('allows TENANT_OWNER to update own tenant', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: RTL_BANK_ID },
    };
    const res = await request(buildApp())
      .patch(`/tenants/${RTL_BANK_ID}`)
      .send({ description: 'Bank updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe('Bank updated');
  });

  it('forbids TENANT_OWNER from updating another tenant', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: RTL_BANK_ID },
    };
    const res = await request(buildApp())
      .patch(`/tenants/${SMARTFOOD_ID}`)
      .send({ description: 'sneaky' });
    expect(res.status).toBe(403);
  });

  it('forbids non-SUPERUSER from changing status', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: RTL_BANK_ID },
    };
    const res = await request(buildApp())
      .patch(`/tenants/${RTL_BANK_ID}`)
      .send({ status: 'suspended' });
    expect(res.status).toBe(403);
  });

  it('allows SUPERUSER to change status', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .patch(`/tenants/${RTL_BANK_ID}`)
      .send({ status: 'suspended' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('suspended');
  });
});

describe('DELETE /tenants/:identifier', () => {
  it('soft-deactivates tenant by default', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete(`/tenants/${SMARTFOOD_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deactivated');
    expect(findById(SMARTFOOD_ID)?.status).toBe('inactive');
  });

  it('refuses to deactivate the heuresys system tenant', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete('/tenants/heuresys');
    expect(res.status).toBe(400);
  });

  it('refuses permanent delete when tenant has employees', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    employeeCountByTenant.set(SMARTFOOD_ID, 280);
    const res = await request(buildApp()).delete(`/tenants/${SMARTFOOD_ID}?permanent=true`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Cannot permanently delete');
  });

  it('permanently deletes empty tenant', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete(`/tenants/${ECONOVA_ID}?permanent=true`);
    expect(res.status).toBe(200);
    expect(findById(ECONOVA_ID)).toBeNull();
  });
});

describe('POST /tenants/:identifier/activate', () => {
  it('activates inactive tenant', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).post(`/tenants/${ECONOVA_ID}/activate`);
    expect(res.status).toBe(200);
    expect(findById(ECONOVA_ID)?.status).toBe('active');
  });

  it('refuses to re-activate already active tenant', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'SUPERUSER' } };
    const res = await request(buildApp()).post(`/tenants/${RTL_BANK_ID}/activate`);
    expect(res.status).toBe(400);
  });
});
