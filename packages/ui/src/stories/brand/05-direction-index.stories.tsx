import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Aesthetic/Direction Explorations/Index',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

export const NavigationHub: Story = {
  args: {
    src: '02-aesthetic/direction-explorations/index.html',
    title: 'Direction explorations index',
    height: '90vh',
  },
};
