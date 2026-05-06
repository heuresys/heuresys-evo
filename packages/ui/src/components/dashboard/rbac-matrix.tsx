import * as React from 'react';
import { cn } from '../../lib/cn';

export interface RbacRole {
  id: string;
  label: string;
  /** Optional ordering hint, e.g. -1 SUPERUSER → 6 EMPLOYEE */
  level?: number;
}

export interface RbacArea {
  id: string;
  label: string;
}

export type RbacPermissionLevel = 'none' | 'read' | 'write' | 'admin' | 'owner';

export interface RbacAssignment {
  roleId: string;
  areaId: string;
  level: RbacPermissionLevel;
}

export interface RbacMatrixProps {
  roles: RbacRole[];
  areas: RbacArea[];
  assignments: RbacAssignment[];
  /** Display-only mode (no onChange; no controls) */
  readonly?: boolean;
  onChange?: (assignment: RbacAssignment) => void;
  className?: string;
}

const LEVEL_ORDER: RbacPermissionLevel[] = ['none', 'read', 'write', 'admin', 'owner'];

const LEVEL_CLS: Record<RbacPermissionLevel, string> = {
  none: 'bg-muted/30 text-muted-fg',
  read: 'bg-primary/10 text-foreground',
  write: 'bg-primary/25 text-foreground',
  admin: 'bg-primary/45 text-foreground font-semibold',
  owner: 'bg-primary/65 text-primary-fg font-bold',
};

const LEVEL_GLYPH: Record<RbacPermissionLevel, string> = {
  none: '·',
  read: 'R',
  write: 'W',
  admin: 'A',
  owner: 'O',
};

function nextLevel(current: RbacPermissionLevel): RbacPermissionLevel {
  const i = LEVEL_ORDER.indexOf(current);
  return LEVEL_ORDER[(i + 1) % LEVEL_ORDER.length]!;
}

export function RbacMatrix({
  roles,
  areas,
  assignments,
  readonly = false,
  onChange,
  className,
}: RbacMatrixProps) {
  const map = React.useMemo(() => {
    const m = new Map<string, RbacPermissionLevel>();
    for (const a of assignments) m.set(`${a.roleId}|${a.areaId}`, a.level);
    return m;
  }, [assignments]);

  const interactive = !readonly && !!onChange;

  return (
    <div className={cn('overflow-auto rounded-md border border-border', className)}>
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 top-0 z-20 border-b border-r border-border bg-muted px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-fg"
            >
              Area / Role
            </th>
            {roles.map((r) => (
              <th
                key={r.id}
                scope="col"
                className="sticky top-0 z-10 border-b border-r border-border bg-muted px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-fg"
              >
                <div className="font-semibold text-foreground">{r.label}</div>
                {r.level != null ? <div className="text-[9px]">L{r.level}</div> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.id}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-r border-border bg-background px-3 py-2 text-left text-xs font-semibold"
              >
                {area.label}
              </th>
              {roles.map((role) => {
                const level = map.get(`${role.id}|${area.id}`) ?? 'none';
                const handleClick = () => {
                  if (!interactive) return;
                  onChange!({ roleId: role.id, areaId: area.id, level: nextLevel(level) });
                };
                return (
                  <td
                    key={role.id}
                    aria-label={`${role.label} × ${area.label}: ${level}`}
                    className={cn(
                      'border-b border-r border-border px-2 py-2 text-center font-mono text-[11px] tabular-nums',
                      LEVEL_CLS[level],
                      interactive && 'cursor-pointer hover:brightness-125'
                    )}
                    onClick={interactive ? handleClick : undefined}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleClick();
                            }
                          }
                        : undefined
                    }
                  >
                    {LEVEL_GLYPH[level]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
