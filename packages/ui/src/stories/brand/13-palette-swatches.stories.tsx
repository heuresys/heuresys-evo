import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { PaletteGrid, PaletteSwatch } from './_components';

const meta: Meta = {
  title: 'Brand/Visual Identity/Palette/Swatches',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ fontFamily: 'system-ui', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
      {title}
    </h3>
    {children}
  </div>
);

export const BrandInviolabili: Story = {
  render: () => (
    <Section title="Brand inviolabili (dal logo)">
      <PaletteGrid>
        <PaletteSwatch
          name="Brand Primary"
          token="--brand-primary"
          oklch="oklch(0.62 0.19 260)"
          hex="#3b82f6"
          note='Wordmark "Heures…s", primary CTA, link, focus ring'
        />
        <PaletteSwatch
          name="Brand Accent"
          token="--brand-accent"
          oklch="oklch(0.63 0.26 297)"
          hex="#a855f7"
          note='Wordmark "y", glow soft, badge highlight, micro-celebration'
        />
      </PaletteGrid>
    </Section>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      style={{
        background: 'oklch(0.1 0.005 260)',
        color: 'oklch(0.96 0.005 260)',
        padding: 32,
        borderRadius: 12,
      }}
    >
      <Section title="Dark mode (default per dashboard + marketing)">
        <PaletteGrid>
          <PaletteSwatch
            name="Background"
            token="--color-background"
            oklch="oklch(0.1 0.005 260)"
            note="near-black navy"
          />
          <PaletteSwatch
            name="Foreground"
            token="--color-foreground"
            oklch="oklch(0.96 0.005 260)"
            note="quasi-white"
          />
          <PaletteSwatch
            name="Surface"
            token="--color-surface"
            oklch="oklch(0.14 0.01 260)"
            note="card bg"
          />
          <PaletteSwatch
            name="Surface Elevated"
            token="--color-surface-elevated"
            oklch="oklch(0.17 0.012 260)"
          />
          <PaletteSwatch
            name="Surface Overlay"
            token="--color-surface-overlay"
            oklch="oklch(0.2 0.015 260)"
            note="modal / popover"
          />
          <PaletteSwatch name="Muted" token="--color-muted" oklch="oklch(0.22 0.025 260)" />
          <PaletteSwatch
            name="Muted Foreground"
            token="--color-muted-foreground"
            oklch="oklch(0.65 0.015 260)"
            note="secondary text"
          />
          <PaletteSwatch name="Border" token="--color-border" oklch="oklch(0.27 0.02 260)" />
          <PaletteSwatch
            name="Border Strong"
            token="--color-border-strong"
            oklch="oklch(0.34 0.025 260)"
          />
          <PaletteSwatch name="Input" token="--color-input" oklch="oklch(0.18 0.015 260)" />
          <PaletteSwatch
            name="Ring"
            token="--color-ring"
            oklch="oklch(0.65 0.22 260)"
            note="focus"
          />
          <PaletteSwatch name="Primary" token="--color-primary" oklch="oklch(0.62 0.19 260)" />
          <PaletteSwatch
            name="Primary Hover"
            token="--color-primary-hover"
            oklch="oklch(0.66 0.2 260)"
          />
          <PaletteSwatch name="Accent" token="--color-accent" oklch="oklch(0.63 0.26 297)" />
          <PaletteSwatch
            name="Accent Hover"
            token="--color-accent-hover"
            oklch="oklch(0.67 0.27 297)"
          />
          <PaletteSwatch
            name="Success"
            token="--color-success"
            oklch="oklch(0.72 0.2 142)"
            note="green vivid"
          />
          <PaletteSwatch
            name="Warning"
            token="--color-warning"
            oklch="oklch(0.8 0.2 80)"
            note="amber vivid"
          />
          <PaletteSwatch
            name="Destructive"
            token="--color-destructive"
            oklch="oklch(0.65 0.25 25)"
            note="red vivid"
          />
          <PaletteSwatch
            name="Info"
            token="--color-info"
            oklch="oklch(0.7 0.18 220)"
            note="cyan-ish"
          />
        </PaletteGrid>
      </Section>
    </div>
  ),
};

