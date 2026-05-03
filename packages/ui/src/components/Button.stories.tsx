import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within, expect, fn } from 'storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
    asChild: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: { children: 'Button', variant: 'default', size: 'md', disabled: false, onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const Link: Story = { args: { variant: 'link', children: 'Read more' } };
export const Small: Story = { args: { size: 'sm', children: 'Small' } };
export const Large: Story = { args: { size: 'lg', children: 'Large' } };
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Loading: simula pending state con spinner SVG inline
function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      }}
    >
      {loading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="4"
            />
            <path d="M4 12a8 8 0 018-8" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
          Saving…
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
}
export const Loading: Story = {
  render: () => <LoadingDemo />,
  parameters: {
    docs: {
      description: { story: 'Click → 1.5s pending con spinner motion. Pattern per async actions.' },
    },
  },
};

// Interactive: play() simula click + verifica handler chiamato
export const InteractiveClick: Story = {
  args: { children: 'Click me' },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const btn = c.getByRole('button', { name: /click me/i });
    await userEvent.click(btn);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click automatico via `play()` + assertion. Vedi pannello Interactions per step-by-step.',
      },
    },
  },
};

// Hover demo via play() — visibile in toolbar Interactions
export const InteractiveHover: Story = {
  args: { children: 'Hover me', variant: 'outline' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.hover(c.getByRole('button'));
  },
};
