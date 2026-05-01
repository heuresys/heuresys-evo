'use client';

import * as React from 'react';
import { Activity, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

/**
 * PerfMonitor — embedded FPS + memory + dom-node-count overlay.
 * Useful in development builds. Pin to a corner.
 * (TIER 13)
 */
export function PerfMonitor({
  position = 'bottom-left',
  className,
}: {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}) {
  const [open, setOpen] = React.useState(true);
  const [fps, setFps] = React.useState(0);
  const [mem, setMem] = React.useState<number | null>(null);
  const [domNodes, setDomNodes] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    function tick(now: number) {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m = (performance as any).memory;
        if (m) setMem(Math.round(m.usedJSHeapSize / 1024 / 1024));
        setDomNodes(document.querySelectorAll('*').length);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) {
    return (
      <Button
        size="icon"
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label="Open performance monitor"
        className={cn('fixed z-50', positionClass[position])}
      >
        <Activity className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed z-50 flex flex-col gap-1 rounded-md border border-border bg-background p-2 font-mono text-xs shadow-md',
        positionClass[position],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="text-[0.65rem] uppercase tracking-wider text-muted-fg">Perf</strong>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close performance monitor"
          className="text-muted-fg hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'font-semibold',
            fps < 30 && 'text-destructive',
            fps >= 50 && 'text-success'
          )}
        >
          {fps} FPS
        </span>
      </div>
      {mem != null ? <div>Mem: {mem} MB</div> : null}
      <div>DOM: {domNodes}</div>
    </div>
  );
}

const positionClass = {
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
};
