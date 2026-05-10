import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const ID = '22222222-2222-2222-2222-222222222222';
const REL_ID = '33333333-3333-3333-3333-333333333333';

const queryRawUnsafeMock = vi.fn();

const { auditLogsCreateMock } = vi.hoisted(() => ({
  auditLogsCreateMock: vi.fn(async () => ({ id: 'audit-mock-id' })),
}));

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: queryRawUnsafeMock,
      // F2 H4: auditedTransaction wraps writes in tx.audit_logs.create
      audit_logs: {
        create: auditLogsCreateMock,
      },
    };
    return fn(tx);
  }),
  mergeScopedWhere: vi.fn(),
  prisma: {} as unknown,
}));

let mockSession: { user?: { id?: string; role?: string; tenantId?: string | null } } | null = null;
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
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { attendanceRouter } from '../attendance.js';
import { timeOffRouter } from '../time-off.js';
import { tenantOnboardingRouter } from '../tenant-onboarding.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/attendance', attendanceRouter);
  app.use('/time-off', timeOffRouter);
  app.use('/tenant-onboarding', tenantOnboardingRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

const crudEndpoints = [
  {
    name: 'attendance',
    base: '/attendance',
    create: { employee_id: REL_ID, attendance_date: '2026-05-06' },
    update: { status: 'absent' },
  },
  {
    name: 'time-off',
    base: '/time-off',
    create: {
      employee_id: REL_ID,
      request_type: 'vacation',
      start_date: '2026-06-01',
      end_date: '2026-06-05',
    },
    update: { status: 'approved' },
  },
];

// F2 H11: audit_logs.create payload expectations per route
const auditExpectations: Record<string, { category: string; resourceType: string }> = {
  attendance: { category: 'SYSTEM', resourceType: 'employee_attendance' },
  'time-off': { category: 'SYSTEM', resourceType: 'employee_time_off_requests' },
};

for (const ep of crudEndpoints) {
  describe(ep.name, () => {
    beforeEach(() => {
      mockSession = null;
      cacheStub.isAllowed.mockReset().mockReturnValue(true);
      queryRawUnsafeMock.mockReset();
      auditLogsCreateMock.mockClear();
    });

    it('GET / 401', async () => {
      const res = await request(buildApp()).get(ep.base);
      expect(res.status).toBe(401);
    });

    it('GET / 200', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]).mockResolvedValueOnce([{ count: 1 }]);
      const res = await request(buildApp()).get(ep.base);
      expect(res.status).toBe(200);
    });

    it('GET /:id 400/404', async () => {
      asAdmin();
      const r1 = await request(buildApp()).get(`${ep.base}/bad`);
      expect(r1.status).toBe(400);
      queryRawUnsafeMock.mockResolvedValueOnce([]);
      const r2 = await request(buildApp()).get(`${ep.base}/${ID}`);
      expect(r2.status).toBe(404);
    });

    it('POST 400/201', async () => {
      asAdmin();
      const r1 = await request(buildApp()).post(ep.base).send({});
      expect(r1.status).toBe(400);
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
      const r2 = await request(buildApp()).post(ep.base).send(ep.create);
      expect(r2.status).toBe(201);
    });

    it('PATCH 200', async () => {
      asAdmin();
      queryRawUnsafeMock
        .mockResolvedValueOnce([{ id: ID }])
        .mockResolvedValueOnce([{ id: ID, ...ep.update }]);
      const res = await request(buildApp()).patch(`${ep.base}/${ID}`).send(ep.update);
      expect(res.status).toBe(200);
    });

    it('DELETE 204', async () => {
      asAdmin();
      // F2 H4: SELECT existing (for audit oldValue) + DELETE
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]).mockResolvedValueOnce([{ id: ID }]);
      const res = await request(buildApp()).delete(`${ep.base}/${ID}`);
      expect(res.status).toBe(204);
    });

    it('audits CREATE with correct actor + category/resource_type', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
      await request(buildApp()).post(ep.base).send(ep.create);
      const exp = auditExpectations[ep.name]!;
      expect(auditLogsCreateMock).toHaveBeenCalledOnce();
      expect(auditLogsCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'CREATE',
            category: exp.category,
            resource_type: exp.resourceType,
            user_id: 'u1',
            tenant_id: ECONOVA,
            success: true,
          }),
        })
      );
    });
  });
}

describe('tenant-onboarding', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
    auditLogsCreateMock.mockClear();
  });

  it('GET /profile 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ tenant_id: ECONOVA, setup_completed: true }]);
    const res = await request(buildApp()).get('/tenant-onboarding/profile');
    expect(res.status).toBe(200);
  });

  it('GET /status 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ setup_completed: false }]);
    const res = await request(buildApp()).get('/tenant-onboarding/status');
    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(false);
  });

  it('PATCH /profile 400 empty body', async () => {
    asAdmin();
    const res = await request(buildApp()).patch('/tenant-onboarding/profile').send({});
    expect(res.status).toBe(400);
  });

  it('PATCH /profile 200', async () => {
    asAdmin();
    // F2 H4: SELECT existing (for audit oldValue) + UPDATE
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ tenant_id: ECONOVA, company_name: 'Old Co' }])
      .mockResolvedValueOnce([{ tenant_id: ECONOVA, company_name: 'New Co' }]);
    const res = await request(buildApp())
      .patch('/tenant-onboarding/profile')
      .send({ company_name: 'New Co' });
    expect(res.status).toBe(200);
  });

  it('audits UPDATE tenant_onboarding_profiles with TENANT category', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ tenant_id: ECONOVA, company_name: 'Old Co' }])
      .mockResolvedValueOnce([{ tenant_id: ECONOVA, company_name: 'Audited Co' }]);
    await request(buildApp())
      .patch('/tenant-onboarding/profile')
      .send({ company_name: 'Audited Co' });
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'UPDATE',
          category: 'TENANT',
          resource_type: 'tenant_onboarding_profiles',
          user_id: 'u1',
          tenant_id: ECONOVA,
          success: true,
        }),
      })
    );
  });
});