export const LightMode: Story = {
  render: () => (
    <div
      style={{
        background: 'oklch(0.99 0.003 260)',
        color: 'oklch(0.18 0.02 260)',
        padding: 32,
        borderRadius: 12,
      }}
    >
      <Section title="Light mode (in pari dignità)">
        <PaletteGrid>
          <PaletteSwatch
            name="Background"
            token="--color-background"
            oklch="oklch(0.99 0.003 260)"
            note="off-white cool"
          />
          <PaletteSwatch
            name="Foreground"
            token="--color-foreground"
            oklch="oklch(0.18 0.02 260)"
            note="gray-900 freddo"
          />
          <PaletteSwatch name="Surface" token="--color-surface" oklch="oklch(0.97 0.005 260)" />
          <PaletteSwatch
            name="Surface Elevated"
            token="--color-surface-elevated"
            oklch="oklch(0.94 0.008 260)"
          />
          <PaletteSwatch
            name="Surface Overlay"
            token="--color-surface-overlay"
            oklch="oklch(0.99 0.003 260)"
          />
          <PaletteSwatch name="Muted" token="--color-muted" oklch="oklch(0.96 0.005 260)" />
          <PaletteSwatch
            name="Muted Foreground"
            token="--color-muted-foreground"
            oklch="oklch(0.48 0.02 260)"
          />
          <PaletteSwatch name="Border" token="--color-border" oklch="oklch(0.92 0.01 260)" />
          <PaletteSwatch
            name="Border Strong"
            token="--color-border-strong"
            oklch="oklch(0.85 0.015 260)"
          />
          <PaletteSwatch name="Input" token="--color-input" oklch="oklch(0.97 0.005 260)" />
          <PaletteSwatch name="Ring" token="--color-ring" oklch="oklch(0.62 0.19 260)" />
          <PaletteSwatch name="Primary" token="--color-primary" oklch="oklch(0.62 0.19 260)" />
          <PaletteSwatch
            name="Primary Hover"
            token="--color-primary-hover"
            oklch="oklch(0.55 0.2 260)"
            note="più scuro per contrast su light"
          />
          <PaletteSwatch name="Accent" token="--color-accent" oklch="oklch(0.63 0.26 297)" />
          <PaletteSwatch
            name="Accent Hover"
            token="--color-accent-hover"
            oklch="oklch(0.55 0.27 297)"
          />
          <PaletteSwatch name="Success" token="--color-success" oklch="oklch(0.62 0.18 142)" />
          <PaletteSwatch name="Warning" token="--color-warning" oklch="oklch(0.74 0.18 75)" />
          <PaletteSwatch
            name="Destructive"
            token="--color-destructive"
            oklch="oklch(0.55 0.22 25)"
          />
          <PaletteSwatch name="Info" token="--color-info" oklch="oklch(0.6 0.15 220)" />
        </PaletteGrid>
      </Section>
    </div>
  ),
};

export const CapabilityDimensions: Story = {
  render: () => (
    <Section title="Capability dimension colors (data viz Knowledge Graph)">
      <PaletteGrid>
        <PaletteSwatch
          name="Process"
          token="--cap-process"
          oklch="oklch(0.62 0.19 260)"
          note="Brand primary blue"
        />
        <PaletteSwatch
          name="Structure"
          token="--cap-structure"
          oklch="oklch(0.70 0.18 220)"
          note="Cyan info"
        />
        <PaletteSwatch
          name="Role"
          token="--cap-role"
          oklch="oklch(0.63 0.26 297)"
          note="Brand accent purple"
        />
        <PaletteSwatch
          name="Competence"
          token="--cap-competence"
          oklch="oklch(0.72 0.20 142)"
          note="Success green"
        />
        <PaletteSwatch
          name="Performance"
          token="--cap-performance"
          oklch="oklch(0.80 0.20 80)"
          note="Warning amber"
        />
      </PaletteGrid>
    </Section>
  ),
};

export const GradientBrand: Story = {
  render: () => (
    <Section title="Gradient brand (CTA pattern only)">
      <div style={{ display: 'grid', gap: 16 }}>
        <div
          style={{
            background:
              'linear-gradient(135deg, oklch(0.62 0.19 260) 0%, oklch(0.63 0.26 297) 100%)',
            height: 120,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'system-ui',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          .bg-brand-gradient → linear-gradient(135deg, primary → accent)
        </div>
        <div
          style={{
            background: 'oklch(0.1 0.005 260)',
            padding: 32,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui',
              fontWeight: 700,
              fontSize: 36,
              backgroundImage:
                'linear-gradient(135deg, oklch(0.62 0.19 260) 0%, oklch(0.63 0.26 297) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            .text-brand-gradient
          </span>
        </div>
        <div
          style={{
            background: 'oklch(0.1 0.005 260)',
            padding: 32,
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'system-ui',
              fontSize: 64,
              color: 'oklch(0.96 0.005 260)',
              filter: 'drop-shadow(0 0 60px oklch(0.63 0.26 297 / 0.4))',
            }}
          >
            heures<span style={{ color: 'oklch(0.63 0.26 297)' }}>y</span>s
          </div>
          <div style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 12, color: '#888' }}>
            .brand-glow (filter drop-shadow purple)
          </div>
        </div>
      </div>
    </Section>
  ),
};
