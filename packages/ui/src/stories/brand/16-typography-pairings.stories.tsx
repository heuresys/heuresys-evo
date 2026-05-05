import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Visual Identity/Typography/Pairings',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

export const PairingExplorations: Story = {
  args: {
    src: '03-visual-identity/typography/pairing-explorations.html',
    title: 'Typography pairing — Set originale (Inter Tight / Geist / Space Grotesk)',
    height: '90vh',
  },
};

export const PairingBAlternatives: Story = {
  args: {
    src: '03-visual-identity/typography/pairing-b-alternatives.html',
    title: 'Typography pairing — B alternatives (Geist / Manrope / DM Sans / Plus Jakarta)',
    height: '90vh',
  },
};
