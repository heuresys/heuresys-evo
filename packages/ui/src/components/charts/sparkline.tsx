import * as React from 'react';
import { cn } from '../../lib/cn';

/**
 * Sparkline — inline tiny chart. Renders SVG polyline + optional area fill.
 * (TIER 4 sparklines)
 */
export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  showPoints?: boolean;
  showMinMax?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  stroke = 'currentColor',
  fill = 'none',
  showPoints = false,
  showMinMax = false,
  className,
  ariaLabel = 'Sparkline trend',
}: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => ({ x: i * stepX, y: height - ((v - min) / range) * height }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `M0,${height} L${polyline} L${width},${height} Z`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block align-middle', className)}
      width={width}
      height={height}
    >
      {fill !== 'none' ? <path d={area} fill={fill} opacity={0.2} /> : null}
      <polyline
        points={polyline}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {showPoints
        ? points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.5} fill={stroke} />)
        : null}
      {showMinMax
        ? (() => {
            const minIdx = data.indexOf(min);
            const maxIdx = data.indexOf(max);
            return (
              <>
                <circle
                  cx={points[minIdx]!.x}
                  cy={points[minIdx]!.y}
                  r={2.5}
                  fill="oklch(0.6 0.22 22)"
                />
                <circle
                  cx={points[maxIdx]!.x}
                  cy={points[maxIdx]!.y}
                  r={2.5}
                  fill="oklch(0.65 0.16 145)"
                />
              </>
            );
          })()
        : null}
    </svg>
  );
}

export function WinLossSparkline({
  data,
  className,
  ariaLabel = 'Win/loss',
}: {
  data: ('win' | 'loss' | 'tie')[];
  className?: string;
  ariaLabel?: string;
}) {
  const W = 6;
  const H = 16;
  const gap = 1;
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-block', className)}
      width={(W + gap) * data.length}
      height={H}
    >
      {data.map((d, i) => {
        const fill =
          d === 'win'
            ? 'oklch(0.65 0.16 145)'
            : d === 'loss'
              ? 'oklch(0.6 0.22 22)'
              : 'oklch(0.7 0.012 252)';
        const y = d === 'win' ? 0 : d === 'loss' ? H / 2 : H / 4;
        const h = d === 'tie' ? H / 2 : H / 2;
        return <rect key={i} x={i * (W + gap)} y={y} width={W} height={h} fill={fill} />;
      })}
    </svg>
  );
}
