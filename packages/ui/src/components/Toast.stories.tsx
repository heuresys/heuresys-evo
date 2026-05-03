import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within, expect } from 'storybook/test';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './Toast';
import { Button } from './Button';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

const ToastDemo = ({ variant }: { variant: 'default' | 'destructive' }) => {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show {variant} toast</Button>
      <Toast open={open} onOpenChange={setOpen} variant={variant} duration={3500}>
        <div className="flex flex-col gap-1">
          <ToastTitle>{variant === 'destructive' ? 'Sync failed' : 'Saved'}</ToastTitle>
          <ToastDescription>
            {variant === 'destructive'
              ? 'Could not reach the leader replica.'
              : 'Changes were applied successfully.'}
          </ToastDescription>
        </div>
        <ToastAction altText="Retry">Retry</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export const Default: Story = { render: () => <ToastDemo variant="default" /> };
export const Destructive: Story = { render: () => <ToastDemo variant="destructive" /> };

// Auto-trigger via play() per vedere swipe-in animation senza click manuale
export const InteractiveTrigger: Story = {
  render: () => <ToastDemo variant="default" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button'));
    await expect(await within(document.body).findByText(/saved/i)).toBeVisible();
  },
  parameters: {
    docs: {
      description: { story: 'Click trigger automatico → vedi animazione swipe-in del toast.' },
    },
  },
};

// Stack multiplo
function StackDemo() {
  const [counter, setCounter] = useState(0);
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string }>>([]);
  const push = () => {
    const id = counter + 1;
    setCounter(id);
    setToasts((t) => [...t, { id, msg: `Notification #${id}` }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };
  return (
    <ToastProvider>
      <Button onClick={push}>Push toast</Button>
      {toasts.map((t) => (
        <Toast key={t.id} open onOpenChange={() => {}}>
          <div>
            <ToastTitle>{t.msg}</ToastTitle>
            <ToastDescription>Auto-dismiss in 3s.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
export const Stack: Story = {
  render: () => <StackDemo />,
  parameters: {
    docs: {
      description: { story: 'Push button multiple times — toasts stack with stagger animation.' },
    },
  },
};
