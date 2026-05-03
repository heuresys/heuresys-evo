import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolCallView } from './tool-call-view';

const meta: Meta<typeof ToolCallView> = {
  title: 'AI/ToolCallView',
  component: ToolCallView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ToolCallView>;

export const Pending: Story = {
  args: {
    call: { id: '1', name: 'searchEmployees', args: { query: 'Mario', limit: 10 } },
  },
};

export const Success: Story = {
  args: {
    call: { id: '2', name: 'getEmployee', args: { id: 'emp-42' } },
    result: {
      id: '2',
      content: JSON.stringify({ id: 'emp-42', name: 'Mario Rossi' }, null, 2),
    },
  },
};

export const Error: Story = {
  args: {
    call: { id: '3', name: 'deleteEmployee', args: { id: 'emp-42' } },
    result: { id: '3', content: '', error: 'Permission denied (P3 RBP)' },
  },
};
