import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const RTL_TENANT = '11111111-1111-1111-1111-111111111111';
const ROOT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const HR_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const FINANCE_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const HR_OPS_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

type OrgUnit = {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  name_en: string | null;
  parent_id: string | null;
  org_level: number;
  org_type: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  manager_id: string | null;
  default_location_id: string | null;
  headcount_budget: number | null;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

let orgUnits: OrgUnit[] = [];
let employeesByOrg: Map<string, number> = new Map();

function makeOu(
  o: Partial<OrgUnit> & { id: string; code: string; name: string; org_level: number }
): OrgUnit {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    tenant_id: RTL_TENANT,
    name_en: null,
    parent_id: null,
    org_type: null,
    is_active: true,
    sort_order: 0,
    manager_id: null,
    default_location_id: null,
    headcount_budget: null,
    description: null,
    created_at: now,
    updated_at: now,
    ...o,
  };
}

vi.mock('../../db/pool.js', () => ({
  prisma: {},
  withTenant: vi.fn(async (_tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      org_units: {
        findMany: vi.fn(
          async (args: {
            where?: Record<string, unknown>;
            take?: number;
            skip?: number;
            distinct?: string[];
          }) => {
            let rows = [...orgUnits];
            const w = args.where ?? {};
            if (typeof w['is_active'] === 'boolean')
              rows = rows.filter((r) => r.is_active === w['is_active']);
            if (typeof w['org_type'] === 'string')
              rows = rows.filter((r) => r.org_type === w['org_type']);
            if (typeof w['parent_id'] === 'string')
              rows = rows.filter((r) => r.parent_id === w['parent_id']);
            if (w['parent_id'] === null) rows = rows.filter((r) => r.parent_id === null);
            if (
              w['org_type'] &&
              typeof w['org_type'] === 'object' &&
              'not' in (w['org_type'] as object)
            ) {
              rows = rows.filter((r) => r.org_type !== null);
            }
            if (Array.isArray(args.distinct) && args.distinct.includes('org_type')) {
              const seen = new Set<string>();
              rows = rows.filter((r) => {
                if (!r.org_type || seen.has(r.org_type)) return false;
                seen.add(r.org_type);
                return true;
              });
            }
            rows.sort(
              (a, b) =>
                a.org_level - b.org_level ||
                (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
                a.name.localeCompare(b.name)
            );
            const skip = args.skip ?? 0;
            const take = args.take ?? rows.length;
            return rows.slice(skip, skip + take);
          }
        ),
        count: vi.fn(async (args?: { where?: Record<string, unknown> }) => {
          let rows = [...orgUnits];
          const w = args?.where ?? {};
          if (typeof w['parent_id'] === 'string')
            rows = rows.filter((r) => r.parent_id === w['parent_id']);
          return rows.length;
        }),
        findUnique: vi.fn(async (args: { where: { id: string } }) => {
          return orgUnits.find((r) => r.id === args.where.id) ?? null;
        }),
        findFirst: vi.fn(async (args: { where: { code?: string } }) => {
          if (args.where.code) return orgUnits.find((r) => r.code === args.where.code) ?? null;
          return null;
        }),
        create: vi.fn(async (args: { data: Record<string, unknown> }) => {
          const ou = makeOu({
            id: `00000000-aaaa-${String(orgUnits.length).padStart(4, '0')}-0000-000000000000`,
            code: args.data['code'] as string,
            name: args.data['name'] as string,
            org_level: (args.data['org_level'] as number) ?? 1,
            parent_id: (args.data['parent_id'] as string | null) ?? null,
            org_type: (args.data['org_type'] as string | null) ?? null,
            tenant_id: args.data['tenant_id'] as string,
          });
          orgUnits.push(ou);
          return ou;
        }),
        update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
          const ou = orgUnits.find((x) => x.id === args.where.id);
          if (!ou) throw new Error('not found');
          Object.assign(ou, args.data, { updated_at: new Date() });
          return ou;
        }),
        delete: vi.fn(async (args: { where: { id: string } }) => {
          orgUnits = orgUnits.filter((r) => r.id !== args.where.id);
          return { id: args.where.id };
        }),
      },
      employees: {
        count: vi.fn(async (args: { where: { org_unit_id: string } }) => {
          return employeesByOrg.get(args.where.org_unit_id) ?? 0;
        }),
        findMany: vi.fn(async (args: { where: { org_unit_id: string } }) => {
          const count = employeesByOrg.get(args.where.org_unit_id) ?? 0;
          return Array.from({ length: count }, (_, i) => ({
            id: `emp-${i}`,
            first_name: `E${i}`,
            last_name: 'X',
            email: `e${i}@x.com`,
            org_unit_id: args.where.org_unit_id,
          }));
        }),
      },
    };
    return fn(tx);
  }),
}));

