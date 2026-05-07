'use client';

import { useState } from 'react';
import { ESCOTreeNavigator, type ESCOTreeNode } from '@heuresys/ui';

export function ExplorerEscoClient({ initialNodes }: { initialNodes: ESCOTreeNode[] }) {
  const [selected, setSelected] = useState<ESCOTreeNode | null>(null);

  async function expand(parentUri: string): Promise<ESCOTreeNode[]> {
    const res = await fetch(`/api/explorer/esco/tree?parent=${encodeURIComponent(parentUri)}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { nodes: ESCOTreeNode[] };
    return json.nodes;
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <section>
        <ESCOTreeNavigator nodes={initialNodes} onExpand={expand} onSelect={setSelected} />
      </section>
      <aside className="rounded-md border border-neutral-200 p-3">
        <h2 className="text-sm font-medium">Selected</h2>
        {selected ? (
          <dl className="mt-2 space-y-1 text-xs">
            <div>
              <dt className="text-neutral-500">Label</dt>
              <dd className="font-medium">{selected.label}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">ESCO code</dt>
              <dd className="font-mono">{selected.code ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">ISCO code</dt>
              <dd className="font-mono">{selected.iscoCode ?? '—'}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-xs text-neutral-500">Pick a node to inspect.</p>
        )}
      </aside>
    </div>
  );
}
