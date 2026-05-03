import type { Meta, StoryObj } from '@storybook/react-vite';
import { MermaidDiagram } from './mermaid-diagram';

const meta: Meta<typeof MermaidDiagram> = {
  title: 'Markdown/MermaidDiagram',
  component: MermaidDiagram,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MermaidDiagram>;

export const Flowchart: Story = {
  args: {
    source: `flowchart TD
  A[User] -->|HTTP| B[nginx]
  B --> C[Next.js]
  B --> D[NestJS]
  C --> E[(PostgreSQL)]
  D --> E
  D --> F[(Redis)]`,
  },
};

export const Sequence: Story = {
  args: {
    source: `sequenceDiagram
  participant U as User
  participant N as Next.js
  participant A as API
  participant D as DB
  U->>N: GET /dashboard
  N->>A: fetch data
  A->>D: query
  D-->>A: rows
  A-->>N: JSON
  N-->>U: HTML`,
  },
};

export const Pie: Story = {
  args: {
    source: `pie title Tenant distribution
  "Heuresys" : 540
  "RTL Bank" : 320
  "SmartFood" : 180
  "EcoNova" : 207`,
  },
};
