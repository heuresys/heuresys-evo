/**
 * Phase 14 Sprint 3.C — DashboardEditor pure-function tests.
 *
 * Covers the layout↔db-shape mappers without rendering the editor (which
 * depends on react-grid-layout DOM apis). Render-level tests live in the
 * Playwright e2e spec.
 */
import { describe, expect, it } from 'vitest';
import {
  elementsToLayout,
  layoutToUpdates,
  type EditorElement,
} from '@/components/dashboard/DashboardEditor';

const sample: EditorElement[] = [
  {
    id: '101',
    widgetCode: 'KpiRing',
    gridColStart: 1,
    gridColSpan: 3,
    gridRowStart: 1,
    gridRowSpan: 2,
    position: 1,
  },
  {
    id: '102',
    widgetCode: 'CareerArc',
    gridColStart: 4,
    gridColSpan: 6,
    gridRowStart: 1,
    gridRowSpan: 2,
    position: 2,
  },
];

describe('elementsToLayout', () => {
  it('translates 1-based DB grid coords to 0-based react-grid-layout coords', () => {
    const out = elementsToLayout(sample);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ i: '101', x: 0, y: 0, w: 3, h: 2 });
    expect(out[1]).toMatchObject({ i: '102', x: 3, y: 0, w: 6, h: 2 });
  });

  it('clamps grid_col_start < 1 to x=0 (defensive against legacy data)', () => {
    const out = elementsToLayout([{ ...sample[0]!, gridColStart: 0 }]);
    expect(out[0]?.x).toBe(0);
  });

  it('preserves min/max constraints for resize bounds', () => {
    const out = elementsToLayout(sample);
    expect(out[0]?.minW).toBe(1);
    expect(out[0]?.maxW).toBe(12);
  });
});

describe('layoutToUpdates', () => {
  it('translates 0-based grid coords back to 1-based DB grid coords', () => {
    const layout = elementsToLayout(sample);
    const updates = layoutToUpdates(layout);
    expect(updates).toHaveLength(2);
    expect(updates[0]).toMatchObject({
      id: '101',
      grid_col_start: 1,
      grid_col_span: 3,
      grid_row_start: 1,
      grid_row_span: 2,
    });
  });

  it('renumbers position field by row-then-col reading order', () => {
    // Out-of-order layout: tile id=102 at (x=0,y=0), id=101 at (x=3,y=0)
    const layout = [
      { i: '102', x: 0, y: 0, w: 3, h: 2 },
      { i: '101', x: 3, y: 0, w: 3, h: 2 },
    ];
    const updates = layoutToUpdates(layout);
    expect(updates[0]?.id).toBe('102');
    expect(updates[0]?.position).toBe(1);
    expect(updates[1]?.id).toBe('101');
    expect(updates[1]?.position).toBe(2);
  });

  it('handles second-row tiles after first-row tiles', () => {
    const layout = [
      { i: 'a', x: 0, y: 1, w: 6, h: 2 },
      { i: 'b', x: 0, y: 0, w: 6, h: 1 },
      { i: 'c', x: 6, y: 0, w: 6, h: 1 },
    ];
    const updates = layoutToUpdates(layout);
    expect(updates.map((u) => u.id)).toEqual(['b', 'c', 'a']);
    expect(updates.map((u) => u.position)).toEqual([1, 2, 3]);
  });
});
