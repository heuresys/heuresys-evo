'use client';

import * as React from 'react';
import Lottie, { type LottieComponentProps } from 'lottie-react';
import { cn } from '../lib/cn';

/**
 * LottiePlayer — wrap lottie-react with a11y label + reduced-motion respect.
 * Accepts JSON animation data or a URL fetched on demand.
 * (TIER 3)
 */
export interface LottiePlayerProps extends Omit<LottieComponentProps, 'animationData' | 'data'> {
  src?: string;
  data?: object;
  ariaLabel: string;
  className?: string;
}

export function LottiePlayer({ src, data, ariaLabel, className, ...rest }: LottiePlayerProps) {
  const [animation, setAnimation] = React.useState<object | null>(data ?? null);
  const reducedMotion = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (data || !src) return;
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setAnimation(j);
      })
      .catch(() => {
        // silently fail
      });
    return () => {
      cancelled = true;
    };
  }, [data, src]);

  if (!animation) {
    return (
      <div role="img" aria-label={ariaLabel} className={cn('animate-pulse bg-muted', className)} />
    );
  }

  return (
    <div role="img" aria-label={ariaLabel} className={className}>
      <Lottie animationData={animation} loop={!reducedMotion} autoplay={!reducedMotion} {...rest} />
    </div>
  );
}
