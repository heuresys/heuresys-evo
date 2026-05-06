import { describe, it, expect } from 'vitest';
import {
  resolveElements,
  userRoleLevel,
  ROLE_LEVEL,
  DEFAULT_USER_LEVEL,
  type DashboardElementShape,
} from '@/lib/dashboard-engine/resolver';

const RTL = '0c54b84a-db6e-4da4-bc91-af5d480d524e';
const SMF = '1d7bf448-ceac-4215-917d-45ff13678104';

function el(
  partial: Partial<DashboardElementShape> & Pick<DashboardElementShape, 'position'>
): DashboardElementShape {
  return {
    id: partial.position,
    widget_code: 'KpiRing',
    widget_catalog_id: null,
    grid_col_start: 1,
    grid_col_span: 12,
    grid_row_start: 1,
    grid_row_span: 1,
    perspective_code: null,
    visibility_min_role: 6,
    config_overrides: null,
    tenant_id: null,
    ...partial,
  };
}

describe('userRoleLevel', () => {
  it('maps known roles to RBP levels', () => {
    expect(userRoleLevel('SUPERUSER')).toBe(-1);
    expect(userRoleLevel('TENANT_OWNER')).toBe(0);
    expect(userRoleLevel('HR_DIRECTOR')).toBe(2);
    expect(userRoleLevel('EMPLOYEE')).toBe(6);
  });

  it('is case-insensitive', () => {
    expect(userRoleLevel('hr_director')).toBe(2);
    expect(userRoleLevel('Hr_Director')).toBe(2);
  });

  it('falls back to DEFAULT_USER_LEVEL for unknown roles', () => {
    expect(userRoleLevel(null)).toBe(DEFAULT_USER_LEVEL);
    expect(userRoleLevel(undefined)).toBe(DEFAULT_USER_LEVEL);
    expect(userRoleLevel('UNKNOWN_ROLE')).toBe(DEFAULT_USER_LEVEL);
    expect(userRoleLevel('')).toBe(DEFAULT_USER_LEVEL);
  });

  it('exports a fully populated ROLE_LEVEL map (8 roles)', () => {
    expect(Object.keys(ROLE_LEVEL)).toHaveLength(8);
  });
});

describe('resolveElements — visibility filter', () => {
  const elements: DashboardElementShape[] = [
    el({ position: 1, visibility_min_role: 6 }), // visible to everyone
    el({ position: 2, visibility_min_role: 2 }), // visible only to HR_DIRECTOR and above
    el({ position: 3, visibility_min_role: 0 }), // visible only to TENANT_OWNER and above
  ];

  it('EMPLOYEE sees only public widget (req=6)', () => {
    const out = resolveElements(elements, { role: 'EMPLOYEE' });
    expect(out.map((e) => e.position)).toEqual([1]);
  });

  it('HR_DIRECTOR sees req<=2 widgets', () => {
    const out = resolveElements(elements, { role: 'HR_DIRECTOR' });
    expect(out.map((e) => e.position)).toEqual([1, 2]);
  });

  it('SUPERUSER sees all widgets', () => {
    const out = resolveElements(elements, { role: 'SUPERUSER' });
    expect(out.map((e) => e.position)).toEqual([1, 2, 3]);
  });

  it('No role / unknown role behaves like EMPLOYEE', () => {
    expect(resolveElements(elements, { role: null }).map((e) => e.position)).toEqual([1]);
    expect(resolveElements(elements, { role: 'UNKNOWN' }).map((e) => e.position)).toEqual([1]);
  });
});

describe('resolveElements — perspective filter', () => {
  const elements: DashboardElementShape[] = [
    el({ position: 1, perspective_code: 'TALENT' }),
    el({ position: 2, perspective_code: 'PROCESS' }),
    el({ position: 3, perspective_code: 'ENTERPRISE' }),
    el({ position: 4, perspective_code: null }), // unscoped — always visible
  ];

  it('No perspective filter returns all elements', () => {
    expect(resolveElements(elements, { role: 'EMPLOYEE' }).map((e) => e.position)).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it('observer=PROCESS keeps PROCESS + unscoped', () => {
    expect(
      resolveElements(elements, { role: 'EMPLOYEE', perspective: 'PROCESS' }).map((e) => e.position)
    ).toEqual([2, 4]);
  });

  it('perspective filter is case-insensitive', () => {
    expect(
      resolveElements(elements, { role: 'EMPLOYEE', perspective: 'talent' }).map((e) => e.position)
    ).toEqual([1, 4]);
  });

  it('observer=NONEXISTENT returns only unscoped', () => {
    expect(
      resolveElements(elements, { role: 'EMPLOYEE', perspective: 'NONEXISTENT' }).map(
        (e) => e.position
      )
    ).toEqual([4]);
  });
});

describe('resolveElements — tenant override merge', () => {
  it('tenant override shadows platform default at same position', () => {
    const elements: DashboardElementShape[] = [
      el({ position: 1, tenant_id: null, widget_code: 'KpiRing' }),
      el({ position: 1, tenant_id: RTL, widget_code: 'CapabilityRadar' }),
    ];
    const out = resolveElements(elements, { role: 'EMPLOYEE' });
    expect(out).toHaveLength(1);
    expect(out[0]!.widget_code).toBe('CapabilityRadar');
    expect(out[0]!.tenant_id).toBe(RTL);
  });

  it('platform default kept when no override exists', () => {
    const elements: DashboardElementShape[] = [
      el({ position: 1, tenant_id: null, widget_code: 'KpiRing' }),
      el({ position: 2, tenant_id: null, widget_code: 'CareerArc' }),
    ];
    const out = resolveElements(elements, { role: 'EMPLOYEE' });
    expect(out.map((e) => e.widget_code)).toEqual(['KpiRing', 'CareerArc']);
  });

  it('override invisible to current role does not leak (filter applied first)', () => {
    const elements: DashboardElementShape[] = [
      el({ position: 1, tenant_id: null, widget_code: 'KpiRing', visibility_min_role: 6 }),
      // tenant override but requires HR_DIRECTOR — invisible to EMPLOYEE → platform default kept
      el({ position: 1, tenant_id: SMF, widget_code: 'RbacMatrix', visibility_min_role: 2 }),
    ];
    const out = resolveElements(elements, { role: 'EMPLOYEE' });
    expect(out).toHaveLength(1);
    expect(out[0]!.widget_code).toBe('KpiRing'); // platform default survives
  });
});

describe('resolveElements — sort + edge cases', () => {
  it('returns elements ordered by position ascending', () => {
    const elements: DashboardElementShape[] = [
      el({ position: 5 }),
      el({ position: 1 }),
      el({ position: 3 }),
    ];
    const out = resolveElements(elements, { role: 'EMPLOYEE' });
    expect(out.map((e) => e.position)).toEqual([1, 3, 5]);
  });

  it('returns empty array when nothing visible', () => {
    const elements: DashboardElementShape[] = [
      el({ position: 1, visibility_min_role: -1 }), // SUPERUSER only
    ];
    expect(resolveElements(elements, { role: 'EMPLOYEE' })).toEqual([]);
  });

  it('handles empty input', () => {
    expect(resolveElements([], { role: 'EMPLOYEE' })).toEqual([]);
  });
});
