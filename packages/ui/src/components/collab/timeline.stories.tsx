import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Timeline, type TimelineEvent } from './timeline';
import { CheckCircle, AlertTriangle, GitMerge, Rocket, XCircle } from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Collab/Timeline',
  component: Timeline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    time: '2026-05-03T01:24:00Z',
    title: 'CI raised heap to 4GB',
    tone: 'primary',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  {
    id: '2',
    time: '2026-05-03T00:34:00Z',
    title: 'Auth fix deployed',
    description: 'JWT refresh + nginx /api/auth/ routing',
    tone: 'success',
    icon: <Rocket className="h-3 w-3" />,
  },
  {
    id: '3',
    time: '2026-05-02T22:14:00Z',
    title: 'PR #142 merged',
    tone: 'success',
    icon: <GitMerge className="h-3 w-3" />,
  },
  {
    id: '4',
    time: '2026-05-02T18:00:00Z',
    title: 'Build failed on Storybook',
    description: 'Missing peer dep — fixed in 5 min',
    tone: 'destructive',
    icon: <XCircle className="h-3 w-3" />,
  },
  { id: '5', time: '2026-05-02T14:30:00Z', title: 'Brand studio scaffolded', tone: 'muted' },
];

export const Default: Story = { args: { events: sampleEvents, className: 'max-w-md' } };
export const Empty: Story = { args: { events: [], className: 'max-w-md border rounded' } };

const milestones: TimelineEvent[] = [
  {
    id: 'm1',
    time: '2026-04-27T00:00:00Z',
    title: 'Project kickoff',
    description: 'Initial repo + monorepo setup',
    tone: 'muted',
  },
  {
    id: 'm2',
    time: '2026-04-29T00:00:00Z',
    title: 'Prisma schema introspect',
    description: '566 modelli importati dal legacy',
    tone: 'primary',
  },
  {
    id: 'm3',
    time: '2026-05-01T00:00:00Z',
    title: 'First UI components',
    description: 'Cantiere B v2 base — 88 componenti',
    tone: 'success',
  },
  {
    id: 'm4',
    time: '2026-05-02T00:00:00Z',
    title: 'Brand studio shipped',
    description: '/brand-studio SUPERUSER tool',
    tone: 'success',
  },
  {
    id: 'm5',
    time: '2026-05-03T00:00:00Z',
    title: 'Storybook expansion',
    description: 'Phase 1+2+3 complete',
    tone: 'warning',
  },
];

export const ProjectMilestones: Story = { args: { events: milestones, className: 'max-w-md' } };

function LiveBuildLog() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const steps = [
    { title: 'Install deps', description: 'npm ci', tone: 'muted' as const },
    { title: 'Lint', description: 'eslint . --max-warnings=0', tone: 'primary' as const },
    { title: 'Typecheck', description: 'tsc --noEmit', tone: 'primary' as const },
    { title: 'Test', description: 'vitest run (130+ tests)', tone: 'success' as const },
    {
      title: 'Build',
      description: 'next build + nest build',
      tone: 'success' as const,
      icon: <Rocket className="h-3 w-3" />,
    },
  ];
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(id);
        return;
      }
      const s = steps[i];
      setEvents((prev) => [
        ...prev,
        {
          id: String(i),
          time: new Date().toISOString(),
          title: s.title,
          description: s.description,
          tone: s.tone,
          icon: s.icon,
        },
      ]);
      i++;
    }, 1200);
    return () => clearInterval(id);
  }, []);
  return <Timeline events={events} className="max-w-md" emptyMessage="Build starting…" />;
}
export const LiveBuild: Story = {
  render: () => <LiveBuildLog />,
  parameters: {
    docs: {
      description: { story: 'Steps di build appaiono uno alla volta ogni 1.2s — pattern CI live.' },
    },
  },
};
