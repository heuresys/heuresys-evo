'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Check, Download, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { contrastRatio, harmony, simulateColorBlind, toCss } from '../../lib/oklch';
import type { OKLCH } from '../../lib/oklch';
import { Button } from '../Button';
import { Input } from '../Input';
import { Stepper } from '../stepper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../Card';
import { Badge } from '../badge';
import { STARTER_PRESETS, findPreset } from './presets';
import { DEFAULT_THEME_STATE, type ThemeBuilderState } from './types';
import {
  downloadAsFile,
  exportFigmaTokens,
  exportTailwindConfig,
  exportThemeProvider,
  exportTokensCss,
  exportTokensJson,
} from './export';

const STEPS = [
  { id: 'brand', label: 'Brand', description: 'Identity basics' },
  { id: 'colors', label: 'Colors', description: 'Primary + system' },
  { id: 'modes', label: 'Modes', description: 'Light/dark/contrast' },
  { id: 'typography', label: 'Typography', description: 'Fonts + scale' },
  { id: 'spacing', label: 'Spacing', description: 'Scale + radius' },
  { id: 'motion', label: 'Motion', description: 'Intensity + easing' },
  { id: 'effects', label: 'Effects', description: 'Shadows + glass' },
  { id: 'density', label: 'Density', description: 'Padding scale' },
  { id: 'icons', label: 'Iconography', description: 'Set + weight' },
  { id: 'export', label: 'Export', description: 'Save & download' },
];

export function ThemeBuilderWizard({
  initial,
  onComplete,
  onChange,
  className,
}: {
  initial?: Partial<ThemeBuilderState>;
  onComplete?: (state: ThemeBuilderState) => void;
  onChange?: (state: ThemeBuilderState) => void;
  className?: string;
}) {
  const [state, setState] = React.useState<ThemeBuilderState>({
    ...DEFAULT_THEME_STATE,
    ...initial,
  });
  const [step, setStep] = React.useState(0);

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    onChangeRef.current?.(state);
  }, [state]);

  const update = <K extends keyof ThemeBuilderState>(key: K, value: ThemeBuilderState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  function loadPreset(id: string) {
    const p = findPreset(id);
    if (!p) return;
    setState((s) => ({
      ...s,
      brand: { ...s.brand, mood: p.mood as ThemeBuilderState['brand']['mood'] },
      colors: { ...s.colors, primary: p.primary, secondary: p.secondary, accent: p.accent },
      typography: {
        ...s.typography,
        fontSans: p.fontSans,
        fontSerif: p.fontSerif,
        fontMono: p.fontMono,
      },
      spacing: { ...s.spacing, borderRadius: p.borderRadius },
      motion: { ...s.motion, intensity: p.motionIntensity },
      density: p.density,
      effects: {
        ...s.effects,
        shadows: p.effects.includes('shadow') ? 'material' : 'none',
        glassmorphism: p.effects.includes('glass') ? 70 : 0,
        glow: p.effects.includes('glow'),
        meshGradient: p.effects.includes('mesh'),
        noiseOverlay: p.effects.includes('noise') ? 10 : 0,
        neumorphism: p.effects.includes('neumorphism'),
      },
    }));
  }

  function exportAll() {
    downloadAsFile('tokens.css', exportTokensCss(state), 'text/css');
    downloadAsFile('tailwind.config.js', exportTailwindConfig(state), 'text/javascript');
    downloadAsFile('tokens.json', exportTokensJson(state), 'application/json');
    downloadAsFile('figma-tokens.json', exportFigmaTokens(state), 'application/json');
    downloadAsFile('theme.tsx', exportThemeProvider(state), 'text/typescript');
    onComplete?.(state);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Stepper
        steps={STEPS.map((s) => ({ id: s.id, label: s.label, description: s.description }))}
        current={step}
        onStepClick={setStep}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]!.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 ? <BrandStep state={state} update={update} /> : null}
            {step === 1 ? <ColorsStep state={state} update={update} /> : null}
            {step === 2 ? <ModesStep state={state} update={update} /> : null}
            {step === 3 ? <TypographyStep state={state} update={update} /> : null}
            {step === 4 ? <SpacingStep state={state} update={update} /> : null}
            {step === 5 ? <MotionStep state={state} update={update} /> : null}
            {step === 6 ? <EffectsStep state={state} update={update} /> : null}
            {step === 7 ? <DensityStep state={state} update={update} /> : null}
            {step === 8 ? <IconsStep state={state} update={update} /> : null}
            {step === 9 ? <ExportStep state={state} onExport={exportAll} /> : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={exportAll}>
                <Download className="mr-1 h-4 w-4" /> Export theme
              </Button>
            )}
          </CardFooter>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live preview</CardTitle>
            </CardHeader>
            <CardContent>
              <LivePreview state={state} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Starter presets</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              {STARTER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p.id)}
                  className="flex items-center gap-2 rounded-md p-2 text-left text-xs transition-colors hover:bg-accent"
                >
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 rounded-full border border-border"
                    style={{ background: toCss(p.primary) }}
                  />
                  <span className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-muted-fg">{p.mood}</div>
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// ---- Step components ----

