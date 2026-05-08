/**
 * G5 + G5-phase-2 — DashboardRenderer unit tests.
 *
 * Copre:
 *  - Flat rendering: top-level elements ordinati per position
 *  - Hierarchy: parent_element_id ricorsivo via LAYOUT_REGISTRY
 *  - Layout container: render children correttamente
 *  - Empty layout container: rende contenitore senza children
 *  - Nested layout: 2+ livelli di profondità
 *  - Fallback: widget_code unknown → alert visibile (warn UX)
 *  - Empty state: zero elements → "no slots configured"
 *  - elementsToSlots adapter
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock entrambi i registry per evitare dynamic import in jsdom.
vi.mock('@/lib/dashboard-engine/registry', () => {
  const KpiRing = ({ data }: { data?: unknown }) => (
    <div data-testid="widget-kpiring">KpiRing data={JSON.stringify(data ?? null)}</div>
  );
  const Histogram = () => <div data-testid="widget-histogram">Histogram</div>;
  const LayoutDoubleSplit = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-double-split">{children}</div>
  );
  const LayoutPanel = ({ data, children }: { data?: unknown; children: React.ReactNode }) => {
    const d = (data as { title?: string } | undefined) ?? {};
    return (
      <div data-testid="layout-panel" data-panel-title={d.title ?? ''}>
        {children}
      </div>
    );
  };
  return {
    WIDGET_REGISTRY: { KpiRing, Histogram },
    LAYOUT_REGISTRY: { LayoutDoubleSplit, LayoutPanel },
  };
});

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

describe('DashboardRenderer (G5 flat)', () => {
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

describe('DashboardRenderer (G5-phase-2 hierarchy)', () => {
  it('renders layout container with children widgets', () => {
    render(
      <DashboardRenderer
        elements={[
          slot({ id: 'split', widget_code: 'LayoutDoubleSplit' }),
          slot({ id: 'kpi1', parent_element_id: 'split', position: 1, widget_code: 'KpiRing' }),
          slot({ id: 'hist', parent_element_id: 'split', position: 2, widget_code: 'Histogram' }),
        ]}
      />
    );
    const layout = screen.getByTestId('layout-double-split');
    expect(layout).toBeInTheDocument();
    const kpi = screen.getByTestId('widget-kpiring');
    const hist = screen.getByTestId('widget-histogram');
    expect(layout).toContainElement(kpi);
    expect(layout).toContainElement(hist);
  });

  it('renders nested layout containers (2 levels)', () => {
    render(
      <DashboardRenderer
        elements={[
          slot({ id: 'outer', widget_code: 'LayoutDoubleSplit' }),
          slot({
            id: 'panel-l',
            parent_element_id: 'outer',
            position: 1,
            widget_code: 'LayoutPanel',
          }),
          slot({
            id: 'panel-r',
            parent_element_id: 'outer',
            position: 2,
            widget_code: 'LayoutPanel',
          }),
          slot({
            id: 'kpi-in-l',
            parent_element_id: 'panel-l',
            position: 1,
            widget_code: 'KpiRing',
          }),
          slot({
            id: 'hist-in-r',
            parent_element_id: 'panel-r',
            position: 1,
            widget_code: 'Histogram',
          }),
        ]}
      />
    );
    const split = screen.getByTestId('layout-double-split');
    const panels = screen.getAllByTestId('layout-panel');
    expect(panels).toHaveLength(2);
    expect(split).toContainElement(panels[0]!);
    expect(split).toContainElement(panels[1]!);
    expect(panels[0]).toContainElement(screen.getByTestId('widget-kpiring'));
    expect(panels[1]).toContainElement(screen.getByTestId('widget-histogram'));
  });

  it('passes data to layout container via element id', () => {
    render(
      <DashboardRenderer
        elements={[slot({ id: 'p1', widget_code: 'LayoutPanel' })]}
        data={{ p1: { title: 'Tenant fleet' } }}
      />
    );
    const panel = screen.getByTestId('layout-panel');
    expect(panel).toHaveAttribute('data-panel-title', 'Tenant fleet');
  });

  it('renders empty layout container when no children', () => {
    render(<DashboardRenderer elements={[slot({ id: 'empty', widget_code: 'LayoutPanel' })]} />);
    expect(screen.getByTestId('layout-panel')).toBeInTheDocument();
  });

  it('orders children within parent by position', () => {
    render(
      <DashboardRenderer
        elements={[
          slot({ id: 'split', widget_code: 'LayoutDoubleSplit' }),
          slot({ id: 'b', parent_element_id: 'split', position: 2, widget_code: 'Histogram' }),
          slot({ id: 'a', parent_element_id: 'split', position: 1, widget_code: 'KpiRing' }),
        ]}
      />
    );
    const layout = screen.getByTestId('layout-double-split');
    const order = Array.from(layout.children).map(
      (c) => (c as HTMLElement).getAttribute('data-widget-code') ?? c.getAttribute('data-testid')
    );
    // First child should wrap KpiRing (position 1)
    expect(order[0]).toBe('KpiRing');
    expect(order[1]).toBe('Histogram');
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
