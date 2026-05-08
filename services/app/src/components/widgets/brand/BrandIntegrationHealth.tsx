import * as React from 'react';

export type IntegrationTone = 'ok' | 'warn' | 'down' | 'info';

export interface BrandIntegrationHealthProps {
  tone: IntegrationTone;
  label?: string;
  pulse?: boolean;
  showDot?: boolean;
}

const PILL_CLASS: Record<IntegrationTone, string> = {
  ok: 'pill-ok',
  warn: 'pill-warn',
  down: 'pill-critical',
  info: 'pill-info',
};

const DEFAULT_LABEL: Record<IntegrationTone, string> = {
  ok: 'OPERATIONAL',
  warn: 'DEGRADED',
  down: 'DOWN',
  info: 'SCANNING',
};

/**
 * BrandIntegrationHealth — pill chrome con dot status (μ-architect).
 * Layout: kpi-card-like wrapper + pill principale + secondary detail.
 */
export function BrandIntegrationHealth({
  tone,
  label,
  pulse = false,
  showDot = true,
}: BrandIntegrationHealthProps) {
  const cls = PILL_CLASS[tone];
  const text = label ?? DEFAULT_LABEL[tone];
  return (
    <article className="kpi-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="kpi-head">
        <span className="kpi-label">INTEGRATION HEALTH</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showDot ? (
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background:
                tone === 'ok'
                  ? 'var(--semantic-success)'
                  : tone === 'warn'
                    ? 'var(--semantic-warning)'
                    : tone === 'down'
                      ? 'var(--semantic-danger)'
                      : 'var(--accent)',
              boxShadow:
                tone === 'ok'
                  ? '0 0 8px rgba(95,184,122,0.5)'
                  : tone === 'down'
                    ? '0 0 8px rgba(239,68,68,0.5)'
                    : 'none',
              animation: pulse ? 'integrationPulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
        ) : null}
        <span className={`pill ${cls}`} style={{ fontSize: 11, padding: '4px 10px' }}>
          {text}
        </span>
      </div>
      <div className="kpi-foot" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
        <span>STATUS</span>
        <strong>{tone.toUpperCase()}</strong>
      </div>
    </article>
  );
}
