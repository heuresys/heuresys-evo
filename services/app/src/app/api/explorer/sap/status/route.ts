/**
 * Phase 14 Sprint 3.G — GET /api/explorer/sap/status
 *
 * JSON variant of /explorer/sap. Auth + RBP gate (S28-bis Wave 7 H5):
 * EXPLORER area, READ action. Tenant-scoped query (RLS enforced via tenantId).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

export async function GET() {
  const guard = await requirePermissionApi('EXPLORER', 'READ');
  if (!guard.ok) return guard.response;
  const { user } = guard;

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
