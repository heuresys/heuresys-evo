import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink } from './skip-link';

const meta: Meta<typeof SkipLink> = {
  title: 'A11y/SkipLink',
  component: SkipLink,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[200px] border rounded p-4">
      <SkipLink href="#main" />
      <p className="text-sm text-neutral-500">
        Press Tab to focus the SkipLink (visually hidden until focused).
      </p>
      <main id="main" className="mt-12 p-4 border rounded bg-card">
        <p className="text-sm">Main content target</p>
      </main>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Class `sr-only` finché non è focused. Pattern WCAG 2.4.1.' } },
  },
};
