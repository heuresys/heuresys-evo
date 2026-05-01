import type { OKLCH } from '../../lib/oklch';

export interface BrandIdentity {
  name: string;
  tagline?: string;
  logoSvg?: string;
  mood: 'corporate' | 'playful' | 'minimal' | 'futuristic' | 'elegant';
}

export interface ColorSystem {
  primary: OKLCH;
  secondary: OKLCH;
  accent: OKLCH;
  success: OKLCH;
  warning: OKLCH;
  destructive: OKLCH;
  info: OKLCH;
  grayScale: 'slate' | 'neutral' | 'zinc' | 'stone' | 'cool' | 'warm';
}

export interface ColorModes {
  light: boolean;
  dark: boolean;
  highContrast: boolean;
  colorBlindSim?: 'protan' | 'deutan' | 'tritan' | null;
}

export interface Typography {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  scale: 'modular' | 'fluid';
  baseSize: number;
  lineHeight: number;
  letterSpacing: number;
  weights: number[];
}

export interface SpacingLayout {
  scale: '4-base' | '8-base' | 'fibonacci' | 'golden';
  borderRadius: 'sharp' | 'soft' | 'round';
  borderWidth: 'thin' | 'medium' | 'thick';
}

export interface MotionConfig {
  intensity: 'reduced' | 'normal' | 'expressive';
  durationFast: number;
  durationBase: number;
  durationSlow: number;
  easing: 'linear' | 'ease-in-out' | 'spring' | 'bounce' | 'anticipate';
}

export interface EffectsConfig {
  shadows: 'none' | 'subtle' | 'material' | 'elevated' | 'dramatic';
  glassmorphism: number; // 0..100 backdrop-blur intensity
  neumorphism: boolean;
  glow: boolean;
  meshGradient: boolean;
  noiseOverlay: number; // 0..30
}

export interface IconographyConfig {
  set: 'lucide' | 'phosphor' | 'tabler' | 'heroicons';
  weight: 'thin' | 'regular' | 'bold';
  style: 'linear' | 'filled' | 'duotone';
}

export interface ThemeBuilderState {
  brand: BrandIdentity;
  colors: ColorSystem;
  modes: ColorModes;
  typography: Typography;
  spacing: SpacingLayout;
  motion: MotionConfig;
  effects: EffectsConfig;
  iconography: IconographyConfig;
  density: 'compact' | 'comfortable' | 'spacious';
}

export const DEFAULT_THEME_STATE: ThemeBuilderState = {
  brand: { name: 'Heuresys', tagline: '', mood: 'corporate' },
  colors: {
    primary: { l: 0.55, c: 0.18, h: 264 },
    secondary: { l: 0.65, c: 0.05, h: 252 },
    accent: { l: 0.7, c: 0.18, h: 195 },
    success: { l: 0.65, c: 0.16, h: 145 },
    warning: { l: 0.78, c: 0.16, h: 80 },
    destructive: { l: 0.6, c: 0.22, h: 22 },
    info: { l: 0.65, c: 0.16, h: 240 },
    grayScale: 'slate',
  },
  modes: { light: true, dark: true, highContrast: false, colorBlindSim: null },
  typography: {
    fontSans: 'Inter',
    fontSerif: 'Source Serif Pro',
    fontMono: 'JetBrains Mono',
    scale: 'fluid',
    baseSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    weights: [400, 500, 600, 700],
  },
  spacing: { scale: '4-base', borderRadius: 'soft', borderWidth: 'thin' },
  motion: {
    intensity: 'normal',
    durationFast: 120,
    durationBase: 200,
    durationSlow: 320,
    easing: 'ease-in-out',
  },
  effects: {
    shadows: 'subtle',
    glassmorphism: 0,
    neumorphism: false,
    glow: false,
    meshGradient: false,
    noiseOverlay: 0,
  },
  iconography: { set: 'lucide', weight: 'regular', style: 'linear' },
  density: 'comfortable',
};
