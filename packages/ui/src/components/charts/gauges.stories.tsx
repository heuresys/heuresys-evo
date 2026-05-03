import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { RadialGauge } from './gauges';

const meta: Meta<typeof RadialGauge> = {
  title: 'Charts/Gauges',
  component: RadialGauge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['semi', 'full'] },
    tone: { control: 'select', options: ['primary', 'success', 'warning', 'destructive'] },
  },
  args: { value: 64, max: 100, label: 'CPU', unit: '%', variant: 'semi', tone: 'primary' },
};
export default meta;
type Story = StoryObj<typeof RadialGauge>;

export const Default: Story = {};
export const FullCircle: Story = { args: { variant: 'full' } };
export const Success: Story = { args: { value: 92, tone: 'success', label: 'Uptime' } };
export const Warning: Story = { args: { value: 78, tone: 'warning', label: 'Disk', unit: '%' } };
export const Critical: Story = { args: { value: 95, tone: 'destructive', label: 'Memory' } };

function LiveGauge() {
  const [v, setV] = useState(50);
  useEffect(() => {
    const id = setInterval(() => setV(() => Math.round(20 + Math.random() * 80)), 1500);
    return () => clearInterval(id);
  }, []);
  const tone = v > 85 ? 'destructive' : v > 70 ? 'warning' : v > 40 ? 'primary' : 'success';
  return (
    <RadialGauge
      value={v}
      label="Live load"
      unit="%"
      tone={tone as 'primary' | 'success' | 'warning' | 'destructive'}
      size={200}
    />
  );
}
export const Live: Story = {
  render: () => <LiveGauge />,
  parameters: {
    docs: {
      description: {
        story: 'Valore random ogni 1.5s, tone cambia con soglie. Vedi animazione SVG smooth.',
      },
    },
  },
};

export const ToneGrid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <RadialGauge value={30} label="Low" tone="success" />
      <RadialGauge value={55} label="Medium" tone="primary" />
      <RadialGauge value={78} label="High" tone="warning" />
      <RadialGauge value={94} label="Critical" tone="destructive" />
    </div>
  ),
};
