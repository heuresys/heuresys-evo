import type { Meta, StoryObj } from '@storybook/react-vite';
import { BentoGrid, BentoCell } from './bento-grid';

const meta: Meta<typeof BentoGrid> = {
  title: 'Components/BentoGrid',
  component: BentoGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BentoGrid>;

const Cell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-lg bg-primary/5 border border-primary/20 p-4 flex items-center justify-center text-sm font-medium ${className}`}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <BentoGrid columns={4}>
      <BentoCell colSpan={2} rowSpan={2}>
        <Cell className="h-full w-full">Big (2x2)</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">A</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">B</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">C</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">D</Cell>
      </BentoCell>
      <BentoCell colSpan={2}>
        <Cell className="h-full w-full">Wide (2x1)</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">E</Cell>
      </BentoCell>
      <BentoCell>
        <Cell className="h-full w-full">F</Cell>
      </BentoCell>
    </BentoGrid>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <BentoGrid columns={6} gap="lg">
      <BentoCell colSpan={2} rowSpan={2}>
        <Cell className="h-full w-full bg-blue-500/10 border-blue-500/30">Hero / Welcome</Cell>
      </BentoCell>
      <BentoCell colSpan={2}>
        <Cell className="h-full w-full bg-emerald-500/10 border-emerald-500/30">KPI 1</Cell>
      </BentoCell>
      <BentoCell colSpan={2}>
        <Cell className="h-full w-full bg-amber-500/10 border-amber-500/30">KPI 2</Cell>
      </BentoCell>
      <BentoCell colSpan={4}>
        <Cell className="h-full w-full bg-purple-500/10 border-purple-500/30">Wide chart</Cell>
      </BentoCell>
      <BentoCell colSpan={3}>
        <Cell className="h-full w-full">Activity feed</Cell>
      </BentoCell>
      <BentoCell colSpan={3}>
        <Cell className="h-full w-full">Tasks list</Cell>
      </BentoCell>
    </BentoGrid>
  ),
  parameters: {
    docs: {
      description: { story: 'Recipe: layout dashboard tipo Apple with mixed colSpan/rowSpan.' },
    },
  },
};

export const Tight: Story = {
  render: () => (
    <BentoGrid columns={6} gap="sm" rowHeight="60px">
      {Array.from({ length: 18 }, (_, i) => (
        <BentoCell key={i}>
          <Cell className="h-full w-full text-xs">{i + 1}</Cell>
        </BentoCell>
      ))}
    </BentoGrid>
  ),
};
