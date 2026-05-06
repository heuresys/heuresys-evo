import { describe, it, expect } from 'vitest';
import { kpiRingAdapter, resolveAdapter } from '@/lib/dashboard-engine/adapters';

describe('kpiRingAdapter', () => {
  it('maps single-row array to props', () => {
    const out = kpiRingAdapter([{ value: 72, label: 'Capability', unit: '%' }]);
    expect(out).toEqual({ value: 72, label: 'Capability', unit: '%' });
  });

  it('accepts plain object (non-array)', () => {
    const out = kpiRingAdapter({ value: 50 });
    expect(out).toEqual({ value: 50 });
  });

  it('coerces string value to number', () => {
    const out = kpiRingAdapter([{ value: '88' }]);
    expect(out).toEqual({ value: 88 });
  });

  it('returns null when value is non-numeric', () => {
    expect(kpiRingAdapter([{ value: 'abc' }])).toBeNull();
    expect(kpiRingAdapter([{ value: null }])).toBeNull();
  });

  it('returns null on empty/invalid input', () => {
    expect(kpiRingAdapter([])).toBeNull();
    expect(kpiRingAdapter(null)).toBeNull();
    expect(kpiRingAdapter(undefined)).toBeNull();
    expect(kpiRingAdapter(42)).toBeNull();
  });

  it('passes through optional fields when present and well-typed', () => {
    const out = kpiRingAdapter([
      {
        value: 60,
        label: 'X',
        sublabel: 'Y',
        unit: 'pts',
        trend: -3.2,
        max: 200,
        min: 10,
        thresholds: { goodAt: 80, warnAt: 50 },
      },
    ]);
    expect(out).toEqual({
      value: 60,
      label: 'X',
      sublabel: 'Y',
      unit: 'pts',
      trend: -3.2,
      max: 200,
      min: 10,
      thresholds: { goodAt: 80, warnAt: 50 },
    });
  });

  it('drops malformed optional fields (silently)', () => {
    const out = kpiRingAdapter([{ value: 1, label: 123, trend: 'high', thresholds: 'bad' }]);
    expect(out).toEqual({ value: 1 });
  });
});

describe('resolveAdapter', () => {
  it('returns adapter for known widget_code', () => {
    expect(resolveAdapter('KpiRing')).toBe(kpiRingAdapter);
  });

  it('returns null for unknown widget_code', () => {
    expect(resolveAdapter('UnknownWidget')).toBeNull();
    expect(resolveAdapter('')).toBeNull();
  });
});
