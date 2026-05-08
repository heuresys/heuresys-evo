import { describe, it, expect } from 'vitest';
import {
  kpiRingAdapter,
  integrationHealthPillAdapter,
  successionCardAdapter,
  careerArcAdapter,
  kgMiniGraphAdapter,
  skillHeatmapAdapter,
  capabilityRadarAdapter,
  rbacMatrixAdapter,
  resolveAdapter,
  ADAPTER_REGISTRY,
} from '@/lib/dashboard-engine/adapters';

describe('kpiRingAdapter', () => {
  it('maps single-row array to props', () => {
    const out = kpiRingAdapter([{ value: 72, label: 'Capability', unit: '%' }]);
    expect(out).toEqual({ value: 72, label: 'Capability', unit: '%' });
  });

  it('accepts plain object (non-array)', () => {
    expect(kpiRingAdapter({ value: 50 })).toEqual({ value: 50 });
  });

  it('coerces string value to number', () => {
    expect(kpiRingAdapter([{ value: '88' }])).toEqual({ value: 88 });
  });

  it('returns null when value is non-numeric or missing', () => {
    expect(kpiRingAdapter([{ value: 'abc' }])).toBeNull();
    expect(kpiRingAdapter([{ value: null }])).toBeNull();
    expect(kpiRingAdapter([])).toBeNull();
    expect(kpiRingAdapter(null)).toBeNull();
    expect(kpiRingAdapter(42)).toBeNull();
  });

  it('passes through optional fields', () => {
    expect(
      kpiRingAdapter([
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
      ])
    ).toEqual({
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

  it('drops malformed optional fields', () => {
    expect(kpiRingAdapter([{ value: 1, label: 123, trend: 'high', thresholds: 'bad' }])).toEqual({
      value: 1,
    });
  });
});

describe('integrationHealthPillAdapter', () => {
  it('passes valid tone', () => {
    expect(integrationHealthPillAdapter([{ tone: 'warn' }])).toEqual({ tone: 'warn' });
  });

  it('defaults tone to ok when invalid or missing', () => {
    expect(integrationHealthPillAdapter([{ tone: 'invalid' }])).toEqual({ tone: 'ok' });
    expect(integrationHealthPillAdapter([{}])).toEqual({ tone: 'ok' });
  });

  it('passes label, pulse, showDot when present', () => {
    expect(
      integrationHealthPillAdapter([{ tone: 'info', label: 'SYNC', pulse: true, show_dot: false }])
    ).toEqual({ tone: 'info', label: 'SYNC', pulse: true, showDot: false });
  });

  it('returns null on empty input', () => {
    expect(integrationHealthPillAdapter([])).toBeNull();
    expect(integrationHealthPillAdapter(null)).toBeNull();
  });
});

describe('successionCardAdapter', () => {
  it('maps snake_case columns to camelCase props', () => {
    expect(
      successionCardAdapter([
        {
          candidate_name: 'Stefania Bianchi',
          current_role: 'Head Credit Risk',
          target_role: 'Director Risk',
          readiness_percent: 88,
        },
      ])
    ).toEqual({
      candidateName: 'Stefania Bianchi',
      currentRole: 'Head Credit Risk',
      targetRole: 'Director Risk',
      readinessPercent: 88,
    });
  });

  it('accepts camelCase columns directly', () => {
    expect(
      successionCardAdapter([
        {
          candidateName: 'A',
          currentRole: 'B',
          targetRole: 'C',
          readinessPercent: 75,
          readiness: 'ready-now',
          risk: 'low',
          readyBy: '2026 Q3',
        },
      ])
    ).toEqual({
      candidateName: 'A',
      currentRole: 'B',
      targetRole: 'C',
      readinessPercent: 75,
      readiness: 'ready-now',
      risk: 'low',
      readyBy: '2026 Q3',
    });
  });

  it('returns null when required fields missing', () => {
    expect(successionCardAdapter([{ candidate_name: 'X' }])).toBeNull();
    expect(successionCardAdapter([])).toBeNull();
  });

  it('drops invalid risk/readiness values', () => {
    const out = successionCardAdapter([
      {
        candidate_name: 'X',
        current_role: 'Y',
        target_role: 'Z',
        readiness_percent: 50,
        risk: 'bogus',
        readiness: 'invalid',
      },
    ]);
    expect(out).toEqual({
      candidateName: 'X',
      currentRole: 'Y',
      targetRole: 'Z',
      readinessPercent: 50,
    });
  });
});

describe('careerArcAdapter', () => {
  it('extracts stages from composite row', () => {
    expect(
      careerArcAdapter([
        {
          stages: [
            { id: '1', label: 'Junior' },
            { id: '2', label: 'Senior' },
          ],
          currentIndex: 1,
        },
      ])
    ).toEqual({
      stages: [
        { id: '1', label: 'Junior' },
        { id: '2', label: 'Senior' },
      ],
      currentIndex: 1,
    });
  });

  it('treats raw array of stages directly', () => {
    expect(
      careerArcAdapter([
        { id: '1', label: 'Junior' },
        { id: '2', label: 'Senior' },
      ])
    ).toEqual({
      stages: [
        { id: '1', label: 'Junior' },
        { id: '2', label: 'Senior' },
      ],
    });
  });

  it('returns null on empty stages', () => {
    expect(careerArcAdapter([{ stages: [] }])).toBeNull();
    expect(careerArcAdapter(null)).toBeNull();
  });
});

describe('kgMiniGraphAdapter', () => {
  it('maps composite row with nodes/edges/legend', () => {
    expect(
      kgMiniGraphAdapter([
        {
          nodes: [{ id: 'a', label: 'A', group: 'x' }],
          edges: [{ id: 'e1', source: 'a', target: 'a' }],
          legend: [{ group: 'x', label: 'X', color: '#000' }],
          layout: 'cose',
          height: 300,
        },
      ])
    ).toEqual({
      nodes: [{ id: 'a', label: 'A', group: 'x' }],
      edges: [{ id: 'e1', source: 'a', target: 'a' }],
      legend: [{ group: 'x', label: 'X', color: '#000' }],
      layout: 'cose',
      height: 300,
    });
  });

  it('returns null when nodes or edges missing', () => {
    expect(kgMiniGraphAdapter([{ nodes: [{ id: 'a' }] }])).toBeNull();
    expect(kgMiniGraphAdapter([{}])).toBeNull();
  });
});

describe('skillHeatmapAdapter', () => {
  it('maps composite row with rows/cols/cells', () => {
    expect(
      skillHeatmapAdapter([
        {
          rows: [{ id: 'r1', label: 'R1' }],
          cols: [{ id: 'c1', label: 'C1' }],
          cells: [{ rowId: 'r1', colId: 'c1', value: 50 }],
          caption: 'Coverage',
        },
      ])
    ).toEqual({
      rows: [{ id: 'r1', label: 'R1' }],
      cols: [{ id: 'c1', label: 'C1' }],
      cells: [{ rowId: 'r1', colId: 'c1', value: 50 }],
      caption: 'Coverage',
    });
  });

  it('returns null when any axis missing', () => {
    expect(skillHeatmapAdapter([{ rows: [], cols: [] }])).toBeNull();
  });
});

describe('capabilityRadarAdapter', () => {
  it('maps composite row with axes/series', () => {
    const out = capabilityRadarAdapter([
      {
        axes: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
        series: [{ id: 's1', label: 'S1', values: [10, 20, 30] }],
        max: 100,
      },
    ]);
    expect(out).toMatchObject({
      axes: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'c', label: 'C' },
      ],
      series: [{ id: 's1', label: 'S1', values: [10, 20, 30] }],
      max: 100,
    });
  });

  it('returns null when fewer than 3 axes', () => {
    expect(
      capabilityRadarAdapter([
        {
          axes: [{ id: 'a', label: 'A' }],
          series: [],
        },
      ])
    ).toBeNull();
  });
});

describe('rbacMatrixAdapter', () => {
  it('maps composite row with roles/areas/assignments', () => {
    expect(
      rbacMatrixAdapter([
        {
          roles: [{ id: 'r', label: 'R' }],
          areas: [{ id: 'a', label: 'A' }],
          assignments: [{ roleId: 'r', areaId: 'a', level: 'read' }],
          readonly: true,
        },
      ])
    ).toEqual({
      roles: [{ id: 'r', label: 'R' }],
      areas: [{ id: 'a', label: 'A' }],
      assignments: [{ roleId: 'r', areaId: 'a', level: 'read' }],
      readonly: true,
    });
  });

  it('returns null when assignments missing', () => {
    expect(rbacMatrixAdapter([{ roles: [], areas: [] }])).toBeNull();
  });
});

describe('resolveAdapter + ADAPTER_REGISTRY', () => {
  it('returns adapter for each known widget_code', () => {
    expect(resolveAdapter('KpiRing')).toBe(kpiRingAdapter);
    expect(resolveAdapter('IntegrationHealthPill')).toBe(integrationHealthPillAdapter);
    expect(resolveAdapter('SuccessionCard')).toBe(successionCardAdapter);
    expect(resolveAdapter('CareerArc')).toBe(careerArcAdapter);
    expect(resolveAdapter('KgMiniGraph')).toBe(kgMiniGraphAdapter);
    expect(resolveAdapter('SkillHeatmap')).toBe(skillHeatmapAdapter);
    expect(resolveAdapter('CapabilityRadar')).toBe(capabilityRadarAdapter);
    expect(resolveAdapter('RbacMatrix')).toBe(rbacMatrixAdapter);
  });

  it('registry exposes 14 entries (TIER 17 + ActivityFeed + 5 G3-bis L43)', () => {
    expect(Object.keys(ADAPTER_REGISTRY)).toHaveLength(14);
  });

  it('returns null for unknown widget_code', () => {
    expect(resolveAdapter('UnknownWidget')).toBeNull();
    expect(resolveAdapter('')).toBeNull();
  });
});
