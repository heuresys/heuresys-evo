import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { OtpInput } from './otp-input';

const meta: Meta<typeof OtpInput> = {
  title: 'Forms/OtpInput',
  component: OtpInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof OtpInput>;

function Demo({ length = 6 }: { length?: number }) {
  const [v, setV] = useState('');
  return (
    <div className="space-y-2">
      <OtpInput
        length={length}
        value={v}
        onChange={setV}
        onComplete={(val) => console.log('complete', val)}
      />
      <p className="text-xs text-neutral-500 tabular-nums">
        value: {v || '(empty)'} / {length}
      </p>
    </div>
  );
}

export const SixDigits: Story = { render: () => <Demo length={6} /> };
export const FourDigits: Story = { render: () => <Demo length={4} /> };
export const Disabled: Story = {
  render: () => <OtpInput length={6} value="123" onChange={() => {}} disabled />,
};
