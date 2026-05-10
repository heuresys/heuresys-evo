import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const RTL_TENANT = '11111111-1111-1111-1111-111111111111';
const PLAN_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const PLAN_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SCENARIO_A = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

type Plan = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  target_date: Date;
  status: string;
};

type Scenario = {
  id: string;
  tenant_id: string;
  workforce_plan_id: string;
  name: string;
  description: string | null;
  status: string | null;
  scenario_type: string | null;
};

type Action = {
  id: string;
  tenant_id: string;
  workforce_plan_id: string;
  scenario_id: string | null;
  action_type: string;
  priority: string | null;
  title: string;
  status: string | null;
  headcount: number | null;
};

let plans: Plan[] = [];
let scenarios: Scenario[] = [];
let actions: Action[] = [];

vi.mock('../../db/pool.js', () => ({
  prisma: {},
  withTenant: vi.fn(async (_tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      workforce_plans: {
        findMany: vi.fn(async (args: { where?: Record<string, unknown> }) => {
          let rows = [...plans];
          if (typeof args.where?.['status'] === 'string') {
            rows = rows.filter((p) => p.status === args.where!['status']);
          }
          return rows;
        }),
        findUnique: vi.fn(async (args: { where: { id: string } }) => {
          return plans.find((p) => p.id === args.where.id) ?? null;
        }),
        create: vi.fn(async (args: { data: Record<string, unknown> }) => {
          const p: Plan = {
            id: `00000000-aaaa-${String(plans.length).padStart(4, '0')}-0000-000000000000`,
            tenant_id: args.data['tenant_id'] as string,
            name: args.data['name'] as string,
            description: (args.data['description'] as string | null) ?? null,
            target_date: args.data['target_date'] as Date,
            status: (args.data['status'] as string) ?? 'draft',
          };
          plans.push(p);
          return p;
        }),
        update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
          const p = plans.find((x) => x.id === args.where.id);
          if (!p) throw new Error('not found');
          Object.assign(p, args.data);
          return p;
        }),
      },
      workforce_plan_scenarios: {
        findMany: vi.fn(async (args: { where?: Record<string, unknown> }) => {
          let rows = [...scenarios];
          if (typeof args.where?.['workforce_plan_id'] === 'string') {
            rows = rows.filter((s) => s.workforce_plan_id === args.where!['workforce_plan_id']);
          }
          return rows;
        }),
        findUnique: vi.fn(async (args: { where: { id: string } }) => {
          return scenarios.find((s) => s.id === args.where.id) ?? null;
        }),
        create: vi.fn(async (args: { data: Record<string, unknown> }) => {
          const s: Scenario = {
            id: `00000000-bbbb-${String(scenarios.length).padStart(4, '0')}-0000-000000000000`,
            tenant_id: args.data['tenant_id'] as string,
            workforce_plan_id: args.data['workforce_plan_id'] as string,
            name: args.data['name'] as string,
            description: (args.data['description'] as string | null) ?? null,
            status: (args.data['status'] as string | null) ?? 'draft',
            scenario_type: (args.data['scenario_type'] as string | null) ?? 'base',
          };
          scenarios.push(s);
          return s;
        }),
      },
      workforce_plan_actions: {
        findMany: vi.fn(async (args: { where: { workforce_plan_id: string } }) => {
          return actions.filter((a) => a.workforce_plan_id === args.where.workforce_plan_id);
        }),
        create: vi.fn(async (args: { data: Record<string, unknown> }) => {
          const a: Action = {
            id: `00000000-cccc-${String(actions.length).padStart(4, '0')}-0000-000000000000`,
            tenant_id: args.data['tenant_id'] as string,
            workforce_plan_id: args.data['workforce_plan_id'] as string,
            scenario_id: (args.data['scenario_id'] as string | null) ?? null,
            action_type: args.data['action_type'] as string,
            priority: (args.data['priority'] as string | null) ?? 'medium',
            title: args.data['title'] as string,
            status: 'pending',
            headcount: (args.data['headcount'] as number | null) ?? 1,
          };
          actions.push(a);
          return a;
        }),
      },
      // F2 H4: auditedTransaction wraps writes in tx.audit_logs.create
      audit_logs: {
        create: vi.fn(async () => ({ id: 'audit-mock-id' })),
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

import { workforcePlanningRouter } from '../workforce-planning.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/workforce-planning', workforcePlanningRouter);
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
  plans = [
    {
      id: PLAN_A,
      tenant_id: RTL_TENANT,
      name: 'Q4 2026 Hiring',
      description: 'Q4 hiring plan',
      target_date: new Date('2026-12-31'),
      status: 'active',
    },
    {
      id: PLAN_B,
      tenant_id: RTL_TENANT,
      name: 'Q1 2027 Reskill',
      description: null,
      target_date: new Date('2027-03-31'),
      status: 'draft',
    },
  ];
  scenarios = [
    {
      id: SCENARIO_A,
      tenant_id: RTL_TENANT,
      workforce_plan_id: PLAN_A,
      name: 'Optimistic',
      description: null,
      status: 'draft',
      scenario_type: 'base',
    },
  ];
  actions = [];
});

describe('GET /workforce-planning/plans', () => {
  it('rejects 401 no auth', async () => {
    const res = await request(buildApp()).get('/workforce-planning/plans');
    expect(res.status).toBe(401);
  });

  it('returns plans for tenant', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/workforce-planning/plans');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('filters by status', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get('/workforce-planning/plans?status=active');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(PLAN_A);
  });
});

describe('POST /workforce-planning/plans', () => {
  it('creates a plan', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/workforce-planning/plans')
      .send({ name: 'New Plan', target_date: '2027-06-30' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('New Plan');
    expect(res.body.data.status).toBe('draft');
  });

  it('rejects missing target_date', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).post('/workforce-planning/plans').send({ name: 'Bad' });
    expect(res.status).toBe(400);
  });
});

describe('GET /workforce-planning/plans/:id', () => {
  it('returns plan by id', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/workforce-planning/plans/${PLAN_A}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Q4 2026 Hiring');
  });

  it('returns 404 not found', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(
      `/workforce-planning/plans/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}`
    );
    expect(res.status).toBe(404);
  });
});

describe('PATCH /workforce-planning/plans/:id', () => {
  it('updates plan status', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .patch(`/workforce-planning/plans/${PLAN_B}`)
      .send({ status: 'active' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('active');
  });
});

describe('Actions', () => {
  it('lists empty actions for new plan', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/workforce-planning/plans/${PLAN_A}/actions`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('creates an action', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post(`/workforce-planning/plans/${PLAN_A}/actions`)
      .send({ action_type: 'hire', title: 'Hire 5 senior devs', headcount: 5, priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.data.action_type).toBe('hire');
    expect(res.body.data.headcount).toBe(5);
  });

  it('rejects creating action for missing plan', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post(`/workforce-planning/plans/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}/actions`)
      .send({ action_type: 'hire', title: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('Scenarios', () => {
  it('lists scenarios filtered by plan_id', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/workforce-planning/scenarios?plan_id=${PLAN_A}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('creates scenario tied to plan', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/workforce-planning/scenarios')
      .send({ workforce_plan_id: PLAN_A, name: 'Pessimistic', scenario_type: 'pessimistic' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Pessimistic');
  });

  it('returns 404 when plan missing on scenario create', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/workforce-planning/scenarios')
      .send({ workforce_plan_id: '99999999-9999-9999-9999-999999999999', name: 'Ghost' });
    expect(res.status).toBe(404);
  });

  it('returns scenario by id', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/workforce-planning/scenarios/${SCENARIO_A}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Optimistic');
  });
});
