import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/99-Samples/Recipes',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const TokenBudgetClaudeDesign: Story = {
  args: { src: '99-samples/rohitg00-recipes/token-budget-claude-design.md' },
};
