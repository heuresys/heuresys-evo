import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Set 1',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const AlphaEditorialCinematic: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/alpha-editorial-cinematic.html',
    title: 'α — Editorial Cinematic',
    height: H,
  },
};

export const BetaBrutalistPaper: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/beta-brutalist-paper.html',
    title: 'β — Brutalist Paper',
    height: H,
  },
};

export const GammaIndustrialBlueprint: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/gamma-industrial-blueprint.html',
    title: 'γ — Industrial Blueprint',
    height: H,
  },
};

export const DeltaQuantitativeFt: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/delta-quantitative-ft.html',
    title: 'δ — Quantitative FT',
    height: H,
  },
};
