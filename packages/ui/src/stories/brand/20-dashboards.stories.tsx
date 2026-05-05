import type { Meta, StoryObj } from '@storybook/react-vite';
import { UxFrame } from './_components';

const meta: Meta<typeof UxFrame> = {
  title: 'Brand/Dashboards (Phase 9)',
  component: UxFrame,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof UxFrame>;

const H = '92vh';

export const Index: Story = {
  args: {
    src: '06-mockups/dashboards/index.html',
    title: 'Dashboards — navigation hub (5 surface)',
    height: H,
  },
};

export const HrDirectorOverview: Story = {
  args: {
    src: '06-mockups/dashboards/hr-director-overview.html',
    title:
      'HR Director Overview — Maria CHRO · RTL Bank · KPI ring + skill gap matrix + activity feed',
    height: H,
  },
};

export const CapabilityGraph: Story = {
  args: {
    src: '06-mockups/dashboards/capability-graph.html',
    title: 'Capability Graph — Davide IT · KG topology SVG + ontology breakdown + ESCO sync',
    height: H,
  },
};

export const SkillsHeatmap: Story = {
  args: {
    src: '06-mockups/dashboards/skills-heatmap.html',
    title: 'Skills Heatmap — Maria CHRO · matrice 8 dept × 12 skill + filters + distribution',
    height: H,
  },
};

export const EmployeeJourney: Story = {
  args: {
    src: '06-mockups/dashboards/employee-journey.html',
    title:
      'Employee Journey — Andrea EMP · career arc 5 stage + skill evolution + capability radar',
    height: H,
  },
};

export const OrgSystems: Story = {
  args: {
    src: '06-mockups/dashboards/org-systems.html',
    title:
      'Org & Systems — Davide IT · 4 tenant fleet + RBAC matrix + integration health + audit log',
    height: H,
  },
};
