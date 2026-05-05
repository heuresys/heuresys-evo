import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/99-Samples/README',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const Overview: Story = {
  args: { src: '99-samples/README.md' },
};
