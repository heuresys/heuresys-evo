import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within, expect } from 'storybook/test';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'error'] },
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'Search employees…', variant: 'default', inputSize: 'md', disabled: false },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Error: Story = { args: { variant: 'error', placeholder: 'Field is required' } };
export const Small: Story = { args: { inputSize: 'sm' } };
export const Large: Story = { args: { inputSize: 'lg' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } };
export const Email: Story = { args: { type: 'email', placeholder: 'name@example.com' } };

// Live validation: cambia variant in real-time mentre scrivi
function ValidationDemo() {
  const [v, setV] = useState('');
  const isValid = v.length >= 3;
  const isError = v.length > 0 && !isValid;
  return (
    <div className="space-y-2 w-[300px]">
      <Input
        value={v}
        onChange={(e) => setV(e.target.value)}
        variant={isError ? 'error' : 'default'}
        placeholder="Min 3 caratteri…"
      />
      <p
        className={`text-xs ${isError ? 'text-destructive' : isValid ? 'text-emerald-600' : 'text-neutral-500'}`}
      >
        {isError ? `Need ${3 - v.length} more chars` : isValid ? '✓ Valid input' : 'Start typing…'}
      </p>
    </div>
  );
}
export const LiveValidation: Story = {
  render: () => <ValidationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Variant cambia tra default/error mentre scrivi. Stato controllato React.',
      },
    },
  },
};

// Input con icona (prefix)
export const WithIcon: Story = {
  render: () => (
    <div className="relative w-[300px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <Input className="pl-9" placeholder="Search…" />
    </div>
  ),
};

// Email con icona
export const EmailWithIcon: Story = {
  render: () => (
    <div className="relative w-[300px]">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <Input className="pl-9" type="email" placeholder="name@example.com" />
    </div>
  ),
};

// Password con toggle visibility
function PasswordToggle() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-[300px]">
      <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
export const PasswordWithToggle: Story = { render: () => <PasswordToggle /> };

// Auto-type via play()
export const InteractiveType: Story = {
  args: { placeholder: 'Type here…' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = c.getByPlaceholderText('Type here…') as HTMLInputElement;
    await userEvent.type(input, 'Hello Storybook', { delay: 50 });
    await expect(input.value).toBe('Hello Storybook');
  },
  parameters: {
    docs: {
      description: {
        story: '`userEvent.type` scrive 1 char ogni 50ms — vedi typing motion in real-time.',
      },
    },
  },
};
