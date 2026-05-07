/**
 * Phase 14 Sprint 3.G — GET /api/explorer/kg/expand?occupationId=<uuid>
 *
 * Returns the 1-hop neighbourhood (essential + optional skills) for an
 * ESCO occupation. Auth required; no tenant gate (ESCO is shared).
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const url = new URL(req.url);
  const occupationId = url.searchParams.get('occupationId');
  if (!occupationId) {
    return NextResponse.json({ error: 'missing_occupationId' }, { status: 400 });
  }

  const occupation = await prisma.esco_occupations.findUnique({
    where: { id: occupationId },
    select: { id: true, code: true, preferred_label_en: true },
  });
  if (!occupation) {
    return NextResponse.json({ error: 'occupation_not_found' }, { status: 404 });
  }

  const links = await prisma.esco_occupation_skills.findMany({
    where: { occupation_id: occupation.id },
    take: 50,
    select: { skill_id: true, relation_type: true },
  });
  const skillIds = links.map((l) => l.skill_id);
  const skills = skillIds.length
    ? await prisma.esco_skills.findMany({
        where: { id: { in: skillIds } },
        select: { id: true, preferred_label_en: true },
      })
    : [];
  const skillById = new Map(skills.map((s) => [s.id, s]));

  return NextResponse.json({
    centre: { id: occupation.id, code: occupation.code, label: occupation.preferred_label_en },
    skills: links.map((l) => {
      const s = skillById.get(l.skill_id);
      return {
        id: s?.id ?? null,
        label: s?.preferred_label_en ?? null,
        essential: (l.relation_type ?? '').toLowerCase().includes('essential'),
      };
    }),
  });
}
