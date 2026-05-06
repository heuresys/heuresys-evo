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

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async (pw: string) => `hashed:${pw}`),
    compare: vi.fn(async () => false),
  },
}));

const RTL_TENANT = '11111111-1111-1111-1111-111111111111';
const SMARTFOOD_TENANT = '22222222-2222-2222-2222-222222222222';
const ALICE_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BOB_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CAESAR_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const SUPER_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const ALICE_EMP = 'aaaaaaaa-1111-1111-1111-111111111111';
const BOB_EMP = 'bbbbbbbb-2222-2222-2222-222222222222';
const NEW_EMP = 'eeeeeeee-3333-3333-3333-333333333333';

type UserRow = {
  id: string;
  username: string;
  password_hash: string | null;
  role: string;
  permissions: string[];
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  employee_id: string | null;
  totp_enabled: boolean;
  employees?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    job_title: string | null;
    tenant_id: string;
    tenants: { id: string; code: string; name: string };
  } | null;
};

let users: UserRow[] = [];

function makeUser(o: Partial<UserRow> & { id: string; username: string }): UserRow {
  const now = new Date('2026-01-01T00:00:00Z');
  return {
    id: o.id,
    username: o.username,
    password_hash: 'hashed:legacy',
    role: 'EMPLOYEE',
    permissions: [],
    is_active: true,
    last_login: null,
    created_at: now,
    updated_at: now,
    employee_id: null,
    totp_enabled: false,
    employees: null,
    ...o,
  };
}

vi.mock('../../db/pool.js', () => ({
  prisma: {
    users: {
      findMany: vi.fn(
        async (args: { where?: Record<string, unknown>; take?: number; skip?: number }) => {
          let rows = [...users];
          const w = args.where ?? {};
          if (typeof w['role'] === 'string') rows = rows.filter((r) => r.role === w['role']);
          if (typeof w['is_active'] === 'boolean')
            rows = rows.filter((r) => r.is_active === w['is_active']);
          const take = args.take ?? rows.length;
          const skip = args.skip ?? 0;
          return rows.slice(skip, skip + take);
        }
      ),
      count: vi.fn(async (args?: { where?: Record<string, unknown> }) => {
        let rows = [...users];
        const w = args?.where ?? {};
        if (typeof w['role'] === 'string') rows = rows.filter((r) => r.role === w['role']);
        return rows.length;
      }),
      findUnique: vi.fn(async (args: { where: { id?: string; username?: string } }) => {
        if (args.where.id) return users.find((u) => u.id === args.where.id) ?? null;
        if (args.where.username)
          return users.find((u) => u.username === args.where.username) ?? null;
        return null;
      }),
      findFirst: vi.fn(async (args: { where: { employee_id?: string } }) => {
        if (args.where.employee_id)
          return users.find((u) => u.employee_id === args.where.employee_id) ?? null;
        return null;
      }),
      create: vi.fn(async (args: { data: Record<string, unknown> }) => {
        const u = makeUser({
          id: `00000000-aaaa-${String(users.length).padStart(4, '0')}-0000-000000000000`,
          username: args.data['username'] as string,
          role: (args.data['role'] as string) ?? 'USER',
          permissions: (args.data['permissions'] as string[]) ?? [],
          employee_id: (args.data['employee_id'] as string | null) ?? null,
          is_active: (args.data['is_active'] as boolean) ?? true,
          password_hash: args.data['password_hash'] as string,
        });
        users.push(u);
        return u;
      }),
      update: vi.fn(async (args: { where: { id: string }; data: Record<string, unknown> }) => {
        const u = users.find((x) => x.id === args.where.id);
        if (!u) throw new Error('not found');
        Object.assign(u, args.data, { updated_at: new Date() });
        return u;
      }),
      delete: vi.fn(async (args: { where: { id: string } }) => {
        users = users.filter((u) => u.id !== args.where.id);
        return { id: args.where.id };
      }),
    },
    employees: {
      findUnique: vi.fn(async (args: { where: { id: string } }) => {
        if (args.where.id === ALICE_EMP) return { id: ALICE_EMP, tenant_id: RTL_TENANT };
        if (args.where.id === BOB_EMP) return { id: BOB_EMP, tenant_id: RTL_TENANT };
        if (args.where.id === NEW_EMP) return { id: NEW_EMP, tenant_id: RTL_TENANT };
        return null;
      }),
      findMany: vi.fn(async () => [
        {
          id: NEW_EMP,
          first_name: 'Erika',
          last_name: 'Bianchi',
          email: 'erika@rtlbank.it',
          tenant_id: RTL_TENANT,
        },
      ]),
    },
    tenants: {
      findUnique: vi.fn(async (args: { where: { id: string } }) => {
        if (args.where.id === RTL_TENANT) return { code: 'rtl-bank', name: 'RTL Bank' };
        return null;
      }),
    },
  },
}));

