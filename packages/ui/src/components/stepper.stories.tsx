import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from './stepper';
import { Button } from './Button';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  { id: 's1', label: 'Identity', description: 'Basic info' },
  { id: 's2', label: 'Role', description: 'Permissions' },
  { id: 's3', label: 'Tenant', description: 'Assign tenant', optional: true },
  { id: 's4', label: 'Review', description: 'Confirm' },
];

function Demo({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  const [cur, setCur] = useState(1);
  return (
    <div className="space-y-3">
      <Stepper steps={steps} current={cur} onStepClick={setCur} orientation={orientation} />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setCur((c) => Math.max(0, c - 1))}>
          ← Prev
        </Button>
        <Button size="sm" onClick={() => setCur((c) => Math.min(steps.length - 1, c + 1))}>
          Next →
        </Button>
      </div>
    </div>
  );
}

export const Horizontal: Story = { render: () => <Demo /> };
export const Vertical: Story = { render: () => <Demo orientation="vertical" /> };
