import type { Meta, StoryObj } from '@storybook/react';
import { HeuresysWordmark } from './wordmark';

/**
 * Storybook for canonical brand wordmark (S28-bis Wave 10 M1).
 *
 * 3 variants × 5 sizes matrix per design review. Reference:
 * `.ux-design/DECISIONS-LOG.md` L25 + L27 + L28 (logo originale + relativo).
 */

const meta: Meta<typeof HeuresysWordmark> = {
  title: 'Brand/Wordmark',
  component: HeuresysWordmark,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Canonical brand wordmark "heuresys" con la "y" highlighted in `var(--accent)`. 3 variants: default (Inter), brand (Exo 2 hero), relative (themed surface).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'relative'],
      description: 'Color/font scheme of body letters',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'hero'],
      description: 'Font size token',
    },
    as: {
      control: 'select',
      options: ['span', 'div', 'h1', 'h2', 'p'],
      description: 'Render-as element. Use "h1" for hero contexts (login).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeuresysWordmark>;

export const Default: Story = {
  args: { variant: 'default', size: 'md' },
};

export const BrandHero: Story = {
  args: { variant: 'brand', size: 'hero', as: 'h1' },
  parameters: {
    docs: {
      description: {
        story:
          'Used in login-aurora hero + marketing surfaces (Exo 2 700, var(--brand-blue) body).',
      },
    },
  },
};

export const Relative: Story = {
  args: { variant: 'relative', size: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'Themed surface variant — body color from var(--logo-body, var(--ink)). Used in direzioni estetiche custom + variant stagionali.',
      },
    },
  },
};

export const SizeMatrix: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
    >
      {(['sm', 'md', 'lg', 'xl', 'hero'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <code style={{ minWidth: 50, color: 'var(--neutral-500)' }}>{size}</code>
          <HeuresysWordmark variant="default" size={size} />
        </div>
      ))}
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(['default', 'brand', 'relative'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <code style={{ minWidth: 80, color: 'var(--neutral-500)' }}>{variant}</code>
          <HeuresysWordmark variant={variant} size="lg" />
        </div>
      ))}
    </div>
  ),
};
