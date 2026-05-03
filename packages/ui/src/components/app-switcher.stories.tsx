import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Briefcase,
  Users,
  BarChart,
  MessageSquare,
  FileText,
  Calendar,
  Mail,
  Database,
  Settings,
} from 'lucide-react';
import { AppSwitcher } from './app-switcher';

const meta: Meta<typeof AppSwitcher> = {
  title: 'Components/AppSwitcher',
  component: AppSwitcher,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppSwitcher>;

const apps = [
  {
    id: 'workforce',
    name: 'Workforce',
    icon: <Users className="h-5 w-5" />,
    description: 'Employees & teams',
  },
  {
    id: 'tenants',
    name: 'Tenants',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Multi-tenant admin',
  },
  { id: 'analytics', name: 'Analytics', icon: <BarChart className="h-5 w-5" /> },
  { id: 'messages', name: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'docs', name: 'Docs', icon: <FileText className="h-5 w-5" /> },
  { id: 'calendar', name: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
  { id: 'mail', name: 'Mail', icon: <Mail className="h-5 w-5" /> },
  { id: 'db', name: 'Database', icon: <Database className="h-5 w-5" /> },
  { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export const Default: Story = { args: { apps } };
export const ThreeApps: Story = { args: { apps: apps.slice(0, 3) } };
export const ManyApps: Story = {
  args: {
    apps: [
      ...apps,
      ...apps.slice(0, 6).map((a, i) => ({ ...a, id: a.id + '-x' + i, name: a.name + ' Plus' })),
    ],
  },
};