type MockSession = {
  expires: string;
  user?: { id?: string; role?: string; tenantId?: string | null };
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
    const tenantId = session?.user?.tenantId ?? null;
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

import { orgUnitsRouter } from '../org-units.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/org-units', orgUnitsRouter);
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
  employeesByOrg = new Map();
  orgUnits = [
    makeOu({ id: ROOT_ID, code: 'ROOT', name: 'RTL Bank', org_level: 1, org_type: 'company' }),
    makeOu({
      id: HR_ID,
      code: 'HR',
      name: 'HR Department',
      org_level: 2,
      parent_id: ROOT_ID,
      org_type: 'department',
    }),
    makeOu({
      id: FINANCE_ID,
      code: 'FIN',
      name: 'Finance',
      org_level: 2,
      parent_id: ROOT_ID,
      org_type: 'department',
    }),
    makeOu({
      id: HR_OPS_ID,
      code: 'HR-OPS',
      name: 'HR Operations',
      org_level: 3,
      parent_id: HR_ID,
      org_type: 'team',
    }),
  ];
});

describe('GET /org-units', () => {
  it('rejects 401 without auth', async () => {
    const res = await request(buildApp()).get('/org-units');
    expect(res.status).toBe(401);
  });

  it('rejects 400 without tenant', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'HR_DIRECTOR' } };
    const res = await request(buildApp()).get('/org-units');
    expect(res.status).toBe(400);
  });

  it('returns full list with employee_count', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    employeesByOrg.set(HR_ID, 12);
    const res = await request(buildApp()).get('/org-units');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(4);
    const hr = (res.body.data as { id: string; employee_count: number }[]).find(
      (r) => r.id === HR_ID
    );
    expect(hr?.employee_count).toBe(12);
  });

  it('filters by org_type', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units?org_type=department');
    expect(res.body.data).toHaveLength(2);
  });

  it('filters by parent_id=null (roots)', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units?parent_id=null');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(ROOT_ID);
  });
});

describe('GET /org-units/tree', () => {
  it('builds hierarchical tree', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units/tree');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    const root = res.body.data[0];
    expect(root.id).toBe(ROOT_ID);
    expect(root.children).toHaveLength(2);
    const hrNode = root.children.find((c: { id: string }) => c.id === HR_ID);
    expect(hrNode.children).toHaveLength(1);
  });

  it('hierarchy alias works', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units/hierarchy');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /org-units/types', () => {
  it('returns distinct org types', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units/types');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expect.arrayContaining(['company', 'department', 'team']));
  });
});

describe('GET /org-units/:id', () => {
  it('returns single org unit', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/org-units/${HR_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe('HR');
  });

  it('returns 404 not found', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(
      `/org-units/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}`
    );
    expect(res.status).toBe(404);
  });

  it('returns 400 invalid UUID', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/org-units/bad');
    expect(res.status).toBe(400);
  });
});

describe('GET /org-units/:id/children + /employees', () => {
  it('returns children of an org unit', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/org-units/${ROOT_ID}/children`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('returns employees of an org unit', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    employeesByOrg.set(HR_ID, 3);
    const res = await request(buildApp()).get(`/org-units/${HR_ID}/employees`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });
});

describe('POST /org-units', () => {
  it('creates root unit', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/org-units')
      .send({ code: 'IT', name: 'IT Department', org_type: 'department' });
    expect(res.status).toBe(201);
    expect(res.body.data.org_level).toBe(1);
  });

  it('creates child unit with computed org_level', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/org-units')
      .send({ code: 'IT-DEV', name: 'IT Dev Team', parent_id: HR_ID });
    expect(res.status).toBe(201);
    expect(res.body.data.org_level).toBe(3);
  });

  it('rejects 409 duplicate code', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/org-units')
      .send({ code: 'HR', name: 'HR Duplicate' });
    expect(res.status).toBe(409);
  });

  it('rejects 400 unknown parent', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/org-units')
      .send({ code: 'X', name: 'X', parent_id: '99999999-9999-9999-9999-999999999999' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /org-units/:id', () => {
  it('updates fields', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .patch(`/org-units/${HR_ID}`)
      .send({ name: 'HR Department Updated', headcount_budget: 50 });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('HR Department Updated');
  });
});

describe('DELETE /org-units/:id', () => {
  it('deletes unit without children/employees', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).delete(`/org-units/${HR_OPS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });

  it('refuses to delete unit with children', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).delete(`/org-units/${HR_ID}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('children');
  });

  it('archives instead of deleting when employees exist', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    employeesByOrg.set(HR_OPS_ID, 5);
    const res = await request(buildApp()).delete(`/org-units/${HR_OPS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('archived');
    expect(orgUnits.find((o) => o.id === HR_OPS_ID)?.is_active).toBe(false);
  });
});
