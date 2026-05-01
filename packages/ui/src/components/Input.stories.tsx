import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
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
