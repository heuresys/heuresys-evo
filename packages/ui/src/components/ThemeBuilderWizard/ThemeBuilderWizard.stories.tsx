import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeBuilderWizard } from './ThemeBuilderWizard';

const meta: Meta<typeof ThemeBuilderWizard> = {
  title: 'ThemeBuilderWizard/ThemeBuilderWizard',
  component: ThemeBuilderWizard,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThemeBuilderWizard>;

export const Default: Story = {
  render: () => (
    <div className="p-6 max-w-6xl mx-auto">
      <ThemeBuilderWizard />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '10-step OKLCH wizard per generare design tokens. Live in /brand-studio (SUPERUSER only).',
      },
    },
  },
};
