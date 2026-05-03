import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { ActivityFeed, type ActivityFeedItem } from './activity-feed';
import { Button } from './Button';
import { GitCommit, UserPlus, Rocket, AlertTriangle, MessageSquare } from 'lucide-react';

const meta: Meta<typeof ActivityFeed> = {
  title: 'Components/ActivityFeed',
  component: ActivityFeed,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ActivityFeed>;

const baseItems: ActivityFeedItem[] = [
  {
    id: '1',
    actor: { name: 'Mario Rossi' },
    verb: 'pushed commit to',
    target: 'main',
    meta: 'fix(auth): JWT refresh',
    timestamp: '5 min ago',
    icon: <GitCommit className="h-4 w-4" />,
  },
  {
    id: '2',
    actor: { name: 'Lucia Bianchi' },
    verb: 'invited',
    target: 'hans@smartfood.test',
    timestamp: '12 min ago',
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: '3',
    actor: { name: 'Hans Müller' },
    verb: 'deployed',
    target: 'production',
    meta: 'v0.4.7',
    timestamp: '1h ago',
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    id: '4',
    actor: { name: 'Yuki Tanaka' },
    verb: 'commented on',
    target: 'PR #142',
    timestamp: '2h ago',
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

export const Default: Story = { args: { items: baseItems, className: 'max-w-xl' } };
export const Empty: Story = { args: { items: [], className: 'max-w-xl border rounded' } };

function LiveFeed() {
  const [items, setItems] = useState<ActivityFeedItem[]>(baseItems);
  const verbs = [
    'pushed commit to',
    'commented on',
    'deployed',
    'merged PR into',
    'opened issue on',
  ];
  const actors = ['Sofia Russo', 'Anna Romano', 'Pietro Conti', 'Elena Marino'];
  useEffect(() => {
    const id = setInterval(() => {
      const newItem: ActivityFeedItem = {
        id: String(Date.now()),
        actor: { name: actors[Math.floor(Math.random() * actors.length)] },
        verb: verbs[Math.floor(Math.random() * verbs.length)],
        target: ['main', 'develop', 'feature/xyz', 'PR #' + Math.floor(Math.random() * 200)][
          Math.floor(Math.random() * 4)
        ],
        timestamp: 'now',
        icon: <AlertTriangle className="h-4 w-4" />,
      };
      setItems((prev) => [newItem, ...prev].slice(0, 8));
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return <ActivityFeed items={items} className="max-w-xl" />;
}
export const Live: Story = {
  render: () => <LiveFeed />,
  parameters: {
    docs: {
      description: { story: 'Nuovo evento in cima ogni 2.5s, lista mantiene max 8 elementi.' },
    },
  },
};

function PaginatedFeed() {
  const [count, setCount] = useState(4);
  const all: ActivityFeedItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: `it-${i}`,
    actor: { name: `User ${i + 1}` },
    verb: ['pushed', 'merged', 'opened', 'closed'][i % 4],
    target: `event #${i}`,
    timestamp: `${i + 1}h ago`,
  }));
  return (
    <div className="max-w-xl space-y-3">
      <ActivityFeed items={all.slice(0, count)} />
      {count < all.length && (
        <Button variant="outline" onClick={() => setCount((c) => Math.min(all.length, c + 4))}>
          Load more ({all.length - count} restanti)
        </Button>
      )}
    </div>
  );
}
export const LoadMore: Story = { render: () => <PaginatedFeed /> };
