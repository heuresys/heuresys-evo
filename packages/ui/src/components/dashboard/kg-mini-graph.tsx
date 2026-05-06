'use client';

import * as React from 'react';
import { NetworkGraph, type NetworkGraphProps } from '../charts/network-graph';
import { cn } from '../../lib/cn';

export interface KgMiniGraphLegendItem {
  group: string;
  label: string;
  color: string;
}

export interface KgMiniGraphProps {
  nodes: NetworkGraphProps['nodes'];
  edges: NetworkGraphProps['edges'];
  /** Smaller default than NetworkGraph (200px vs 400px) */
  height?: number | string;
  layout?: NetworkGraphProps['layout'];
  /** Optional legend to render below the canvas */
  legend?: KgMiniGraphLegendItem[];
  ariaLabel?: string;
  className?: string;
}

export function KgMiniGraph({
  nodes,
  edges,
  height = 200,
  layout = 'cose',
  legend,
  ariaLabel = 'Knowledge graph mini',
  className,
}: KgMiniGraphProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        height={height}
        layout={layout}
        ariaLabel={ariaLabel}
      />
      {legend && legend.length > 0 ? (
        <ul role="list" className="flex flex-wrap items-center gap-3">
          {legend.map((item) => (
            <li key={item.group} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
