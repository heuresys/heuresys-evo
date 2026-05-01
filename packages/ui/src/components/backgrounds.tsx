import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Decorative backgrounds — pure CSS, no JS, respects prefers-reduced-motion.
 * (TIER 3)
 */

export function MeshGradient({
  className,
  colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6'],
  intensity = 0.6,
}: {
  className?: string;
  colors?: string[];
  intensity?: number;
}) {
  const gradients = colors.map((c, i) => {
    const x = [10, 90, 80, 20][i % 4];
    const y = [20, 30, 80, 70][i % 4];
    return `radial-gradient(at ${x}% ${y}%, ${c} 0px, transparent 50%)`;
  });
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-10', className)}
      style={{
        backgroundImage: gradients.join(','),
        opacity: intensity,
        filter: 'blur(60px)',
      }}
    />
  );
}

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      <div
        className="absolute -inset-[10%] motion-safe:animate-[aurora_18s_ease-in-out_infinite_alternate]"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, #38bdf8 0deg, #818cf8 120deg, #f472b6 240deg, #38bdf8 360deg)',
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />
      <style>{`@keyframes aurora { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.2); } }`}</style>
    </div>
  );
}

export function DotGrid({
  className,
  size = 24,
  dotSize = 1,
  color = 'currentColor',
}: {
  className?: string;
  size?: number;
  dotSize?: number;
  color?: string;
}) {
  const bg = `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`;
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-10 text-muted-fg/40', className)}
      style={{
        backgroundImage: bg,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

export function NoiseOverlay({
  className,
  opacity = 0.04,
}: {
  className?: string;
  opacity?: number;
}) {
  // SVG noise filter — independent of dependencies
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(#n)"/></svg>`
  );
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        mixBlendMode: 'overlay',
        opacity,
      }}
    />
  );
}
