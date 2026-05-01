import * as React from 'react';
import { cn } from '../../lib/cn';

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  oldLine?: number;
  newLine?: number;
}

/**
 * DiffViewer — side-by-side or unified line diff renderer.
 * Accepts pre-computed DiffLine[] (caller can use jsdiff or any algo).
 * (TIER 9)
 */
export function DiffViewer({
  lines,
  variant = 'unified',
  className,
}: {
  lines: DiffLine[];
  variant?: 'unified' | 'split';
  className?: string;
}) {
  if (variant === 'split') {
    return (
      <div
        className={cn(
          'grid grid-cols-2 overflow-hidden rounded-md border border-border font-mono text-xs',
          className
        )}
      >
        <div className="border-r border-border">
          {lines.map((l, i) => (
            <div
              key={`a-${i}`}
              className={cn(
                'flex gap-2 px-2 py-0.5',
                l.type === 'remove' && 'bg-destructive/10 text-destructive'
              )}
            >
              <span className="w-8 select-none text-right text-muted-fg">{l.oldLine ?? ''}</span>
              <span>{l.type !== 'add' ? l.content : ''}</span>
            </div>
          ))}
        </div>
        <div>
          {lines.map((l, i) => (
            <div
              key={`b-${i}`}
              className={cn(
                'flex gap-2 px-2 py-0.5',
                l.type === 'add' && 'bg-success/10 text-success'
              )}
            >
              <span className="w-8 select-none text-right text-muted-fg">{l.newLine ?? ''}</span>
              <span>{l.type !== 'remove' ? l.content : ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn('overflow-hidden rounded-md border border-border font-mono text-xs', className)}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          className={cn(
            'flex gap-2 px-2 py-0.5',
            l.type === 'add' && 'bg-success/10 text-success',
            l.type === 'remove' && 'bg-destructive/10 text-destructive'
          )}
        >
          <span className="w-8 select-none text-right text-muted-fg">
            {l.type === 'add' ? '+' : l.type === 'remove' ? '-' : ' '}
          </span>
          <span className="w-8 select-none text-right text-muted-fg">{l.oldLine ?? ''}</span>
          <span className="w-8 select-none text-right text-muted-fg">{l.newLine ?? ''}</span>
          <span className="flex-1">{l.content}</span>
        </div>
      ))}
    </div>
  );
}
