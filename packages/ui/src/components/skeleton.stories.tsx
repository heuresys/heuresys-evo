import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Skeleton, Spinner } from './skeleton';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

const meta: Meta = {
  title: 'Components/Skeleton',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const CardLoader: Story = {
  name: 'Card loader',
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-32 w-72" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  ),
};

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => <Spinner className="h-8 w-8 text-primary" />,
};

// Recipe: lista che mostra skeleton per N secondi poi popola
function ListLoadingDemo() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="space-y-2 w-[400px]">
      {loaded
        ? ['Mario Rossi', 'Lucia Bianchi', 'Hans Müller', 'Yuki Tanaka'].map((n) => (
            <div key={n} className="flex items-center gap-3 p-2 border rounded animate-in fade-in">
              <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-sm font-medium">
                {n
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{n}</p>
                <p className="text-xs text-neutral-500">Engineer</p>
              </div>
            </div>
          ))
        : Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 border rounded">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
    </div>
  );
}
export const ListLoading: Story = {
  render: () => <ListLoadingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Skeleton per 2.5s poi sostituito da contenuto con `animate-in fade-in`. Pattern UX standard per fetch.',
      },
    },
  },
};

export const TableLoader: Story = {
  name: 'Table loader',
  render: () => (
    <div className="border rounded-lg overflow-hidden w-[500px]">
      <div className="grid grid-cols-3 gap-4 p-3 border-b bg-neutral-50">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  ),
};

export const CardsGrid: Story = {
  name: 'Cards grid loader',
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
