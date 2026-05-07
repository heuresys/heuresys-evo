'use client';

/**
 * Phase 14 Sprint 3.G — ESCOTreeNavigator atomic.
 *
 * Lazy-expand tree view of ESCO occupations. The component is presentation-only:
 * the parent passes the visible nodes + an `onExpand(uri)` callback that fetches
 * children and yields a new flat node list. State (expanded set) is owned by
 * the consumer so the same tree can be controlled from a server-rendered
 * skeleton or from a fully client-side Knowledge Graph explorer.
 */

import { useState, type ReactElement } from 'react';

export interface ESCOTreeNode {
  uri: string;
  code: string | null;
  label: string;
  iscoCode: string | null;
  hasChildren: boolean;
  parentUri: string | null;
}

export interface ESCOTreeNavigatorProps {
  nodes: ESCOTreeNode[];
  /** Called when the user expands a parent for the first time. Resolves to its children. */
  onExpand?: (parentUri: string) => Promise<ESCOTreeNode[]>;
  onSelect?: (node: ESCOTreeNode) => void;
}

interface InternalNode extends ESCOTreeNode {
  children: InternalNode[];
}

function buildForest(flat: ESCOTreeNode[]): InternalNode[] {
  const byUri = new Map<string, InternalNode>();
  for (const n of flat) byUri.set(n.uri, { ...n, children: [] });
  const roots: InternalNode[] = [];
  for (const node of byUri.values()) {
    if (node.parentUri && byUri.has(node.parentUri)) {
      byUri.get(node.parentUri)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function ESCOTreeNavigator({ nodes, onExpand, onSelect }: ESCOTreeNavigatorProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [extra, setExtra] = useState<ESCOTreeNode[]>([]);

  async function handleExpand(node: ESCOTreeNode): Promise<void> {
    if (expanded.has(node.uri)) {
      const next = new Set(expanded);
      next.delete(node.uri);
      setExpanded(next);
      return;
    }
    if (
      onExpand &&
      !nodes.some((n) => n.parentUri === node.uri) &&
      !extra.some((n) => n.parentUri === node.uri)
    ) {
      const nextLoading = new Set(loading);
      nextLoading.add(node.uri);
      setLoading(nextLoading);
      try {
        const children = await onExpand(node.uri);
        setExtra((prev) => [...prev, ...children]);
      } finally {
        const doneLoading = new Set(loading);
        doneLoading.delete(node.uri);
        setLoading(doneLoading);
      }
    }
    const nextExpanded = new Set(expanded);
    nextExpanded.add(node.uri);
    setExpanded(nextExpanded);
  }

  const allNodes = [...nodes, ...extra];
  const forest = buildForest(allNodes);

  function renderNode(node: InternalNode, depth: number): ReactElement {
    const isExpanded = expanded.has(node.uri);
    const isLoading = loading.has(node.uri);
    return (
      <li key={node.uri} className="leading-tight" data-testid="esco-tree-node">
        <div className="flex items-center gap-1 py-1" style={{ paddingLeft: depth * 16 }}>
          {node.hasChildren ? (
            <button
              type="button"
              onClick={() => handleExpand(node)}
              className="h-5 w-5 rounded text-xs hover:bg-neutral-100"
              aria-expanded={isExpanded}
              data-testid="esco-tree-toggle"
            >
              {isLoading ? '…' : isExpanded ? '▾' : '▸'}
            </button>
          ) : (
            <span className="inline-block w-5" />
          )}
          <button
            type="button"
            onClick={() => onSelect?.(node)}
            className="rounded px-2 py-0.5 text-left text-sm hover:bg-neutral-100"
            data-testid="esco-tree-label"
          >
            <span className="font-medium">{node.label}</span>
            {node.code && (
              <span className="ml-2 font-mono text-xs text-neutral-500">{node.code}</span>
            )}
          </button>
        </div>
        {isExpanded && node.children.length > 0 && (
          <ul>{node.children.map((c) => renderNode(c, depth + 1))}</ul>
        )}
      </li>
    );
  }

  return <ul data-testid="esco-tree-navigator">{forest.map((n) => renderNode(n, 0))}</ul>;
}
