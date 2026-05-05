import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Visual Identity/Typography/Doc',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const TypographyFinal: Story = {
  args: { src: '03-visual-identity/typography/typography-final.md' },
};

export const LogoFinalReadme: Story = {
  args: { src: '03-visual-identity/logo/final/README.md' },
};
