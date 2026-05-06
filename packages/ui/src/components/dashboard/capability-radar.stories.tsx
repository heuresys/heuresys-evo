import type { Meta, StoryObj } from '@storybook/react-vite';
import { CapabilityRadar } from './capability-radar';

const meta: Meta<typeof CapabilityRadar> = {
  title: 'Dashboard/CapabilityRadar',
  component: CapabilityRadar,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof CapabilityRadar>;

const AXES = [
  { id: 'tech', label: 'Tech' },
  { id: 'fin', label: 'Finance' },
  { id: 'lead', label: 'Leadership' },
  { id: 'comm', label: 'Comms' },
  { id: 'risk', label: 'Risk' },
];

export const Single: Story = {
  render: () => (
    <CapabilityRadar
      axes={AXES}
      series={[{ id: 'andrea', label: 'Andrea', values: [82, 70, 35, 60, 75] }]}
    />
  ),
};

export const VsTarget: Story = {
  render: () => (
    <CapabilityRadar
      axes={AXES}
      series={[
        { id: 'current', label: 'Current', values: [82, 70, 35, 60, 75] },
        { id: 'target', label: 'Target role', values: [75, 80, 70, 80, 85] },
      ]}
    />
  ),
};

export const Triplet: Story = {
  render: () => (
    <CapabilityRadar
      axes={AXES}
      series={[
        { id: 's1', label: 'Andrea', values: [82, 70, 35, 60, 75] },
        { id: 's2', label: 'Stefania', values: [60, 85, 78, 72, 88] },
        { id: 's3', label: 'Team avg', values: [70, 65, 55, 65, 70] },
      ]}
    />
  ),
};

export const SevenAxes: Story = {
  render: () => (
    <CapabilityRadar
      axes={[
        { id: 'a', label: 'Strategy' },
        { id: 'b', label: 'Execution' },
        { id: 'c', label: 'Coaching' },
        { id: 'd', label: 'Influence' },
        { id: 'e', label: 'Innovation' },
        { id: 'f', label: 'Delivery' },
        { id: 'g', label: 'Quality' },
      ]}
      series={[{ id: 'maria', label: 'Maria CHRO', values: [88, 75, 92, 82, 65, 78, 85] }]}
      size={320}
    />
  ),
};