interface StepProps {
  state: ThemeBuilderState;
  update: <K extends keyof ThemeBuilderState>(k: K, v: ThemeBuilderState[K]) => void;
}

function BrandStep({ state, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Brand name">
        <Input
          value={state.brand.name}
          onChange={(e) => update('brand', { ...state.brand, name: e.target.value })}
        />
      </Field>
      <Field label="Tagline (optional)">
        <Input
          value={state.brand.tagline ?? ''}
          onChange={(e) => update('brand', { ...state.brand, tagline: e.target.value })}
        />
      </Field>
      <Field label="Mood">
        <div className="flex flex-wrap gap-2">
          {(['corporate', 'playful', 'minimal', 'futuristic', 'elegant'] as const).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={state.brand.mood === m ? 'default' : 'outline'}
              onClick={() => update('brand', { ...state.brand, mood: m })}
            >
              {m}
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Logo SVG (paste markup)">
        <textarea
          value={state.brand.logoSvg ?? ''}
          onChange={(e) => update('brand', { ...state.brand, logoSvg: e.target.value })}
          rows={4}
          placeholder="<svg>…</svg>"
          className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs"
        />
      </Field>
    </div>
  );
}

function ColorsStep({ state, update }: StepProps) {
  const [harmonyKind, setHarmonyKind] = React.useState<
    'analogous' | 'triadic' | 'split-complement' | 'monochromatic'
  >('analogous');
  const harmonyColors = harmony(state.colors.primary, harmonyKind);
  return (
    <div className="space-y-4">
      <Field label="Primary (OKLCH)">
        <OklchPicker
          color={state.colors.primary}
          onChange={(c) => update('colors', { ...state.colors, primary: c })}
        />
      </Field>
      <Field label={`Harmony — ${harmonyKind}`}>
        <div className="flex flex-wrap gap-2">
          {(['analogous', 'triadic', 'split-complement', 'monochromatic'] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={harmonyKind === k ? 'default' : 'outline'}
              onClick={() => setHarmonyKind(k)}
            >
              {k}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex gap-1">
          {harmonyColors.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i === 1) update('colors', { ...state.colors, secondary: c });
                if (i === 2) update('colors', { ...state.colors, accent: c });
              }}
              className="h-10 flex-1 rounded-md border border-border"
              style={{ background: toCss(c) }}
              title={`Apply as ${i === 0 ? 'primary' : i === 1 ? 'secondary' : 'accent'}`}
            />
          ))}
        </div>
      </Field>
      <Field label="Semantic colors">
        <div className="grid grid-cols-2 gap-3">
          <ColorRow
            label="Success"
            color={state.colors.success}
            onChange={(c) => update('colors', { ...state.colors, success: c })}
          />
          <ColorRow
            label="Warning"
            color={state.colors.warning}
            onChange={(c) => update('colors', { ...state.colors, warning: c })}
          />
          <ColorRow
            label="Destructive"
            color={state.colors.destructive}
            onChange={(c) => update('colors', { ...state.colors, destructive: c })}
          />
          <ColorRow
            label="Info"
            color={state.colors.info}
            onChange={(c) => update('colors', { ...state.colors, info: c })}
          />
        </div>
      </Field>
    </div>
  );
}

