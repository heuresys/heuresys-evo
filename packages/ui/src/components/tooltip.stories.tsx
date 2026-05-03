import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button } from './Button';
import { Info, Settings, HelpCircle } from 'lucide-react';

const meta: Meta<typeof TooltipProvider> = {
  title: 'Components/Tooltip',
  component: TooltipProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TooltipProvider>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content with portal</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Info</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Help</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-8 p-12">
        {['top', 'right', 'bottom', 'left'].map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side as 'top' | 'right' | 'bottom' | 'left'}>
              Side: {side}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
