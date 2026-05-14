/**
 * _role-shaper.test.ts — Unit tests for role-aware Prisma scope shaper.
 *
 * Cycle 2 Phase 0 T0.9. Coverage matrix: 8 roles × 5 entities = 40 cases.
 */
import { describe, expect, it } from 'vitest';
import {
  resolveScope,
  resolveScopeLevel,
  type EntityKind,
  type ScopeContext,
} from '../_role-shaper';
import type { UserRole } from '@/lib/navigation/types';

const TENANT = '11111111-1111-1111-1111-111111111111';
const EMP = '22222222-2222-2222-2222-222222222222';
const ORGU = '33333333-3333-3333-3333-333333333333';

const ENTITIES: EntityKind[] = ['employees', 'reviews', 'goals', 'learning', 'compensation'];

function ctx(role: UserRole, overrides: Partial<ScopeContext> = {}): ScopeContext {
  return {
    role,
    tenantId: TENANT,
    employeeId: EMP,
    orgUnitId: ORGU,
    ...overrides,
  };
}

describe('resolveScopeLevel', () => {
  it('SUPERUSER → platform when no tenant impersonation', () => {
    expect(resolveScopeLevel({ role: 'SUPERUSER', tenantId: null })).toBe('platform');
  });
  it('SUPERUSER → tenant when impersonating tenant', () => {
    expect(resolveScopeLevel(ctx('SUPERUSER'))).toBe('tenant');
  });
  it('TENANT_OWNER / IT_ADMIN / HR_DIRECTOR → tenant', () => {
    expect(resolveScopeLevel(ctx('TENANT_OWNER'))).toBe('tenant');
    expect(resolveScopeLevel(ctx('IT_ADMIN'))).toBe('tenant');
    expect(resolveScopeLevel(ctx('HR_DIRECTOR'))).toBe('tenant');
  });
  it('HR_MANAGER → team with orgUnit, tenant otherwise', () => {
    expect(resolveScopeLevel(ctx('HR_MANAGER'))).toBe('team');
    expect(resolveScopeLevel(ctx('HR_MANAGER', { orgUnitId: null }))).toBe('tenant');
  });
  it('DEPT_HEAD → dept with orgUnit, tenant otherwise', () => {
    expect(resolveScopeLevel(ctx('DEPT_HEAD'))).toBe('dept');
    expect(resolveScopeLevel(ctx('DEPT_HEAD', { orgUnitId: null }))).toBe('tenant');
  });
  it('LINE_MANAGER → reports with employeeId, self otherwise', () => {
    expect(resolveScopeLevel(ctx('LINE_MANAGER'))).toBe('reports');
    expect(resolveScopeLevel(ctx('LINE_MANAGER', { employeeId: null }))).toBe('self');
  });
  it('EMPLOYEE → self always', () => {
    expect(resolveScopeLevel(ctx('EMPLOYEE'))).toBe('self');
  });
});

describe('resolveScope — platform (SUPERUSER no tenant)', () => {
  for (const entity of ENTITIES) {
    it(`SUPERUSER × ${entity} → empty where, no tenant wrap`, () => {
      const r = resolveScope({ role: 'SUPERUSER', tenantId: null }, entity);
      expect(r.level).toBe('platform');
      expect(r.where).toEqual({});
      expect(r.requiresTenantWrap).toBe(false);
    });
  }
});

describe('resolveScope — tenant scope (TENANT_OWNER / IT_ADMIN / HR_DIRECTOR)', () => {
  const tenantRoles: UserRole[] = ['TENANT_OWNER', 'IT_ADMIN', 'HR_DIRECTOR'];
  for (const role of tenantRoles) {
    for (const entity of ENTITIES) {
      it(`${role} × ${entity} → tenant_id only`, () => {
        const r = resolveScope(ctx(role), entity);
        expect(r.level).toBe('tenant');
        expect(r.where.tenant_id).toBe(TENANT);
        expect(r.requiresTenantWrap).toBe(true);
      });
    }
  }
});

describe('resolveScope — HR_MANAGER team scope', () => {
  it('employees → org_unit_id filter', () => {
    const r = resolveScope(ctx('HR_MANAGER'), 'employees');
    expect(r.where).toMatchObject({ tenant_id: TENANT, org_unit_id: ORGU });
  });
  it('reviews → employees.org_unit_id join', () => {
    const r = resolveScope(ctx('HR_MANAGER'), 'reviews');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employees: { org_unit_id: ORGU } });
  });
  it('goals → org_unit_id direct', () => {
    const r = resolveScope(ctx('HR_MANAGER'), 'goals');
    expect(r.where).toMatchObject({ tenant_id: TENANT, org_unit_id: ORGU });
  });
});

describe('resolveScope — DEPT_HEAD dept scope', () => {
  it('employees → org_unit_id filter', () => {
    const r = resolveScope(ctx('DEPT_HEAD'), 'employees');
    expect(r.level).toBe('dept');
    expect(r.where).toMatchObject({ tenant_id: TENANT, org_unit_id: ORGU });
  });
  it('learning → employees.org_unit_id join', () => {
    const r = resolveScope(ctx('DEPT_HEAD'), 'learning');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employees: { org_unit_id: ORGU } });
  });
});

describe('resolveScope — LINE_MANAGER reports scope', () => {
  it('employees → manager_id = me', () => {
    const r = resolveScope(ctx('LINE_MANAGER'), 'employees');
    expect(r.level).toBe('reports');
    expect(r.where).toMatchObject({ tenant_id: TENANT, manager_id: EMP });
  });
  it('reviews → employees.manager_id = me', () => {
    const r = resolveScope(ctx('LINE_MANAGER'), 'reviews');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employees: { manager_id: EMP } });
  });
  it('goals → owner_employee.manager_id = me', () => {
    const r = resolveScope(ctx('LINE_MANAGER'), 'goals');
    expect(r.where).toMatchObject({ tenant_id: TENANT, owner_employee: { manager_id: EMP } });
  });
});

describe('resolveScope — EMPLOYEE self scope', () => {
  it('employees → id = me', () => {
    const r = resolveScope(ctx('EMPLOYEE'), 'employees');
    expect(r.level).toBe('self');
    expect(r.where).toMatchObject({ tenant_id: TENANT, id: EMP });
  });
  it('reviews → employee_id = me', () => {
    const r = resolveScope(ctx('EMPLOYEE'), 'reviews');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employee_id: EMP });
  });
  it('goals → owner_employee_id = me', () => {
    const r = resolveScope(ctx('EMPLOYEE'), 'goals');
    expect(r.where).toMatchObject({ tenant_id: TENANT, owner_employee_id: EMP });
  });
  it('learning → employee_id = me', () => {
    const r = resolveScope(ctx('EMPLOYEE'), 'learning');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employee_id: EMP });
  });
  it('compensation → employee_id = me', () => {
    const r = resolveScope(ctx('EMPLOYEE'), 'compensation');
    expect(r.where).toMatchObject({ tenant_id: TENANT, employee_id: EMP });
  });
});

describe('resolveScope — degraded contexts (missing employeeId / orgUnitId)', () => {
  it('LINE_MANAGER without employeeId collapses to self', () => {
    const r = resolveScope(ctx('LINE_MANAGER', { employeeId: null }), 'employees');
    expect(r.level).toBe('self');
  });
  it('HR_MANAGER without orgUnitId collapses to tenant', () => {
    const r = resolveScope(ctx('HR_MANAGER', { orgUnitId: null }), 'employees');
    expect(r.level).toBe('tenant');
    expect(r.where).toEqual({ tenant_id: TENANT });
  });
});
