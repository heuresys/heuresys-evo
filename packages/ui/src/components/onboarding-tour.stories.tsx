import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { OnboardingTour } from './onboarding-tour';
import { Button } from './Button';

const meta: Meta<typeof OnboardingTour> = {
  title: 'Components/OnboardingTour',
  component: OnboardingTour,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof OnboardingTour>;

const steps = [
  {
    id: 's1',
    targetSelector: '#tour-target-1',
    title: 'Welcome!',
    description: 'This is your dashboard.',
    placement: 'bottom' as const,
  },
  {
    id: 's2',
    targetSelector: '#tour-target-2',
    title: 'Employees',
    description: 'Manage your workforce here.',
    placement: 'right' as const,
  },
  {
    id: 's3',
    targetSelector: '#tour-target-3',
    title: 'Settings',
    description: 'Configure your preferences.',
    placement: 'left' as const,
  },
];

function Demo() {
  const [active, setActive] = useState(false);
  return (
    <div className="space-y-6">
      <Button onClick={() => setActive(true)}>Start tour</Button>
      <div className="grid grid-cols-3 gap-4">
        <div id="tour-target-1" className="p-6 rounded border bg-primary/5">
          Target 1
        </div>
        <div id="tour-target-2" className="p-6 rounded border bg-success/5">
          Target 2
        </div>
        <div id="tour-target-3" className="p-6 rounded border bg-warning/5">
          Target 3
        </div>
      </div>
      <OnboardingTour
        steps={steps}
        active={active}
        onDismiss={() => setActive(false)}
        onComplete={() => setActive(false)}
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
