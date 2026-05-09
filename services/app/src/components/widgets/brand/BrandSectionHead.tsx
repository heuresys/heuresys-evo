import * as React from 'react';

export interface BrandSectionHeadProps {
  /** Title string. The last word is auto-wrapped in `<em>` for accent colour. */
  title: string;
  /** Optional meta label (uppercase mono) shown to the right of the title. */
  meta?: React.ReactNode;
  /** Override for which segment of the title gets the accent. Defaults to last word. */
  accent?: string;
}

/**
 * BrandSectionHead — section header mockup-fedele.
 * Layout: `.section-head` (h2 with optional `<em>` accent + .meta uppercase mono).
 * Coverage: 7/7 mockup as inline header inside views/widgets.
 */
export function BrandSectionHead({ title, meta, accent }: BrandSectionHeadProps) {
  let pre = title;
  let highlight = '';
  if (accent && title.endsWith(accent)) {
    pre = title.slice(0, title.length - accent.length).trimEnd();
    highlight = accent;
  } else if (!accent) {
    const parts = title.split(' ');
    if (parts.length > 1) {
      highlight = parts[parts.length - 1] ?? '';
      pre = parts.slice(0, -1).join(' ');
    } else {
      pre = '';
      highlight = title;
    }
  } else {
    pre = title;
    highlight = accent;
  }

  return (
    <header className="section-head">
      <h2>
        {pre}
        {pre && highlight ? ' ' : ''}
        {highlight ? <em>{highlight}</em> : null}
      </h2>
      {meta != null ? <span className="meta">{meta}</span> : null}
    </header>
  );
}
