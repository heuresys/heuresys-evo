import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Aesthetic/Docs',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const HeuresysCurrentStyle: Story = {
  args: { src: '02-aesthetic/heuresys-com-current-style.md' },
};

export const Moodboard: Story = {
  args: { src: '02-aesthetic/moodboard.md' },
};

export const DirectionFinal: Story = {
  args: { src: '02-aesthetic/direction-final.md' },
};

export const LogoStandard: Story = {
  args: { src: '02-aesthetic/logo-standard.md' },
};
