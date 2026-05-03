import type { Meta, StoryObj } from '@storybook/react-vite';
import { Admonition } from './admonition';

const meta: Meta<typeof Admonition> = {
  title: 'Markdown/Admonition',
  component: Admonition,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Admonition>;

export const Info: Story = {
  args: { variant: 'info', title: 'Heads up', children: 'This area is informational.' as never },
};
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Caution',
    children: 'Read carefully before proceeding.' as never,
  },
};
export const Tip: Story = {
  args: { variant: 'tip', title: 'Pro tip', children: 'Use Cmd+K for quick search.' as never },
};
export const Danger: Story = {
  args: { variant: 'danger', title: 'Danger', children: 'This action is irreversible.' as never },
};
export const Note: Story = {
  args: { variant: 'note', children: 'Plain note without title.' as never },
};
export const Quote: Story = {
  args: {
    variant: 'quote',
    children: '"The best architecture is one that survives change."' as never,
  },
};

export const All: Story = {
  render: () => (
    <div className="space-y-3 max-w-prose">
      <Admonition variant="info" title="Info">
        Info content
      </Admonition>
      <Admonition variant="warning" title="Warning">
        Warning content
      </Admonition>
      <Admonition variant="tip" title="Tip">
        Tip content
      </Admonition>
      <Admonition variant="danger" title="Danger">
        Danger content
      </Admonition>
      <Admonition variant="note" title="Note">
        Note content
      </Admonition>
      <Admonition variant="quote">Quote content</Admonition>
    </div>
  ),
};
