import * as React from 'react';
import { Award } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const tierVariants = cva(
  'inline-flex flex-col items-center gap-1 rounded-lg border p-3 transition-transform hover:scale-105',
  {
    variants: {
      tier: {
        bronze: 'border-amber-600/40 bg-amber-100/50 text-amber-900 dark:bg-amber-900/20',
        silver: 'border-slate-400/40 bg-slate-100/50 text-slate-700 dark:bg-slate-800/40',
        gold: 'border-yellow-500/50 bg-yellow-100/60 text-yellow-900 dark:bg-yellow-900/30',
        platinum: 'border-cyan-400/40 bg-cyan-50/50 text-cyan-900 dark:bg-cyan-900/30',
        legendary:
          'border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-100 to-purple-100 text-fuchsia-900 dark:from-fuchsia-900/30 dark:to-purple-900/30',
      },
    },
    defaultVariants: { tier: 'bronze' },
  }
);

export interface AchievementBadgeProps extends VariantProps<typeof tierVariants> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  unlocked?: boolean;
  unlockedAt?: string;
  className?: string;
}

/**
 * AchievementBadge — gamification badge with tier coloring + unlock state.
 * (TIER 3)
 */
export function AchievementBadge({
  title,
  description,
  icon,
  tier,
  unlocked = true,
  unlockedAt,
  className,
}: AchievementBadgeProps) {
  return (
    <div
      role="img"
      aria-label={`${unlocked ? 'Unlocked' : 'Locked'} ${tier} achievement: ${title}`}
      className={cn(tierVariants({ tier }), !unlocked && 'opacity-40 grayscale', className)}
    >
      <div className="text-2xl" aria-hidden="true">
        {icon ?? <Award className="h-8 w-8" />}
      </div>
      <span className="text-sm font-semibold">{title}</span>
      {description ? <span className="text-center text-xs">{description}</span> : null}
      {unlockedAt ? (
        <time dateTime={unlockedAt} className="text-[0.65rem] opacity-70">
          {new Date(unlockedAt).toLocaleDateString()}
        </time>
      ) : null}
    </div>
  );
}
