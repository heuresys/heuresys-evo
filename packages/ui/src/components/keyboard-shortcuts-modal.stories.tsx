import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal';
import { Button } from './Button';

const meta: Meta<typeof KeyboardShortcutsModal> = {
  title: 'Components/KeyboardShortcutsModal',
  component: KeyboardShortcutsModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof KeyboardShortcutsModal>;

const groups = [
  {
    heading: 'Navigation',
    shortcuts: [
      { keys: ['⌘', 'K'], label: 'Command palette' },
      { keys: ['G', 'D'], label: 'Go to dashboard' },
      { keys: ['G', 'E'], label: 'Go to employees' },
      { keys: ['?'], label: 'Show shortcuts' },
    ],
  },
  {
    heading: 'Editing',
    shortcuts: [
      { keys: ['⌘', 'S'], label: 'Save' },
      { keys: ['⌘', 'Z'], label: 'Undo' },
      { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
      { keys: ['⌘', '/'], label: 'Toggle comment' },
    ],
  },
];

function Demo({ openInitial = false }: { openInitial?: boolean }) {
  const [open, setOpen] = useState(openInitial);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show shortcuts (?)</Button>
      <KeyboardShortcutsModal groups={groups} open={open} onOpenChange={setOpen} />
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Open: Story = { render: () => <Demo openInitial /> };
