import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const RTL_TENANT = '11111111-1111-1111-1111-111111111111';
const ALICE_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BOB_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ALICE_USER = 'aaaaaaaa-1111-1111-1111-111111111111';

type Employee = {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string | null;
  department: string | null;
  is_active: boolean | null;
  hire_date: Date | null;
  manager_id: string | null;
  org_unit_id: string | null;
  cost_center_id: string | null;
  pernr: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

let employees: Employee[] = [];
let employeeSkills: { employee_id: string; skill_name: string; created_at: Date }[] = [];

const { auditLogsCreateMock } = vi.hoisted(() => ({
  auditLogsCreateMock: vi.fn(async () => ({ id: 'audit-mock-id' })),
}));

function makeEmployee(o: Partial<Employee> & { id: string; email: string }): Employee {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    tenant_id: RTL_TENANT,
    first_name: 'Test',
    last_name: 'User',
    job_title: null,
    department: null,
    is_active: true,
    hire_date: null,
    manager_id: null,
    org_unit_id: null,
    cost_center_id: null,
    pernr: null,
    created_at: now,
    updated_at: now,
    ...o,
  };
}

vi.mock('../../db/pool.js', () => ({
  prisma: {},
  withTenant: vi.fn(async (_tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      employees: {
        findUnique: vi.fn(async (args: { where: { id: string } }) => {
          return employees.find((e) => e.id === args.where.id) ?? null;
        }),
        findFirst: vi.fn(async (args: { where: { email?: string } }) => {
          if (args.where.email) return employees.find((e) => e.email === args.where.email) ?? null;
          return null;
        }),
        findMany: vi.fn(async () => [...employees]),
        count: vi.fn(async () => employees.length),
        create: vi.fn(async (args: { data: Record<string, unknown> }) => {
          const e = makeEmployee({
            id: `00000000-aaaa-${String(employees.length).padStart(4, '0')}-0000-000000000000`,
            email: args.data['email'] as string,
            first_name: args.data['first_name'] as string,
            last_name: args.data['last_name'] as string,
            job_title: (args.data['job_title'] as string | null) ?? null,
            department: (args.data['department'] as string | null) ?? null,
            tenant_id: args.data['tenant_id'] as string,
          });
          employees.push(e);
          return e;
        }),
        update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
          const e = employees.find((x) => x.id === args.where.id);
          if (!e) throw new Error('not found');
          Object.assign(e, args.data, { updated_at: new Date() });
          return e;
        }),
        delete: vi.fn(async (args: { where: { id: string } }) => {
          employees = employees.filter((e) => e.id !== args.where.id);
          return { id: args.where.id };
        }),
      },
      employee_skills: {
        findMany: vi.fn(async (args: { where: { employee_id: string } }) => {
          return employeeSkills.filter((s) => s.employee_id === args.where.employee_id);
        }),
      },
      // S28-bis Wave 8 H4: auditedTransaction wraps writes in tx.audit_logs.create
      audit_logs: {
        create: auditLogsCreateMock,
      },
    };
    return fn(tx);
  }),
}));

type MockSession = {
  expires: string;
  user?: {
    id?: string;
    role?: string;
    tenantId?: string | null;
    employeeId?: string | null;
  };
};
let mockSession: MockSession | null = null;
const FAR_FUTURE = '2099-12-31T23:59:59Z';

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

vi.mock('../../middleware/tenant.js', () => ({
  resolveTenant: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const session = (req as express.Request & { session?: MockSession }).session;
    const tenantHeader = req.headers['x-tenant-id'];
    const tenantId =
      session?.user?.tenantId ?? (typeof tenantHeader === 'string' ? tenantHeader : null);
    if (!tenantId) {
      res.status(400).json({ error: 'tenant_required' });
      return;
    }
    (req as express.Request & { tenantId?: string }).tenantId = tenantId;
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

import { employeesRouter } from '../employees.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/employees', employeesRouter);
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
  employees = [
    makeEmployee({
      id: ALICE_ID,
      email: 'alice@rtl-bank.org',
      first_name: 'Alice',
      last_name: 'Verdi',
      job_title: 'CHRO',
    }),
    makeEmployee({
      id: BOB_ID,
      email: 'bob@rtl-bank.org',
      first_name: 'Bob',
      last_name: 'Rossi',
      job_title: 'Analyst',
      manager_id: ALICE_ID,
    }),
  ];
  employeeSkills = [
    { employee_id: ALICE_ID, skill_name: 'leadership', created_at: new Date() },
    { employee_id: ALICE_ID, skill_name: 'strategy', created_at: new Date() },
    { employee_id: BOB_ID, skill_name: 'sql', created_at: new Date() },
  ];
});

