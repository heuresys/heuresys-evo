import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PhoneInputField, MoneyInput } from './smart-inputs';

const meta: Meta<typeof PhoneInputField> = {
  title: 'Forms/SmartInputs',
  component: PhoneInputField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PhoneInputField>;

function PhoneDemo() {
  const [v, setV] = useState('');
  return (
    <div className="w-[320px] space-y-2">
      <p className="text-xs font-medium">PhoneInputField (default IT)</p>
      <PhoneInputField value={v} onChange={setV} />
      <p className="text-xs text-neutral-500">E.164 value: {v || '(empty)'}</p>
    </div>
  );
}
export const Phone: Story = { render: () => <PhoneDemo /> };

function MoneyDemo() {
  const [v, setV] = useState<number | null>(1234.56);
  return (
    <div className="w-[280px] space-y-2">
      <p className="text-xs font-medium">MoneyInput (EUR, it-IT)</p>
      <MoneyInput
        value={v}
        onChange={setV}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <p className="text-xs text-neutral-500">Value: {v ?? '(null)'}</p>
    </div>
  );
}
export const Money: Story = { render: () => <MoneyDemo /> };
