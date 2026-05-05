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
    title: 'Login (base) — formal · no-chrome fullscreen · M365 + Google Workspace SSO · L25 logo',
    height: H,
  },
};

export const AuthLoginAurora: Story = {
  args: {
    src: '06-mockups/auth/login-aurora.html',
    title:
      'Login (Aurora) — glassmorphism · animated mesh gradient · floating dots · shimmer wordmark',
    height: H,
  },
};

export const AuthLoginSplit: Story = {
  args: {
    src: '06-mockups/auth/login-split.html',
    title:
      'Login (Split Cinematic) — 50/50 brand showcase + form aerea · KG topology animata · trust badges · editorial typography',
    height: H,
  },
};

export const AuthLoginPlayful: Story = {
  args: {
    src: '06-mockups/auth/login-playful.html',
    title:
      'Login (Magnetic Playful) — geometric pastel shapes · magnetic button hover · wordmark mouse parallax · animated underline focus',
    height: H,
  },
};
