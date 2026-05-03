import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NotificationCenter, type Notification } from './notification-center';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NotificationCenter>;

const seed: Notification[] = [
  {
    id: '1',
    title: 'Deploy successful',
    body: 'v0.4.7 is live in production',
    timestamp: '2 min ago',
    variant: 'success',
  },
  {
    id: '2',
    title: 'New PR for review',
    body: 'PR #142 by Mario Rossi',
    timestamp: '15 min ago',
    variant: 'info',
    read: false,
  },
  {
    id: '3',
    title: 'Quota at 87%',
    body: 'Monthly API calls',
    timestamp: '1h ago',
    variant: 'warning',
    read: false,
  },
  {
    id: '4',
    title: 'Build failed',
    body: 'CI typecheck error',
    timestamp: '3h ago',
    variant: 'destructive',
    read: true,
  },
  { id: '5', title: 'Welcome!', body: 'Tour starts in 5 sec', timestamp: 'yesterday', read: true },
];

function Demo() {
  const [notifications, setNotifications] = useState(seed);
  return (
    <div className="flex justify-end p-4 border rounded-lg bg-muted/10">
      <NotificationCenter
        notifications={notifications}
        onMarkRead={(id) =>
          setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)))
        }
        onMarkAllRead={() => setNotifications((n) => n.map((x) => ({ ...x, read: true })))}
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Empty: Story = {
  render: () => (
    <div className="flex justify-end p-4 border rounded-lg">
      <NotificationCenter notifications={[]} />
    </div>
  ),
};
