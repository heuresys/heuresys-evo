'use client';

/**
 * BrandOkrCascadeTree — OKR cascade tree expand/collapse (cycle 2 Phase 3).
 *
 * Tree hierarchical Tenant → Dept → Team → Individual goals con progress bar
 * inline + status tone. Source: services/app/src/lib/data/goals-queries.ts.
 * P11: data === null → DataNotAvailable.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';

export interface OkrCascadeNode {
  id: string;
  title: string;
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'draft';
  progressPercent: number | null;
  owner?: string | null;
  children?: OkrCascadeNode[];
}

export interface BrandOkrCascadeTreeProps {
  roots: OkrCascadeNode[] | null;
  title?: string;
}

const STATUS_TONE: Record<OkrCascadeNode['status'], string> = {
  on_track: 'okr-status-ok',
  at_risk: 'okr-status-warn',
  off_track: 'okr-status-crit',
  completed: 'okr-status-done',
  draft: 'okr-status-muted',
};

function CascadeNode({ node, depth }: { node: OkrCascadeNode; depth: number }) {
  const [open, setOpen] = React.useState(depth < 2);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  return (
    <li className="okr-node" data-depth={depth}>
      <div className="okr-row">
        {hasChildren ? (
          <button
            type="button"
            className="okr-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <span aria-hidden="true">{open ? '▼' : '▶'}</span>
          </button>
        ) : (
          <span className="okr-toggle okr-toggle-leaf" aria-hidden="true" />
        )}
        <span className="okr-title">{node.title}</span>
        <span className={`okr-status ${STATUS_TONE[node.status]}`}>{node.status}</span>
        {typeof node.progressPercent === 'number' ? (
          <span className="okr-progress" aria-label={`Progress ${node.progressPercent}%`}>
            <span
              className="okr-progress-bar"
              style={{ width: `${Math.max(0, Math.min(100, node.progressPercent))}%` }}
            />
            <span className="okr-progress-label">{node.progressPercent}%</span>
          </span>
        ) : null}
        {node.owner ? <span className="okr-owner">{node.owner}</span> : null}
      </div>
      {hasChildren && open ? (
        <ul className="okr-children">
          {node.children!.map((child) => (
            <CascadeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function BrandOkrCascadeTree({ roots, title = 'OKR cascade' }: BrandOkrCascadeTreeProps) {
  if (roots === null) {
    return (
      <div className="okr-cascade">
        <div className="widget-head">
          <h3>{title}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  return (
    <div className="okr-cascade">
      <div className="widget-head">
        <h3>{title}</h3>
        <span className="count-chip">{roots.length} root goals</span>
      </div>
      {roots.length === 0 ? (
        <p className="okr-empty">Nessun obiettivo cascade definito.</p>
      ) : (
        <ul className="okr-tree" role="tree">
          {roots.map((r) => (
            <CascadeNode key={r.id} node={r} depth={0} />
          ))}
        </ul>
      )}
    </div>
  );
}
