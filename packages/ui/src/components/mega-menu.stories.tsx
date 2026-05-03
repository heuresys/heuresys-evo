import type { Meta, StoryObj } from '@storybook/react-vite';
import { Users, BarChart, Briefcase, Database, Globe, Zap } from 'lucide-react';
import { MegaMenu } from './mega-menu';
import { Badge } from './badge';

const meta: Meta<typeof MegaMenu> = {
  title: 'Components/MegaMenu',
  component: MegaMenu,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MegaMenu>;

const triggers = [
  {
    id: 'product',
    label: 'Product',
    columns: [
      {
        heading: 'Workforce',
        items: [
          {
            id: 'employees',
            label: 'Employees',
            description: 'Manage all workers',
            icon: <Users className="h-5 w-5" />,
          },
          { id: 'teams', label: 'Teams', description: 'Organize into squads' },
          { id: 'roles', label: 'Roles & Permissions', description: 'RBP enforced' },
        ],
      },
      {
        heading: 'Analytics',
        items: [
          {
            id: 'reports',
            label: 'Reports',
            icon: <BarChart className="h-5 w-5" />,
            badge: <Badge variant="success">New</Badge>,
          },
          { id: 'dashboards', label: 'Custom dashboards', description: 'BentoGrid layouts' },
          { id: 'esports', label: 'Exports' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    columns: [
      {
        heading: 'About',
        items: [
          { id: 'about', label: 'About us', icon: <Globe className="h-5 w-5" /> },
          { id: 'careers', label: 'Careers', badge: <Badge>9 open</Badge> },
        ],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    columns: [
      {
        heading: 'Learn',
        items: [
          { id: 'docs', label: 'Documentation', icon: <Database className="h-5 w-5" /> },
          { id: 'guides', label: 'Guides' },
          { id: 'changelog', label: 'Changelog', badge: <Badge variant="warning">v0.4.7</Badge> },
        ],
      },
      {
        heading: 'Tools',
        items: [
          { id: 'api', label: 'API reference', icon: <Zap className="h-5 w-5" /> },
          { id: 'sdk', label: 'SDK' },
        ],
      },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <div className="border rounded-lg bg-background h-[450px]">
      <div className="border-b p-3 flex items-center gap-4">
        <span className="font-bold">heuresys</span>
        <MegaMenu triggers={triggers} />
      </div>
      <div className="p-6 text-sm text-neutral-500">
        Click a trigger to expand multi-column menu.
      </div>
    </div>
  ),
};
