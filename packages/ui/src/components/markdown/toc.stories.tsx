import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableOfContents } from './toc';

const meta: Meta<typeof TableOfContents> = {
  title: 'Markdown/Toc',
  component: TableOfContents,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TableOfContents>;

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-[200px_1fr] gap-6">
      <aside className="sticky top-4">
        <p className="text-xs font-semibold uppercase mb-2 text-neutral-500">On this page</p>
        <TableOfContents containerSelector="#story-article" />
      </aside>
      <article id="story-article" className="prose prose-sm max-w-none space-y-4">
        <h1>Heuresys Architecture</h1>
        <h2>Stack overview</h2>
        <p>Lorem ipsum.</p>
        <h2>Multi-tenant</h2>
        <p>P1 principle.</p>
        <h3>tenantId</h3>
        <p>On every query.</p>
        <h3>RLS policies</h3>
        <p>DB-level enforcement.</p>
        <h2>RBP</h2>
        <p>Role-based permissions.</p>
        <h2>Audit log</h2>
        <p>P4 principle.</p>
      </article>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Auto-genera TOC da headings nell'article. Scroll-spy active highlight.",
      },
    },
  },
};
