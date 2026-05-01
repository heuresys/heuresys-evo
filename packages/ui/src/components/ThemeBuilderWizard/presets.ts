import type { OKLCH } from '../../lib/oklch';

export interface ThemePreset {
  id: string;
  name: string;
  mood: string;
  description: string;
  primary: OKLCH;
  secondary: OKLCH;
  accent: OKLCH;
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  borderRadius: 'sharp' | 'soft' | 'round';
  motionIntensity: 'reduced' | 'normal' | 'expressive';
  effects: ('shadow' | 'glass' | 'neumorphism' | 'glow' | 'mesh' | 'noise')[];
  density: 'compact' | 'comfortable' | 'spacious';
}

export const STARTER_PRESETS: ThemePreset[] = [
  {
    id: 'corporate-strict',
    name: 'Corporate Strict',
    mood: 'Professional, conservative',
    description: 'Navy + cyan accent. Inter + Source Serif. Minimal shadows.',
    primary: { l: 0.32, c: 0.16, h: 250 },
    secondary: { l: 0.6, c: 0.12, h: 200 },
    accent: { l: 0.7, c: 0.18, h: 195 },
    fontSans: 'Inter',
    fontSerif: 'Source Serif Pro',
    fontMono: 'JetBrains Mono',
    borderRadius: 'sharp',
    motionIntensity: 'reduced',
    effects: ['shadow'],
    density: 'comfortable',
  },
  {
    id: 'playful-bright',
    name: 'Playful Bright',
    mood: 'Energetic, friendly',
    description: 'Coral + mint, soft shadows + curves.',
    primary: { l: 0.65, c: 0.21, h: 25 },
    secondary: { l: 0.75, c: 0.15, h: 160 },
    accent: { l: 0.78, c: 0.18, h: 75 },
    fontSans: 'Manrope',
    fontSerif: 'Fraunces',
    fontMono: 'Fira Code',
    borderRadius: 'round',
    motionIntensity: 'expressive',
    effects: ['shadow', 'glow'],
    density: 'comfortable',
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    mood: 'Editorial, clean',
    description: 'Black + gray scale. Sharp edges. Editorial feel.',
    primary: { l: 0.18, c: 0.01, h: 250 },
    secondary: { l: 0.5, c: 0.01, h: 250 },
    accent: { l: 0.7, c: 0.05, h: 250 },
    fontSans: 'Inter',
    fontSerif: 'Playfair Display',
    fontMono: 'IBM Plex Mono',
    borderRadius: 'sharp',
    motionIntensity: 'reduced',
    effects: [],
    density: 'spacious',
  },
  {
    id: 'futuristic-neon',
    name: 'Futuristic Neon',
    mood: 'Tech, gaming',
    description: 'Purple + electric lime. Glow + glassmorphism.',
    primary: { l: 0.55, c: 0.27, h: 295 },
    secondary: { l: 0.85, c: 0.22, h: 130 },
    accent: { l: 0.7, c: 0.25, h: 200 },
    fontSans: 'Space Grotesk',
    fontSerif: 'Space Grotesk',
    fontMono: 'JetBrains Mono',
    borderRadius: 'soft',
    motionIntensity: 'expressive',
    effects: ['glass', 'glow', 'mesh'],
    density: 'comfortable',
  },
  {
    id: 'elegant-editorial',
    name: 'Elegant Editorial',
    mood: 'Premium, sophisticated',
    description: 'Burgundy + cream. Soft contrast. Print-ready feel.',
    primary: { l: 0.42, c: 0.16, h: 15 },
    secondary: { l: 0.85, c: 0.06, h: 75 },
    accent: { l: 0.55, c: 0.13, h: 35 },
    fontSans: 'Inter',
    fontSerif: 'Playfair Display',
    fontMono: 'IBM Plex Mono',
    borderRadius: 'soft',
    motionIntensity: 'normal',
    effects: ['shadow'],
    density: 'spacious',
  },
  {
    id: 'glassmorphism-pro',
    name: 'Glassmorphism Pro',
    mood: 'Modern, dynamic',
    description: 'Gradient mesh background. Backdrop-blur cards. Vivid.',
    primary: { l: 0.6, c: 0.22, h: 270 },
    secondary: { l: 0.7, c: 0.18, h: 200 },
    accent: { l: 0.78, c: 0.18, h: 320 },
    fontSans: 'Geist',
    fontSerif: 'Geist',
    fontMono: 'Geist Mono',
    borderRadius: 'round',
    motionIntensity: 'expressive',
    effects: ['glass', 'mesh', 'noise', 'glow'],
    density: 'comfortable',
  },
];

export function findPreset(id: string): ThemePreset | undefined {
  return STARTER_PRESETS.find((p) => p.id === id);
}
