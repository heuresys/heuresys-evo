import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, useTheme } from './theme-provider';
import { Button } from './Button';

const meta: Meta<typeof ThemeProvider> = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThemeProvider>;

function ThemeReader() {
  const { theme, resolved, setTheme } = useTheme();
  return (
    <div className="space-y-3 p-4 border rounded">
      <p className="text-sm">
        theme = <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{theme}</code>
      </p>
      <p className="text-sm">
        resolved = <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{resolved}</code>
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setTheme('light')}>
          light
        </Button>
        <Button size="sm" variant="outline" onClick={() => setTheme('dark')}>
          dark
        </Button>
        <Button size="sm" variant="outline" onClick={() => setTheme('system')}>
          system
        </Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system">
      <ThemeReader />
    </ThemeProvider>
  ),
};

export const StartLight: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light">
      <ThemeReader />
    </ThemeProvider>
  ),
};
