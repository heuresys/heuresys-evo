import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RBPCacheService } from '../rbp-cache.js';

interface MockPrisma {
  $queryRawUnsafe: ReturnType<typeof vi.fn>;
}

function makePrisma(): MockPrisma {
  return { $queryRawUnsafe: vi.fn() };
}

const FIXTURE_ROLES = [
  { code: 'SUPERUSER', hierarchy_level: 100, inherits_from: null },
  { code: 'TENANT_OWNER', hierarchy_level: 90, inherits_from: null },
  { code: 'HR_DIRECTOR', hierarchy_level: 70, inherits_from: null },
  { code: 'EMPLOYEE', hierarchy_level: 10, inherits_from: null },
];

const FIXTURE_PERMS = [
  {
    role_code: 'SUPERUSER',
    area_code: 'EMPLOYEES',
    can_view: true,
    can_create: true,
    can_edit: true,
    can_delete: true,
    can_approve: true,
    can_export: true,
    scope_type: 'PLATFORM',
  },
  {
    role_code: 'HR_DIRECTOR',
    area_code: 'EMPLOYEES',
    can_view: true,
    can_create: true,
    can_edit: true,
    can_delete: false,
    can_approve: true,
    can_export: true,
    scope_type: 'TENANT',
  },
  {
    role_code: 'EMPLOYEE',
    area_code: 'EMPLOYEES',
    can_view: true,
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_approve: false,
    can_export: false,
    scope_type: 'SELF',
  },
];

describe('RBPCacheService', () => {
  let prisma: MockPrisma;
  let cache: RBPCacheService;

  beforeEach(() => {
    prisma = makePrisma();
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce(FIXTURE_ROLES)
      .mockResolvedValueOnce(FIXTURE_PERMS);
    cache = new RBPCacheService(prisma as never, { ttlMs: 1000 });
  });

  it('loads roles + permissions on first ensureLoaded', async () => {
    await cache.ensureLoaded();
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(2);
    expect(cache.getRole('SUPERUSER')?.hierarchyLevel).toBe(100);
  });

  it('does not reload within TTL', async () => {
    await cache.ensureLoaded();
    await cache.ensureLoaded();
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it('returns null for unknown role', async () => {
    await cache.ensureLoaded();
    expect(cache.getRole('GHOST')).toBeNull();
  });

  it('isAllowed returns true for SUPERUSER × EMPLOYEES × view', async () => {
    await cache.ensureLoaded();
    expect(cache.isAllowed('SUPERUSER', 'EMPLOYEES', 'view')).toBe(true);
    expect(cache.isAllowed('SUPERUSER', 'EMPLOYEES', 'delete')).toBe(true);
  });

  it('isAllowed returns false for EMPLOYEE × EMPLOYEES × delete (read-only SELF scope)', async () => {
    await cache.ensureLoaded();
    expect(cache.isAllowed('EMPLOYEE', 'EMPLOYEES', 'view')).toBe(true);
    expect(cache.isAllowed('EMPLOYEE', 'EMPLOYEES', 'delete')).toBe(false);
    expect(cache.isAllowed('EMPLOYEE', 'EMPLOYEES', 'edit')).toBe(false);
  });

  it('HR_DIRECTOR can edit + approve but not delete', async () => {
    await cache.ensureLoaded();
    expect(cache.isAllowed('HR_DIRECTOR', 'EMPLOYEES', 'edit')).toBe(true);
    expect(cache.isAllowed('HR_DIRECTOR', 'EMPLOYEES', 'approve')).toBe(true);
    expect(cache.isAllowed('HR_DIRECTOR', 'EMPLOYEES', 'delete')).toBe(false);
  });

  it('isAllowed returns false for unknown area', async () => {
    await cache.ensureLoaded();
    expect(cache.isAllowed('SUPERUSER', 'NONEXISTENT_AREA', 'view')).toBe(false);
  });

  it('refresh forces reload even within TTL', async () => {
    await cache.ensureLoaded();
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce(FIXTURE_ROLES)
      .mockResolvedValueOnce(FIXTURE_PERMS);
    await cache.refresh();
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(4);
  });

  it('getPermission returns scopeType for use by getScopeCondition', async () => {
    await cache.ensureLoaded();
    const p = cache.getPermission('HR_DIRECTOR', 'EMPLOYEES');
    expect(p?.scopeType).toBe('TENANT');
  });

  it('concurrent ensureLoaded calls share a single in-flight load', async () => {
    const c2 = new RBPCacheService(prisma as never, { ttlMs: 1000 });
    prisma.$queryRawUnsafe.mockReset();
    prisma.$queryRawUnsafe
      .mockResolvedValueOnce(FIXTURE_ROLES)
      .mockResolvedValueOnce(FIXTURE_PERMS);
    await Promise.all([c2.ensureLoaded(), c2.ensureLoaded(), c2.ensureLoaded()]);
    // Each call to load() makes 2 raw queries; concurrent callers share one load
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });
});
