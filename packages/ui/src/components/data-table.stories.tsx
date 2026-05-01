import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './data-table';
import type { ColumnDef } from '@tanstack/react-table';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

const data: Employee[] = [
  { id: '1', name: 'Mario Rossi', role: 'Engineer', email: 'mario@example.com' },
  { id: '2', name: 'Lucia Bianchi', role: 'Designer', email: 'lucia@example.com' },
  { id: '3', name: 'Hans Müller', role: 'Manager', email: 'hans@example.com' },
];

const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'email', header: 'Email' },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable as never,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof DataTable<Employee, unknown>>;

export const Default: Story = {
  args: { columns: columns as never, data: data as never, caption: 'Employee list' },
};

export const Empty: Story = {
  args: { columns: columns as never, data: [], emptyMessage: 'No employees yet.' },
};
