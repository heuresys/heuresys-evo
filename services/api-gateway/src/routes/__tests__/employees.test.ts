import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA_TENANT = '11111111-1111-1111-1111-111111111111';
const RTL_BANK_TENANT = '22222222-2222-2222-2222-222222222222';

type FixtureEmployee = {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
};

const econovaEmployees: FixtureEmployee[] = [
  {
    id: 'aaaaaaaa-1111-1111-1111-111111111111',
    tenantId: ECONOVA_TENANT,
    firstName: 'Laura',
    lastName: 'Bertolini',
    email: 'laura@econova.org',
  },
  {
    id: 'aaaaaaaa-1111-1111-1111-111111111112',
    tenantId: ECONOVA_TENANT,
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco@econova.org',
  },
];
const rtlBankEmployees: FixtureEmployee[] = Array.from({ length: 4 }, (_, i) => ({
  id: `bbbbbbbb-2222-2222-2222-22222222222${i}`,
  tenantId: RTL_BANK_TENANT,
  firstName: `Banker${i}`,
  lastName: 'Surname',
  email: `b${i}@rtlbank.it`,
}));

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const dataset =
      tenantId === ECONOVA_TENANT
        ? econovaEmployees
        : tenantId === RTL_BANK_TENANT
          ? rtlBankEmployees
          : [];
    const tx = {
      employees: {
        findMany: vi.fn(async (args: { take?: number; cursor?: { id: string }; skip?: number }) => {
          let rows = dataset;
          if (args.cursor) {
            const idx = rows.findIndex((r) => r.id === args.cursor!.id);
            rows = idx >= 0 ? rows.slice(idx + (args.skip ?? 0)) : [];
          }
          return rows.slice(0, args.take ?? 10);
        }),
        count: vi.fn(async () => dataset.length),
      },
    };
    return fn(tx);
  }),
}));

type MockSession = { expires: string; user?: { id?: string; tenantId?: string | null } };
const FAR_FUTURE = '2099-12-31T23:59:59Z';
let mockSession: MockSession | null = null;
function withUser(user: NonNullable<MockSession['user']>): MockSession {
  return { expires: FAR_FUTURE, user };
}
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

describe('GET /employees contract', () => {
  beforeEach(() => {
    mockSession = null;
  });

  it('returns 401 when no session is present', async () => {
    const res = await request(buildApp()).get('/employees');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'unauthorized' });
  });

  it('returns 400 tenant_required when session has no tenantId and no header', async () => {
    mockSession = withUser({ id: 'u1' });
    const res = await request(buildApp()).get('/employees');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('tenant_required');
  });

  it('falls back to X-Tenant-Id header when session has no tenantId', async () => {
    mockSession = withUser({ id: 'u1' });
    const res = await request(buildApp()).get('/employees').set('X-Tenant-Id', ECONOVA_TENANT);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('returns EcoNova-only data when session.user.tenantId = EcoNova', async () => {
    mockSession = withUser({ id: 'u1', tenantId: ECONOVA_TENANT });
    const res = await request(buildApp()).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body.data.every((e: FixtureEmployee) => e.tenantId === ECONOVA_TENANT)).toBe(true);
    expect(res.body.total).toBe(2);
  });

  it('returns RTL Bank-only data when session.user.tenantId = RTL Bank — RLS isolation', async () => {
    mockSession = withUser({ id: 'u1', tenantId: RTL_BANK_TENANT });
    const res = await request(buildApp()).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.data.every((e: FixtureEmployee) => e.tenantId === RTL_BANK_TENANT)).toBe(true);
  });

  it('returns empty data + total=0 when tenantId is unknown', async () => {
    mockSession = withUser({ id: 'u1', tenantId: '99999999-9999-9999-9999-999999999999' });
    const res = await request(buildApp()).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('rejects limit > 100 with 400 (Zod validation)', async () => {
    mockSession = withUser({ id: 'u1', tenantId: ECONOVA_TENANT });
    const res = await request(buildApp()).get('/employees?limit=500');
    expect(res.status).toBe(400);
  });

  it('rejects non-uuid cursor with 400 (Zod validation)', async () => {
    mockSession = withUser({ id: 'u1', tenantId: ECONOVA_TENANT });
    const res = await request(buildApp()).get('/employees?cursor=not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('applies limit and returns nextCursor when result == limit', async () => {
    mockSession = withUser({ id: 'u1', tenantId: RTL_BANK_TENANT });
    const res = await request(buildApp()).get('/employees?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.nextCursor).toBe(rtlBankEmployees[1]!.id);
  });

  it('returns nextCursor=null when result < limit (last page)', async () => {
    mockSession = withUser({ id: 'u1', tenantId: ECONOVA_TENANT });
    const res = await request(buildApp()).get('/employees?limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.nextCursor).toBeNull();
  });

  it('includes total count regardless of pagination window', async () => {
    mockSession = withUser({ id: 'u1', tenantId: RTL_BANK_TENANT });
    const res = await request(buildApp()).get('/employees?limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(4);
  });

  it('session tenantId takes precedence over X-Tenant-Id header (defense-in-depth)', async () => {
    mockSession = withUser({ id: 'u1', tenantId: ECONOVA_TENANT });
    const res = await request(buildApp()).get('/employees').set('X-Tenant-Id', RTL_BANK_TENANT);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2); // EcoNova count, NOT RTL Bank's 4
  });
});
