import * as React from 'react';

export type TenantCardKind = 'platform' | 'tenant';

export interface TenantCardRow {
  label: string;
  value: React.ReactNode;
  /** When true, value rendered with .val.success colour (semantic-success). */
  success?: boolean;
}

export interface BrandTenantCardProps {
  /** Tenant display name (e.g. "RTL Bank", "Heuresys System"). */
  name: string;
  /** Short tenant identifier (e.g. "rtl-bank", "FB1E866C"). */
  tid?: string;
  /** Variant: "platform" applies the landlord chrome (`.tenant-card.platform`). */
  kind?: TenantCardKind;
  /** Tag label rendered above title. Defaults to "PLATFORM" / "TENANT" by `kind`. */
  tag?: string;
  /** Up to N rows of label/value pairs (e.g. employees, revenue, status). */
  rows?: TenantCardRow[];
  /** Optional health line at the bottom. Tone via `health.warn`. */
  health?: { label: string; strong?: string; tone?: 'ok' | 'warn' };
}

/**
 * BrandTenantCard — tenant card mockup-fedele.
 * Layout: `.tenant-card[.platform]` chrome (tag + h3 + tid + rows + optional health).
 * Coverage: cross-tenant overview + org-systems.
 */
export function BrandTenantCard({
  name,
  tid,
  kind = 'tenant',
  tag,
  rows = [],
  health,
}: BrandTenantCardProps) {
  const tagLabel = tag ?? (kind === 'platform' ? 'PLATFORM' : 'TENANT');
  const tagClass = kind === 'platform' ? 'tag tag-platform' : 'tag tag-tenant';
  return (
    <article className={kind === 'platform' ? 'tenant-card platform' : 'tenant-card'}>
      <span className={tagClass}>{tagLabel}</span>
      <h3>{name}</h3>
      {tid ? <div className="tid">{tid}</div> : null}
      {rows.map((r, i) => (
        <div className="row" key={`${r.label}-${i}`}>
          <span className="lbl">{r.label}</span>
          <span className={r.success ? 'val success' : 'val'}>{r.value}</span>
        </div>
      ))}
      {health ? (
        <div className="health">
          <span className={health.tone === 'warn' ? 'dot warn' : 'dot'} aria-hidden="true" />
          <span className="lbl">
            {health.strong ? <strong>{health.strong}</strong> : null}
            {health.strong ? ' ' : ''}
            {health.label}
          </span>
        </div>
      ) : null}
    </article>
  );
}
