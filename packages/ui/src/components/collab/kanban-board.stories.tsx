import type { Meta, StoryObj } from '@storybook/react-vite';
import { KanbanBoard, type KanbanColumn } from './kanban-board';
import { Badge } from '../badge';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Collab/KanbanBoard',
  component: KanbanBoard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const sprintBoard: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      {
        id: 'b1',
        title: 'Refactor auth middleware',
        description: 'Migrate from JWT to session cookies',
        badge: <Badge variant="outline">P3</Badge>,
      },
      { id: 'b2', title: 'Add audit log to write ops' },
      {
        id: 'b3',
        title: 'i18n: add German translations',
        badge: <Badge variant="outline">L</Badge>,
      },
    ],
  },
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      {
        id: 't1',
        title: 'Wire up brand-studio export',
        assignee: { name: 'Mario Rossi' },
        badge: <Badge variant="warning">P2</Badge>,
      },
      {
        id: 't2',
        title: 'Fix dashboard hydration mismatch',
        assignee: { name: 'Lucia Bianchi' },
        badge: <Badge variant="destructive">P1</Badge>,
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      {
        id: 'p1',
        title: 'Storybook expansion (Phase 1+2+3)',
        assignee: { name: 'Hans Müller' },
        description: '88 components, 10 rich + 78 scaffold',
        badge: <Badge variant="success">M</Badge>,
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      {
        id: 'r1',
        title: 'PR #142: nginx /api/auth routing',
        assignee: { name: 'Yuki Tanaka' },
        badge: <Badge>S</Badge>,
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'd1', title: 'Auth fix deployed to prod', assignee: { name: 'Mario Rossi' } },
      { id: 'd2', title: 'Heap raised to 4GB', assignee: { name: 'Hans Müller' } },
      { id: 'd3', title: '/showcase route shipped', assignee: { name: 'Lucia Bianchi' } },
    ],
  },
];

export const Default: Story = {
  args: {
    columns: sprintBoard,
    onChange: (cols) => console.log('reorder', cols),
    onAddCard: (colId) => console.log('add card to', colId),
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Drag cards** tra colonne con mouse o tastiera (Tab → Space → frecce → Space). Vedi animazioni @dnd-kit.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    columns: [
      { id: 'col1', title: 'Empty col 1', cards: [] },
      { id: 'col2', title: 'Empty col 2', cards: [] },
      { id: 'col3', title: 'Empty col 3', cards: [] },
    ],
    onAddCard: (colId) => console.log('add to', colId),
  },
};

export const SingleColumn: Story = {
  args: {
    columns: [
      {
        id: 'tasks',
        title: 'Tasks',
        cards: Array.from({ length: 8 }, (_, i) => ({
          id: `task-${i}`,
          title: `Task #${i + 1}`,
          description: i % 2 === 0 ? `Description for task ${i + 1}` : undefined,
        })),
      },
    ],
  },
};
