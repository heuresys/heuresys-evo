import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { StatsCard } from './stats-card';

const meta: Meta<typeof StatsCard> = {
  title: 'Components/StatsCard',
  component: StatsCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    label: 'Active employees',
    value: 1247,
    trend: 8.2,
    trendDirection: 'up',
    icon: <Users className="h-5 w-5" />,
  },
};

export const WithSparkline: Story = {
  args: {
    label: 'Monthly revenue',
    value: 84500,
    unit: '€',
    trend: 12.5,
    trendDirection: 'up',
    sparkline: [42, 48, 55, 53, 60, 67, 71, 75, 82, 84],
    icon: <DollarSign className="h-5 w-5" />,
  },
};

export const Negative: Story = {
  args: {
    label: 'Churn rate',
    value: 3.2,
    unit: '%',
    trend: -1.8,
    trendDirection: 'down',
    icon: <Activity className="h-5 w-5" />,
  },
};

export const Flat: Story = {
  args: {
    label: 'Avg session',
    value: 4.5,
    unit: 'min',
    trend: 0,
    trendDirection: 'flat',
    description: 'No change WoW',
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard label="Tenants" value={4} icon={<Users className="h-5 w-5" />} />
      <StatsCard
        label="Employees"
        value={1247}
        trend={5.2}
        trendDirection="up"
        icon={<Users className="h-5 w-5" />}
      />
      <StatsCard
        label="Revenue"
        value={84500}
        unit="€"
        trend={12.5}
        trendDirection="up"
        sparkline={[42, 48, 55, 53, 60, 67, 71, 75, 82, 84]}
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatsCard
        label="Uptime"
        value={99.97}
        unit="%"
        trend={0.02}
        trendDirection="up"
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Dashboard recipe — 4 KPI in grid responsive con count-up animation.' },
    },
  },
};

function LiveStats() {
  const [v, setV] = useState(1247);
  useEffect(() => {
    const id = setInterval(() => setV((x) => x + Math.floor(Math.random() * 11) - 5), 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <StatsCard
      label="Active sessions"
      value={v}
      description="Updates every 1.5s"
      icon={<Activity className="h-5 w-5" />}
    />
  );
}
export const Live: Story = {
  render: () => <LiveStats />,
  parameters: {
    docs: { description: { story: 'Valore cambia ogni 1.5s con count-up smooth (800ms easing).' } },
  },
};
