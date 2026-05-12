/**
 * Phase 14 Sprint 3.G — /explorer/kg — Knowledge-graph canvas.
 *
 * Foundation scope: select an ESCO occupation → render the centered node + a
 * 1-hop neighborhood pulled from `esco_skill_relations`. Cytoscape graph
 * upgrade is a follow-up; the KGGraphCanvas atomic accepts the same node/edge
 * shape so the swap is local.
 */

import { redirect } from 'next/navigation';
import { KGGraphCanvas, type KGEdge, type KGNode } from '@heuresys/ui';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ occ?: string }>;
}

export default async function ExplorerKgPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/explorer/kg');

  const params = await searchParams;
  const occupationId = params.occ ?? null;

  // Default seed: pick a representative occupation if no selection.
  const center = occupationId
    ? await prisma.esco_occupations.findUnique({
        where: { id: occupationId },
        select: { id: true, code: true, preferred_label_en: true },
      })
    : await prisma.esco_occupations.findFirst({
        where: { preferred_label_en: { contains: 'manager', mode: 'insensitive' } },
        select: { id: true, code: true, preferred_label_en: true },
        orderBy: { preferred_label_en: 'asc' },
      });

  let nodes: KGNode[] = [];
  let edges: KGEdge[] = [];

  if (center) {
    const skillLinks = await prisma.esco_occupation_skills.findMany({
      where: { occupation_id: center.id },
      take: 12,
      select: { skill_id: true, relation_type: true },
    });
    const skillIds = skillLinks.map((l) => l.skill_id);
    const skills = skillIds.length
      ? await prisma.esco_skills.findMany({
          where: { id: { in: skillIds } },
          select: { id: true, preferred_label_en: true },
        })
      : [];
    const skillById = new Map(skills.map((s) => [s.id, s]));

    nodes.push({
      id: `occ:${center.id}`,
      label: center.preferred_label_en ?? center.code ?? center.id,
      group: 'occupation',
    });
    for (const link of skillLinks) {
      const skill = skillById.get(link.skill_id);
      if (!skill) continue;
      const isEssential = (link.relation_type ?? '').toLowerCase().includes('essential');
      const skillNodeId = `skill:${skill.id}`;
      nodes.push({
        id: skillNodeId,
        label: skill.preferred_label_en ?? skill.id,
        group: isEssential ? 'essential-skill' : 'optional-skill',
      });
      edges.push({
        id: `${center.id}:${skill.id}`,
        source: `occ:${center.id}`,
        target: skillNodeId,
        label: isEssential ? 'requires' : 'related',
      });
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Esploratore · grafo della conoscenza</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vicinato a 1 hop centrato su un&apos;occupazione. Passa{' '}
          <code className="rounded bg-neutral-100 px-1">?occ=&lt;uuid&gt;</code> per centrare il
          grafo su una specifica occupazione ESCO; il seed predefinito è un ruolo manager
          rappresentativo.
        </p>
      </header>
      {center && (
        <p className="mb-3 text-sm text-muted-foreground">
          Centro: <span className="font-medium">{center.preferred_label_en}</span> (codice ESCO{' '}
          {center.code})
        </p>
      )}
      <KGGraphCanvas
        nodes={nodes}
        edges={edges}
        emptyState="Nessun dato grafo per questa occupazione"
      />
    </main>
  );
}
