import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?u=1" alt="User" />
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>LB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>HM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="h-6 w-6">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      {['MR', 'LB', 'HM', 'YT', 'SR', 'AR', 'PC'].map((i) => (
        <Avatar key={i} className="ring-2 ring-background">
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
  parameters: { docs: { description: { story: 'AvatarGroup con max=4 → mostra +3 overflow.' } } },
};
