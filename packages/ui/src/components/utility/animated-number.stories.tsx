import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { AnimatedNumber } from './animated-number';
import { Button } from '../Button';

const meta: Meta<typeof AnimatedNumber> = {
  title: 'Utility/AnimatedNumber',
  component: AnimatedNumber,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AnimatedNumber>;

export const Static: Story = {
  args: { value: 1247, duration: 1000, className: 'text-4xl font-bold' },
};
export const Currency: Story = {
  args: { value: 84500, prefix: '€', duration: 1500, className: 'text-3xl font-semibold' },
};
export const Percent: Story = {
  args: {
    value: 99.97,
    suffix: '%',
    decimals: 2,
    duration: 1200,
    className: 'text-3xl font-semibold',
  },
};

function ReplayDemo() {
  const [v, setV] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatedNumber value={v} className="text-5xl font-bold" duration={1200} />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setV(0)}>
          0
        </Button>
        <Button size="sm" onClick={() => setV(100)}>
          100
        </Button>
        <Button size="sm" onClick={() => setV(1000)}>
          1k
        </Button>
        <Button size="sm" onClick={() => setV(99999)}>
          99k
        </Button>
      </div>
    </div>
  );
}
export const Interactive: Story = { render: () => <ReplayDemo /> };

function LiveDemo() {
  const [v, setV] = useState(50);
  useEffect(() => {
    const id = setInterval(() => setV(() => Math.round(Math.random() * 1000)), 1500);
    return () => clearInterval(id);
  }, []);
  return <AnimatedNumber value={v} className="text-4xl font-bold" duration={800} />;
}
export const LiveStream: Story = {
  render: () => <LiveDemo />,
  parameters: { docs: { description: { story: 'Valore random ogni 1.5s con count-up smooth.' } } },
};
