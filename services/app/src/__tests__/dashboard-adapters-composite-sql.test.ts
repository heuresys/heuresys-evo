/**
 * Phase 14.C — Composite widget SQL shape regression.
 *
 * Validates that the 5 composite adapters accept rows shaped like the result
 * of the phase14c migration queries: a single-row array whose columns are
 * jsonb arrays (top-level fields, NOT nested under a `data` envelope).
 *
 * The fixtures here mirror the actual query output. If a phase14c query is
 * ever changed in a way that breaks adapter normalization, this test catches it.
 */
import { describe, expect, it } from 'vitest';
import {
  capabilityRadarAdapter,
  careerArcAdapter,
  kgMiniGraphAdapter,
  rbacMatrixAdapter,
  skillHeatmapAdapter,
} from '@/lib/dashboard-engine/adapters';

describe('Composite adapters · phase14c SQL shape', () => {
  it('rbacMatrixAdapter accepts rbp_* live SQL row', () => {
    const sqlResult = [
      {
        roles: [
          { id: 'SUPERUSER', label: 'Platform Owner', level: -1 },
          { id: 'TENANT_OWNER', label: 'Tenant Owner', level: 0 },
          { id: 'EMPLOYEE', label: 'Employee', level: 6 },
        ],
        areas: [
          { id: 'employees', label: 'Employees' },
          { id: 'audit', label: 'Audit' },
        ],
        assignments: [
          { roleId: 'SUPERUSER', areaId: 'employees', permission: 'admin' },
          { roleId: 'EMPLOYEE', areaId: 'employees', permission: 'read' },
        ],
        readonly: true,
      },
    ];
    const out = rbacMatrixAdapter(sqlResult);
    expect(out).not.toBeNull();
    expect(out?.roles).toHaveLength(3);
    expect(out?.areas).toHaveLength(2);
    expect(out?.assignments).toHaveLength(2);
    expect(out?.readonly).toBe(true);
  });

  it('careerArcAdapter accepts row-with-stages SQL shape', () => {
    const sqlResult = [
      {
        stages: [
          { id: '1', year: '2018', label: 'Junior Analyst' },
          { id: '2', year: '2020', label: 'Analyst' },
          { id: '3', year: '2023', label: 'Senior Analyst' },
        ],
        currentIndex: 2,
      },
    ];
    const out = careerArcAdapter(sqlResult);
    expect(out).not.toBeNull();
    expect(out?.stages).toHaveLength(3);
    expect(out?.currentIndex).toBe(2);
  });

  it('kgMiniGraphAdapter accepts nodes/edges SQL shape', () => {
    const sqlResult = [
      {
        nodes: [
          { id: 'finance', group: 'domain', label: 'Finance' },
          { id: 'risk', group: 'domain', label: 'Risk' },
        ],
        edges: [{ id: 'e1', source: 'finance', target: 'risk' }],
        legend: [{ id: 'domain', label: 'Domain' }],
        layout: 'force',
      },
    ];
    const out = kgMiniGraphAdapter(sqlResult);
    expect(out).not.toBeNull();
    expect(out?.nodes).toHaveLength(2);
    expect(out?.edges).toHaveLength(1);
    expect(out?.legend).toHaveLength(1);
    expect(out?.layout).toBe('force');
  });

  it('skillHeatmapAdapter accepts rows/cols/cells SQL shape', () => {
    const sqlResult = [
      {
        rows: [{ id: 'finance', label: 'Finance' }],
        cols: [{ id: 'sql', label: 'SQL' }],
        cells: [{ colId: 'sql', rowId: 'finance', value: 78 }],
        caption: 'Test caption',
        showValue: true,
      },
    ];
    const out = skillHeatmapAdapter(sqlResult);
    expect(out).not.toBeNull();
    expect(out?.rows).toHaveLength(1);
    expect(out?.cols).toHaveLength(1);
    expect(out?.cells).toHaveLength(1);
    expect(out?.caption).toBe('Test caption');
    expect(out?.showValue).toBe(true);
  });

  it('capabilityRadarAdapter accepts axes/series SQL shape with ≥3 axes', () => {
    const sqlResult = [
      {
        axes: [
          { id: 'tech', label: 'Tech' },
          { id: 'fin', label: 'Finance' },
          { id: 'lead', label: 'Lead' },
          { id: 'comm', label: 'Comms' },
          { id: 'risk', label: 'Risk' },
        ],
        series: [
          { id: 'cur', label: 'Current', values: [82, 70, 35, 60, 75] },
          { id: 'tgt', label: 'Target', values: [75, 80, 70, 80, 85] },
        ],
        max: 100,
      },
    ];
    const out = capabilityRadarAdapter(sqlResult);
    expect(out).not.toBeNull();
    expect(out?.axes).toHaveLength(5);
    expect(out?.series).toHaveLength(2);
    expect(out?.max).toBe(100);
  });

  it('capabilityRadarAdapter rejects shapes with <3 axes', () => {
    const sqlResult = [
      {
        axes: [
          { id: 'tech', label: 'Tech' },
          { id: 'fin', label: 'Finance' },
        ],
        series: [{ id: 'cur', label: 'Current', values: [80, 70] }],
      },
    ];
    expect(capabilityRadarAdapter(sqlResult)).toBeNull();
  });
});
