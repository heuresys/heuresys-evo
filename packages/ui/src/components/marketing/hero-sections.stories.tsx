import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroSplit } from './hero-sections';

const meta: Meta<typeof HeroSplit> = {
  title: 'Marketing/HeroSections',
  component: HeroSplit,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof HeroSplit>;

export const Split: Story = {
  args: {
    eyebrow: 'New for 2026',
    title: 'Heuresys evo — Workforce Orchestration',
    description: 'Govern processes, structure, roles, competencies via Knowledge Graph.',
    primaryCta: { label: 'Start free trial' },
    secondaryCta: { label: 'Watch demo' },
    imageSrc: 'https://picsum.photos/seed/hero/600/400',
    imageAlt: 'Dashboard preview',
  },
};

export const Minimal: Story = {
  args: {
    title: 'Simple, powerful, secure.',
    description: 'No fluff. Just the platform you need.',
    primaryCta: { label: 'Get started' },
    imageSrc: 'https://picsum.photos/seed/min/600/400',
    imageAlt: 'Product',
  },
};
