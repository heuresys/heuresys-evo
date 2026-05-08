import * as React from 'react';

/**
 * G5-phase-2 — Layout container widgets.
 *
 * Container widget = widget che riceve `children` (slot figli ricorsivi) +
 * eventuale `data` per metadata (es. titolo Panel). Distingue dal leaf widget
 * regolare in WIDGET_REGISTRY che riceve solo `data`.
 *
 * Mappati in LAYOUT_REGISTRY (separato da WIDGET_REGISTRY) e risolti dal
 * DashboardRenderer quando incontra un element con figli (parent_element_id
 * che riferisce a questo element).
 *
 * Pattern: `<div className="<asset-class>">{children}</div>` con eventuale
 * panel-head per BrandPanel. Catalog § 3 Layout primitives + § 4 Navigation
 * & chrome.
 */

export interface LayoutContainerProps {
  data?: unknown;
  children: React.ReactNode;
}

/** `.double-split` — Grid 2-col asimmetrico (1.4fr 1fr). Catalog post-L42 unified. */
export function BrandDoubleSplit({ children }: LayoutContainerProps) {
  return <div className="double-split">{children}</div>;
}

/** `.main-split` — Grid 2-col asimmetrico (2fr 1fr) per main content + side. */
export function BrandMainSplit({ children }: LayoutContainerProps) {
  return <div className="main-split">{children}</div>;
}

/** `.kpi-ring` — Container 4-col grid per kpi-card. */
export function BrandKpiRing({ children }: LayoutContainerProps) {
  return <div className="kpi-ring">{children}</div>;
}

interface BrandPanelData {
  title?: string;
  titleEm?: string;
  meta?: string;
}

/**
 * `.panel` — Card wrapper con optional `.panel-head` (h2 + em + meta).
 * Title + titleEm + meta forniti via slot.data; se assenti, panel renderizza
 * solo body senza head.
 */
export function BrandPanel({ data, children }: LayoutContainerProps) {
  const d = (data as BrandPanelData | undefined) ?? {};
  const hasHead = d.title !== undefined;
  return (
    <div className="panel">
      {hasHead ? (
        <div className="panel-head">
          <h2>
            {d.title}
            {d.titleEm ? <em> {d.titleEm}</em> : null}
          </h2>
          {d.meta ? <span className="meta">{d.meta}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Lista esportabile per LAYOUT_REGISTRY (registrata in registry.tsx). */
export const LAYOUT_CONTAINERS = {
  LayoutDoubleSplit: BrandDoubleSplit,
  LayoutMainSplit: BrandMainSplit,
  LayoutKpiRing: BrandKpiRing,
  LayoutPanel: BrandPanel,
} as const;

export type LayoutContainerCode = keyof typeof LAYOUT_CONTAINERS;
