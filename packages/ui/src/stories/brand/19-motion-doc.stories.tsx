import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Motion/Doc',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const MotionFinal: Story = {
  args: { src: '04-motion-language/motion-final.md' },
};
