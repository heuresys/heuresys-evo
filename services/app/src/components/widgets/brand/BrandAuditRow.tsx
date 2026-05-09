import * as React from 'react';

export interface BrandAuditRowProps {
  /** Timestamp string (e.g. "14:32:08"). Rendered uppercase mono. */
  ts: string;
  /** Action description. Supports inline `<strong>` and `<span class=accent>` via React nodes. */
  what: React.ReactNode;
  /** Optional actor (user/system). Right-aligned mono uppercase. */
  actor?: string;
}

/**
 * BrandAuditRow — audit log row mockup-fedele.
 * Layout: `.audit-row` grid (80px 1fr 120px) with .ts + .what + .actor.
 * Coverage: org-systems audit log live stream.
 */
export function BrandAuditRow({ ts, what, actor }: BrandAuditRowProps) {
  return (
    <div className="audit-row">
      <span className="ts">{ts}</span>
      <span className="what">{what}</span>
      {actor ? <span className="actor">{actor}</span> : null}
    </div>
  );
}
