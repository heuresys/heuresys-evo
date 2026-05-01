import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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
