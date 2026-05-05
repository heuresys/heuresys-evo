import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Set 5 Legacy (D1 winner)',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '90vh';

export const MuArchitectLegacy: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-architect-legacy.html',
    title: 'μ — Architect Legacy (Systems POV + palette legacy heuresys.com) — D1 WINNER',
    height: H,
  },
};

export const MuArchitectLegacyDetailed: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/mu-architect-legacy-detailed.html',
    title: 'μ — Architect Legacy Detailed',
    height: H,
  },
};
