import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignaturePadField } from './signature-pad';

const meta: Meta<typeof SignaturePadField> = {
  title: 'Forms/SignaturePad',
  component: SignaturePadField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SignaturePadField>;

export const Default: Story = {
  args: { onSave: (dataUrl) => console.log('signature dataUrl length', dataUrl.length) },
};

export const Wide: Story = { args: { width: 600, height: 200, onSave: () => {} } };
export const Compact: Story = { args: { width: 300, height: 120, onSave: () => {} } };
