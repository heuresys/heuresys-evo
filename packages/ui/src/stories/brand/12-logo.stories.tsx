import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxAsset } from './_components';

const meta: Meta<typeof UxAsset> = {
  title: 'Brand/Visual Identity/Logo',
  component: UxAsset,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof UxAsset>;

export const Wordmark: Story = {
  args: {
    src: '03-visual-identity/logo/final/heuresys-wordmark.svg',
    alt: 'Heuresys wordmark canonical (Exo 2 700 + y 500 purple)',
    background: '#0a0e1a',
    maxHeight: 160,
  },
};

export const WordmarkMonochromeDark: Story = {
  args: {
    src: '03-visual-identity/logo/final/heuresys-wordmark-monochrome-dark.svg',
    alt: 'Heuresys wordmark monochrome (dark surface usage)',
    background: '#0a0e1a',
    maxHeight: 160,
  },
};

export const WordmarkMonochromeLight: Story = {
  args: {
    src: '03-visual-identity/logo/final/heuresys-wordmark-monochrome-light.svg',
    alt: 'Heuresys wordmark monochrome (light surface usage)',
    background: '#fafaf7',
    maxHeight: 160,
  },
};

export const Mark: Story = {
  args: {
    src: '03-visual-identity/logo/final/heuresys-mark.svg',
    alt: 'Heuresys mark — only "y" isolated',
    background: '#0a0e1a',
    maxHeight: 200,
  },
};

export const Favicon: Story = {
  args: {
    src: '03-visual-identity/logo/final/favicon.svg',
    alt: 'Heuresys favicon — y on dark square',
    background: '#fafaf7',
    maxHeight: 128,
  },
};

export const OgImageTemplate: Story = {
  args: {
    src: '03-visual-identity/logo/final/og-image-template.svg',
    alt: 'OG image template 1200×630 social preview',
    background: '#0a0e1a',
    maxHeight: 400,
  },
};