import { usersRouter } from '../users.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/users', usersRouter);
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
  users = [
    makeUser({
      id: ALICE_ID,
      username: 'alice',
      role: 'HR_DIRECTOR',
      employee_id: ALICE_EMP,
      employees: {
        first_name: 'Alice',
        last_name: 'Verdi',
        email: 'alice@rtlbank.it',
        job_title: 'CHRO',
        tenant_id: RTL_TENANT,
        tenants: { id: RTL_TENANT, code: 'rtl-bank', name: 'RTL Bank' },
      },
    }),
    makeUser({
      id: BOB_ID,
      username: 'bob',
      role: 'EMPLOYEE',
      employee_id: BOB_EMP,
      employees: {
        first_name: 'Bob',
        last_name: 'Rossi',
        email: 'bob@rtlbank.it',
        job_title: 'Analyst',
        tenant_id: RTL_TENANT,
        tenants: { id: RTL_TENANT, code: 'rtl-bank', name: 'RTL Bank' },
      },
    }),
    makeUser({
      id: CAESAR_ID,
      username: 'caesar',
      role: 'EMPLOYEE',
      employee_id: 'cccccccc-emp-emp-emp-cccccccccccc',
      employees: {
        first_name: 'Caesar',
        last_name: 'Sf',
        email: 'caesar@smartfood.com',
        job_title: 'Manager',
        tenant_id: SMARTFOOD_TENANT,
        tenants: { id: SMARTFOOD_TENANT, code: 'smartfood', name: 'SmartFood' },
      },
    }),
    makeUser({
      id: SUPER_ID,
      username: 'admin',
      role: 'SUPERUSER',
      employee_id: null,
      employees: null,
    }),
  ];
});

describe('GET /users', () => {
  it('rejects 401 without auth', async () => {
    const res = await request(buildApp()).get('/users');
    expect(res.status).toBe(401);
  });

  it('rejects 403 when role not allowed', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'x', role: 'EMPLOYEE' } };
    cacheMock.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/users');
    expect(res.status).toBe(403);
  });

  it('SUPERUSER sees all users', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.data.users).toHaveLength(4);
    expect(res.body.data.meta).toMatchObject({ totalCount: 4, limit: 20, offset: 0 });
  });

  it('exposes /meta/roles with descriptions', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/users/meta/roles');
    expect(res.status).toBe(200);
    const names = (res.body.data as { name: string }[]).map((r) => r.name);
    expect(names).toEqual(expect.arrayContaining(['SUPERUSER', 'TENANT_OWNER', 'EMPLOYEE']));
  });

  it('exposes /permissions/available to authorized users', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/users/permissions/available');
    expect(res.status).toBe(200);
    expect(res.body.data.employees).toBeDefined();
  });
});

