import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxMarkdownDoc } from './_components';

const meta: Meta<typeof UxMarkdownDoc> = {
  title: 'Brand/99-Samples/Frameworks (rohitg00)',
  component: UxMarkdownDoc,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof UxMarkdownDoc>;

export const EditorialLinear: Story = {
  args: { src: '99-samples/rohitg00-frameworks/editorial/linear.md' },
};

export const EditorialVercel: Story = {
  args: { src: '99-samples/rohitg00-frameworks/editorial/vercel.md' },
};

export const DataDenseClickhouse: Story = {
  args: { src: '99-samples/rohitg00-frameworks/data-dense/clickhouse.md' },
};

export const DataDensePosthog: Story = {
  args: { src: '99-samples/rohitg00-frameworks/data-dense/posthog.md' },
};

export const WarmClaude: Story = {
  args: { src: '99-samples/rohitg00-frameworks/warm/claude.md' },
};

export const GlassApple: Story = {
  args: { src: '99-samples/rohitg00-frameworks/glass/apple.md' },
};

export const CinematicRunway: Story = {
  args: { src: '99-samples/rohitg00-frameworks/cinematic/runway.md' },
};

export const TerminalOllama: Story = {
  args: { src: '99-samples/rohitg00-frameworks/terminal/ollama.md' },
};
