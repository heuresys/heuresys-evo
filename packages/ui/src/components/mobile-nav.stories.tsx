import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { MobileBottomNav } from './mobile-nav';

const meta: Meta<typeof MobileBottomNav> = {
  title: 'Components/MobileNav',
  component: MobileBottomNav,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MobileBottomNav>;

const items = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" />, active: true },
  { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" /> },
  { id: 'new', label: 'New', icon: <Plus className="h-5 w-5" /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell className="h-5 w-5" />, badge: 7 },
  { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

export const Default: Story = {
  render: () => (
    <div className="md:hidden h-screen bg-muted/20 p-4">
      <p className="text-sm text-neutral-500 text-center">
        Mobile content. Bar fixed at bottom (visible solo su md:hidden).
      </p>
      <MobileBottomNav items={items} />
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <div className="md:hidden h-screen bg-muted/20">
      <MobileBottomNav
        items={items.map((it) => ({ ...it, badge: Math.floor(Math.random() * 150) }))}
      />
    </div>
  ),
};
