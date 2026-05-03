import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, within, expect } from 'storybook/test';
import { CommandPalette } from './command-palette';
import { Button } from './Button';
import { Search, FileText, Settings, Users, Home, Database } from 'lucide-react';

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

function PaletteDemo({ openOnMount = false }: { openOnMount?: boolean }) {
  const [open, setOpen] = useState(openOnMount);
  return (
    <div className="space-y-3">
      <Button onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" /> Open palette (or ⌘K)
      </Button>
      <p className="text-xs text-neutral-500">Type to filter, ↑↓ to navigate, Enter to select</p>
      <CommandPalette open={open} onOpenChange={setOpen} placeholder="Search anything…">
        <CommandPalette.Group heading="Navigate">
          <CommandPalette.Item
            onSelect={() => {
              console.log('go: dashboard');
              setOpen(false);
            }}
          >
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </CommandPalette.Item>
          <CommandPalette.Item
            onSelect={() => {
              console.log('go: employees');
              setOpen(false);
            }}
          >
            <Users className="mr-2 h-4 w-4" /> Employees
          </CommandPalette.Item>
          <CommandPalette.Item
            onSelect={() => {
              console.log('go: tenants');
              setOpen(false);
            }}
          >
            <Database className="mr-2 h-4 w-4" /> Tenants
          </CommandPalette.Item>
          <CommandPalette.Item
            onSelect={() => {
              console.log('go: settings');
              setOpen(false);
            }}
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Group heading="Quick actions">
          <CommandPalette.Item
            onSelect={() => {
              console.log('action: new employee');
              setOpen(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" /> New employee
          </CommandPalette.Item>
          <CommandPalette.Item
            onSelect={() => {
              console.log('action: export csv');
              setOpen(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" /> Export CSV
          </CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette>
    </div>
  );
}

export const Default: Story = { render: () => <PaletteDemo /> };

export const PreOpened: Story = {
  render: () => <PaletteDemo openOnMount />,
  parameters: {
    docs: {
      description: {
        story: 'Aperto al mount per vedere immediatamente il contenuto + animazione fade-in.',
      },
    },
  },
};

export const InteractiveSearch: Story = {
  render: () => <PaletteDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /open palette/i }));
    const input = await within(document.body).findByPlaceholderText(/search anything/i);
    await userEvent.type(input, 'emp', { delay: 100 });
    await expect(within(document.body).getByText(/employees/i)).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: 'play() apre il palette + scrive "emp" → filtra a "Employees" + "New employee".',
      },
    },
  },
};
