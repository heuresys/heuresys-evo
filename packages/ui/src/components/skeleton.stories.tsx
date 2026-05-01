import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, Spinner } from './skeleton';

const meta: Meta = {
  title: 'Components/Skeleton',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Card: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-32 w-72" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  ),
};

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => <Spinner className="h-8 w-8 text-primary" />,
};
