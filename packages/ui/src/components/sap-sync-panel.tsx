'use client';

/**
 * Phase 14 Sprint 3.G — SAPSyncPanel atomic.
 *
 * Read-only summary of SAP migration / sync activity for a tenant.
 * Accepts a job list + a delta sync log. Renders status badges + a
 * compact KPI row so the host page can drop the panel inline without
 * additional layout work.
 */

import type { ReactNode } from 'react';

export type SAPJobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'rolled_back';

export interface SAPJobSummary {
  id: string;
  jobName: string;
  jobType: string;
  status: SAPJobStatus;
  progressPercent: number | null;
  totalRecords: number | null;
  successCount: number | null;
  errorCount: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface SAPDeltaEntry {
  timestamp: string;
  kind: 'success' | 'error' | 'warning';
  count: number;
  message: string | null;
}

export interface SAPSyncPanelProps {
  jobs: SAPJobSummary[];
  delta: SAPDeltaEntry[];
  emptyJobsLabel?: string;
}

const STATUS_BADGE: Record<SAPJobStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-neutral-100 text-neutral-700' },
  running: { label: 'Running', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelled', className: 'bg-amber-100 text-amber-800' },
  rolled_back: { label: 'Rolled back', className: 'bg-purple-100 text-purple-800' },
};

function StatusBadge({ status }: { status: SAPJobStatus }): ReactNode {
  const cfg = STATUS_BADGE[status] ?? {
    label: status,
    className: 'bg-neutral-100 text-neutral-700',
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide ${cfg.className}`}
      data-testid="sap-status-badge"
    >
      {cfg.label}
    </span>
  );
}

export function SAPSyncPanel({ jobs, delta, emptyJobsLabel }: SAPSyncPanelProps) {
  const lastJob = jobs[0] ?? null;
  const totalSuccess = delta.filter((d) => d.kind === 'success').reduce((a, b) => a + b.count, 0);
  const totalErrors = delta.filter((d) => d.kind === 'error').reduce((a, b) => a + b.count, 0);

  return (
    <div data-testid="sap-sync-panel" className="space-y-4">
      <div className="grid grid-cols-3 gap-2 rounded-md border border-neutral-200 p-3">
        <div>
          <p className="text-[10px] font-mono uppercase text-neutral-500">Last job</p>
          <p className="text-sm font-medium">{lastJob ? lastJob.jobName : '—'}</p>
          {lastJob && <StatusBadge status={lastJob.status} />}
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase text-neutral-500">Δ success (recent)</p>
          <p className="text-2xl font-semibold text-emerald-700">{totalSuccess}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase text-neutral-500">Δ errors (recent)</p>
          <p className="text-2xl font-semibold text-red-700">{totalErrors}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Migration jobs</h3>
        {jobs.length === 0 ? (
          <p className="rounded-md border border-dashed border-neutral-300 p-3 text-sm text-neutral-500">
            {emptyJobsLabel ?? 'No SAP migration jobs yet.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono uppercase text-neutral-500">
              <tr className="text-left">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Progress</th>
                <th className="pb-2 pr-4">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {jobs.map((j) => (
                <tr key={j.id} data-testid="sap-job-row">
                  <td className="py-2 pr-4 font-medium">{j.jobName}</td>
                  <td className="py-2 pr-4">{j.jobType}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="py-2 pr-4">
                    {j.progressPercent !== null ? `${j.progressPercent}%` : '—'}
                  </td>
                  <td className="py-2 pr-4 text-xs text-neutral-500">
                    {j.startedAt ? new Date(j.startedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
