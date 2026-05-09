import * as React from 'react';

export type IntRowTone = 'ok' | 'warn' | 'critical';

export interface BrandIntRowProps {
  /** Integration display name (e.g. "SAP HCM"). */
  name: string;
  /** Meta line (e.g. "last sync · 2 min ago"). */
  meta?: string;
  /** Status pill tone (post-L41 unified). */
  tone?: IntRowTone;
  /** Pill label. Defaults to tone uppercase. */
  status?: string;
  /** Optional inline SVG inside the icon box. Defaults to a generic plug glyph. */
  icon?: React.ReactNode;
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 8V4M11 8V4M3 8h10v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Z" />
  </svg>
);

/**
 * BrandIntRow — integration row mockup-fedele.
 * Layout: `.int-row` (.icon SVG box + .info {.name + .meta} + status pill).
 * Coverage: org-systems · cross-tenant · tenant-owner integration lists.
 */
export function BrandIntRow({
  name,
  meta,
  tone = 'ok',
  status,
  icon = DEFAULT_ICON,
}: BrandIntRowProps) {
  const pillClass = `pill pill-${tone}`;
  const label = status ?? tone.toUpperCase();
  return (
    <div className="int-row">
      <div className="icon">{icon}</div>
      <div className="info">
        <div className="name">{name}</div>
        {meta ? <div className="meta">{meta}</div> : null}
      </div>
      <span className={pillClass}>{label}</span>
    </div>
  );
}
