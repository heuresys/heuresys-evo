import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/99-Samples/Voltagent DESIGN.md',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const Apple: Story = {
  args: { src: '99-samples/voltagent-design-md/apple.DESIGN.md' },
};
export const Claude: Story = {
  args: { src: '99-samples/voltagent-design-md/claude.DESIGN.md' },
};
export const Clickhouse: Story = {
  args: { src: '99-samples/voltagent-design-md/clickhouse.DESIGN.md' },
};
export const Hashicorp: Story = {
  args: { src: '99-samples/voltagent-design-md/hashicorp.DESIGN.md' },
};
export const Linear: Story = {
  args: { src: '99-samples/voltagent-design-md/linear.DESIGN.md' },
};
export const Notion: Story = {
  args: { src: '99-samples/voltagent-design-md/notion.DESIGN.md' },
};
export const Posthog: Story = {
  args: { src: '99-samples/voltagent-design-md/posthog.DESIGN.md' },
};
export const Sentry: Story = {
  args: { src: '99-samples/voltagent-design-md/sentry.DESIGN.md' },
};
export const Stripe: Story = {
  args: { src: '99-samples/voltagent-design-md/stripe.DESIGN.md' },
};
export const Supabase: Story = {
  args: { src: '99-samples/voltagent-design-md/supabase.DESIGN.md' },
};
export const Vercel: Story = {
  args: { src: '99-samples/voltagent-design-md/vercel.DESIGN.md' },
};
export const Wired: Story = {
  args: { src: '99-samples/voltagent-design-md/wired.DESIGN.md' },
};
