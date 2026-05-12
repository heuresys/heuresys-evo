/**
 * Phase 14 Sprint 3.G — /explorer/esco — ESCO occupation tree.
 *
 * Foundation scope: server-fetched root layer + client-side lazy expand
 * via /api/explorer/esco/tree. Full filter/search bar + saved views are
 * follow-ups.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ExplorerEscoClient } from '@/components/explorer/ExplorerEscoClient';
import type { ESCOTreeNode } from '@heuresys/ui';

export const dynamic = 'force-dynamic';

async function loadRootLayer(): Promise<ESCOTreeNode[]> {
  // Top-level entries: parent_uri IS NULL (1 root) + their immediate children.
  const root = await prisma.esco_occupations.findMany({
    where: { parent_uri: null },
    select: { uri: true, code: true, preferred_label_en: true, isco_code: true, parent_uri: true },
    take: 1,
  });
  const childrenForRoots = await prisma.esco_occupations.findMany({
    where: { parent_uri: { in: root.map((r) => r.uri) } },
    select: { uri: true, code: true, preferred_label_en: true, isco_code: true, parent_uri: true },
    take: 50,
    orderBy: { preferred_label_en: 'asc' },
  });
  const flat = [...root, ...childrenForRoots];

  // hasChildren signal — query in one shot for the visible set.
  const childCounts = await prisma.esco_occupations.groupBy({
    by: ['parent_uri'],
    _count: { _all: true },
    where: { parent_uri: { in: flat.map((f) => f.uri) } },
  });
  const childByParent = new Map(childCounts.map((c) => [c.parent_uri ?? '', c._count._all]));

  return flat.map((n) => ({
    uri: n.uri,
    code: n.code,
    label: n.preferred_label_en ?? n.uri,
    iscoCode: n.isco_code,
    hasChildren: (childByParent.get(n.uri) ?? 0) > 0,
    parentUri: n.parent_uri,
  }));
}

export default async function ExplorerEscoPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/explorer/esco');

  const rootLayer = await loadRootLayer();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Esploratore · albero ESCO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista gerarchica su 3.040 occupazioni ESCO (1 root + 8 gruppi maggiori ISCO + sotto-gruppi
          nidificati). Clicca un nodo padre per espandere lazy i figli.
        </p>
      </header>
      <ExplorerEscoClient initialNodes={rootLayer} />
    </main>
  );
}
