import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const EMP_ALICE = 'aaaaaaaa-1111-1111-1111-111111111111';
const EMP_MGR = 'aaaaaaaa-2222-2222-2222-222222222222';

interface FixtureLeave {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  days_requested: number;
}

const fixtureLeaves: FixtureLeave[] = [
  {
    id: 'leave-1',
    employee_id: EMP_ALICE,
    leave_type: 'vacation',
    start_date: '2026-06-01',
    end_date: '2026-06-05',
    status: 'pending',
    days_requested: 5,
  },
  {
    id: 'leave-2',
    employee_id: EMP_ALICE,
    leave_type: 'sick',
    start_date: '2026-05-10',
    end_date: '2026-05-10',
    status: 'approved',
    days_requested: 1,
  },
];

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_tenantId: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: vi.fn(async (sql: string, ..._params: unknown[]) => {
        if (/^INSERT/i.test(sql)) {
          return [
            {
              id: 'leave-new',
              employee_id: EMP_ALICE,
              leave_type: 'vacation',
              status: 'pending',
              created_at: new Date(),
            },
          ];
        }
        if (/^UPDATE/i.test(sql)) {
          return [
            {
              id: 'leave-1',
              employee_id: EMP_ALICE,
              status: 'approved',
              approver_id: EMP_MGR,
              approved_at: new Date(),
            },
          ];
        }
        return fixtureLeaves;
      }),
      // F2 H4: auditedTransaction wraps writes in tx.audit_logs.create
      audit_logs: {
        create: vi.fn(async () => ({ id: 'audit-mock-id' })),
      },
    };
    return fn(tx);
  }),
  mergeScopedWhere: vi.fn(),
  prisma: {} as unknown,
}));

let mockSession: {
  user?: { id?: string; role?: string; tenantId?: string | null; employeeId?: string | null };
} | null = null;
vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!mockSession?.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    (req as unknown as { session: typeof mockSession }).session = mockSession;
    next();
  },
}));

const cacheStub = {
  ensureLoaded: vi.fn().mockResolvedValue(undefined),
  isAllowed: vi.fn(),
  getPermission: vi.fn(),
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { leavesRouter } from '../leaves.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/leaves', leavesRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /leaves', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    cacheStub.getPermission.mockReset().mockReturnValue({ scopeType: 'SELF' });
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/leaves');
    expect(res.status).toBe(401);
  });

  it('400 tenant_required when session has no tenantId', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE' } };
    const res = await request(buildApp()).get('/leaves');
    expect(res.status).toBe(400);
  });

  it('403 when role lacks LEAVES.view', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/leaves');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ area: 'LEAVES', action: 'view' });
  });

  it('200 returns leaves with SELF scope filtering', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    const res = await request(buildApp()).get('/leaves');
    expect(res.status).toBe(200);
    expect(res.body.scope).toBe('SELF');
    expect(res.body.data).toHaveLength(2);
  });

  it('200 with TENANT scope (HR_DIRECTOR)', async () => {
    mockSession = {
      user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA, employeeId: EMP_MGR },
    };
    cacheStub.getPermission.mockReturnValue({ scopeType: 'TENANT' });
    const res = await request(buildApp()).get('/leaves');
    expect(res.status).toBe(200);
    expect(res.body.scope).toBe('TENANT');
  });

  it('400 on invalid status filter (Zod rejection)', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    const res = await request(buildApp()).get('/leaves?status=invalid');
    expect(res.status).toBe(400);
  });
});

describe('POST /leaves (submit)', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    cacheStub.getPermission.mockReset();
  });

  it('403 when role lacks LEAVES.create', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).post('/leaves').send({
      leave_type: 'vacation',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      days_requested: 5,
    });
    expect(res.status).toBe(403);
  });

  it('400 employee_required when caller has no employeeId', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).post('/leaves').send({
      leave_type: 'vacation',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      days_requested: 5,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('employee_required');
  });

  it('400 Zod rejection on bad date format', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    const res = await request(buildApp()).post('/leaves').send({
      leave_type: 'vacation',
      start_date: 'not-a-date',
      end_date: '2026-06-05',
      days_requested: 5,
    });
    expect(res.status).toBe(400);
  });

  it('201 on successful submit', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    const res = await request(buildApp()).post('/leaves').send({
      leave_type: 'vacation',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
      days_requested: 5,
      reason: 'family vacation',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });
});

describe('POST /leaves/:id/approve', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    cacheStub.getPermission.mockReset();
  });

  it('403 when role lacks LEAVES.approve', async () => {
    mockSession = {
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ALICE },
    };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).post(
      '/leaves/' + 'aaaaaaaa-1111-1111-1111-111111111111' + '/approve'
    );
    expect(res.status).toBe(403);
  });

  it('200 approve succeeds for manager', async () => {
    mockSession = {
      user: { id: 'u1', role: 'LINE_MANAGER', tenantId: ECONOVA, employeeId: EMP_MGR },
    };
    const res = await request(buildApp()).post(
      '/leaves/' + 'aaaaaaaa-1111-1111-1111-111111111111' + '/approve'
    );
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('approved');
  });

  it('400 Zod rejection on non-uuid id', async () => {
    mockSession = {
      user: { id: 'u1', role: 'LINE_MANAGER', tenantId: ECONOVA, employeeId: EMP_MGR },
    };
    const res = await request(buildApp()).post('/leaves/not-a-uuid/approve');
    expect(res.status).toBe(400);
  });
});
