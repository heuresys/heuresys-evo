import type { Meta, StoryObj } from '@storybook/react-vite';
import { PerfMonitor } from './perf-monitor';

const meta: Meta<typeof PerfMonitor> = {
  title: 'Devtools/PerfMonitor',
  component: PerfMonitor,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PerfMonitor>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[400px] border border-dashed border-border bg-muted/10 p-6">
    <p className="text-sm text-neutral-500">
      FPS counter visible in selected corner. Updates every 1s.
    </p>
    {children}
  </div>
);

export const BottomLeft: Story = {
  decorators: [
    (S) => (
      <Frame>
        <S />
      </Frame>
    ),
  ],
  args: { position: 'bottom-left' },
};
export const BottomRight: Story = {
  decorators: [
    (S) => (
      <Frame>
        <S />
      </Frame>
    ),
  ],
  args: { position: 'bottom-right' },
};
export const TopLeft: Story = {
  decorators: [
    (S) => (
      <Frame>
        <S />
      </Frame>
    ),
  ],
  args: { position: 'top-left' },
};
export const TopRight: Story = {
  decorators: [
    (S) => (
      <Frame>
        <S />
      </Frame>
    ),
  ],
  args: { position: 'top-right' },
};
