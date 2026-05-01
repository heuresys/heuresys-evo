import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox } from 'lucide-react';
import { EmptyState } from './empty-state';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <Inbox className="h-10 w-10" aria-hidden="true" />,
    title: 'No messages',
    description: 'When you receive new messages they will appear here.',
    action: <Button>Compose new</Button>,
  },
};