function ModesStep({ state, update }: StepProps) {
  const fg = { l: 0.22, c: 0.018, h: 252 };
  const ratio = contrastRatio(state.colors.primary, fg);
  return (
    <div className="space-y-4">
      <ToggleRow
        label="Light mode"
        checked={state.modes.light}
        onChange={(v) => update('modes', { ...state.modes, light: v })}
      />
      <ToggleRow
        label="Dark mode"
        checked={state.modes.dark}
        onChange={(v) => update('modes', { ...state.modes, dark: v })}
      />
      <ToggleRow
        label="High contrast"
        checked={state.modes.highContrast}
        onChange={(v) => update('modes', { ...state.modes, highContrast: v })}
      />
      <Field label="Color blindness simulation">
        <div className="flex gap-2">
          {(['none', 'protan', 'deutan', 'tritan'] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={(state.modes.colorBlindSim ?? 'none') === t ? 'default' : 'outline'}
              onClick={() =>
                update('modes', { ...state.modes, colorBlindSim: t === 'none' ? null : t })
              }
            >
              {t}
            </Button>
          ))}
        </div>
        {state.modes.colorBlindSim ? (
          <div
            className="mt-3 h-10 rounded-md border border-border"
            style={{
              background: toCss(
                simulateColorBlind(state.colors.primary, state.modes.colorBlindSim)
              ),
            }}
          />
        ) : null}
      </Field>
      <div className="rounded-md border border-border p-3 text-sm">
        WCAG contrast ratio (primary vs foreground): <strong>{ratio.toFixed(2)}</strong>{' '}
        <Badge variant={ratio >= 7 ? 'success' : ratio >= 4.5 ? 'secondary' : 'destructive'}>
          {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail'}
        </Badge>
      </div>
    </div>
  );
}

