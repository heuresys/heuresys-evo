import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FadeIn, SlideIn, ScaleIn } from './motion';
import { Button } from './Button';

const meta: Meta<typeof FadeIn> = {
  title: 'Components/Motion',
  component: FadeIn,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FadeIn>;

function Replay({ Cmp, label }: { Cmp: React.ComponentType<any>; label: string }) {
  const [k, setK] = useState(0);
  return (
    <div className="space-y-2">
      <Button size="sm" onClick={() => setK((x) => x + 1)}>
        Replay {label}
      </Button>
      <Cmp key={k} className="rounded-md border p-6 bg-card">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-neutral-500">Click "Replay" to re-trigger</p>
      </Cmp>
    </div>
  );
}

export const Fade: Story = { render: () => <Replay Cmp={FadeIn} label="FadeIn" /> };
export const Slide: Story = { render: () => <Replay Cmp={SlideIn} label="SlideIn (bottom)" /> };
export const Scale: Story = { render: () => <Replay Cmp={ScaleIn} label="ScaleIn" /> };

export const Stagger: Story = {
  render: () => {
    const [k, setK] = useState(0);
    return (
      <div className="space-y-3">
        <Button size="sm" onClick={() => setK((x) => x + 1)}>
          Replay
        </Button>
        <div key={k} className="grid grid-cols-3 gap-3">
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((d, i) => (
            <FadeIn key={i} delay={d} className="rounded-md border p-4 bg-primary/5">
              <p className="text-sm">Item {i + 1}</p>
              <p className="text-xs text-neutral-500">delay {d}s</p>
            </FadeIn>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'Stagger pattern: 6 items con delay incrementale 0.1s.' } },
  },
};
