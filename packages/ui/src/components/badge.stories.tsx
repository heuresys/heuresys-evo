import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'outline'],
    },
  },
  args: { children: 'Badge', variant: 'default' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Default' } };
export const Success: Story = { args: { children: 'Active', variant: 'success' } };
export const Warning: Story = { args: { children: 'Pending', variant: 'warning' } };
export const Destructive: Story = { args: { children: 'Failed', variant: 'destructive' } };
export const Outline: Story = { args: { children: 'Draft', variant: 'outline' } };

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// Live counter — dimostra animazione contenuto dinamico
function LiveCounter() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => (x + 1) % 100), 600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-600">Inbox</span>
      <Badge variant="destructive">{n}</Badge>
    </div>
  );
}
export const LiveCount: Story = {
  render: () => <LiveCounter />,
  parameters: {
    docs: {
      description: {
        story: 'Badge con contenuto che cambia ogni 600ms — dimostra render dinamico.',
      },
    },
  },
};

// Pulse dot — micro-animazione status
export const StatusDots: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <Badge variant="success">Online</Badge>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <Badge variant="warning">Idle</Badge>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-neutral-400" />
        <Badge variant="outline">Offline</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Badge accoppiato a status dot con `animate-ping` per "live" feel.' },
    },
  },
};
