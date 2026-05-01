import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeBuilderWizard } from '../ThemeBuilderWizard/ThemeBuilderWizard';
import {
  exportTokensCss,
  exportTokensJson,
  exportTailwindConfig,
} from '../ThemeBuilderWizard/export';
import { DEFAULT_THEME_STATE } from '../ThemeBuilderWizard/types';
import { STARTER_PRESETS, findPreset } from '../ThemeBuilderWizard/presets';
import { contrastRatio, harmony, oklch, simulateColorBlind, toCss, toHex } from '../../lib/oklch';

describe('OKLCH utilities', () => {
  it('converts to css oklch() syntax', () => {
    expect(toCss(oklch(0.5, 0.1, 200))).toMatch(/^oklch\(/);
  });
  it('converts to hex without throwing', () => {
    expect(toHex(oklch(0.55, 0.18, 264))).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('contrast ratio symmetric and >= 1', () => {
    const a = oklch(0.2, 0.05, 250);
    const b = oklch(0.95, 0.02, 250);
    const r1 = contrastRatio(a, b);
    const r2 = contrastRatio(b, a);
    expect(r1).toBeCloseTo(r2, 5);
    expect(r1).toBeGreaterThan(1);
  });
  it('harmony returns 3 colors', () => {
    expect(harmony(oklch(0.5, 0.15, 100), 'triadic')).toHaveLength(3);
  });
  it('color blindness sim shifts hue', () => {
    const base = oklch(0.5, 0.2, 100);
    const sim = simulateColorBlind(base, 'deutan');
    expect(sim.h).not.toBe(base.h);
    expect(sim.c).toBeLessThan(base.c);
  });
});

describe('Theme Builder export', () => {
  it('exportTokensCss contains :root + primary var', () => {
    const css = exportTokensCss(DEFAULT_THEME_STATE);
    expect(css).toContain(':root');
    expect(css).toContain('--color-primary');
  });
  it('exportTokensJson is valid JSON', () => {
    const json = exportTokensJson(DEFAULT_THEME_STATE);
    expect(() => JSON.parse(json)).not.toThrow();
  });
  it('exportTailwindConfig is parsable JS module syntax', () => {
    const out = exportTailwindConfig(DEFAULT_THEME_STATE);
    expect(out).toContain('module.exports');
    expect(out).toContain('Inter');
  });
});

describe('Starter presets', () => {
  it('exposes 6 presets', () => {
    expect(STARTER_PRESETS).toHaveLength(6);
  });
  it('findPreset returns a known preset', () => {
    expect(findPreset('corporate-strict')).toBeDefined();
    expect(findPreset('does-not-exist')).toBeUndefined();
  });
});

describe('ThemeBuilderWizard render', () => {
  it('renders step 1 by default', () => {
    render(<ThemeBuilderWizard />);
    expect(screen.getByRole('heading', { name: /brand/i })).toBeInTheDocument();
    expect(screen.getByText(/Brand name/i)).toBeInTheDocument();
  });
});
