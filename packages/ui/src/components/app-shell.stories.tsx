import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Users, Settings, Database, BarChart, MessageSquare } from 'lucide-react';
import { AppShell } from './app-shell';
import { Avatar, AvatarFallback } from './avatar';

const meta: Meta<typeof AppShell> = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppShell>;

const nav = [
  { id: 'home', label: 'Dashboard', icon: <Home className="h-4 w-4" />, active: true },
  { id: 'employees', label: 'Employees', icon: <Users className="h-4 w-4" />, badge: '1.2k' },
  { id: 'tenants', label: 'Tenants', icon: <Database className="h-4 w-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart className="h-4 w-4" /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" />, badge: '7' },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export const Default: Story = {
  args: {
    brand: <span className="font-bold">Heuresys evo</span>,
    nav,
    topbarRight: (
      <Avatar>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
    ),
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to the dashboard</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Sidebar collapsible (icon button top), mobile-responsive overlay drawer.
        </p>
      </div>
    ),
  },
};

export const Collapsed: Story = {
  args: {
    ...{
      brand: <span className="font-bold">H</span>,
      nav,
      collapsedDefault: true,
      children: <div className="p-6">Sidebar starts collapsed.</div>,
    },
  },
};
