import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/99-Samples/Prompts (rohitg00)',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const FamilyPicker: Story = {
  args: { src: '99-samples/rohitg00-prompts/family-picker.md' },
};

export const BrandToDesignMd: Story = {
  args: { src: '99-samples/rohitg00-prompts/brand-to-design-md.md' },
};

export const AuditLiveSite: Story = {
  args: { src: '99-samples/rohitg00-prompts/audit-live-site.md' },
};

export const ThreeDesignerDebate: Story = {
  args: { src: '99-samples/rohitg00-prompts/3-designer-debate.md' },
};

export const RemixTwoBrands: Story = {
  args: { src: '99-samples/rohitg00-prompts/remix-two-brands.md' },
};

export const BreakDefaultAesthetic: Story = {
  args: { src: '99-samples/rohitg00-prompts/break-default-aesthetic.md' },
};
