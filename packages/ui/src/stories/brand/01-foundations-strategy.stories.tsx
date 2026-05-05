import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/Foundations/Strategy',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const BrandFoundations: Story = {
  args: { src: '01-strategy/brand-foundations.md' },
};

export const VoiceAndTone: Story = {
  args: { src: '01-strategy/voice-and-tone.md' },
};

export const AudiencePositioning: Story = {
  args: { src: '01-strategy/audience-positioning.md' },
};

export const DashboardArchitecture: Story = {
  args: { src: '01-strategy/dashboard-architecture.md' },
};
