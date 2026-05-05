import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Other Surfaces (Phase 10)',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '92vh';

export const AuthLogin: Story = {
  args: {
    src: '06-mockups/auth/login.html',
    title:
      'Login — no-chrome fullscreen · tenant resolver mockup · M365 + Google Workspace SSO · L25 logo',
    height: H,
  },
};
