import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Banner } from './banner';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'destructive', 'neutral'] },
    dismissible: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Heads up',
    children: 'Maintenance window 02:00-03:00 UTC tomorrow.',
  },
};
export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Deploy successful',
    children: 'v0.4.7 is now live in production.',
  },
};
export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Quota nearing limit',
    children: 'You used 87% of monthly API calls.',
  },
};
export const Destructive: Story = {
  args: {
    tone: 'destructive',
    title: 'Sync failed',
    children: 'Could not reach the leader replica.',
  },
};
export const Neutral: Story = {
  args: { tone: 'neutral', children: 'New feature: brand-studio is now SUPERUSER-only.' },
};

export const AllTones: Story = {
  render: () => (
    <div className="space-y-2 max-w-xl">
      {(['info', 'success', 'warning', 'destructive', 'neutral'] as const).map((t) => (
        <Banner key={t} tone={t} title={t.charAt(0).toUpperCase() + t.slice(1)}>
          Pattern showcase per tone {t}.
        </Banner>
      ))}
    </div>
  ),
};

function DismissDemo() {
  const [open, setOpen] = useState(true);
  if (!open)
    return (
      <button className="text-sm underline" onClick={() => setOpen(true)}>
        Show banner again
      </button>
    );
  return (
    <Banner tone="info" title="Cookies" dismissible onDismiss={() => setOpen(false)}>
      Click X to dismiss. Stato locale React.
    </Banner>
  );
}
export const Dismissible: Story = { render: () => <DismissDemo /> };
