import { describe, it, expect } from 'vitest';
import { mergeScopedWhere } from '../pool.js';

describe('mergeScopedWhere', () => {
  it('returns baseWhere unchanged when scopeCond is empty (PLATFORM scope)', () => {
    const result = mergeScopedWhere({}, { is_active: true });
    expect(result).toEqual({ is_active: true });
  });

  it('merges TENANT scope with baseWhere', () => {
    const result = mergeScopedWhere({ tenant_id: 't1' }, { is_active: true });
    expect(result).toEqual({ is_active: true, tenant_id: 't1' });
  });

  it('preserves deny-all sentinel from missing-context scope', () => {
    const result = mergeScopedWhere({ id: '__deny_all__' }, { is_active: true });
    expect(result.id).toBe('__deny_all__');
    expect(result.is_active).toBe(true);
  });

  it('scope keys override baseWhere on collision (RBP wins)', () => {
    const result = mergeScopedWhere(
      { tenant_id: 't1' },
      { tenant_id: 'attacker_provided', is_active: true }
    );
    expect(result.tenant_id).toBe('t1');
  });

  it('handles complex DEPARTMENT scope ({ in: [...] })', () => {
    const result = mergeScopedWhere({ department_id: { in: ['d1', 'd2'] } }, { is_active: true });
    expect(result).toEqual({
      is_active: true,
      department_id: { in: ['d1', 'd2'] },
    });
  });

  it('returns plain object (no prototype chain leakage)', () => {
    const result = mergeScopedWhere({ tenant_id: 't1' }, { is_active: true });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
