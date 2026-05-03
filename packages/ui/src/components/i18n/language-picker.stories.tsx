import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LanguagePicker } from './language-picker';

const meta: Meta<typeof LanguagePicker> = {
  title: 'I18n/LanguagePicker',
  component: LanguagePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LanguagePicker>;

function Demo() {
  const [v, setV] = useState('it');
  return (
    <div className="flex flex-col items-center gap-3">
      <LanguagePicker value={v} onChange={setV} />
      <p className="text-xs text-neutral-500">
        Selected: <code>{v}</code>
      </p>
    </div>
  );
}
export const Default: Story = { render: () => <Demo /> };