function TypographyStep({ state, update }: StepProps) {
  const fonts = [
    'Inter',
    'Manrope',
    'Space Grotesk',
    'Geist',
    'IBM Plex Sans',
    'Plus Jakarta Sans',
  ];
  const serifs = ['Source Serif Pro', 'Playfair Display', 'Fraunces', 'Lora', 'EB Garamond'];
  const monos = ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Geist Mono'];
  return (
    <div className="space-y-4">
      <Field label="Sans-serif">
        <select
          className="w-full rounded-md border border-input bg-background p-2"
          value={state.typography.fontSans}
          onChange={(e) => update('typography', { ...state.typography, fontSans: e.target.value })}
        >
          {fonts.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label="Serif">
        <select
          className="w-full rounded-md border border-input bg-background p-2"
          value={state.typography.fontSerif}
          onChange={(e) => update('typography', { ...state.typography, fontSerif: e.target.value })}
        >
          {serifs.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label="Mono">
        <select
          className="w-full rounded-md border border-input bg-background p-2"
          value={state.typography.fontMono}
          onChange={(e) => update('typography', { ...state.typography, fontMono: e.target.value })}
        >
          {monos.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label={`Base size: ${state.typography.baseSize}px`}>
        <input
          type="range"
          min={12}
          max={20}
          value={state.typography.baseSize}
          onChange={(e) =>
            update('typography', { ...state.typography, baseSize: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Base font size"
        />
      </Field>
      <Field label={`Line height: ${state.typography.lineHeight}`}>
        <input
          type="range"
          min={1.2}
          max={1.8}
          step={0.05}
          value={state.typography.lineHeight}
          onChange={(e) =>
            update('typography', { ...state.typography, lineHeight: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Line height"
        />
      </Field>
      <p
        className="rounded-md border border-border p-3 text-foreground"
        style={{
          fontFamily: state.typography.fontSans,
          fontSize: state.typography.baseSize,
          lineHeight: state.typography.lineHeight,
        }}
      >
        The quick brown fox jumps over the lazy dog. 1234567890.
      </p>
    </div>
  );
}

function SpacingStep({ state, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Scale base">
        <div className="flex flex-wrap gap-2">
          {(['4-base', '8-base', 'fibonacci', 'golden'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={state.spacing.scale === s ? 'default' : 'outline'}
              onClick={() => update('spacing', { ...state.spacing, scale: s })}
            >
              {s}
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Border radius">
        <div className="flex gap-2">
          {(['sharp', 'soft', 'round'] as const).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={state.spacing.borderRadius === r ? 'default' : 'outline'}
              onClick={() => update('spacing', { ...state.spacing, borderRadius: r })}
            >
              {r}
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Border width">
        <div className="flex gap-2">
          {(['thin', 'medium', 'thick'] as const).map((w) => (
            <Button
              key={w}
              size="sm"
              variant={state.spacing.borderWidth === w ? 'default' : 'outline'}
              onClick={() => update('spacing', { ...state.spacing, borderWidth: w })}
            >
              {w}
            </Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function MotionStep({ state, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Intensity">
        <div className="flex gap-2">
          {(['reduced', 'normal', 'expressive'] as const).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={state.motion.intensity === m ? 'default' : 'outline'}
              onClick={() => update('motion', { ...state.motion, intensity: m })}
            >
              {m}
            </Button>
          ))}
        </div>
      </Field>
      <Field label={`Fast: ${state.motion.durationFast}ms`}>
        <input
          type="range"
          min={50}
          max={300}
          value={state.motion.durationFast}
          onChange={(e) =>
            update('motion', { ...state.motion, durationFast: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Fast duration"
        />
      </Field>
      <Field label={`Base: ${state.motion.durationBase}ms`}>
        <input
          type="range"
          min={100}
          max={500}
          value={state.motion.durationBase}
          onChange={(e) =>
            update('motion', { ...state.motion, durationBase: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Base duration"
        />
      </Field>
      <Field label={`Slow: ${state.motion.durationSlow}ms`}>
        <input
          type="range"
          min={200}
          max={800}
          value={state.motion.durationSlow}
          onChange={(e) =>
            update('motion', { ...state.motion, durationSlow: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Slow duration"
        />
      </Field>
      <Field label="Easing">
        <div className="flex flex-wrap gap-2">
          {(['linear', 'ease-in-out', 'spring', 'bounce', 'anticipate'] as const).map((e) => (
            <Button
              key={e}
              size="sm"
              variant={state.motion.easing === e ? 'default' : 'outline'}
              onClick={() => update('motion', { ...state.motion, easing: e })}
            >
              {e}
            </Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function EffectsStep({ state, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Shadows">
        <div className="flex flex-wrap gap-2">
          {(['none', 'subtle', 'material', 'elevated', 'dramatic'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={state.effects.shadows === s ? 'default' : 'outline'}
              onClick={() => update('effects', { ...state.effects, shadows: s })}
            >
              {s}
            </Button>
          ))}
        </div>
      </Field>
      <Field label={`Glassmorphism intensity: ${state.effects.glassmorphism}`}>
        <input
          type="range"
          min={0}
          max={100}
          value={state.effects.glassmorphism}
          onChange={(e) =>
            update('effects', { ...state.effects, glassmorphism: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Glassmorphism intensity"
        />
      </Field>
      <ToggleRow
        label="Neumorphism"
        checked={state.effects.neumorphism}
        onChange={(v) => update('effects', { ...state.effects, neumorphism: v })}
      />
      <ToggleRow
        label="Glow effects"
        checked={state.effects.glow}
        onChange={(v) => update('effects', { ...state.effects, glow: v })}
      />
      <ToggleRow
        label="Mesh gradient bg"
        checked={state.effects.meshGradient}
        onChange={(v) => update('effects', { ...state.effects, meshGradient: v })}
      />
      <Field label={`Noise overlay: ${state.effects.noiseOverlay}`}>
        <input
          type="range"
          min={0}
          max={30}
          value={state.effects.noiseOverlay}
          onChange={(e) =>
            update('effects', { ...state.effects, noiseOverlay: Number(e.target.value) })
          }
          className="w-full"
          aria-label="Noise overlay"
        />
      </Field>
    </div>
  );
}

function DensityStep({ state, update }: StepProps) {
  return (
    <Field label="Layout density">
      <div className="flex gap-2">
        {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={state.density === d ? 'default' : 'outline'}
            onClick={() => update('density', d)}
          >
            {d}
          </Button>
        ))}
      </div>
    </Field>
  );
}

function IconsStep({ state, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Icon set">
        <div className="flex flex-wrap gap-2">
          {(['lucide', 'phosphor', 'tabler', 'heroicons'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={state.iconography.set === s ? 'default' : 'outline'}
              onClick={() => update('iconography', { ...state.iconography, set: s })}
            >
              {s}
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Weight">
        <div className="flex gap-2">
          {(['thin', 'regular', 'bold'] as const).map((w) => (
            <Button
              key={w}
              size="sm"
              variant={state.iconography.weight === w ? 'default' : 'outline'}
              onClick={() => update('iconography', { ...state.iconography, weight: w })}
            >
              {w}
            </Button>
          ))}
        </div>
      </Field>
      <Field label="Style">
        <div className="flex gap-2">
          {(['linear', 'filled', 'duotone'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={state.iconography.style === s ? 'default' : 'outline'}
              onClick={() => update('iconography', { ...state.iconography, style: s })}
            >
              {s}
            </Button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function ExportStep({ state, onExport }: { state: ThemeBuilderState; onExport: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-fg">
        Click <strong>Export</strong> to download all 5 artifacts (tokens.css, tailwind.config.js,
        tokens.json, figma-tokens.json, theme.tsx).
      </p>
      <ExportPreview filename="tokens.css" content={exportTokensCss(state)} />
      <Button onClick={onExport} className="w-full">
        <Download className="mr-1 h-4 w-4" /> Export theme bundle
      </Button>
    </div>
  );
}

// ---- Helpers ----

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}

function ColorRow({
  label,
  color,
  onChange,
}: {
  label: string;
  color: OKLCH;
  onChange: (c: OKLCH) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-8 w-8 rounded-md border border-border"
        style={{ background: toCss(color) }}
      />
      <div className="flex-1">
        <div className="text-xs text-muted-fg">{label}</div>
        <div className="text-xs font-mono">{toCss(color)}</div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          onChange({
            l: Math.random() * 0.5 + 0.4,
            c: Math.random() * 0.2 + 0.05,
            h: Math.floor(Math.random() * 360),
          })
        }
        aria-label={`Randomize ${label}`}
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

function OklchPicker({ color, onChange }: { color: OKLCH; onChange: (c: OKLCH) => void }) {
  return (
    <div className="space-y-2">
      <div
        className="h-12 rounded-md border border-border"
        style={{ background: toCss(color) }}
        aria-label={`Current color ${toCss(color)}`}
      />
      <Slider
        label={`Lightness ${color.l.toFixed(2)}`}
        min={0}
        max={1}
        step={0.01}
        value={color.l}
        onChange={(v) => onChange({ ...color, l: v })}
      />
      <Slider
        label={`Chroma ${color.c.toFixed(2)}`}
        min={0}
        max={0.4}
        step={0.005}
        value={color.c}
        onChange={(v) => onChange({ ...color, c: v })}
      />
      <Slider
        label={`Hue ${color.h.toFixed(0)}°`}
        min={0}
        max={360}
        step={1}
        value={color.h}
        onChange={(v) => onChange({ ...color, h: v })}
      />
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-xs text-muted-fg">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
      />
    </label>
  );
}

function LivePreview({ state }: { state: ThemeBuilderState }) {
  return (
    <div
      className="space-y-3 rounded-md border border-border p-3 text-sm"
      style={{
        background: 'oklch(0.99 0.005 264)',
        color: 'oklch(0.22 0.018 252)',
        fontFamily: state.typography.fontSans,
      }}
    >
      <Button style={{ background: toCss(state.colors.primary), color: 'white' }}>
        Primary action
      </Button>
      <div
        className="rounded-md p-3"
        style={{
          background: 'oklch(0.96 0.005 252)',
          borderRadius:
            state.spacing.borderRadius === 'sharp'
              ? '0.125rem'
              : state.spacing.borderRadius === 'soft'
                ? '0.5rem'
                : '0.875rem',
        }}
      >
        Card with current radius
      </div>
      <div className="flex gap-1">
        {[
          state.colors.primary,
          state.colors.secondary,
          state.colors.accent,
          state.colors.success,
          state.colors.warning,
          state.colors.destructive,
        ].map((c, i) => (
          <span key={i} className="h-6 flex-1 rounded" style={{ background: toCss(c) }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-success" aria-hidden="true" />
        <span>Saved</span>
      </div>
    </div>
  );
}

function ExportPreview({ filename, content }: { filename: string; content: string }) {
  return (
    <details className="rounded-md border border-border">
      <summary className="cursor-pointer p-2 text-xs font-medium">{filename}</summary>
      <pre className="overflow-x-auto bg-muted p-3 text-xs">
        <code>{content}</code>
      </pre>
    </details>
  );
}
