import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const ROLE_ID = '22222222-2222-2222-2222-222222222222';
const CAND_ID = '33333333-3333-3333-3333-333333333333';
const EMP_ID = '44444444-4444-4444-4444-444444444444';

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

import { successionRouter } from '../succession.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/succession', successionRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('GET /succession/stats', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/succession/stats');
    expect(res.status).toBe(401);
  });

  it('200 returns aggregate stats', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ total_critical_roles: 5, departments_covered: 3 }])
      .mockResolvedValueOnce([
        { total_candidates: 12, unique_candidates: 10, roles_with_candidates: 4 },
      ]);
    const res = await request(buildApp()).get('/succession/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total_critical_roles).toBe(5);
    expect(res.body.data.total_candidates).toBe(12);
  });
});

describe('GET /succession/critical-roles', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ROLE_ID, role_name: 'CTO', candidate_count: 2 }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/succession/critical-roles');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('200 with department + status filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get(
      '/succession/critical-roles?department=Engineering&succession_status=at_risk'
    );
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('Engineering');
    expect(args).toContain('at_risk');
  });
});

describe('GET /succession/critical-roles/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/succession/critical-roles/bad');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/succession/critical-roles/${ROLE_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 with candidates', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ROLE_ID, role_name: 'CTO' }])
      .mockResolvedValueOnce([{ id: CAND_ID, candidate_name: 'Jane' }]);
    const res = await request(buildApp()).get(`/succession/critical-roles/${ROLE_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.candidates).toHaveLength(1);
  });
});

describe('POST /succession/critical-roles', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
    auditLogsCreateMock.mockClear();
  });

  it('403 without EMPLOYEES.create', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).post('/succession/critical-roles').send({});
    expect(res.status).toBe(403);
  });

  it('400 on missing role_name', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/succession/critical-roles').send({});
    expect(res.status).toBe(400);
  });

  it('201 creates role', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ROLE_ID, role_name: 'CTO' }]);
    const res = await request(buildApp())
      .post('/succession/critical-roles')
      .send({ role_name: 'CTO', criticality_level: 'Critical' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(ROLE_ID);
  });

  it('audits CREATE critical_roles with USER category', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ROLE_ID, role_name: 'COO' }]);
    await request(buildApp())
      .post('/succession/critical-roles')
      .send({ role_name: 'COO', criticality_level: 'High' });
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'CREATE',
          category: 'USER',
          resource_type: 'critical_roles',
          user_id: 'u1',
          user_role: 'HR_DIRECTOR',
          tenant_id: ECONOVA,
          success: true,
        }),
      })
    );
  });
});

describe('PATCH /succession/critical-roles/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('404 when role missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .patch(`/succession/critical-roles/${ROLE_ID}`)
      .send({ role_name: 'New' });
    expect(res.status).toBe(404);
  });

  it('200 updates role', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ROLE_ID }])
      .mockResolvedValueOnce([{ id: ROLE_ID, role_name: 'New' }]);
    const res = await request(buildApp())
      .patch(`/succession/critical-roles/${ROLE_ID}`)
      .send({ role_name: 'New' });
    expect(res.status).toBe(200);
    expect(res.body.data.role_name).toBe('New');
  });
});

describe('DELETE /succession/critical-roles/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).delete(`/succession/critical-roles/${ROLE_ID}`);
    expect(res.status).toBe(404);
  });

  it('204 deletes', async () => {
    asAdmin();
    // F2 H4: SELECT existing (for audit oldValue) + DELETE
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ROLE_ID }])
      .mockResolvedValueOnce([{ id: ROLE_ID }]);
    const res = await request(buildApp()).delete(`/succession/critical-roles/${ROLE_ID}`);
    expect(res.status).toBe(204);
  });
});

describe('Candidates CRUD', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET candidates list 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: CAND_ID, candidate_name: 'Jane' }]);
    const res = await request(buildApp()).get(`/succession/critical-roles/${ROLE_ID}/candidates`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('POST candidate 404 if role missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .post(`/succession/critical-roles/${ROLE_ID}/candidates`)
      .send({ candidate_employee_id: EMP_ID, readiness_level: 'ready_now' });
    expect(res.status).toBe(404);
  });

  it('POST candidate 201', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ROLE_ID }])
      .mockResolvedValueOnce([{ id: CAND_ID, candidate_employee_id: EMP_ID }]);
    const res = await request(buildApp())
      .post(`/succession/critical-roles/${ROLE_ID}/candidates`)
      .send({ candidate_employee_id: EMP_ID, readiness_level: 'ready_now' });
    expect(res.status).toBe(201);
  });

  it('PATCH candidate 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: CAND_ID }])
      .mockResolvedValueOnce([{ id: CAND_ID, readiness_level: '1_2_years' }]);
    const res = await request(buildApp())
      .patch(`/succession/candidates/${CAND_ID}`)
      .send({ readiness_level: '1_2_years' });
    expect(res.status).toBe(200);
  });

  it('DELETE candidate 204', async () => {
    asAdmin();
    // F2 H4: SELECT existing (for audit oldValue) + DELETE
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: CAND_ID }])
      .mockResolvedValueOnce([{ id: CAND_ID }]);
    const res = await request(buildApp()).delete(`/succession/candidates/${CAND_ID}`);
    expect(res.status).toBe(204);
  });
});