describe('GET /users/:id', () => {
  it('returns 400 on invalid UUID', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get('/users/not-a-uuid');
    expect(res.status).toBe(400);
  });

  it('returns 404 when not found', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get(
      `/users/${'9'.repeat(8)}-9999-9999-9999-${'9'.repeat(12)}`
    );
    expect(res.status).toBe(404);
  });

  it('returns 200 by ID', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).get(`/users/${ALICE_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('alice');
    expect(res.body.data.tenantId).toBe(RTL_TENANT);
  });

  it('forbids cross-tenant access for non-SUPERUSER', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_ID, role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).get(`/users/${CAESAR_ID}`);
    expect(res.status).toBe(403);
  });
});

describe('POST /users', () => {
  it('rejects without password and without generate_password', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'newone', role: 'TENANT_OWNER' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password');
  });

  it('rejects weak password', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'newone', role: 'TENANT_OWNER', password: 'short' });
    expect(res.status).toBe(400);
  });

  it('creates user with generate_password (system role)', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'newadmin', role: 'TENANT_OWNER', generate_password: true });
    expect(res.status).toBe(201);
    expect(res.body.data.username).toBe('newadmin');
    expect(res.body.data.temporaryPassword).toMatch(/^.{16}$/);
  });

  it('rejects 409 on duplicate username', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'alice', role: 'TENANT_OWNER', generate_password: true });
    expect(res.status).toBe(409);
  });

  it('forbids non-SUPERUSER from creating SUPERUSER', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_ID, role: 'TENANT_OWNER', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'newuser', role: 'SUPERUSER', generate_password: true });
    expect(res.status).toBe(403);
  });

  it('refuses non-system role without employee_id', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users')
      .send({ username: 'employeeuser', role: 'EMPLOYEE', generate_password: true });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('linked to an employee');
  });
});

describe('PATCH /users/:id', () => {
  it('updates username', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).patch(`/users/${BOB_ID}`).send({ username: 'bob.rossi' });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('bob.rossi');
  });

  it('forbids non-SUPERUSER from modifying SUPERUSER target', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_ID, role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).patch(`/users/${SUPER_ID}`).send({ username: 'h4ck3d' });
    expect(res.status).toBe(403);
  });

  it('forbids cross-tenant modification', async () => {
    mockSession = {
      expires: FAR_FUTURE,
      user: { id: ALICE_ID, role: 'HR_DIRECTOR', tenantId: RTL_TENANT },
    };
    const res = await request(buildApp()).patch(`/users/${CAESAR_ID}`).send({ is_active: false });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /users/:id', () => {
  it('forbids self-delete', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: BOB_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete(`/users/${BOB_ID}`);
    expect(res.status).toBe(400);
  });

  it('soft-deactivates by default', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete(`/users/${BOB_ID}`);
    expect(res.status).toBe(200);
    expect(users.find((u) => u.id === BOB_ID)?.is_active).toBe(false);
  });

  it('hard-deletes when SUPERUSER and ?hard=true', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp()).delete(`/users/${BOB_ID}?hard=true`);
    expect(res.status).toBe(200);
    expect(users.find((u) => u.id === BOB_ID)).toBeUndefined();
  });
});

describe('POST /users/:id/reset-password', () => {
  it('rejects weak password', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post(`/users/${BOB_ID}/reset-password`)
      .send({ new_password: 'weak' });
    expect(res.status).toBe(400);
  });

  it('resets password with valid policy', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post(`/users/${BOB_ID}/reset-password`)
      .send({ new_password: 'StrongPass1!XYZ' });
    expect(res.status).toBe(200);
  });
});

describe('POST /users/bulk', () => {
  it('creates from employee list with skip on existing', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: SUPER_ID, role: 'SUPERUSER' } };
    const res = await request(buildApp())
      .post('/users/bulk')
      .send({ employee_ids: [ALICE_EMP, NEW_EMP], role: 'TENANT_OWNER' });
    expect(res.status).toBe(201);
    expect(res.body.data.summary.total).toBe(2);
    expect(res.body.data.summary.created).toBe(1);
    expect(res.body.data.summary.skipped).toBe(1);
  });
});
