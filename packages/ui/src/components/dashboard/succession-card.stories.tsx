import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessionCard } from './succession-card';

const meta: Meta<typeof SuccessionCard> = {
  title: 'Dashboard/SuccessionCard',
  component: SuccessionCard,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof SuccessionCard>;

export const ReadyNow: Story = {
  args: {
    candidateName: 'Stefania Bianchi',
    currentRole: 'Head Credit Risk Modelling',
    targetRole: 'Director Risk & Analytics',
    readinessPercent: 88,
    readiness: 'ready-now',
    risk: 'low',
    readyBy: '2026 Q3',
  },
};

export const MediumTermDevelopment: Story = {
  args: {
    candidateName: 'Andrea Mercurio',
    currentRole: 'Quant Analyst Senior',
    targetRole: 'Head Quant Modelling',
    readinessPercent: 56,
    readiness: '1-2y',
    risk: 'medium',
    readyBy: '2027 Q4',
  },
};

export const HighRisk: Story = {
  args: {
    candidateName: 'Marco Tabasso',
    currentRole: 'Lead Engineer Platform',
    targetRole: 'CTO',
    readinessPercent: 28,
    readiness: 'not-ready',
    risk: 'critical',
    readyBy: '2029+',
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid w-[680px] grid-cols-2 gap-4">
      <SuccessionCard
        candidateName="Stefania Bianchi"
        currentRole="Head Credit Risk Modelling"
        targetRole="Director Risk & Analytics"
        readinessPercent={88}
        readiness="ready-now"
        risk="low"
        readyBy="2026 Q3"
      />
      <SuccessionCard
        candidateName="Andrea Mercurio"
        currentRole="Quant Analyst Senior"
        targetRole="Head Quant Modelling"
        readinessPercent={56}
        readiness="1-2y"
        risk="medium"
        readyBy="2027 Q4"
      />
      <SuccessionCard
        candidateName="Lia Romano"
        currentRole="Compliance Manager"
        targetRole="Head Compliance"
        readinessPercent={72}
        readiness="1-2y"
        risk="medium"
      />
      <SuccessionCard
        candidateName="Marco Tabasso"
        currentRole="Lead Engineer Platform"
        targetRole="CTO"
        readinessPercent={28}
        readiness="not-ready"
        risk="critical"
        readyBy="2029+"
      />
    </div>
  ),
};
