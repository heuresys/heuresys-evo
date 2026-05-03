import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Typewriter } from './text-effects';
import { Button } from '../Button';

const meta: Meta<typeof Typewriter> = {
  title: 'Utility/TextEffects',
  component: Typewriter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Typewriter>;

function Replay({ text = 'Heuresys evo — Organizational Intelligence', speed = 50 }) {
  const [k, setK] = useState(0);
  return (
    <div className="space-y-3 w-[500px]">
      <div className="rounded border p-4 bg-card min-h-[60px]">
        <Typewriter key={k} text={text} speed={speed} className="text-xl font-semibold" />
      </div>
      <Button size="sm" onClick={() => setK((x) => x + 1)}>
        Replay
      </Button>
    </div>
  );
}

export const Default: Story = { render: () => <Replay /> };
export const Slow: Story = { render: () => <Replay text="Slow typewriter…" speed={150} /> };
export const Fast: Story = {
  render: () => <Replay text="Lorem ipsum dolor sit amet consectetur adipiscing elit" speed={20} />,
};
