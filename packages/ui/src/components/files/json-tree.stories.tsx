import type { Meta, StoryObj } from '@storybook/react-vite';
import { JsonTree } from './json-tree';

const meta: Meta<typeof JsonTree> = {
  title: 'Files/JsonTree',
  component: JsonTree,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JsonTree>;

const sample = {
  tenant: { id: 'heuresys', name: 'Heuresys System', tier: 'platform' },
  employees: [
    { id: 1, name: 'Mario Rossi', role: 'Engineer', active: true },
    { id: 2, name: 'Lucia Bianchi', role: 'Designer', active: true },
  ],
  config: { multiTenant: true, rls: true, audit: true },
  meta: null,
  count: 1247,
  ratio: 0.847,
};

export const Object_: Story = { name: 'Object', args: { value: sample, defaultOpen: true } };
export const Collapsed: Story = { args: { value: sample, defaultOpen: false } };
export const Array_: Story = {
  name: 'Array',
  args: { value: [1, 2, 'three', { four: 4 }, [5, 6, 7]] },
};
export const Primitives: Story = {
  render: () => (
    <div className="space-y-1">
      <JsonTree value="hello" name="string" />
      <JsonTree value={42} name="number" />
      <JsonTree value={true} name="boolean" />
      <JsonTree value={null} name="nullVal" />
    </div>
  ),
};
