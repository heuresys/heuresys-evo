import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Short: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Tenants', href: '/tenants' },
      { label: 'Heuresys', href: '/tenants/heuresys' },
      { label: 'Employees' },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Tenants', href: '/tenants' },
      { label: 'Heuresys', href: '/tenants/heuresys' },
      { label: 'Departments', href: '/tenants/heuresys/departments' },
      { label: 'Engineering', href: '/tenants/heuresys/departments/eng' },
      { label: 'Backend', href: '/tenants/heuresys/departments/eng/backend' },
      { label: 'Mario Rossi' },
    ],
    maxItems: 4,
  },
  parameters: {
    docs: {
      description: { story: 'maxItems=4 → primo + ultimi 3, con overflow ellipsis dropdown.' },
    },
  },
};

export const SinglePage: Story = { args: { items: [{ label: 'Dashboard' }] } };

export const WithCallbacks: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => console.log('go home') },
      { label: 'Settings', onClick: () => console.log('go settings') },
      { label: 'Billing' },
    ],
  },
};
