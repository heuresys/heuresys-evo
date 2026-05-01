'use client';

import * as React from 'react';
import mermaid from 'mermaid';
import { cn } from '../../lib/cn';

mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' });

/**
 * MermaidDiagram — render mermaid source as SVG via data-URL image.
 *
 * Implementation: mermaid produces SVG markup which we encode as a data URL
 * and assign to an <img> src. This avoids any HTML injection path entirely
 * since the browser parses the SVG as an image (no script execution).
 *
 * Supports flowchart/sequence/class/state/ER/Gantt/Sankey diagrams.
 * (TIER 10)
 */
export function MermaidDiagram({
  source,
  className,
  ariaLabel = 'Mermaid diagram',
}: {
  source: string;
  className?: string;
  ariaLabel?: string;
}) {
  const id = React.useId().replace(/:/g, '_');
  const [src, setSrc] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    mermaid
      .render(`mmd-${id}`, source)
      .then((res) => {
        if (cancelled) return;
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(res.svg)}`;
        setSrc(dataUrl);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e));
      });
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  if (error) {
    return (
      <pre role="alert" className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
        {error}
      </pre>
    );
  }
  if (!src) {
    return (
      <div
        role="status"
        aria-label="Rendering diagram"
        className={cn('h-32 animate-pulse rounded-md bg-muted', className)}
      />
    );
  }
  return (
    <img
      src={src}
      alt={ariaLabel}
      className={cn('w-full rounded-md border border-border bg-background p-2', className)}
    />
  );
}
