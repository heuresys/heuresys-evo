import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Set 3',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const IotaIndustrialBlueprintTempered: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/iota-industrial-blueprint-tempered.html',
    title: 'ι — Industrial Blueprint Tempered (55T/45C)',
    height: H,
  },
};

export const KappaQuantitativeFtTempered: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/kappa-quantitative-ft-tempered.html',
    title: 'κ — Quantitative FT Tempered (65T/35C)',
    height: H,
  },
};

export const LambdaGammaEtaRemix: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/lambda-gamma-eta-remix.html',
    title: 'λ — γ × η Remix Industrial-Swiss (60T/40C)',
    height: H,
  },
};

export const MuDataDenseTemperata: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-data-dense-temperata.html',
    title: 'μ — Data-Dense Temperata (60T/40C exact)',
    height: H,
  },
};
