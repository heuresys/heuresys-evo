import * as React from 'react';

export type RbacPermissionLevel = 'none' | 'read' | 'write' | 'admin' | 'owner';

export interface RbacRole {
  id: string;
  label: string;
  level?: number;
}

export interface RbacArea {
  id: string;
  label: string;
}

export interface RbacAssignment {
  roleId: string;
  areaId: string;
  level: RbacPermissionLevel;
}

export interface BrandRbacMatrixProps {
  roles: RbacRole[];
  areas: RbacArea[];
  assignments: RbacAssignment[];
  readonly?: boolean;
}

const LEVEL_PILL: Record<RbacPermissionLevel, string> = {
  none: 'pill-critical',
  read: 'pill-info',
  write: 'pill-warn',
  admin: 'pill-ok',
  owner: 'pill-ok',
};

const LEVEL_LABEL: Record<RbacPermissionLevel, string> = {
  none: '—',
  read: 'READ',
  write: 'WRITE',
  admin: 'ADMIN',
  owner: 'OWNER',
};

/**
 * BrandRbacMatrix — table.dense + pill role/area cells (mockup-fedele).
 * Layout: matrix-wrap chrome + widget-head + table.dense + colored pill per cell.
 */
export function BrandRbacMatrix({ roles, areas, assignments }: BrandRbacMatrixProps) {
  // Lookup helper
  const matrix = React.useMemo(() => {
    const m: Record<string, Record<string, RbacPermissionLevel>> = {};
    for (const a of assignments) {
      if (!m[a.roleId]) m[a.roleId] = {};
      m[a.roleId]![a.areaId] = a.level;
    }
    return m;
  }, [assignments]);

  return (
    <div className="matrix-wrap">
      {/* Title is rendered by parent LayoutPanel (data.title="RBAC matrix"). */}
      <div className="widget-head" style={{ justifyContent: 'flex-end' }}>
        <div className="filters">
          <span className="filter-pill active">{roles.length} roles</span>
          <span className="filter-pill">{areas.length} areas</span>
        </div>
      </div>
      <table className="dense">
        <thead>
          <tr>
            <th>Area / Role</th>
            {roles.map((r) => (
              <th
                key={r.id}
                className="right"
                title={`${r.label}${r.level !== undefined ? ` (level ${r.level})` : ''}`}
              >
                {r.label}
                {r.level !== undefined ? (
                  <span style={{ display: 'block', fontSize: 8, opacity: 0.6, marginTop: 2 }}>
                    L{r.level}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a.id}>
              <td className="mono" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {a.label}
              </td>
              {roles.map((r) => {
                const lvl = matrix[r.id]?.[a.id] ?? 'none';
                return (
                  <td key={r.id} className="right" title={`${r.label} × ${a.label}: ${lvl}`}>
                    <span className={`pill ${LEVEL_PILL[lvl]}`}>{LEVEL_LABEL[lvl]}</span>
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
