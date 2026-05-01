'use client';

import * as React from 'react';
import { Wrench, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { ToolCall, ToolResult } from './chat-provider';

/**
 * ToolCallView — collapsible card showing a tool call + its result.
 * (TIER 8)
 */
export function ToolCallView({
  call,
  result,
  className,
}: {
  call: ToolCall;
  result?: ToolResult;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn('mt-2 rounded-md border border-border bg-background/50 text-xs', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 p-2 text-left hover:bg-accent"
      >
        <ChevronRight
          className={cn('h-3 w-3 transition-transform', open && 'rotate-90')}
          aria-hidden="true"
        />
        <Wrench className="h-3 w-3 text-primary" aria-hidden="true" />
        <span className="font-medium">{call.name}</span>
        {result?.error ? (
          <span className="ml-auto text-destructive">error</span>
        ) : result ? (
          <span className="ml-auto text-success">ok</span>
        ) : (
          <span className="ml-auto text-muted-fg animate-pulse">running…</span>
        )}
      </button>
      {open ? (
        <div className="border-t border-border p-2">
          <details>
            <summary className="cursor-pointer text-muted-fg">Input</summary>
            <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-[0.65rem]">
              {JSON.stringify(call.input, null, 2)}
            </pre>
          </details>
          {result ? (
            <details className="mt-1">
              <summary className="cursor-pointer text-muted-fg">
                {result.error ? 'Error' : 'Output'}
              </summary>
              <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-[0.65rem]">
                {result.error ?? JSON.stringify(result.output, null, 2)}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
