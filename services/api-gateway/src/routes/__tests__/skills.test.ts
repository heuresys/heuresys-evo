import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const SKILL_ID = '22222222-2222-2222-2222-222222222222';

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

import { skillsRouter } from '../skills.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/skills', skillsRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('GET /skills/stats', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/skills/stats');
    expect(res.status).toBe(401);
  });

  it('403 without ESCO_KG.view nor EMPLOYEES.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/skills/stats');
    expect(res.status).toBe(403);
  });

  it('200 returns counts + reuse_levels', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([
        {
          total: 100,
          skills: 60,
          knowledge: 30,
          competences: 10,
          digital_skills: 20,
          green_skills: 5,
        },
      ])
      .mockResolvedValueOnce([{ reuse_level: 'occupation-specific', count: 40 }]);
    const res = await request(buildApp()).get('/skills/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(100);
    expect(res.body.data.reuse_levels).toHaveLength(1);
  });
});

describe('GET /skills/types', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns type breakdown', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ skill_type: 'skill', count: 60 }]);
    const res = await request(buildApp()).get('/skills/types');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /skills/digital + /skills/green', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 digital paginated', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: SKILL_ID, preferred_label_en: 'Coding', is_digital: true }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/skills/digital?limit=10&offset=0');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.meta.limit).toBe(10);
  });

  it('200 green paginated', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: SKILL_ID, preferred_label_en: 'Recycling', is_green: true }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/skills/green');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /skills/search', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on missing q', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/skills/search');
    expect(res.status).toBe(400);
  });

  it('200 with q + filters', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: SKILL_ID, preferred_label_en: 'JavaScript', skill_type: 'skill' },
    ]);
    const res = await request(buildApp()).get(
      '/skills/search?q=java&skill_type=skill&is_digital=true'
    );
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args[1]).toBe('%java%');
    expect(args[2]).toBe('skill');
    const sql = args[0] as string;
    expect(sql).toMatch(/is_digital = true/);
  });
});

describe('GET /skills (list)', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: SKILL_ID, preferred_label_en: 'X' }])
      .mockResolvedValueOnce([{ count: 5 }]);
    const res = await request(buildApp()).get('/skills');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(5);
  });

  it('200 with skill_type filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get('/skills?skill_type=knowledge&limit=20');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('knowledge');
    expect(args).toContain(20);
  });
});

describe('GET /skills/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/skills/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/skills/${SKILL_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 returns full row', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: SKILL_ID, uri: 'http://...', preferred_label_en: 'X' },
    ]);
    const res = await request(buildApp()).get(`/skills/${SKILL_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(SKILL_ID);
  });
});

describe('POST /skills', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
    auditLogsCreateMock.mockClear();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).post('/skills').send({});
    expect(res.status).toBe(401);
  });

  it('403 without ESCO_KG.create', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp())
      .post('/skills')
      .send({ uri: 'x', preferred_label_en: 'Y', skill_type: 'skill' });
    expect(res.status).toBe(403);
  });

  it('400 on missing required fields', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/skills').send({ uri: 'x' });
    expect(res.status).toBe(400);
  });

  it('201 creates skill', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: SKILL_ID, uri: 'http://example/x', preferred_label_en: 'X', skill_type: 'skill' },
    ]);
    const res = await request(buildApp()).post('/skills').send({
      uri: 'http://example/x',
      preferred_label_en: 'X',
      skill_type: 'skill',
      is_digital: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(SKILL_ID);
  });

  it('audits CREATE with correct actor + payload', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: SKILL_ID, uri: 'http://example/y', preferred_label_en: 'Y', skill_type: 'skill' },
    ]);
    await request(buildApp()).post('/skills').send({
      uri: 'http://example/y',
      preferred_label_en: 'Y',
      skill_type: 'skill',
    });
    expect(auditLogsCreateMock).toHaveBeenCalledOnce();
    expect(auditLogsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'CREATE',
          category: 'SYSTEM',
          resource_type: 'esco_skills',
          user_id: 'u1',
          user_role: 'HR_DIRECTOR',
          tenant_id: ECONOVA,
          success: true,
        }),
      })
    );
  });
});

describe('PATCH /skills/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).patch('/skills/bad-id').send({ preferred_label_en: 'X' });
    expect(res.status).toBe(400);
  });

  it('400 on empty body', async () => {
    asAdmin();
    const res = await request(buildApp()).patch(`/skills/${SKILL_ID}`).send({});
    expect(res.status).toBe(400);
  });

  it('404 when skill missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .patch(`/skills/${SKILL_ID}`)
      .send({ preferred_label_en: 'New' });
    expect(res.status).toBe(404);
  });

  it('200 updates allowed fields', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: SKILL_ID }])
      .mockResolvedValueOnce([{ id: SKILL_ID, preferred_label_en: 'New' }]);
    const res = await request(buildApp())
      .patch(`/skills/${SKILL_ID}`)
      .send({ preferred_label_en: 'New', is_digital: true });
    expect(res.status).toBe(200);
    expect(res.body.data.preferred_label_en).toBe('New');
  });
});

describe('DELETE /skills/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).delete('/skills/x');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).delete(`/skills/${SKILL_ID}`);
    expect(res.status).toBe(404);
  });

  it('204 deletes', async () => {
    asAdmin();
    // F2 H4: SELECT existing (for audit oldValue) + DELETE
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: SKILL_ID }])
      .mockResolvedValueOnce([{ id: SKILL_ID }]);
    const res = await request(buildApp()).delete(`/skills/${SKILL_ID}`);
    expect(res.status).toBe(204);
  });
});
