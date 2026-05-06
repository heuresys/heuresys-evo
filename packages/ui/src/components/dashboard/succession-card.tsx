import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Badge } from '../badge';
import { LinearGauge } from '../charts/gauges';
import { cn } from '../../lib/cn';

export type SuccessionRisk = 'low' | 'medium' | 'high' | 'critical';
export type SuccessionReadiness = 'ready-now' | '1-2y' | '3-5y' | 'not-ready';

const RISK_VARIANT: Record<SuccessionRisk, React.ComponentProps<typeof Badge>['variant']> = {
  low: 'success',
  medium: 'secondary',
  high: 'warning',
  critical: 'destructive',
};

const RISK_LABEL: Record<SuccessionRisk, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  critical: 'Critical',
};

const READINESS_LABEL: Record<SuccessionReadiness, string> = {
  'ready-now': 'Ready now',
  '1-2y': 'Ready 1-2y',
  '3-5y': 'Ready 3-5y',
  'not-ready': 'Not ready',
};

const READINESS_TONE: Record<
  SuccessionReadiness,
  React.ComponentProps<typeof LinearGauge>['tone']
> = {
  'ready-now': 'success',
  '1-2y': 'primary',
  '3-5y': 'warning',
  'not-ready': 'destructive',
};

export interface SuccessionCardProps {
  candidateName: string;
  candidateAvatarUrl?: string;
  currentRole: string;
  targetRole: string;
  /** 0-100 readiness percentage */
  readinessPercent: number;
  readiness?: SuccessionReadiness;
  risk?: SuccessionRisk;
  /** ISO date or human label */
  readyBy?: string;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function SuccessionCard({
  candidateName,
  candidateAvatarUrl,
  currentRole,
  targetRole,
  readinessPercent,
  readiness,
  risk = 'medium',
  readyBy,
  className,
}: SuccessionCardProps) {
  const clamped = Math.max(0, Math.min(100, readinessPercent));
  const tone = readiness
    ? READINESS_TONE[readiness]
    : clamped >= 80
      ? 'success'
      : clamped >= 50
        ? 'primary'
        : 'warning';

  return (
    <div
      role="article"
      aria-label={`Succession candidate ${candidateName}`}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-background p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {candidateAvatarUrl ? <AvatarImage src={candidateAvatarUrl} alt={candidateName} /> : null}
          <AvatarFallback>{initials(candidateName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{candidateName}</div>
          <div className="truncate font-mono text-[11px] text-muted-fg">{currentRole}</div>
        </div>
        <Badge variant={RISK_VARIANT[risk]}>{RISK_LABEL[risk]}</Badge>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">Target</div>
        <div className="text-sm font-medium">{targetRole}</div>
      </div>
      <LinearGauge
        value={clamped}
        max={100}
        label={readiness ? READINESS_LABEL[readiness] : 'Readiness'}
        tone={tone}
      />
      {readyBy ? (
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">
          Ready by · <span className="text-foreground">{readyBy}</span>
        </div>
      ) : null}
    </div>
  );
}
