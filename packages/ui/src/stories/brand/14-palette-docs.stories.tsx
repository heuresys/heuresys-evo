import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Visual Identity/Palette/Docs',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const PaletteFinal: Story = {
  args: { src: '03-visual-identity/color/palette-final.md' },
};

export const PaletteExplorations: Story = {
  args: { src: '03-visual-identity/color/palette-explorations.md' },
};
