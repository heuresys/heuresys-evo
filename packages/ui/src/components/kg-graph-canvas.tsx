'use client';

/**
 * Phase 14 Sprint 3.G — KGGraphCanvas atomic.
 *
 * Lightweight knowledge-graph canvas rendered as a tabular adjacency list
 * (foundation scope — cytoscape integration follows in 3.G+). Accepts the
 * same `nodes` + `edges` shape the future cytoscape pass will use, so the
 * page layer needs no changes when the renderer is upgraded.
 */

import { useMemo } from 'react';

export interface KGNode {
  id: string;
  label: string;
  group?: string;
}

export interface KGEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface KGGraphCanvasProps {
  nodes: KGNode[];
  edges: KGEdge[];
  emptyState?: string;
}

export function KGGraphCanvas({ nodes, edges, emptyState }: KGGraphCanvasProps) {
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const adj = useMemo(() => {
    const m = new Map<string, KGEdge[]>();
    for (const e of edges) {
      if (!m.has(e.source)) m.set(e.source, []);
      m.get(e.source)!.push(e);
    }
    return m;
  }, [edges]);

  if (nodes.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">
        {emptyState ?? 'No graph data'}
      </div>
    );
  }

  return (
    <div data-testid="kg-graph-canvas" className="rounded-md border border-neutral-200">
      <header className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 text-xs font-mono uppercase tracking-wide text-neutral-500">
        <span>Knowledge graph</span>
        <span>
          {nodes.length} nodes · {edges.length} edges
        </span>
      </header>
      <ul className="divide-y divide-neutral-100">
        {nodes.map((n) => {
          const out = adj.get(n.id) ?? [];
          return (
            <li key={n.id} className="px-3 py-2" data-testid="kg-graph-node">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{n.label}</span>
                {n.group && (
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600">
                    {n.group}
                  </span>
                )}
              </div>
              {out.length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-4 text-xs text-neutral-600">
                  {out.map((e) => {
                    const target = byId.get(e.target);
                    return (
                      <li key={e.id} data-testid="kg-graph-edge">
                        → {target?.label ?? e.target}
                        {e.label && <span className="ml-1 text-neutral-400">({e.label})</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
