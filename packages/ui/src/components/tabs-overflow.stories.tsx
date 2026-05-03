import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TabsOverflow } from './tabs-overflow';
import { Badge } from './badge';

const meta: Meta<typeof TabsOverflow> = {
  title: 'Components/TabsOverflow',
  component: TabsOverflow,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TabsOverflow>;

const items = [
  { id: 't1', label: 'Overview' },
  { id: 't2', label: 'Employees', badge: <Badge variant="outline">1247</Badge> },
  { id: 't3', label: 'Departments' },
  { id: 't4', label: 'Roles' },
  { id: 't5', label: 'Permissions' },
  { id: 't6', label: 'Audit log' },
  { id: 't7', label: 'Reports', badge: <Badge variant="success">New</Badge> },
  { id: 't8', label: 'Settings' },
  { id: 't9', label: 'Integrations' },
  { id: 't10', label: 'Webhooks' },
];

function Demo({ width = '600px' }: { width?: string }) {
  const [val, setVal] = useState('t1');
  return (
    <div style={{ width }} className="border rounded-lg p-3">
      <TabsOverflow items={items} value={val} onChange={setVal} />
      <p className="text-xs text-neutral-500 mt-3">
        Selected: {val} | Try resize browser to trigger overflow collapse
      </p>
    </div>
  );
}

export const Wide: Story = { render: () => <Demo width="1000px" /> };
export const Medium: Story = { render: () => <Demo width="600px" /> };
export const Narrow: Story = {
  render: () => <Demo width="350px" />,
  parameters: {
    docs: { description: { story: 'Narrow width forces overflow into "More" dropdown.' } },
  },
};
