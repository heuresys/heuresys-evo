import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Icon Libraries',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

export const Showcase: Story = {
  args: {
    src: '02-aesthetic/icon-libraries-showcase.html',
    title: 'Icon libraries showcase',
    height: '90vh',
  },
};
