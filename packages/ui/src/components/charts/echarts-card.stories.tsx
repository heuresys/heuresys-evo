import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { EChartsCard } from './echarts-card';

const meta: Meta<typeof EChartsCard> = {
  title: 'Charts/EchartsCard',
  component: EChartsCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EChartsCard>;

const lineOpt = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line', smooth: true }],
  tooltip: { trigger: 'axis' },
};
export const Line: Story = {
  args: { option: lineOpt as never, height: 320, ariaLabel: 'Weekly logins' },
};

const barOpt = {
  xAxis: { type: 'category', data: ['Heuresys', 'RTL Bank', 'SmartFood', 'EcoNova'] },
  yAxis: { type: 'value' },
  series: [
    { data: [320, 480, 210, 240], type: 'bar', itemStyle: { color: 'oklch(0.55 0.18 250)' } },
  ],
  tooltip: {},
};
export const Bar: Story = {
  args: { option: barOpt as never, height: 280, ariaLabel: 'Employees by tenant' },
};

const pieOpt = {
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 540, name: 'Engineer' },
        { value: 320, name: 'Manager' },
        { value: 180, name: 'Director' },
        { value: 207, name: 'Other' },
      ],
    },
  ],
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
};
export const Pie: Story = {
  args: { option: pieOpt as never, height: 320, ariaLabel: 'Roles distribution' },
};

function LiveECharts() {
  const [series, setSeries] = useState(() =>
    Array.from({ length: 12 }, () => Math.round(Math.random() * 100))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => [...s.slice(1), Math.round(Math.random() * 100)]);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const opt = {
    xAxis: { type: 'category', data: series.map((_, i) => `t-${series.length - i}`) },
    yAxis: { type: 'value', max: 100 },
    series: [{ data: series, type: 'line', smooth: true, areaStyle: {} }],
    animationDuration: 800,
    tooltip: { trigger: 'axis' },
  };
  return <EChartsCard option={opt as never} height={320} ariaLabel="Live metric stream" />;
}
export const Live: Story = {
  render: () => <LiveECharts />,
  parameters: {
    docs: {
      description: {
        story: 'Stream simulato — nuovo punto ogni 1s, animazione 800ms ECharts smooth.',
      },
    },
  },
};

export const Loading: Story = { args: { option: lineOpt as never, loading: true, height: 240 } };
