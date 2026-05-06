import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export type CareerStageStatus = 'past' | 'current' | 'future';

export interface CareerStage {
  id: string;
  label: string;
  /** ISO year or display label */
  year?: string;
  description?: string;
  status?: CareerStageStatus;
}

export interface CareerArcProps {
  stages: CareerStage[];
  /** Index of current stage; ignored if stages already define `status` */
  currentIndex?: number;
  className?: string;
}

const STATUS_DOT: Record<CareerStageStatus, string> = {
  past: 'bg-success text-success-fg border-success',
  current: 'bg-primary text-primary-fg border-primary ring-4 ring-primary/20',
  future: 'bg-background text-muted-fg border-border',
};

const STATUS_LINE: Record<CareerStageStatus, string> = {
  past: 'bg-success',
  current: 'bg-gradient-to-r from-success to-primary',
  future: 'bg-border',
};

function resolveStatuses(
  stages: CareerStage[],
  currentIndex: number | undefined
): CareerStageStatus[] {
  if (stages.every((s) => s.status)) return stages.map((s) => s.status!);
  const idx = currentIndex ?? 0;
  return stages.map((s, i) => s.status ?? (i < idx ? 'past' : i === idx ? 'current' : 'future'));
}

export function CareerArc({ stages, currentIndex, className }: CareerArcProps) {
  if (stages.length === 0) {
    return <p className={cn('p-4 text-sm text-muted-fg', className)}>No career stages.</p>;
  }
  const statuses = resolveStatuses(stages, currentIndex);
  return (
    <ol role="list" aria-label="Career arc" className={cn('flex w-full items-start', className)}>
      {stages.map((stage, i) => {
        const status: CareerStageStatus = statuses[i] ?? 'future';
        const nextStatus: CareerStageStatus = statuses[i + 1] ?? 'future';
        const isLast = i === stages.length - 1;
        return (
          <li
            key={stage.id}
            role="listitem"
            aria-current={status === 'current' ? 'step' : undefined}
            className="flex flex-1 flex-col items-center"
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold',
                  STATUS_DOT[status]
                )}
              >
                {status === 'past' ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {!isLast ? (
                <span aria-hidden="true" className={cn('h-1 flex-1', STATUS_LINE[nextStatus])} />
              ) : null}
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs font-semibold">{stage.label}</div>
              {stage.year ? (
                <div className="font-mono text-[10px] text-muted-fg">{stage.year}</div>
              ) : null}
              {stage.description ? (
                <div className="mt-1 max-w-[140px] text-[11px] text-muted-fg">
                  {stage.description}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
