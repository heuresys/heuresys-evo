'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * JsonTree — collapsible JSON viewer with type-coloring.
 * (TIER 9)
 */
export function JsonTree({
  value,
  name,
  depth = 0,
  defaultOpen = true,
  className,
}: {
  value: unknown;
  name?: string;
  depth?: number;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  if (value === null) {
    return <Leaf name={name} type="null" content="null" className={className} />;
  }
  const t = typeof value;
  if (t === 'string')
    return <Leaf name={name} type="string" content={`"${value}"`} className={className} />;
  if (t === 'number')
    return <Leaf name={name} type="number" content={String(value)} className={className} />;
  if (t === 'boolean')
    return <Leaf name={name} type="boolean" content={String(value)} className={className} />;
  if (Array.isArray(value)) {
    return (
      <div className={cn('font-mono text-xs', className)} style={{ paddingLeft: depth ? 16 : 0 }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 hover:bg-accent"
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform', open && 'rotate-90')}
            aria-hidden="true"
          />
          {name ? <span className="text-muted-fg">{name}: </span> : null}
          <span className="text-muted-fg">[{value.length}]</span>
        </button>
        {open ? (
          <ol className="pl-4">
            {value.map((v, i) => (
              <li key={i}>
                <JsonTree value={v} name={String(i)} depth={depth + 1} defaultOpen={false} />
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    );
  }
  if (t === 'object') {
    const entries = Object.entries(value as object);
    return (
      <div className={cn('font-mono text-xs', className)} style={{ paddingLeft: depth ? 16 : 0 }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 hover:bg-accent"
        >
          <ChevronRight
            className={cn('h-3 w-3 transition-transform', open && 'rotate-90')}
            aria-hidden="true"
          />
          {name ? <span className="text-muted-fg">{name}: </span> : null}
          <span className="text-muted-fg">{`{${entries.length}}`}</span>
        </button>
        {open ? (
          <ul className="pl-4">
            {entries.map(([k, v]) => (
              <li key={k}>
                <JsonTree value={v} name={k} depth={depth + 1} defaultOpen={false} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
  return null;
}

function Leaf({
  name,
  type,
  content,
  className,
}: {
  name?: string;
  type: 'string' | 'number' | 'boolean' | 'null';
  content: string;
  className?: string;
}) {
  const colorClass = {
    string: 'text-success',
    number: 'text-info',
    boolean: 'text-warning',
    null: 'text-muted-fg',
  }[type];
  return (
    <span className={cn('font-mono text-xs', className)}>
      {name ? <span className="text-muted-fg">{name}: </span> : null}
      <span className={colorClass}>{content}</span>
    </span>
  );
}
