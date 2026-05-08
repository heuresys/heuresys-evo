'use client';

import * as React from 'react';
import { LAYOUT_REGISTRY, WIDGET_REGISTRY } from '@/lib/dashboard-engine/registry';
import type { DashboardElementShape } from '@/lib/dashboard-engine/resolver';

export interface DashboardRendererSlot {
  id: string | number | bigint;
  parent_element_id: string | number | bigint | null;
  position: number;
  widget_code: string;
  variant: string | null;
  data?: unknown;
  /** Grid hints (legacy 12-col), opzionale per layout adattivo successivo. */
  grid_col_start?: number;
  grid_col_span?: number;
}

export interface DashboardRendererProps {
  /** Elementi di un singolo preset, già filtrati per ruolo (resolver) e tenant override (loader). */
  elements: DashboardRendererSlot[];
  /** Mapping data preloaded per ogni element id (chiave = element.id come stringa). */
  data?: Record<string, unknown>;
  /** Renderer fallback per widget non registrato (default: stub box visibile in dev). */
  unknownWidgetFallback?: (widget_code: string) => React.ReactNode;
}

const ROOT_KEY = '__root__';

interface ChildrenMap {
  get(key: string): DashboardRendererSlot[] | undefined;
}

function buildChildrenMap(elements: DashboardRendererSlot[]): Map<string, DashboardRendererSlot[]> {
  const map = new Map<string, DashboardRendererSlot[]>();
  for (const s of elements) {
    const key = s.parent_element_id == null ? ROOT_KEY : String(s.parent_element_id);
    let bucket = map.get(key);
    if (!bucket) {
      bucket = [];
      map.set(key, bucket);
    }
    bucket.push(s);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => a.position - b.position);
  }
  return map;
}

interface RenderContext {
  childrenMap: ChildrenMap;
  data?: Record<string, unknown>;
  fallback?: (widget_code: string) => React.ReactNode;
}

function renderSlot(slot: DashboardRendererSlot, ctx: RenderContext): React.ReactNode {
  const elKey = String(slot.id);
  const elData = ctx.data?.[elKey];
  const Layout = LAYOUT_REGISTRY[slot.widget_code];

  if (Layout) {
    const childSlots = ctx.childrenMap.get(elKey) ?? [];
    const renderedChildren = childSlots.map((c) => renderSlot(c, ctx));
    return (
      <Layout key={elKey} data={elData}>
        {renderedChildren}
      </Layout>
    );
  }

  const Widget = WIDGET_REGISTRY[slot.widget_code];
  if (Widget) {
    return (
      <div
        key={elKey}
        data-element-id={elKey}
        data-widget-code={slot.widget_code}
        data-variant={slot.variant ?? undefined}
      >
        <Widget data={elData} />
      </div>
    );
  }

  if (ctx.fallback) {
    return <React.Fragment key={elKey}>{ctx.fallback(slot.widget_code)}</React.Fragment>;
  }
  return (
    <div
      key={elKey}
      role="alert"
      style={{
        padding: 12,
        margin: '6px 0',
        border: '1px dashed var(--semantic-warning)',
        borderRadius: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: 'var(--semantic-warning)',
        background: 'var(--surface-2)',
      }}
    >
      Unknown widget_code: <strong>{slot.widget_code}</strong>
    </div>
  );
}

/**
 * G5 — DashboardRenderer (hierarchy support post-G5-phase-2).
 *
 * Single entry-point per qualunque preset DB-driven. Risolve element via
 * LAYOUT_REGISTRY (container ricorsivo) o WIDGET_REGISTRY (leaf), passa data
 * preloaded via mapping per id.
 *
 * **Hierarchy support**:
 *   - Element con `parent_element_id == null` → top-level slot (renderizzato direttamente)
 *   - Element con `parent_element_id != null` → child slot (renderizzato dentro il parent)
 *   - Layout container risolve i figli ricorsivamente; se nessuno, container vuoto
 *   - Leaf widget ignora figli (non dovrebbero esistere per design)
 *
 * **Adoption path** (S20):
 *   1. ✅ S19 G5 skeleton: rendering FLAT (parent_element_id ignorato)
 *   2. ✅ S19 G5-phase-2 (questo): hierarchy ricorsivo · 4 layout containers shipped
 *   3. S20+ G6 full: seedare 8 preset DB-driven matching i 7 view bespoke
 *   4. S20+ G6 adoption: redirect `dashboard/page.tsx` switch a `<DashboardRenderer/>`
 *
 * Riferimento: `docs/30-developer/brand-dashboard-catalog.md` § Appendix A · DECISIONS-LOG L43+L44.
 */
export function DashboardRenderer({
  elements,
  data,
  unknownWidgetFallback,
}: DashboardRendererProps) {
  const childrenMap = React.useMemo(() => buildChildrenMap(elements), [elements]);
  const topLevel = childrenMap.get(ROOT_KEY) ?? [];

  if (topLevel.length === 0) {
    return (
      <div
        role="status"
        style={{
          padding: '24px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'var(--ink-muted)',
          textAlign: 'center',
        }}
      >
        No dashboard slots configured for this preset.
      </div>
    );
  }

  const ctx: RenderContext = { childrenMap, data, fallback: unknownWidgetFallback };

  return <div className="dashboard-renderer">{topLevel.map((s) => renderSlot(s, ctx))}</div>;
}

/**
 * Adapter da `DashboardElementShape` (loader output) a `DashboardRendererSlot`.
 * Espone parent_element_id + variant (G4 schema additions) come campi tipizzati.
 */
export function elementsToSlots(
  shapes: (DashboardElementShape & {
    parent_element_id?: string | number | bigint | null;
    variant?: string | null;
  })[]
): DashboardRendererSlot[] {
  return shapes.map((s) => ({
    id: s.id,
    parent_element_id: s.parent_element_id ?? null,
    position: s.position,
    widget_code: s.widget_code,
    variant: s.variant ?? null,
    grid_col_start: s.grid_col_start,
    grid_col_span: s.grid_col_span,
  }));
}
