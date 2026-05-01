'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

/**
 * Text effects — typewriter, gradient, shimmer, marquee.
 * (TIER 15)
 */

export function Typewriter({
  text,
  speed = 50,
  className,
  onComplete,
}: {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [out, setOut] = React.useState('');
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      onComplete?.();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onComplete]);
  return (
    <span className={className} aria-label={text}>
      {out}
      <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-current">&nbsp;</span>
    </span>
  );
}

export function GradientText({
  children,
  from = 'oklch(0.55 0.22 264)',
  to = 'oklch(0.7 0.22 320)',
  className,
}: {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}

export function Marquee({
  children,
  speed = 30,
  reverse,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('relative flex w-full overflow-hidden [--gap:2rem]', className)}>
      <div
        className={cn(
          'flex shrink-0 gap-[var(--gap)] motion-safe:animate-[marquee_var(--duration)_linear_infinite]',
          reverse && 'motion-safe:[animation-direction:reverse]',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
        style={{ ['--duration' as never]: `${speed}s` }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        <div aria-hidden="true" className="flex shrink-0 gap-[var(--gap)]">
          {children}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-100% - var(--gap))); } }`}</style>
    </div>
  );
}
