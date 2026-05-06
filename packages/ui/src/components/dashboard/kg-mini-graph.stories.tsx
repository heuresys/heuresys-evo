import type { Meta, StoryObj } from '@storybook/react-vite';
import { KgMiniGraph } from './kg-mini-graph';

const meta: Meta<typeof KgMiniGraph> = {
  title: 'Dashboard/KgMiniGraph',
  component: KgMiniGraph,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof KgMiniGraph>;

const ESCO_NODES = [
  { id: 'finance', label: 'Finance', group: 'domain' },
  { id: 'risk', label: 'Risk', group: 'domain' },
  { id: 'sql', label: 'SQL', group: 'tech' },
  { id: 'python', label: 'Python', group: 'tech' },
  { id: 'leadership', label: 'Leadership', group: 'soft' },
  { id: 'communication', label: 'Communication', group: 'soft' },
];

const ESCO_EDGES = [
  { id: 'e1', source: 'finance', target: 'risk' },
  { id: 'e2', source: 'risk', target: 'sql' },
  { id: 'e3', source: 'risk', target: 'python' },
  { id: 'e4', source: 'leadership', target: 'communication' },
  { id: 'e5', source: 'finance', target: 'leadership' },
];

const LEGEND = [
  { group: 'domain', label: 'Domain', color: '#3b82f6' },
  { group: 'tech', label: 'Tech skill', color: '#a855f7' },
  { group: 'soft', label: 'Soft skill', color: '#5fb87a' },
];

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <KgMiniGraph nodes={ESCO_NODES} edges={ESCO_EDGES} legend={LEGEND} />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-[320px]">
      <KgMiniGraph nodes={ESCO_NODES} edges={ESCO_EDGES} height={160} />
    </div>
  ),
};

export const CircleLayout: Story = {
  render: () => (
    <div className="w-[480px]">
      <KgMiniGraph nodes={ESCO_NODES} edges={ESCO_EDGES} layout="circle" legend={LEGEND} />
    </div>
  ),
};
