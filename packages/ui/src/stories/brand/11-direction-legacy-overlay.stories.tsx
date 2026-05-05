import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Legacy Overlay',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const AlphaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/alpha-editorial-cinematic-legacy.html',
    title: 'α — Editorial Cinematic (legacy palette)',
    height: H,
  },
};
export const BetaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/beta-brutalist-paper-legacy.html',
    title: 'β — Brutalist Paper (legacy palette)',
    height: H,
  },
};
export const GammaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/gamma-industrial-blueprint-legacy.html',
    title: 'γ — Industrial Blueprint (legacy palette)',
    height: H,
  },
};
export const DeltaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/delta-quantitative-ft-legacy.html',
    title: 'δ — Quantitative FT (legacy palette)',
    height: H,
  },
};
export const EpsilonLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/epsilon-sculptural-variable-legacy.html',
    title: 'ε — Sculptural Variable (legacy palette)',
    height: H,
  },
};
export const ZetaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/zeta-architectural-warm-legacy.html',
    title: 'ζ — Architectural Warm (legacy palette)',
    height: H,
  },
};
export const EtaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/eta-swiss-computational-legacy.html',
    title: 'η — Swiss Computational (legacy palette)',
    height: H,
  },
};
export const ThetaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/theta-algorithmic-generative-legacy.html',
    title: 'θ — Algorithmic Generative (legacy palette)',
    height: H,
  },
};
export const IotaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/iota-industrial-blueprint-tempered-legacy.html',
    title: 'ι — Industrial Blueprint Tempered (legacy palette)',
    height: H,
  },
};
export const KappaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/kappa-quantitative-ft-tempered-legacy.html',
    title: 'κ — Quantitative FT Tempered (legacy palette)',
    height: H,
  },
};
export const LambdaLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/lambda-gamma-eta-remix-legacy.html',
    title: 'λ — γ × η Remix (legacy palette)',
    height: H,
  },
};
export const MuDataDenseLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-data-dense-temperata-legacy.html',
    title: 'μ — Data-Dense Temperata (legacy palette)',
    height: H,
  },
};
export const MuArtDirectorLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-art-director-legacy.html',
    title: 'μ — Art Director (legacy palette)',
    height: H,
  },
};
export const MuPragmaticLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-pragmatic-legacy.html',
    title: 'μ — Pragmatic (legacy palette)',
    height: H,
  },
};
export const MuSynthesisLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-synthesis-legacy.html',
    title: 'μ — Synthesis (legacy palette)',
    height: H,
  },
};
