'use client';

import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — react-cytoscapejs ships no types
import CytoscapeComponent from 'react-cytoscapejs';
import type { ElementDefinition } from 'cytoscape';
import { cn } from '../../lib/cn';

/**
 * NetworkGraph — Cytoscape.js wrapper for force-directed graph viz.
 * Useful for ESCO knowledge graph, org chart, dependency maps.
 * (TIER 4 specialized viz)
 */
export interface NetworkGraphProps {
  nodes: { id: string; label?: string; group?: string; size?: number }[];
  edges: { id: string; source: string; target: string; label?: string; weight?: number }[];
  layout?: 'cose' | 'circle' | 'grid' | 'concentric' | 'breadthfirst';
  height?: number | string;
  className?: string;
  ariaLabel?: string;
}

export function NetworkGraph({
  nodes,
  edges,
  layout = 'cose',
  height = 400,
  className,
  ariaLabel = 'Network graph',
}: NetworkGraphProps) {
  const elements: ElementDefinition[] = React.useMemo(
    () => [
      ...nodes.map((n) => ({
        data: { id: n.id, label: n.label ?? n.id, group: n.group ?? 'default' },
        ...(n.size ? { style: { width: n.size, height: n.size } } : {}),
      })),
      ...edges.map((e) => ({
        data: { id: e.id, source: e.source, target: e.target, label: e.label ?? '' },
      })),
    ],
    [nodes, edges]
  );

  const stylesheet = React.useMemo(
    () => [
      {
        selector: 'node',
        style: {
          'background-color': 'oklch(0.55 0.18 264)',
          label: 'data(label)',
          color: 'oklch(0.99 0 0)',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': 10,
          width: 32,
          height: 32,
        },
      },
      {
        selector: 'edge',
        style: {
          width: 2,
          'line-color': 'oklch(0.65 0.05 252)',
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': 'oklch(0.65 0.05 252)',
        },
      },
    ],
    []
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('rounded-md border border-border bg-background', className)}
    >
      <CytoscapeComponent
        elements={elements}
        layout={{ name: layout, animate: true }}
        stylesheet={stylesheet as never}
        style={{ width: '100%', height }}
      />
    </div>
  );
}
