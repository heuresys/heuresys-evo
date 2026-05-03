import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { render: () => <Checkbox /> };

export const Checked: Story = { render: () => <Checkbox defaultChecked /> };

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox disabled /> Disabled unchecked
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox disabled defaultChecked /> Disabled checked
      </label>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox /> Accept terms and conditions
    </label>
  ),
};

function Group() {
  const [checked, setChecked] = useState({
    p1: true,
    p2: false,
    p3: true,
  } as Record<string, boolean>);
  return (
    <div className="space-y-2">
      {Object.entries(checked).map(([key, val]) => (
        <label key={key} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={val}
            onCheckedChange={(c) => setChecked((s) => ({ ...s, [key]: !!c }))}
          />
          {key.toUpperCase()}: Multi-tenant principle {key.slice(1)}
        </label>
      ))}
      <p className="text-xs text-neutral-500">
        Selected:{' '}
        {Object.entries(checked)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', ') || 'none'}
      </p>
    </div>
  );
}
export const ControlledGroup: Story = { render: () => <Group /> };
