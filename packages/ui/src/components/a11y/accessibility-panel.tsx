'use client';

import * as React from 'react';
import { Accessibility, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

interface A11ySettings {
  fontSize: 'A' | 'A+' | 'A++' | 'A+++';
  reducedMotion: boolean;
  highContrast: boolean;
  underlineLinks: boolean;
  readingMode: boolean;
  colorBlindSim: 'none' | 'protan' | 'deutan' | 'tritan';
}

const DEFAULT_SETTINGS: A11ySettings = {
  fontSize: 'A',
  reducedMotion: false,
  highContrast: false,
  underlineLinks: false,
  readingMode: false,
  colorBlindSim: 'none',
};

/**
 * AccessibilityPanel — user-controlled a11y preferences toolbar.
 * Persists settings to localStorage and applies CSS classes/data-attrs to <html>.
 * (TIER 12)
 */
export function AccessibilityPanel({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<A11ySettings>(DEFAULT_SETTINGS);

  React.useEffect(() => {
    const stored = localStorage.getItem('heuresys-a11y');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  React.useEffect(() => {
    const html = document.documentElement;
    const fontSizeMap = { A: '100%', 'A+': '110%', 'A++': '125%', 'A+++': '140%' };
    html.style.fontSize = fontSizeMap[settings.fontSize];
    html.classList.toggle('high-contrast', settings.highContrast);
    html.classList.toggle('underline-links', settings.underlineLinks);
    html.classList.toggle('reading-mode', settings.readingMode);
    html.dataset.colorBlind = settings.colorBlindSim === 'none' ? '' : settings.colorBlindSim;
    if (settings.reducedMotion) {
      html.style.setProperty('--motion-duration-fast', '0ms');
      html.style.setProperty('--motion-duration-base', '0ms');
      html.style.setProperty('--motion-duration-slow', '0ms');
    }
    localStorage.setItem('heuresys-a11y', JSON.stringify(settings));
  }, [settings]);

  function update<K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label="Open accessibility settings"
        className={cn('fixed bottom-4 right-4 z-40', className)}
      >
        <Accessibility className="h-4 w-4" />
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-80 rounded-md border border-border bg-background p-4 shadow-xl">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Accessibility</h2>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </header>
            <div className="space-y-3 text-sm">
              <div>
                <span className="mb-1 block font-medium">Font size</span>
                <div className="flex gap-1">
                  {(['A', 'A+', 'A++', 'A+++'] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={settings.fontSize === s ? 'default' : 'outline'}
                      onClick={() => update('fontSize', s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <ToggleRow
                label="Reduced motion"
                checked={settings.reducedMotion}
                onChange={(v) => update('reducedMotion', v)}
              />
              <ToggleRow
                label="High contrast"
                checked={settings.highContrast}
                onChange={(v) => update('highContrast', v)}
              />
              <ToggleRow
                label="Underline links"
                checked={settings.underlineLinks}
                onChange={(v) => update('underlineLinks', v)}
              />
              <ToggleRow
                label="Reading mode"
                checked={settings.readingMode}
                onChange={(v) => update('readingMode', v)}
              />
              <div>
                <span className="mb-1 block font-medium">Color blindness simulation</span>
                <div className="flex flex-wrap gap-1">
                  {(['none', 'protan', 'deutan', 'tritan'] as const).map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={settings.colorBlindSim === t ? 'default' : 'outline'}
                      onClick={() => update('colorBlindSim', t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSettings(DEFAULT_SETTINGS)}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
    <label className="flex items-center justify-between gap-3">
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
