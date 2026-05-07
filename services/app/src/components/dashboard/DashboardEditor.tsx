'use client';

/**
 * Phase 14 Sprint 3.C — Drag-resize dashboard editor.
 *
 * Client-only component (react-grid-layout has DOM-only deps). Loaded via
 * dynamic({ ssr: false }) from the parent page to avoid hydration warnings.
 *
 * Each grid item maps to a dashboard_elements row. On drag/resize end the
 * editor PUTs the full layout array to /api/dashboard/[code]/elements,
 * which writes via auditedDashboardMutation (one audit_logs entry per
 * changed element).
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Layout, LayoutItem } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// react-grid-layout v2 has a "legacy" entry that preserves the flat-prop v1
// API (cols, rowHeight, margin as direct props + onDragStop/onResizeStop
// callbacks). The new composable v2 API (gridConfig, dragConfig…) is more
// surface than this editor needs. Loaded via next/dynamic ssr:false because
// react-grid-layout has DOM-only deps (ResizeObserver, document).
const GridLayout = dynamic(() => import('react-grid-layout/legacy').then((m) => m.default ?? m), {
  ssr: false,
});

export interface EditorElement {
  id: string;
  widgetCode: string;
  gridColStart: number;
  gridColSpan: number;
  gridRowStart: number;
  gridRowSpan: number;
  position: number;
}

interface DashboardEditorProps {
  presetCode: string;
  elements: EditorElement[];
}

const COLS = 12;
const ROW_HEIGHT = 80;
const MARGIN: [number, number] = [12, 12];

export function elementsToLayout(els: EditorElement[]): LayoutItem[] {
  // grid_col_start is 1-based in DB; react-grid-layout x is 0-based.
  return els.map((el) => ({
    i: el.id,
    x: Math.max(0, el.gridColStart - 1),
    y: Math.max(0, el.gridRowStart - 1),
    w: Math.max(1, el.gridColSpan),
    h: Math.max(1, el.gridRowSpan),
    minW: 1,
    minH: 1,
    maxW: COLS,
  }));
}

export function layoutToUpdates(layout: LayoutItem[]): Array<{
  id: string;
  grid_col_start: number;
  grid_col_span: number;
  grid_row_start: number;
  grid_row_span: number;
  position: number;
}> {
  return layout
    .slice()
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((l, idx) => ({
      id: l.i,
      grid_col_start: l.x + 1,
      grid_col_span: l.w,
      grid_row_start: l.y + 1,
      grid_row_span: l.h,
      position: idx + 1,
    }));
}

export function DashboardEditor({ presetCode, elements }: DashboardEditorProps) {
  const [layout, setLayout] = useState<LayoutItem[]>(() => elementsToLayout(elements));
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLayout(elementsToLayout(elements));
  }, [elements]);

  async function persist(next: LayoutItem[]) {
    setSaveState('saving');
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/dashboard/${presetCode}/elements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: layoutToUpdates(next) }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSaveState('error');
        setErrorMsg(j.error ?? `HTTP ${res.status}`);
        return;
      }
      setSaveState('saved');
    } catch (e) {
      setSaveState('error');
      setErrorMsg(e instanceof Error ? e.message : 'unknown error');
    }
  }

  function onLayoutChange(next: Layout) {
    setLayout(next.slice());
  }

  function onDragOrResizeStop(next: Layout) {
    const mutable = next.slice();
    setLayout(mutable);
    void persist(mutable);
  }

  const lookup = new Map(elements.map((e) => [e.id, e]));

  return (
    <div data-testid="dashboard-editor">
      <div
        className="mb-3 flex items-center gap-2 text-xs text-muted-fg"
        data-testid="editor-status"
      >
        {saveState === 'idle' && <span>Drag or resize to save.</span>}
        {saveState === 'saving' && <span>Saving…</span>}
        {saveState === 'saved' && <span className="text-emerald-700">Saved</span>}
        {saveState === 'error' && (
          <span className="text-destructive">Save failed{errorMsg ? `: ${errorMsg}` : ''}</span>
        )}
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={1200}
        margin={MARGIN}
        compactType="vertical"
        onLayoutChange={onLayoutChange}
        onDragStop={onDragOrResizeStop}
        onResizeStop={onDragOrResizeStop}
        draggableCancel="button,a,input,textarea"
      >
        {layout.map((l) => {
          const el = lookup.get(l.i);
          return (
            <div
              key={l.i}
              data-testid="editor-tile"
              data-element-id={l.i}
              className="flex flex-col rounded-md border border-border bg-card p-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">
                  {el?.widgetCode ?? l.i}
                </span>
                <span className="font-mono text-[10px] text-muted-fg">
                  {l.x + 1},{l.y + 1} · {l.w}×{l.h}
                </span>
              </div>
              <div className="flex-1 text-sm text-muted-fg">drag · resize</div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
