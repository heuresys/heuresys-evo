import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { http, HttpResponse, delay } from 'msw';
import { DataTable } from './data-table';
import { Skeleton } from './skeleton';
import type { ColumnDef } from '@tanstack/react-table';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  tenant?: string;
}

const seed: Employee[] = [
  {
    id: '1',
    name: 'Mario Rossi',
    role: 'Engineer',
    email: 'mario@heuresys.com',
    tenant: 'Heuresys',
  },
  { id: '2', name: 'Lucia Bianchi', role: 'Designer', email: 'lucia@rtl.test', tenant: 'RTL Bank' },
  {
    id: '3',
    name: 'Hans Müller',
    role: 'Manager',
    email: 'hans@smartfood.test',
    tenant: 'SmartFood',
  },
  { id: '4', name: 'Yuki Tanaka', role: 'Director', email: 'yuki@econova.test', tenant: 'EcoNova' },
  {
    id: '5',
    name: 'Sofia Russo',
    role: 'Engineer',
    email: 'sofia@heuresys.com',
    tenant: 'Heuresys',
  },
];

const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'email', header: 'Email' },
];

const columnsWithTenant: ColumnDef<Employee>[] = [
  ...columns,
  { accessorKey: 'tenant', header: 'Tenant' },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable as never,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof DataTable<Employee, unknown>>;

export const Default: Story = {
  args: { columns: columns as never, data: seed as never, caption: 'Employee list' },
};

export const Empty: Story = {
  args: { columns: columns as never, data: [], emptyMessage: 'No employees yet.' },
};

export const ManyRows: Story = {
  args: {
    columns: columnsWithTenant as never,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Employee #${i + 1}`,
      role: ['Engineer', 'Designer', 'Manager', 'Director'][i % 4],
      email: `emp${i + 1}@example.com`,
      tenant: ['Heuresys', 'RTL Bank', 'SmartFood', 'EcoNova'][i % 4],
    })) as never,
    caption: '50 employees',
  },
};

// Loading state — fetch simulato
function FetchingDemo() {
  const [data, setData] = useState<Employee[] | null>(null);
  useEffect(() => {
    fetch('/api/employees')
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .catch(() => setData([]));
  }, []);
  if (data === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid grid-cols-3 gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        ))}
      </div>
    );
  }
  return <DataTable columns={columns as never} data={data as never} caption="Employees from API" />;
}
export const WithMockedFetch: Story = {
  render: () => <FetchingDemo />,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/employees', async () => {
          await delay(1500); // simulate latency, mostra skeleton
          return HttpResponse.json({ data: seed });
        }),
      ],
    },
    docs: {
      description: {
        story:
          'MSW intercept di `/api/employees` con 1.5s delay. Vedi skeleton → dati con animazione di fade.',
      },
    },
  },
};

// Errore di fetch
export const WithMockedError: Story = {
  render: () => <FetchingDemo />,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/employees', async () => {
          await delay(800);
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
    docs: {
      description: { story: 'MSW restituisce 500 — la table mostra empty state come fallback.' },
    },
  },
};
