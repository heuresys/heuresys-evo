import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterBar } from './filter-bar';
import { Button } from './Button';

const meta: Meta<typeof FilterBar> = {
  title: 'Components/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

function Demo({ withChips = false, withRight = false }) {
  const [search, setSearch] = useState('');
  const [chipsCount, setChipsCount] = useState(withChips ? 3 : 0);
  const chips = Array.from({ length: chipsCount }, (_, i) => ({
    id: String(i),
    label: ['Status', 'Role', 'Tenant'][i],
    value: ['Active', 'Manager', 'Heuresys'][i],
    onRemove: () => setChipsCount((c) => Math.max(0, c - 1)),
  }));
  return (
    <FilterBar
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search employees…"
      chips={chips}
      onClearAll={() => setChipsCount(0)}
      rightSlot={withRight ? <Button size="sm">Export</Button> : undefined}
    />
  );
}

export const Default: Story = { render: () => <Demo /> };
export const WithChips: Story = { render: () => <Demo withChips /> };
export const Full: Story = { render: () => <Demo withChips withRight /> };
