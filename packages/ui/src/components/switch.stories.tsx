import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = { render: () => <Switch /> };
export const Checked: Story = { render: () => <Switch defaultChecked /> };
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
};

function SettingsPanel() {
  const [s, setS] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false,
    telemetry: false,
  });
  return (
    <div className="space-y-3 w-[300px]">
      {[
        { key: 'notifications', label: 'Push notifications', desc: 'Receive alerts in real-time' },
        { key: 'autoSave', label: 'Auto-save drafts', desc: 'Saved every 30s' },
        { key: 'darkMode', label: 'Dark mode', desc: 'Override system preference' },
        { key: 'telemetry', label: 'Anonymous telemetry', desc: 'Help improve the product' },
      ].map(({ key, label, desc }) => (
        <div key={key} className="flex items-start justify-between gap-3 p-3 border rounded">
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-neutral-500">{desc}</p>
          </div>
          <Switch
            checked={s[key as keyof typeof s]}
            onCheckedChange={(v) => setS((x) => ({ ...x, [key]: !!v }))}
          />
        </div>
      ))}
    </div>
  );
}
export const SettingsRecipe: Story = {
  render: () => <SettingsPanel />,
  parameters: {
    docs: {
      description: {
        story: 'Recipe: pannello settings con 4 switch controlled, vedi animation thumb slide.',
      },
    },
  },
};
