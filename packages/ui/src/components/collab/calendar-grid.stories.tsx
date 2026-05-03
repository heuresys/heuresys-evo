import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CalendarGrid, type CalendarEvent } from './calendar-grid';

const meta: Meta<typeof CalendarGrid> = {
  title: 'Collab/CalendarGrid',
  component: CalendarGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CalendarGrid>;

const events: CalendarEvent[] = [
  { id: '1', date: '2026-05-03', title: 'Sprint planning', tone: 'primary' },
  { id: '2', date: '2026-05-08', title: 'PR review', tone: 'success' },
  { id: '3', date: '2026-05-15', title: 'Deadline', tone: 'destructive' },
  { id: '4', date: '2026-05-22', title: 'Demo', tone: 'warning' },
];

function Demo() {
  const [selected, setSelected] = useState('2026-05-03');
  return (
    <CalendarGrid
      month={4}
      year={2026}
      events={events}
      selected={selected}
      onSelectDate={setSelected}
      className="w-[400px]"
    />
  );
}

export const May2026: Story = { render: () => <Demo /> };
export const NoEvents: Story = { args: { month: 4, year: 2026, className: 'w-[400px]' } };
