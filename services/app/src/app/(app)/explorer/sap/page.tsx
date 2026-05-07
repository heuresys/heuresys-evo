/**
 * Phase 14 Sprint 3.G — /explorer/sap — SAP migration sync panel.
 *
 * Renders SAPSyncPanel atomic with the caller-tenant's recent migration jobs +
 * delta sync log. Auth required; tenant gate enforced via Prisma `where` clause.
 */

import { redirect } from 'next/navigation';
import {
  SAPSyncPanel,
  type SAPDeltaEntry,
  type SAPJobStatus,
  type SAPJobSummary,
} from '@heuresys/ui';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const JOB_STATUSES: ReadonlySet<SAPJobStatus> = new Set([
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
  'rolled_back',
]);

function normalizeStatus(status: string | null): SAPJobStatus {
  if (status && JOB_STATUSES.has(status as SAPJobStatus)) {
    return status as SAPJobStatus;
  }
  return 'pending';
}

export default async function ExplorerSapPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/explorer/sap');
  const user = session.user as { tenantId?: string };

  const jobs: SAPJobSummary[] = user.tenantId
    ? (
        await prisma.sap_migration_jobs.findMany({
          where: { tenant_id: user.tenantId },
          select: {
            id: true,
            job_name: true,
            job_type: true,
            status: true,
            progress_percent: true,
            total_records: true,
            success_count: true,
            error_count: true,
            started_at: true,
            completed_at: true,
          },
          orderBy: { created_at: 'desc' },
          take: 10,
        })
      ).map((j) => ({
        id: j.id,
        jobName: j.job_name,
        jobType: j.job_type,
        status: normalizeStatus(j.status),
        progressPercent: j.progress_percent,
        totalRecords: j.total_records,
        successCount: j.success_count,
        errorCount: j.error_count,
        startedAt: j.started_at?.toISOString() ?? null,
        completedAt: j.completed_at?.toISOString() ?? null,
      }))
    : [];

  const delta: SAPDeltaEntry[] = user.tenantId
    ? (
        await prisma.sap_delta_sync_log.findMany({
          where: { tenant_id: user.tenantId },
          select: {
            local_timestamp: true,
            status: true,
            records_created: true,
            records_updated: true,
            error_message: true,
          },
          orderBy: { local_timestamp: 'desc' },
          take: 25,
        })
      ).map((d) => ({
        timestamp: d.local_timestamp?.toISOString() ?? new Date().toISOString(),
        kind: d.status === 'error' ? 'error' : d.status === 'warning' ? 'warning' : 'success',
        count: (d.records_created ?? 0) + (d.records_updated ?? 0),
        message: d.error_message,
      }))
    : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Explorer · SAP migration</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Read-only summary of SAP infotype migration jobs and delta sync activity for your tenant.
        </p>
      </header>
      <SAPSyncPanel jobs={jobs} delta={delta} />
    </main>
  );
}
