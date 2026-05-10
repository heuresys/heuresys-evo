/**
 * Phase 14 Sprint 3.G — GET /api/explorer/esco/tree?parent=<uri>
 *
 * Returns child occupations for a given parent_uri, plus a `hasChildren`
 * boolean per child (one extra group-by query). Auth + RBP gate
 * (S28-bis Wave 7 H5): EXPLORER area, READ action.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

export async function GET(req: Request) {
  const guard = await requirePermissionApi('EXPLORER', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const parent = url.searchParams.get('parent');
  if (!parent) {
    return NextResponse.json({ error: 'missing_parent' }, { status: 400 });
  }

  const children = await prisma.esco_occupations.findMany({
    where: { parent_uri: parent },
    select: { uri: true, code: true, preferred_label_en: true, isco_code: true, parent_uri: true },
    take: 200,
    orderBy: { preferred_label_en: 'asc' },
  });

  if (children.length === 0) {
    return NextResponse.json({ nodes: [] });
  }

  const childCounts = await prisma.esco_occupations.groupBy({
    by: ['parent_uri'],
    _count: { _all: true },
    where: { parent_uri: { in: children.map((c) => c.uri) } },
  });
  const byParent = new Map(childCounts.map((c) => [c.parent_uri ?? '', c._count._all]));

  return NextResponse.json({
    nodes: children.map((n) => ({
      uri: n.uri,
      code: n.code,
      label: n.preferred_label_en ?? n.uri,
      iscoCode: n.isco_code,
      hasChildren: (byParent.get(n.uri) ?? 0) > 0,
      parentUri: n.parent_uri,
    })),
  });
}
