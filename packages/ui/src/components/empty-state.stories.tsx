import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox, Search, Database, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { EmptyState } from './empty-state';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <Inbox className="h-10 w-10" aria-hidden="true" />,
    title: 'No messages',
    description: 'When you receive new messages they will appear here.',
    action: <Button>Compose new</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <Search className="h-10 w-10" aria-hidden="true" />,
    title: 'No results',
    description: 'Try a different keyword or remove some filters.',
    action: <Button variant="outline">Clear filters</Button>,
  },
};

export const NoData: Story = {
  args: {
    icon: <Database className="h-10 w-10" aria-hidden="true" />,
    title: 'No data yet',
    description: 'Connect a data source to start populating this view.',
    action: <Button>Connect source</Button>,
  },
};

export const FirstTimeOnboarding: Story = {
  args: {
    icon: <Sparkles className="h-10 w-10" aria-hidden="true" />,
    title: 'Welcome aboard!',
    description: 'Set up your first project to unlock the dashboard.',
    action: <Button>Start onboarding</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    icon: <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />,
    title: 'Failed to load',
    description: 'We could not reach the API. Please retry in a few seconds.',
    action: <Button variant="outline">Retry</Button>,
  },
};

export const FilteredOut: Story = {
  args: {
    icon: <Filter className="h-10 w-10" aria-hidden="true" />,
    title: 'All items filtered out',
    description: 'Your filter combination matches 0 records. Adjust filters to see results.',
    action: <Button variant="ghost">Reset</Button>,
  },
};
