/**
 * G5 — DashboardRenderer skeleton unit tests.
 *
 * Copre:
 *  - rendering flat: top-level elements ordinati per position
 *  - filter: parent_element_id non-null esclusi (TODO hierarchy in G5-phase-2)
 *  - fallback: widget_code unknown → alert visibile (warn UX)
 *  - empty state: zero elements → "no slots configured"
 *  - elementsToSlots adapter
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock WIDGET_REGISTRY: stub semplice per evitare dynamic import in jsdom.
vi.mock('@/lib/dashboard-engine/registry', () => ({
  WIDGET_REGISTRY: {
    KpiRing: ({ data }: { data?: unknown }) => (
      <div data-testid="widget-kpiring">KpiRing data={JSON.stringify(data ?? null)}</div>
    ),
    Histogram: () => <div data-testid="widget-histogram">Histogram</div>,
  },
}));

import {
  DashboardRenderer,
  elementsToSlots,
  type DashboardRendererSlot,
} from '../components/DashboardRenderer';

const slot = (overrides: Partial<DashboardRendererSlot> = {}): DashboardRendererSlot => ({
  id: '1',
  parent_element_id: null,
  position: 1,
  widget_code: 'KpiRing',
  variant: null,
  ...overrides,
});

describe('DashboardRenderer (G5 skeleton)', () => {
  it('renders top-level slots in position order', () => {
    render(
      <DashboardRenderer
        elements={[
          slot({ id: '2', position: 2, widget_code: 'Histogram' }),
          slot({ id: '1', position: 1, widget_code: 'KpiRing' }),
        ]}
      />
    );
    const all = screen.getAllByTestId(/widget-/);
    expect(all).toHaveLength(2);
    expect(all[0]).toHaveAttribute('data-testid', 'widget-kpiring');
    expect(all[1]).toHaveAttribute('data-testid', 'widget-histogram');
  });

  it('skips children (parent_element_id non-null) — flat MVP', () => {
    render(
      <DashboardRenderer
        elements={[slot({ id: '1' }), slot({ id: '2', parent_element_id: '1' })]}
      />
    );
    expect(screen.getAllByTestId(/widget-/)).toHaveLength(1);
  });

  it('renders alert fallback for unknown widget_code', () => {
    render(<DashboardRenderer elements={[slot({ widget_code: 'NonExistent' })]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unknown widget_code: NonExistent');
  });

  it('renders custom fallback when provided', () => {
    render(
      <DashboardRenderer
        elements={[slot({ widget_code: 'NonExistent' })]}
        unknownWidgetFallback={(code) => <span data-testid="custom-fallback">{code}</span>}
      />
    );
    expect(screen.getByTestId('custom-fallback')).toHaveTextContent('NonExistent');
  });

  it('renders empty state when no top-level elements', () => {
    render(<DashboardRenderer elements={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent('No dashboard slots configured');
  });

  it('passes data preloaded to widget by element id', () => {
    render(
      <DashboardRenderer
        elements={[slot({ id: '1', widget_code: 'KpiRing' })]}
        data={{ '1': { value: 42 } }}
      />
    );
    expect(screen.getByTestId('widget-kpiring')).toHaveTextContent('"value":42');
  });

  it('applies data-* attributes (id, code, variant) to slot wrapper', () => {
    const { container } = render(
      <DashboardRenderer
        elements={[slot({ id: 'abc', widget_code: 'KpiRing', variant: 'kpi-warn' })]}
      />
    );
    const wrapper = container.querySelector('[data-element-id="abc"]');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveAttribute('data-widget-code', 'KpiRing');
    expect(wrapper).toHaveAttribute('data-variant', 'kpi-warn');
  });
});

describe('elementsToSlots adapter', () => {
  it('maps DashboardElementShape to slots with parent + variant fields', () => {
    const shapes = [
      {
        id: 1n,
        position: 1,
        widget_code: 'KpiRing',
        widget_catalog_id: null,
        grid_col_start: 1,
        grid_col_span: 4,
        grid_row_start: 1,
        grid_row_span: 1,
        perspective_code: null,
        visibility_min_role: 6,
        config_overrides: null,
        tenant_id: null,
        parent_element_id: null,
        variant: 'kpi-info',
      },
    ];
    const slots = elementsToSlots(shapes);
    expect(slots).toHaveLength(1);
    expect(slots[0]).toMatchObject({
      id: 1n,
      position: 1,
      widget_code: 'KpiRing',
      parent_element_id: null,
      variant: 'kpi-info',
      grid_col_start: 1,
      grid_col_span: 4,
    });
  });

  it('defaults parent_element_id and variant to null when omitted', () => {
    const shapes = [
      {
        id: '2',
        position: 1,
        widget_code: 'Histogram',
        widget_catalog_id: null,
        grid_col_start: 1,
        grid_col_span: 12,
        grid_row_start: 1,
        grid_row_span: 1,
        perspective_code: null,
        visibility_min_role: 6,
        config_overrides: null,
        tenant_id: null,
      },
    ];
    const slots = elementsToSlots(shapes);
    expect(slots[0]?.parent_element_id).toBeNull();
    expect(slots[0]?.variant).toBeNull();
  });
});
