import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Sparkline } from './sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Sparkline>;

const STATIC = [3, 5, 4, 7, 6, 9, 8, 11, 9, 13, 12, 15];

export const Default: Story = { args: { data: STATIC } };
export const WithFill: Story = { args: { data: STATIC, fill: 'currentColor' } };
export const WithPoints: Story = { args: { data: STATIC, showPoints: true, showMinMax: true } };

function LiveSparkline() {
  const [data, setData] = useState<number[]>([10, 12, 11, 13, 14]);
  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = d[d.length - 1] + (Math.random() * 6 - 3);
        return [...d.slice(-19), Math.max(0, next)];
      });
    }, 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-1 text-primary">
      <Sparkline data={data} width={240} height={48} fill="currentColor" showPoints />
      <p className="text-xs text-neutral-500 tabular-nums">
        last: {data[data.length - 1].toFixed(2)}
      </p>
    </div>
  );
}
export const Live: Story = {
  render: () => <LiveSparkline />,
  parameters: {
    docs: {
      description: { story: 'Push nuovo data point ogni 800ms — vedi sparkline che scorre live.' },
    },
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'CPU %', data: [20, 25, 22, 30, 28, 35, 33, 40, 38] },
        { label: 'RAM %', data: [60, 62, 58, 65, 63, 70, 68, 72, 70] },
        { label: 'Net Mb/s', data: [5, 8, 12, 7, 15, 10, 18, 14, 22] },
      ].map((m) => (
        <div key={m.label} className="rounded border p-3">
          <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
          <Sparkline data={m.data} width={140} height={32} fill="currentColor" />
        </div>
      ))}
    </div>
  ),
};
