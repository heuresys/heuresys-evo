/**
 * Phase 15.H · L49 — Theme/palette framework metadata.
 *
 * Mirror of `.ux-design/02-aesthetic/theme-framework/heuresys-palette-switcher.js`
 * PALETTES catalog, ported to TS for typed consumption in /brand-studio.
 *
 * Token data (--primary, --accent, --bg, ...) is defined in
 * `services/app/src/styles/theme-framework/palette-core.css` (`:root` defaults)
 * + `palette-variants.css` (17 palette × 2 mode blocks, lazy-loaded for `(app)`
 * + `/brand-studio` only — see S60 CW-LCP1). This file is the metadata + UI-
 * presentation layer (id, label, family, swatch).
 */

export type PaletteId =
  | 'legacy'
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'delta'
  | 'epsilon'
  | 'zeta'
  | 'eta'
  | 'theta'
  | 'iota'
  | 'kappa'
  | 'lambda'
  | 'mu-architect'
  | 'mu-art-director'
  | 'mu-pragmatic'
  | 'mu-synthesis'
  | 'mu-data-dense';

export type ThemeMode = 'dark' | 'light';

export type PaletteFamily = 'Set 5' | 'Primary' | 'Tempered' | 'Mu';

export interface PaletteMeta {
  id: PaletteId;
  label: string;
  family: PaletteFamily;
  /** Representative swatch color (used in mini-cards before applying). */
  swatch: string;
}

export const PALETTES: readonly PaletteMeta[] = [
  { id: 'legacy', label: 'legacy', family: 'Set 5', swatch: '#a855f7' },
  { id: 'alpha', label: 'α alpha', family: 'Primary', swatch: '#a855f7' },
  { id: 'beta', label: 'β beta', family: 'Primary', swatch: '#c4361b' },
  { id: 'gamma', label: 'γ gamma', family: 'Primary', swatch: '#1a4d7a' },
  { id: 'delta', label: 'δ delta', family: 'Primary', swatch: '#990f3d' },
  { id: 'epsilon', label: 'ε epsilon', family: 'Primary', swatch: '#2d1f6b' },
  { id: 'zeta', label: 'ζ zeta', family: 'Primary', swatch: '#c5612d' },
  { id: 'eta', label: 'η eta', family: 'Primary', swatch: '#DC2626' },
  { id: 'theta', label: 'θ theta', family: 'Primary', swatch: '#5b21b6' },
  { id: 'iota', label: 'ι iota', family: 'Tempered', swatch: '#d4a017' },
  { id: 'kappa', label: 'κ kappa', family: 'Tempered', swatch: '#b8395a' },
  { id: 'lambda', label: 'λ lambda', family: 'Tempered', swatch: '#DC2626' },
  { id: 'mu-architect', label: 'μ architect', family: 'Mu', swatch: '#5e69d1' },
  { id: 'mu-art-director', label: 'μ art-dir', family: 'Mu', swatch: '#b370e0' },
  { id: 'mu-pragmatic', label: 'μ pragmatic', family: 'Mu', swatch: '#22c55e' },
  { id: 'mu-synthesis', label: 'μ synthesis', family: 'Mu', swatch: '#7a7fad' },
  { id: 'mu-data-dense', label: 'μ data-dense', family: 'Mu', swatch: '#7a7fad' },
] as const;

export const VALID_PALETTE_IDS = new Set<PaletteId>(PALETTES.map((p) => p.id));
export const VALID_THEMES = new Set<ThemeMode>(['dark', 'light']);

export const FAMILY_ORDER: readonly PaletteFamily[] = ['Set 5', 'Primary', 'Tempered', 'Mu'];

export const DEFAULT_PALETTE: PaletteId = 'legacy';
export const DEFAULT_THEME: ThemeMode = 'dark';

export interface ActivePaletteState {
  palette: PaletteId;
  theme: ThemeMode;
}

export const DEFAULT_ACTIVE_PALETTE: ActivePaletteState = {
  palette: DEFAULT_PALETTE,
  theme: DEFAULT_THEME,
};

export function isValidPaletteId(input: unknown): input is PaletteId {
  return typeof input === 'string' && VALID_PALETTE_IDS.has(input as PaletteId);
}

export function isValidTheme(input: unknown): input is ThemeMode {
  return typeof input === 'string' && VALID_THEMES.has(input as ThemeMode);
}

export function getPalettesByFamily(family: PaletteFamily): readonly PaletteMeta[] {
  return PALETTES.filter((p) => p.family === family);
}
