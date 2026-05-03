import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownView } from './markdown-view';

const meta: Meta<typeof MarkdownView> = {
  title: 'Markdown/MarkdownView',
  component: MarkdownView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MarkdownView>;

const sample = `# Heuresys evo

Multi-tenant SaaS platform for **Organizational Intelligence**.

## Features
- Multi-tenant by design (P1)
- RBP enforced (P3)
- 33 functional areas + 47 PET mapping

## Code
\`\`\`ts
const tenant = await prisma.tenant.findFirst({ where: { id: tenantId } });
\`\`\`

## Table
| Tenant | Employees | Status |
|---|---|---|
| Heuresys | 540 | Active |
| RTL Bank | 320 | Active |
| SmartFood | 180 | Active |

> Quote: "Architecture is decisions you wish you could change later."

- [x] Setup repo
- [x] Migrate schema
- [ ] Deploy v1
`;

export const Default: Story = { args: { content: sample } };
export const Short: Story = {
  args: { content: '## Hello\n\nMarkdown rendered with **GFM**, _italic_, and `code`.' },
};
