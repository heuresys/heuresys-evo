import * as React from 'react';

export type SuccessionRisk = 'low' | 'medium' | 'high' | 'critical';
export type SuccessionReadiness = 'ready-now' | '1-2y' | '3-5y' | 'not-ready';

export interface BrandSuccessionCardProps {
  candidateName: string;
  currentRole: string;
  targetRole: string;
  readinessPercent: number;
  readiness?: SuccessionReadiness;
  risk?: SuccessionRisk;
  readyBy?: string;
  candidateAvatarUrl?: string;
}

const RISK_PILL: Record<SuccessionRisk, string> = {
  low: 'pill-ok',
  medium: 'pill-info',
  high: 'pill-warn',
  critical: 'pill-critical',
};

const READINESS_LABEL: Record<SuccessionReadiness, string> = {
  'ready-now': 'READY NOW',
  '1-2y': '1-2 YEARS',
  '3-5y': '3-5 YEARS',
  'not-ready': 'NOT READY',
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return '??';
  if (!second) return first.slice(0, 2).toUpperCase();
  return ((first[0] ?? '') + (second[0] ?? '')).toUpperCase();
}

/**
 * BrandSuccessionCard — succession card mockup-fedele.
 * Layout: role-mono uppercase + h3 candidate name + candidates avatar stack
 *         + meta-row (readiness % + ready by date).
 */
export function BrandSuccessionCard({
  candidateName,
  currentRole,
  targetRole,
  readinessPercent,
  readiness = 'ready-now',
  risk = 'low',
  readyBy,
  candidateAvatarUrl,
}: BrandSuccessionCardProps) {
  const safeName = candidateName?.trim() || 'Candidato da assegnare';
  const safeRole = currentRole?.trim() || '—';
  const safeTarget = targetRole?.trim() || 'TBD';
  const safeReadiness: SuccessionReadiness =
    readiness && READINESS_LABEL[readiness] ? readiness : 'ready-now';
  const safeRisk: SuccessionRisk = risk && RISK_PILL[risk] ? risk : 'low';
  const safePercent = Number.isFinite(readinessPercent)
    ? Math.max(0, Math.min(100, readinessPercent))
    : 0;
  const initials = deriveInitials(safeName);

  return (
    <article className="succession-card">
      <div className="role">{safeRole}</div>
      <h3>{safeName}</h3>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: 'var(--ink-muted)',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        TARGET · <span style={{ color: 'var(--accent)' }}>{safeTarget}</span>
      </div>
      <div className="candidates" aria-label={`${safeName} successor stack`}>
        <div className="candidate top" title={safeName}>
          {candidateAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={candidateAvatarUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            initials
          )}
        </div>
        <div className="candidate" title="Backup #2">
          —
        </div>
        <div className="candidate" title="Backup #3">
          —
        </div>
        <div className="more">+0</div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className={`pill ${RISK_PILL[safeRisk]}`}>{safeRisk.toUpperCase()} RISK</span>
        <span className="pill pill-info" title={`Readiness: ${READINESS_LABEL[safeReadiness]}`}>
          {READINESS_LABEL[safeReadiness]}
        </span>
      </div>
      <div className="meta-row">
        <span>READINESS</span>
        <strong>{Math.round(safePercent)}%</strong>
      </div>
      {readyBy ? (
        <div className="meta-row" style={{ borderTop: 0, paddingTop: 0, marginTop: -4 }}>
          <span>READY BY</span>
          <strong>{readyBy}</strong>
        </div>
      ) : null}
    </article>
  );
}
