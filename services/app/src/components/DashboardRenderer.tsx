'use client';

import * as React from 'react';
import { WIDGET_REGISTRY } from '@/lib/dashboard-engine/registry';
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

/**
 * G5 — DashboardRenderer skeleton.
 *
 * Consume singolo entry-point per qualunque preset DB-driven. Sostituisce i 7
 * `_views/*View.tsx` bespoke (D9 concordato S18). Risolve ogni element via
 * WIDGET_REGISTRY[widget_code] e passa data preloaded.
 *
 * **MVP scope (S19)**: rendering FLAT — tutti gli element top-level renderizzati
 * in document order. Hierarchical slots via parent_element_id sono parsati ma
 * renderizzati come flat fallback finché G5-phase-2 non aggiunge i layout
 * containers (.double-split, .main-split, .panel) come widget_code dedicati.
 *
 * **Adoption path**:
 *   1. S19 (skeleton): nessun consumer attivo. Renderer disponibile per tests + future migration.
 *   2. S20+ (G5-phase-2): aggiungere layout container widgets nel registry, abilitare hierarchy nesting.
 *   3. S20+ (G6): seedare 8 preset DB-driven, redirect `dashboard/page.tsx` a `<DashboardRenderer/>`.
 *
 * Riferimento: `docs/30-developer/brand-dashboard-catalog.md` § Appendix A roadmap G5/G6.
 */
export function DashboardRenderer({
  elements,
  data,
  unknownWidgetFallback,
}: DashboardRendererProps) {
  // Filtra solo top-level (parent_element_id === null) per MVP flat rendering.
  const topLevel = React.useMemo(
    () =>
      elements.filter((e) => e.parent_element_id == null).sort((a, b) => a.position - b.position),
    [elements]
  );

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

  return (
    <div className="dashboard-renderer">
      {topLevel.map((el) => {
        const Widget = WIDGET_REGISTRY[el.widget_code];
        const elKey = String(el.id);
        const elData = data?.[elKey];

        if (!Widget) {
          if (unknownWidgetFallback)
            return (
              <React.Fragment key={elKey}>{unknownWidgetFallback(el.widget_code)}</React.Fragment>
            );
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
              Unknown widget_code: <strong>{el.widget_code}</strong>
            </div>
          );
        }

        return (
          <div
            key={elKey}
            data-element-id={elKey}
            data-widget-code={el.widget_code}
            data-variant={el.variant ?? undefined}
          >
            <Widget data={elData} />
          </div>
        );
      })}
    </div>
  );
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
