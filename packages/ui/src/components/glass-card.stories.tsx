import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassCard } from './glass-card';

const meta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    intensity: { control: 'select', options: ['light', 'medium', 'heavy'] },
    tint: { control: 'select', options: ['none', 'primary', 'accent'] },
  },
};
export default meta;
type Story = StoryObj<typeof GlassCard>;

const Backdrop = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[400px] p-8 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
    {children}
  </div>
);

export const Default: Story = {
  decorators: [
    (S) => (
      <Backdrop>
        <S />
      </Backdrop>
    ),
  ],
  args: {
    intensity: 'medium',
    children: (
      <div className="p-6">
        <h3 className="text-xl font-semibold">Glass Card</h3>
        <p className="text-sm">Backdrop blur visible over gradient background.</p>
      </div>
    ) as never,
  },
};

export const Light: Story = {
  decorators: [
    (S) => (
      <Backdrop>
        <S />
      </Backdrop>
    ),
  ],
  args: {
    intensity: 'light',
    children: (<div className="p-6">Light blur intensity</div>) as never,
  },
};

export const Heavy: Story = {
  decorators: [
    (S) => (
      <Backdrop>
        <S />
      </Backdrop>
    ),
  ],
  args: {
    intensity: 'heavy',
    tint: 'primary',
    children: (<div className="p-6">Heavy blur + primary tint ring</div>) as never,
  },
};

export const Stack: Story = {
  render: () => (
    <Backdrop>
      <div className="grid grid-cols-3 gap-4">
        <GlassCard intensity="light" className="p-4">
          Light
        </GlassCard>
        <GlassCard intensity="medium" tint="primary" className="p-4">
          Medium + primary
        </GlassCard>
        <GlassCard intensity="heavy" tint="accent" className="p-4">
          Heavy + accent
        </GlassCard>
      </div>
    </Backdrop>
  ),
};
