import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetworkGraph } from './network-graph';

const meta: Meta<typeof NetworkGraph> = {
  title: 'Charts/NetworkGraph',
  component: NetworkGraph,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['cose', 'circle', 'grid', 'concentric', 'breadthfirst'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof NetworkGraph>;

const orgChart = {
  nodes: [
    { id: 'ceo', label: 'CEO' },
    { id: 'cto', label: 'CTO' },
    { id: 'cpo', label: 'CPO' },
    { id: 'eng-mgr', label: 'Eng Manager' },
    { id: 'design-mgr', label: 'Design Lead' },
    { id: 'eng1', label: 'Eng 1' },
    { id: 'eng2', label: 'Eng 2' },
    { id: 'eng3', label: 'Eng 3' },
    { id: 'des1', label: 'Designer 1' },
    { id: 'des2', label: 'Designer 2' },
  ],
  edges: [
    { id: 'e1', source: 'ceo', target: 'cto' },
    { id: 'e2', source: 'ceo', target: 'cpo' },
    { id: 'e3', source: 'cto', target: 'eng-mgr' },
    { id: 'e4', source: 'cpo', target: 'design-mgr' },
    { id: 'e5', source: 'eng-mgr', target: 'eng1' },
    { id: 'e6', source: 'eng-mgr', target: 'eng2' },
    { id: 'e7', source: 'eng-mgr', target: 'eng3' },
    { id: 'e8', source: 'design-mgr', target: 'des1' },
    { id: 'e9', source: 'design-mgr', target: 'des2' },
  ],
};

export const OrgChart: Story = {
  args: { ...orgChart, layout: 'breadthfirst', height: 480, ariaLabel: 'Organizational chart' },
};

export const ForceDirected: Story = {
  args: { ...orgChart, layout: 'cose', height: 480, ariaLabel: 'Force-directed layout' },
  parameters: {
    docs: {
      description: {
        story:
          'Layout `cose` — fisica simulata, nodi si auto-distribuiscono. Drag con mouse per perturbare.',
      },
    },
  },
};

export const Concentric: Story = {
  args: { ...orgChart, layout: 'concentric', height: 480 },
};

const meshTopology = {
  nodes: Array.from({ length: 8 }, (_, i) => ({ id: `node-${i}`, label: `Node ${i}` })),
  edges: Array.from({ length: 8 }, (_, i) => ({
    id: `e-${i}`,
    source: `node-${i}`,
    target: `node-${(i + 1) % 8}`,
  })).concat(
    Array.from({ length: 4 }, (_, i) => ({
      id: `cross-${i}`,
      source: `node-${i}`,
      target: `node-${i + 4}`,
    }))
  ),
};

export const MeshTopology: Story = {
  args: { ...meshTopology, layout: 'circle', height: 480, ariaLabel: 'Mesh network topology' },
};
