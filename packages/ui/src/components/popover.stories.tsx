import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './Button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <p className="font-medium text-sm">Popover content</p>
          <p className="text-sm text-neutral-500">
            Renders in portal, auto-positions vs trigger. Click outside to close.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Edit profile</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span>Display name</span>
            <input className="rounded-md border px-2 py-1.5 text-sm" defaultValue="Mario Rossi" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Title</span>
            <input
              className="rounded-md border px-2 py-1.5 text-sm"
              defaultValue="Senior Engineer"
            />
          </label>
          <Button size="sm">Save</Button>
        </form>
      </PopoverContent>
    </Popover>
  ),
};

export const FilterPicker: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filter (3)</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Filter by</p>
          {['Status: Active', 'Role: Manager', 'Tenant: Heuresys'].map((f) => (
            <label key={f} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> {f}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
};
