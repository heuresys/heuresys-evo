import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeCredentials, type AuthorizePrismaShape } from '../authorize';

const SUPERUSER_DEFAULT_TENANT = '00000000-0000-0000-0000-000000000001';
const ECONOVA_TENANT = '11111111-1111-1111-1111-111111111111';

function makePrisma(): AuthorizePrismaShape & {
  __users: { findFirst: ReturnType<typeof vi.fn> };
  __employees: { findUnique: ReturnType<typeof vi.fn> };
} {
  const users = { findFirst: vi.fn() };
  const employees = { findUnique: vi.fn() };
  const proxy = {
    users,
    employees,
    __users: users,
    __employees: employees,
  } as unknown as AuthorizePrismaShape & {
    __users: typeof users;
    __employees: typeof employees;
  };
  return proxy;
}

describe('authorizeCredentials', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let bcryptCompare: ReturnType<
    typeof vi.fn<(plaintext: string, hash: string) => Promise<boolean>>
  >;
  const env = { DEFAULT_SUPERUSER_TENANT_ID: SUPERUSER_DEFAULT_TENANT };

  beforeEach(() => {
    prisma = makePrisma();
    bcryptCompare = vi.fn<(plaintext: string, hash: string) => Promise<boolean>>();
  });

  it('returns null when credentials is undefined', async () => {
    const result = await authorizeCredentials(prisma, env, undefined, bcryptCompare);
    expect(result).toBeNull();
    expect(prisma.__users.findFirst).not.toHaveBeenCalled();
  });

  it('returns null when username is not a string', async () => {
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 123, password: 'secret' },
      bcryptCompare
    );
    expect(result).toBeNull();
    expect(prisma.__users.findFirst).not.toHaveBeenCalled();
  });

  it('returns null when password is not a string', async () => {
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'u', password: undefined },
      bcryptCompare
    );
    expect(result).toBeNull();
    expect(prisma.__users.findFirst).not.toHaveBeenCalled();
  });

  it('returns null when user not found in DB', async () => {
    prisma.__users.findFirst.mockResolvedValue(null);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'ghost', password: 'Heuresys2026!' },
      bcryptCompare
    );
    expect(result).toBeNull();
    expect(bcryptCompare).not.toHaveBeenCalled();
  });

  it('returns null when user has null password_hash (e.g. invalidated by migration 216)', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'u',
      password_hash: null,
      role: 'EMPLOYEE',
      employee_id: null,
      totp_enabled: false,
    });
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'u', password: 'x' },
      bcryptCompare
    );
    expect(result).toBeNull();
    expect(bcryptCompare).not.toHaveBeenCalled();
  });

  it('returns null when bcrypt comparison fails', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'u',
      password_hash: '$2b$12$valid.bcrypt.hash',
      role: 'EMPLOYEE',
      employee_id: null,
      totp_enabled: false,
    });
    bcryptCompare.mockResolvedValue(false);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'u', password: 'wrong' },
      bcryptCompare
    );
    expect(result).toBeNull();
  });

  it('resolves tenantId from employee_id when present', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'laura.bertolini',
      password_hash: '$2b$12$h',
      role: 'TENANT_OWNER',
      employee_id: 'emp-1',
      totp_enabled: false,
    });
    prisma.__employees.findUnique.mockResolvedValue({ tenant_id: ECONOVA_TENANT });
    bcryptCompare.mockResolvedValue(true);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'laura.bertolini', password: 'Heuresys2026!' },
      bcryptCompare
    );
    expect(result).toEqual({
      id: 'u1',
      name: 'laura.bertolini',
      email: 'laura.bertolini@heuresys.local',
      username: 'laura.bertolini',
      role: 'TENANT_OWNER',
      tenantId: ECONOVA_TENANT,
    });
    expect(prisma.__employees.findUnique).toHaveBeenCalledWith({
      where: { id: 'emp-1' },
      select: { tenant_id: true },
    });
  });

  it('falls back to DEFAULT_SUPERUSER_TENANT_ID when user has no employee_id', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u-su',
      username: 'superuser',
      password_hash: '$2b$12$h',
      role: 'SUPERUSER',
      employee_id: null,
      totp_enabled: false,
    });
    bcryptCompare.mockResolvedValue(true);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'superuser', password: 'Heuresys2026!' },
      bcryptCompare
    );
    expect(result?.tenantId).toBe(SUPERUSER_DEFAULT_TENANT);
    expect(prisma.__employees.findUnique).not.toHaveBeenCalled();
  });

  it('falls back to DEFAULT_SUPERUSER_TENANT_ID when employee row is missing', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'orphan',
      password_hash: '$2b$12$h',
      role: 'EMPLOYEE',
      employee_id: 'emp-missing',
      totp_enabled: false,
    });
    prisma.__employees.findUnique.mockResolvedValue(null);
    bcryptCompare.mockResolvedValue(true);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'orphan', password: 'x' },
      bcryptCompare
    );
    expect(result?.tenantId).toBe(SUPERUSER_DEFAULT_TENANT);
  });

  it('returns empty string tenantId when no fallback and no employee tenant', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'u',
      password_hash: '$2b$12$h',
      role: 'EMPLOYEE',
      employee_id: null,
      totp_enabled: false,
    });
    bcryptCompare.mockResolvedValue(true);
    const result = await authorizeCredentials(
      prisma,
      {},
      { username: 'u', password: 'x' },
      bcryptCompare
    );
    expect(result?.tenantId).toBe('');
  });

  it('defaults role to EMPLOYEE when DB returns null role', async () => {
    prisma.__users.findFirst.mockResolvedValue({
      id: 'u1',
      username: 'rolelessuser',
      password_hash: '$2b$12$h',
      role: null,
      employee_id: null,
      totp_enabled: false,
    });
    bcryptCompare.mockResolvedValue(true);
    const result = await authorizeCredentials(
      prisma,
      env,
      { username: 'rolelessuser', password: 'x' },
      bcryptCompare
    );
    expect(result?.role).toBe('EMPLOYEE');
  });

  it('filters DB query with is_active=true and deleted_at=null (soft-delete safety)', async () => {
    prisma.__users.findFirst.mockResolvedValue(null);
    await authorizeCredentials(prisma, env, { username: 'deleted', password: 'x' }, bcryptCompare);
    expect(prisma.__users.findFirst).toHaveBeenCalledWith({
      where: { username: 'deleted', is_active: true, deleted_at: null },
      select: expect.objectContaining({
        id: true,
        username: true,
        password_hash: true,
        role: true,
        employee_id: true,
        totp_enabled: true,
      }),
    });
  });
});
