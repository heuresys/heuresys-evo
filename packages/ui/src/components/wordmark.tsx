'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * HeuresysWordmark — canonical brand wordmark.
 *
 * Spec (Heuresys Brand Identity, L25 + L27):
 * - Lowercase "heuresys" (8 lettere)
 * - "y" highlighted in `var(--accent)`
 * - Body color depends on variant:
 *   • default: Inter 700, body in `var(--ink)` (μ-architect header)
 *   • brand:   Exo 2 700, body in `var(--brand-blue)` (login-aurora hero, marketing surfaces)
 *   • relative (L28): Inter 700, body in `var(--logo-body, var(--ink))` (themed surfaces)
 *
 * The "y" letter is wrapped in <span class="wm-y"> so consumers can tweak
 * via CSS if needed. Default styling is provided.
 */

export type WordmarkVariant = 'default' | 'brand' | 'relative';
export type WordmarkSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface HeuresysWordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: WordmarkVariant;
  size?: WordmarkSize | number;
  /**
   * Optional render-as. Defaults to "span". Use "h1" for hero contexts (login).
   */
  as?: 'span' | 'div' | 'h1' | 'h2' | 'p';
  /**
   * Optional aria-label override. Default: "heuresys".
   */
  'aria-label'?: string;
}

const SIZE_MAP: Record<WordmarkSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
  xl: 40,
  hero: 60,
};

const LETTER_SPACING_MAP: Record<WordmarkSize, string> = {
  sm: '-0.4px',
  md: '-0.6px',
  lg: '-0.9px',
  xl: '-1.6px',
  hero: '-2.5px',
};

function resolveSize(size: WordmarkSize | number): { fontSize: number; letterSpacing: string } {
  if (typeof size === 'number') {
    // Approximate proportional letter-spacing for arbitrary px sizes
    const spacing = -Math.max(0.4, size * 0.04);
    return { fontSize: size, letterSpacing: `${spacing.toFixed(1)}px` };
  }
  return { fontSize: SIZE_MAP[size], letterSpacing: LETTER_SPACING_MAP[size] };
}

const VARIANT_STYLES: Record<WordmarkVariant, React.CSSProperties> = {
  default: {
    fontFamily: 'var(--font-sans, Inter), Inter, sans-serif',
    color: 'var(--ink)',
  },
  brand: {
    fontFamily: 'var(--font-display, "Exo 2"), "Exo 2", sans-serif',
    color: 'var(--brand-blue)',
  },
  relative: {
    fontFamily: 'var(--font-sans, Inter), Inter, sans-serif',
    color: 'var(--logo-body, var(--ink))',
  },
};

export function HeuresysWordmark({
  variant = 'default',
  size = 'md',
  as = 'span',
  className,
  style,
  'aria-label': ariaLabel = 'heuresys',
  ...rest
}: HeuresysWordmarkProps) {
  const { fontSize, letterSpacing } = resolveSize(size);
  const variantStyle = VARIANT_STYLES[variant];

  // y emphasis weight: 500 (lighter than body 700) on default+relative; same 700 on brand variant
  const yWeight = variant === 'brand' ? 700 : 500;

  const props: React.HTMLAttributes<HTMLElement> & { 'aria-label': string; role: string } = {
    role: 'img',
    'aria-label': ariaLabel,
    className: cn('inline-flex items-baseline leading-none', className),
    style: {
      fontWeight: 700,
      textTransform: 'lowercase',
      fontSize,
      letterSpacing,
      ...variantStyle,
      ...style,
    },
    ...rest,
  };

  const inner = (
    <>
      <span aria-hidden="true">heures</span>
      <span
        aria-hidden="true"
        className="wm-y"
        style={{ color: 'var(--accent)', fontWeight: yWeight }}
      >
        y
      </span>
      <span aria-hidden="true">s</span>
    </>
  );

  switch (as) {
    case 'h1':
      return <h1 {...props}>{inner}</h1>;
    case 'h2':
      return <h2 {...props}>{inner}</h2>;
    case 'div':
      return <div {...props}>{inner}</div>;
    case 'p':
      return <p {...props}>{inner}</p>;
    case 'span':
    default:
      return <span {...props}>{inner}</span>;
  }
}

export default HeuresysWordmark;
