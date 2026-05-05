import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Aesthetic/Critiques',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const IotaIndustrialBlueprint: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/iota-industrial-blueprint-tempered.critique.md',
  },
};

export const KappaQuantitativeFt: Story = {
  args: { src: '02-aesthetic/direction-explorations/kappa-quantitative-ft-tempered.critique.md' },
};

export const LambdaGammaEtaRemix: Story = {
  args: { src: '02-aesthetic/direction-explorations/lambda-gamma-eta-remix.critique.md' },
};

export const MuDataDenseTemperata: Story = {
  args: { src: '02-aesthetic/direction-explorations/mu-data-dense-temperata.critique.md' },
};
