import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trophy, Medal, Star, Crown, Zap } from 'lucide-react';
import { AchievementBadge } from './achievement-badge';

const meta: Meta<typeof AchievementBadge> = {
  title: 'Components/AchievementBadge',
  component: AchievementBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    tier: { control: 'select', options: ['bronze', 'silver', 'gold', 'platinum', 'legendary'] },
  },
};
export default meta;
type Story = StoryObj<typeof AchievementBadge>;

export const Bronze: Story = {
  args: {
    tier: 'bronze',
    title: 'First Steps',
    description: 'Complete onboarding',
    icon: <Medal className="h-5 w-5" />,
  },
};
export const Silver: Story = {
  args: { tier: 'silver', title: '10 Tasks Done', icon: <Star className="h-5 w-5" /> },
};
export const Gold: Story = {
  args: { tier: 'gold', title: 'Sprint Champion', icon: <Trophy className="h-5 w-5" /> },
};
export const Platinum: Story = {
  args: {
    tier: 'platinum',
    title: 'Mentor',
    description: 'Helped 5+ teammates',
    icon: <Crown className="h-5 w-5" />,
  },
};
export const Legendary: Story = {
  args: {
    tier: 'legendary',
    title: 'Speed Demon',
    description: 'Top 1% performer',
    icon: <Zap className="h-5 w-5" />,
  },
};

export const Locked: Story = {
  args: {
    tier: 'gold',
    title: 'Hidden achievement',
    icon: <Trophy className="h-5 w-5" />,
    unlocked: false,
  },
};

export const TierWall: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <AchievementBadge tier="bronze" title="Newcomer" icon={<Medal className="h-5 w-5" />} />
      <AchievementBadge tier="silver" title="Contributor" icon={<Star className="h-5 w-5" />} />
      <AchievementBadge tier="gold" title="Champion" icon={<Trophy className="h-5 w-5" />} />
      <AchievementBadge tier="platinum" title="Master" icon={<Crown className="h-5 w-5" />} />
      <AchievementBadge tier="legendary" title="Legend" icon={<Zap className="h-5 w-5" />} />
    </div>
  ),
};
