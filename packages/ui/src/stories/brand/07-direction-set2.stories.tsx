import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Set 2',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const EpsilonSculpturalVariable: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/epsilon-sculptural-variable.html',
    title: 'ε — Sculptural Variable',
    height: H,
  },
};

export const ZetaArchitecturalWarm: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/zeta-architectural-warm.html',
    title: 'ζ — Architectural Warm',
    height: H,
  },
};

export const EtaSwissComputational: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/eta-swiss-computational.html',
    title: 'η — Swiss Computational',
    height: H,
  },
};

export const ThetaAlgorithmicGenerative: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/theta-algorithmic-generative.html',
    title: 'θ — Algorithmic Generative',
    height: H,
  },
};
