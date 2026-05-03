import type { Meta, StoryObj } from '@storybook/react-vite';
import { NeumorphicCard } from './neumorphic-card';

const meta: Meta<typeof NeumorphicCard> = {
  title: 'Components/NeumorphicCard',
  component: NeumorphicCard,
  parameters: { layout: 'padded', backgrounds: { default: 'paper' } },
  tags: ['autodocs'],
  argTypes: { elevation: { control: 'select', options: ['raised', 'pressed', 'flat'] } },
};
export default meta;
type Story = StoryObj<typeof NeumorphicCard>;

export const Raised: Story = {
  args: {
    elevation: 'raised',
    className: 'w-[280px]',
    children: (<div className="text-sm">Raised elevation — soft outer shadow.</div>) as never,
  },
};
export const Pressed: Story = {
  args: {
    elevation: 'pressed',
    className: 'w-[280px]',
    children: (<div className="text-sm">Pressed — inset shadow.</div>) as never,
  },
};
export const Flat: Story = {
  args: {
    elevation: 'flat',
    className: 'w-[280px]',
    children: (<div className="text-sm">Flat — no shadow.</div>) as never,
  },
};

export const Comparison: Story = {
  render: () => (
    <div className="flex gap-4">
      <NeumorphicCard elevation="raised" className="w-[180px]">
        <p className="text-sm font-medium">Raised</p>
      </NeumorphicCard>
      <NeumorphicCard elevation="pressed" className="w-[180px]">
        <p className="text-sm font-medium">Pressed</p>
      </NeumorphicCard>
      <NeumorphicCard elevation="flat" className="w-[180px]">
        <p className="text-sm font-medium">Flat</p>
      </NeumorphicCard>
    </div>
  ),
};
