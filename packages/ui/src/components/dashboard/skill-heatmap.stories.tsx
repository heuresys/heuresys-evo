import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillHeatmap } from './skill-heatmap';

const meta: Meta<typeof SkillHeatmap> = {
  title: 'Dashboard/SkillHeatmap',
  component: SkillHeatmap,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof SkillHeatmap>;

const ROWS = [
  { id: 'fin', label: 'Finance' },
  { id: 'risk', label: 'Risk' },
  { id: 'ops', label: 'Operations' },
  { id: 'data', label: 'Data Science' },
  { id: 'eng', label: 'Engineering' },
  { id: 'hr', label: 'People & HR' },
  { id: 'mkt', label: 'Marketing' },
  { id: 'leg', label: 'Legal' },
];

const COLS = [
  { id: 'sql', label: 'SQL' },
  { id: 'python', label: 'Python' },
  { id: 'r', label: 'R' },
  { id: 'tableau', label: 'Tableau' },
  { id: 'excel', label: 'Excel' },
  { id: 'powerbi', label: 'PowerBI' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'docker', label: 'Docker' },
  { id: 'k8s', label: 'K8s' },
  { id: 'lead', label: 'Leadership' },
  { id: 'comm', label: 'Comms' },
  { id: 'risk', label: 'Risk Mgmt' },
];

function rng(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * 100);
}

const CELLS = ROWS.flatMap((r, ri) =>
  COLS.map((c, ci) => ({ rowId: r.id, colId: c.id, value: rng(ri * 13 + ci * 7 + 1) }))
);

export const EightByTwelve: Story = {
  render: () => (
    <div className="w-full max-w-[860px]">
      <SkillHeatmap rows={ROWS} cols={COLS} cells={CELLS} caption="Skill coverage by department" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="w-full max-w-[860px]">
      <SkillHeatmap
        rows={ROWS}
        cols={COLS}
        cells={CELLS}
        onCellClick={(cell) => console.log('clicked', cell)}
        caption="Click cells to drill into department × skill"
      />
    </div>
  ),
};

export const SmallMatrix: Story = {
  render: () => {
    const rows = ROWS.slice(0, 3);
    const cols = COLS.slice(0, 4);
    const cells = rows.flatMap((r, ri) =>
      cols.map((c, ci) => ({ rowId: r.id, colId: c.id, value: rng(ri * 31 + ci * 11 + 5) }))
    );
    return (
      <div className="w-[480px]">
        <SkillHeatmap rows={rows} cols={cols} cells={cells} />
      </div>
    );
  },
};
