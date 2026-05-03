import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './page-header';
import { Button } from './Button';
import { Badge } from './badge';
import { Plus, Download } from 'lucide-react';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: { title: 'Employees', description: 'Manage workforce across all tenants.' },
};

export const WithActions: Story = {
  args: {
    title: 'Employees',
    description: 'Manage workforce across all tenants.',
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add employee
        </Button>
      </>
    ),
  },
};

export const WithBadges: Story = {
  args: {
    title: 'Brand Studio',
    description: 'Real-time design tokens editor.',
    badges: (
      <>
        <Badge variant="success">SUPERUSER</Badge>
        <Badge variant="outline">Beta</Badge>
      </>
    ),
    actions: <Button size="sm">Save tokens</Button>,
  },
};

export const Full: Story = {
  args: {
    title: 'Engineering / Backend',
    description: 'Active sprint dashboard, team velocity, and PR queue.',
    breadcrumbs: <span>Heuresys › Departments › Engineering › Backend</span>,
    badges: <Badge variant="success">Sprint #14</Badge>,
    actions: (
      <>
        <Button variant="outline" size="sm">
          Settings
        </Button>
        <Button size="sm">New ticket</Button>
      </>
    ),
  },
};
