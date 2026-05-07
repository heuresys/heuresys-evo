/**
 * Phase 14 Sprint 3.G — GET /api/explorer/sap/status
 *
 * JSON variant of /explorer/sap. Auth required; tenant-scoped query.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const user = session.user as { tenantId?: string };
  if (!user.tenantId) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  const [jobs, delta] = await Promise.all([
    prisma.sap_migration_jobs.findMany({
      where: { tenant_id: user.tenantId },
      orderBy: { created_at: 'desc' },
      take: 10,
    }),
    prisma.sap_delta_sync_log.findMany({
      where: { tenant_id: user.tenantId },
      orderBy: { local_timestamp: 'desc' },
      take: 25,
    }),
  ]);

  return NextResponse.json({
    jobs: jobs.length,
    delta: delta.length,
    lastJob: jobs[0] ?? null,
  });
}
