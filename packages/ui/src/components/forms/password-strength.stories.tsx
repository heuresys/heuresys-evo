import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordStrengthMeter } from './password-strength';
import { Input } from '../Input';

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: 'Forms/PasswordStrength',
  component: PasswordStrengthMeter,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PasswordStrengthMeter>;

function Demo({ initial = '' }: { initial?: string }) {
  const [pwd, setPwd] = useState(initial);
  return (
    <div className="w-[300px] space-y-2">
      <Input
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="Type a password…"
      />
      <PasswordStrengthMeter password={pwd} userInputs={['mario', 'rossi', 'heuresys']} />
    </div>
  );
}

export const Empty: Story = { render: () => <Demo /> };
export const Weak: Story = { render: () => <Demo initial="abc123" /> };
export const Fair: Story = { render: () => <Demo initial="Password1" /> };
export const Good: Story = { render: () => <Demo initial="MyP@ssword99" /> };
export const Strong: Story = { render: () => <Demo initial="!T8z@bX#qLm$pY7" /> };
