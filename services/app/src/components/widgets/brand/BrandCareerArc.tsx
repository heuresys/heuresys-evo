import * as React from 'react';

export interface CareerStage {
  id: string;
  label: string;
  year?: string;
  status?: 'past' | 'current' | 'future';
  description?: string;
}

export interface BrandCareerArcProps {
  stages: CareerStage[];
  currentIndex?: number;
}

/**
 * BrandCareerArc — career arc 5-stage timeline (mockup-fedele).
 * Layout: horizontal flex con dot+label+year per stage, linea connettrice.
 */
export function BrandCareerArc({ stages, currentIndex }: BrandCareerArcProps) {
  // Derive status if not set: < currentIndex past, == current, > future
  const stagesWithStatus = stages.map((s, i) => {
    if (s.status) return s;
    if (currentIndex === undefined) return { ...s, status: 'future' as const };
    if (i < currentIndex) return { ...s, status: 'past' as const };
    if (i === currentIndex) return { ...s, status: 'current' as const };
    return { ...s, status: 'future' as const };
  });

  return (
    <div className="career-arc" role="list" aria-label="Career arc">
      {stagesWithStatus.map((s, i) => (
        <div
          key={s.id}
          className={`career-stage ${s.status ?? 'future'}`}
          role="listitem"
          title={s.description}
        >
          <div className="dot">{i + 1}</div>
          <div className="label">{s.label}</div>
          {s.year ? <div className="year">{s.year}</div> : null}
        </div>
      ))}
    </div>
  );
}