describe('GET /employees/meta/*', () => {
  it('returns 401 without auth', async () => {
    const res = await request(buildApp()).get('/employees/meta/employment-statuses');
    expect(res.status).toBe(401);
  });

  it('returns employment statuses with auth', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/employees/meta/employment-statuses');
    expect(res.status).toBe(200);
    const values = (res.body.data as { value: string }[]).map((d) => d.value);
    expect(values).toEqual(
      expect.arrayContaining(['active', 'inactive', 'on_leave', 'terminated'])
    );
  });

  it('returns termination reasons', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/employees/meta/termination-reasons');
    expect(res.status).toBe(200);
  });
});

describe('GET /employees/me', () => {
  it('returns 404 when user has no employeeId linked', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/employees/me');
    expect(res.status).toBe(404);
  });

  it('returns own employee profile', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_USER, role: 'HR_DIRECTOR', tenantId: RTL_TENANT, employeeId: ALICE_ID },
    };
    const res = await request(buildApp()).get('/employees/me');
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('alice@rtl-bank.org');
  });

  it('returns own skills', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_USER, role: 'HR_DIRECTOR', tenantId: RTL_TENANT, employeeId: ALICE_ID },
    };
    const res = await request(buildApp()).get('/employees/me/skills');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

describe('GET /employees/:id', () => {
  it('returns 400 on invalid UUID', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/employees/not-uuid');
    expect(res.status).toBe(400);
  });

  it('returns 404 not found', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(
      `/employees/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}`
    );
    expect(res.status).toBe(404);
  });

  it('returns employee by ID', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/employees/${BOB_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('bob@rtl-bank.org');
  });

  it('returns 403 when role not allowed', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: RTL_TENANT },
    };
    cacheMock.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get(`/employees/${BOB_ID}`);
    expect(res.status).toBe(403);
  });

  it('returns skills for an employee', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/employees/${ALICE_ID}/skills`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
});

describe('POST /employees', () => {
  it('creates a new employee', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/employees')
      .send({ first_name: 'Erika', last_name: 'Bianchi', email: 'erika@rtl-bank.org' });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('erika@rtl-bank.org');
  });

  it('rejects 409 on duplicate email', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/employees')
      .send({ first_name: 'Alice', last_name: 'X', email: 'alice@rtl-bank.org' });
    expect(res.status).toBe(409);
  });

  it('rejects invalid email', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/employees')
      .send({ first_name: 'X', last_name: 'Y', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('audits CREATE employees with EMPLOYEE category', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    await request(buildApp())
      .post('/employees')
      .send({ first_name: 'Audit', last_name: 'Tester', email: 'audit@rtl-bank.org' });
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'CREATE',
          category: 'EMPLOYEE',
          resource_type: 'employees',
          user_id: 'u1',
          user_role: 'HR_DIRECTOR',
          tenant_id: RTL_TENANT,
          success: true,
        }),
      })
    );
  });

  it('audits UPDATE employees with EMPLOYEE category', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    await request(buildApp()).patch(`/employees/${BOB_ID}`).send({ job_title: 'Senior Analyst' });
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'UPDATE',
          category: 'EMPLOYEE',
          resource_type: 'employees',
          resource_id: BOB_ID,
          user_id: 'u1',
          tenant_id: RTL_TENANT,
        }),
      })
    );
  });

  it('audits DELETE employees with EMPLOYEE category (hard delete)', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'SUPERUSER', tenantId: RTL_TENANT },
    };
    await request(buildApp()).delete(`/employees/${BOB_ID}?hard=true`);
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'DELETE',
          category: 'EMPLOYEE',
          resource_type: 'employees',
          resource_id: BOB_ID,
          user_role: 'SUPERUSER',
          tenant_id: RTL_TENANT,
        }),
      })
    );
  });
});

describe('PATCH /employees/:id', () => {
  it('updates an employee', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .patch(`/employees/${BOB_ID}`)
      .send({ job_title: 'Senior Analyst' });
    expect(res.status).toBe(200);
    expect(res.body.data.job_title).toBe('Senior Analyst');
  });

  it('returns 404 when employee not found', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .patch(`/employees/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}`)
      .send({ job_title: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /employees/:id', () => {
  it('soft-archives by default', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).delete(`/employees/${BOB_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('archived');
    expect(employees.find((e) => e.id === BOB_ID)?.is_active).toBe(false);
  });

  it('hard-deletes when SUPERUSER + ?hard=true', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'SUPERUSER', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).delete(`/employees/${BOB_ID}?hard=true`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('permanently deleted');
    expect(employees.find((e) => e.id === BOB_ID)).toBeUndefined();
  });

  it('soft-archives when non-SUPERUSER + ?hard=true (downgrade)', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).delete(`/employees/${BOB_ID}?hard=true`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('archived');
    expect(employees.find((e) => e.id === BOB_ID)).toBeDefined();
  });
});
