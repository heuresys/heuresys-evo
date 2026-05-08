import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => {
  const mock = {
    $queryRaw: vi.fn(
      async (_strings: TemplateStringsArray, ..._values: unknown[]) => [] as unknown[]
    ),
  };
  return { prisma: mock };
});

import { resolvePresetCodeForRole } from '@/lib/dashboard-engine/role-preset-resolver';
import * as dbModule from '@/lib/db';

const mockedQuery = (dbModule.prisma as unknown as { $queryRaw: ReturnType<typeof vi.fn> })
  .$queryRaw;

const RTL_BANK_ID = '0c54b84a-db6e-4da4-bc91-af5d480d524e';

describe('resolvePresetCodeForRole', () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it('returns the platform default preset_code when tenantId is null', async () => {
    mockedQuery.mockResolvedValueOnce([{ preset_code: 'cross_tenant_overview' }]);
    const result = await resolvePresetCodeForRole({ role: 'SUPERUSER', tenantId: null });
    expect(result).toBe('cross_tenant_overview');
    expect(mockedQuery).toHaveBeenCalledTimes(1);
  });

  it('returns the tenant override preset_code when both rows exist', async () => {
    mockedQuery.mockResolvedValueOnce([{ preset_code: 'rtl_custom_hr_dashboard' }]);
    const result = await resolvePresetCodeForRole({
      role: 'HR_DIRECTOR',
      tenantId: RTL_BANK_ID,
    });
    expect(result).toBe('rtl_custom_hr_dashboard');
  });

  it('falls back to platform default when no tenant override exists', async () => {
    mockedQuery.mockResolvedValueOnce([{ preset_code: 'hr_director_overview' }]);
    const result = await resolvePresetCodeForRole({
      role: 'HR_DIRECTOR',
      tenantId: RTL_BANK_ID,
    });
    expect(result).toBe('hr_director_overview');
  });

  it('returns null when role has no mapping at all', async () => {
    mockedQuery.mockResolvedValueOnce([]);
    const result = await resolvePresetCodeForRole({
      role: 'NEW_UNMAPPED_ROLE',
      tenantId: null,
    });
    expect(result).toBeNull();
  });

  it('returns null when query returns empty array for tenant user', async () => {
    mockedQuery.mockResolvedValueOnce([]);
    const result = await resolvePresetCodeForRole({
      role: 'EMPLOYEE',
      tenantId: RTL_BANK_ID,
    });
    expect(result).toBeNull();
  });

  it('uses different SQL paths for tenant vs platform users', async () => {
    mockedQuery.mockResolvedValueOnce([{ preset_code: 'a' }]);
    await resolvePresetCodeForRole({ role: 'SUPERUSER', tenantId: null });

    mockedQuery.mockResolvedValueOnce([{ preset_code: 'b' }]);
    await resolvePresetCodeForRole({ role: 'HR_DIRECTOR', tenantId: RTL_BANK_ID });

    expect(mockedQuery).toHaveBeenCalledTimes(2);
    const secondCall = mockedQuery.mock.calls[1];
    expect(secondCall).toBeDefined();
    const values = secondCall!.slice(1);
    expect(values).toContain('HR_DIRECTOR');
    expect(values).toContain(RTL_BANK_ID);
  });
});
