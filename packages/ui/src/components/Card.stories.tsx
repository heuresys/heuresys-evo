import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './badge';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Workforce snapshot</CardTitle>
        <CardDescription>Total headcount across active tenants.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">270</p>
        <p className="text-sm text-neutral-500">+12 vs last month</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View details
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Sync status</CardTitle>
        <CardDescription>All replicas aligned with leader.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

// Live metric con update ogni secondo
function LiveMetricCard() {
  const [val, setVal] = useState(270);
  const [trend, setTrend] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 7) - 3;
      setVal((v) => Math.max(0, v + delta));
      setTrend(delta);
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <Card className="w-[320px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Live, refresh 1.5s</CardDescription>
        </div>
        <Badge variant={trend >= 0 ? 'success' : 'destructive'}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold tabular-nums transition-all">{val}</p>
      </CardContent>
    </Card>
  );
}
export const LiveMetric: Story = {
  render: () => <LiveMetricCard />,
  parameters: {
    docs: { description: { story: 'Card con valore che cambia ogni 1.5s, badge trend live.' } },
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
      {[
        { t: 'Tenants', v: '4', d: 'Heuresys, RTL Bank, SmartFood, EcoNova' },
        { t: 'Employees', v: '1,247', d: 'Across all tenants' },
        { t: 'Functional areas', v: '33', d: 'RBP enforced' },
      ].map((c) => (
        <Card key={c.t}>
          <CardHeader>
            <CardTitle>{c.t}</CardTitle>
            <CardDescription className="text-xs">{c.d}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{c.v}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Recipe dashboard: 3 KPI cards in grid responsive.' } },
  },
};
