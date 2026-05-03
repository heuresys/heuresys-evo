import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from './theme-provider';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system">
      <div className="flex flex-col items-center gap-3">
        <ThemeToggle />
        <p className="text-xs text-neutral-500">Click to cycle: light → dark → system</p>
      </div>
    </ThemeProvider>
  ),
};
