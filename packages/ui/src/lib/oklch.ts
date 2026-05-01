/**
 * Lightweight OKLCH color utilities for the Theme Builder Wizard.
 * Pure TS, no deps. Math from CSS Color Module Level 4.
 */

export interface OKLCH {
  l: number; // 0..1
  c: number; // 0..0.4
  h: number; // 0..360
}

export function oklch(l: number, c: number, h: number): OKLCH {
  return { l, c, h };
}

export function toCss({ l, c, h }: OKLCH): string {
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/** Convert OKLCH to sRGB hex (approximate via sRGB gamut clip). */
export function toHex(color: OKLCH): string {
  const rgb = toRgb(color);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const r = clamp(rgb.r * 255);
  const g = clamp(rgb.g * 255);
  const b = clamp(rgb.b * 255);
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

/** OKLCH → Linear sRGB (for relative luminance / contrast calcs). */
export function toRgb({ l, c, h }: OKLCH): { r: number; g: number; b: number } {
  // OKLCH → OKLAB
  const a_ = c * Math.cos((h * Math.PI) / 180);
  const b_ = c * Math.sin((h * Math.PI) / 180);
  // OKLAB → linear sRGB (matrix from Björn Ottosson)
  const l_ = (l + 0.3963377774 * a_ + 0.2158037573 * b_) ** 3;
  const m_ = (l - 0.1055613458 * a_ - 0.0638541728 * b_) ** 3;
  const s_ = (l - 0.0894841775 * a_ - 1.291485548 * b_) ** 3;
  const rl = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const gl = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  // Linear → sRGB gamma encoding
  const enc = (x: number) =>
    x >= 0.0031308 ? 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055 : 12.92 * x;
  return { r: enc(rl), g: enc(gl), b: enc(bl) };
}

/** Approximate WCAG relative luminance from OKLCH. */
export function luminance(color: OKLCH): number {
  const { r, g, b } = toRgb(color);
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two colors. */
export function contrastRatio(a: OKLCH, b: OKLCH): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Color blindness simulation (Brettel et al., daltonization simplified). */
export function simulateColorBlind(color: OKLCH, type: 'protan' | 'deutan' | 'tritan'): OKLCH {
  // Cheap approximation: shift hue and reduce chroma per type.
  const shift = { protan: -20, deutan: 20, tritan: 40 }[type];
  const cReduction = { protan: 0.6, deutan: 0.6, tritan: 0.5 }[type];
  return { l: color.l, c: color.c * cReduction, h: (color.h + shift + 360) % 360 };
}

/** Generate harmonies from a base color. */
export function harmony(
  base: OKLCH,
  kind: 'analogous' | 'triadic' | 'split-complement' | 'monochromatic'
): OKLCH[] {
  switch (kind) {
    case 'analogous':
      return [base, { ...base, h: (base.h + 30) % 360 }, { ...base, h: (base.h + 360 - 30) % 360 }];
    case 'triadic':
      return [base, { ...base, h: (base.h + 120) % 360 }, { ...base, h: (base.h + 240) % 360 }];
    case 'split-complement':
      return [base, { ...base, h: (base.h + 150) % 360 }, { ...base, h: (base.h + 210) % 360 }];
    case 'monochromatic':
      return [
        { ...base, l: Math.min(0.95, base.l + 0.15) },
        base,
        { ...base, l: Math.max(0.15, base.l - 0.15) },
      ];
  }
}

/** Build a 11-stop scale (50, 100..900, 950) from a base. */
export function buildScale(base: OKLCH): OKLCH[] {
  const targets = [0.97, 0.94, 0.87, 0.78, 0.68, 0.58, 0.48, 0.38, 0.28, 0.18, 0.13];
  return targets.map((l) => ({ ...base, l }));
}
