import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiRing } from './kpi-ring';

const meta: Meta<typeof KpiRing> = {
  title: 'Dashboard/KpiRing',
  component: KpiRing,
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    variant: { control: { type: 'select' }, options: ['semi', 'full'] },
    tone: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'destructive'],
    },
  },
  args: { value: 72, label: 'Capability score', sublabel: 'company-wide · Q4', unit: '%' },
};
export default meta;

type Story = StoryObj<typeof KpiRing>;

export const Default: Story = {};

export const ThresholdSuccess: Story = {
  args: { value: 88, thresholds: { goodAt: 80, warnAt: 60 }, sublabel: '≥80 success' },
};

export const ThresholdWarning: Story = {
  args: { value: 68, thresholds: { goodAt: 80, warnAt: 60 }, sublabel: '60-79 warn' },
};

export const ThresholdDanger: Story = {
  args: { value: 42, thresholds: { goodAt: 80, warnAt: 60 }, sublabel: '<60 danger' },
};

export const WithTrendUp: Story = { args: { value: 76, trend: 4.2 } };
export const WithTrendDown: Story = { args: { value: 56, trend: -3.1, tone: 'warning' } };

export const FullRing: Story = { args: { variant: 'full', value: 84 } };

export const Triplet: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <KpiRing
        value={88}
        label="Capability"
        unit="%"
        thresholds={{ goodAt: 80, warnAt: 60 }}
        trend={4.2}
      />
      <KpiRing
        value={64}
        label="Engagement"
        unit="%"
        thresholds={{ goodAt: 80, warnAt: 60 }}
        trend={-1.4}
      />
      <KpiRing
        value={32}
        label="Attrition risk"
        unit="%"
        thresholds={{ goodAt: 80, warnAt: 60 }}
        tone="destructive"
      />
    </div>
  ),
};
