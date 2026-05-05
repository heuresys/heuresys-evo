import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Set 4',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const MuArchitect: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-architect.html',
    title: 'μ — Architect (Systems POV)',
    height: H,
  },
};

export const MuArtDirector: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-art-director.html',
    title: 'μ — Art Director (Pentagram POV)',
    height: H,
  },
};

export const MuPragmatic: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-pragmatic.html',
    title: 'μ — Pragmatic (Conversion POV)',
    height: H,
  },
};

export const MuSynthesis: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-synthesis.html',
    title: 'μ — Synthesis (40/30/30 mix)',
    height: H,
  },
};
