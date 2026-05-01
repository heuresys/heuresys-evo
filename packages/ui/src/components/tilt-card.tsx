'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * TiltCard — 3D tilt effect on hover via mouse position. Pure CSS transform
 * no extra deps. Disabled when prefers-reduced-motion. (TIER 3)
 */
export function TiltCard({
  children,
  className,
  intensity = 12,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { intensity?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('transition-transform duration-200 will-change-transform', className)}
      {...props}
    >
      {children}
    </div>
  );
}
