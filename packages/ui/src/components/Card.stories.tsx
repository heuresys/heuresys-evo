import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
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
        <Button variant="outline" size="sm">View details</Button>
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
