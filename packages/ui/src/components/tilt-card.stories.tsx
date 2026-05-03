import type { Meta, StoryObj } from '@storybook/react-vite';
import { TiltCard } from './tilt-card';

const meta: Meta<typeof TiltCard> = {
  title: 'Components/TiltCard',
  component: TiltCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TiltCard>;

export const Default: Story = {
  render: () => (
    <TiltCard className="rounded-xl bg-primary text-primary-fg p-8 w-[280px] shadow-2xl">
      <p className="text-lg font-semibold">Hover me</p>
      <p className="text-sm opacity-80">3D tilt segue il mouse, rispetta prefers-reduced-motion.</p>
    </TiltCard>
  ),
};

export const HighIntensity: Story = {
  render: () => (
    <TiltCard
      intensity={25}
      className="rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white p-8 w-[280px] shadow-2xl"
    >
      <p className="text-lg font-semibold">High intensity (25)</p>
    </TiltCard>
  ),
};

export const SubtleIntensity: Story = {
  render: () => (
    <TiltCard intensity={5} className="rounded-xl bg-card border p-8 w-[280px] shadow-md">
      <p className="text-lg font-semibold">Subtle (5)</p>
      <p className="text-sm text-neutral-500">Minimal tilt, professional feel.</p>
    </TiltCard>
  ),
};
