import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within, expect } from 'storybook/test';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog';
import { Button } from './Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

const ConfirmDialog = ({ destructive = false }: { destructive?: boolean }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant={destructive ? 'destructive' : 'default'}>
        {destructive ? 'Delete record' : 'Open dialog'}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{destructive ? 'Delete record?' : 'Confirm action'}</DialogTitle>
        <DialogDescription>
          {destructive
            ? 'This action cannot be undone. The record will be permanently removed.'
            : 'This will replace the existing record.'}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant={destructive ? 'destructive' : 'default'}>
          {destructive ? 'Delete' : 'Confirm'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Default: Story = { render: () => <ConfirmDialog /> };
export const DestructiveConfirm: Story = { render: () => <ConfirmDialog destructive /> };

// Auto-open via play(): apre il dialog e verifica che sia visibile
export const InteractiveOpen: Story = {
  render: () => <ConfirmDialog />,
  play: async ({ canvasElement }) => {
    // Dialog renders in portal → use document.body scope
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /open dialog/i }));
    // Title ora visibile in body
    await expect(await within(document.body).findByText(/confirm action/i)).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click trigger automatico → asserisce title visibile in portal. Vedi step Interactions.',
      },
    },
  },
};

// Form dentro dialog (recipe comune)
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New employee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
          <DialogDescription>Compilare i campi required per creare il record.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-3 py-2">
          <label className="grid gap-1 text-sm">
            <span>Name</span>
            <input className="rounded-md border px-3 py-1.5" placeholder="Mario Rossi" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Email</span>
            <input
              type="email"
              className="rounded-md border px-3 py-1.5"
              placeholder="mario@example.com"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Role</span>
            <select className="rounded-md border px-3 py-1.5">
              <option>Employee</option>
              <option>Manager</option>
              <option>Director</option>
            </select>
          </label>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
