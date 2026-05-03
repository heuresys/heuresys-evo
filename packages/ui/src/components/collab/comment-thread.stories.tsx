import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommentThread, type Comment } from './comment-thread';

const meta: Meta<typeof CommentThread> = {
  title: 'Collab/CommentThread',
  component: CommentThread,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommentThread>;

const comments: Comment[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Mario Rossi' },
    body: 'Looks good to me, ready to merge.',
    timestamp: '5 min ago',
    reactions: { '👍': 3, '🚀': 1 },
    replies: [
      {
        id: '1a',
        author: { id: 'u2', name: 'Lucia Bianchi' },
        body: 'Agreed. CI is green.',
        timestamp: '3 min ago',
      },
    ],
  },
  {
    id: '2',
    author: { id: 'u3', name: 'Hans Müller' },
    body: '@mario can you also check the migration ordering?',
    timestamp: '12 min ago',
  },
];

export const Default: Story = { args: { comments, className: 'max-w-xl' } };
export const Empty: Story = { args: { comments: [], className: 'max-w-xl' } };
