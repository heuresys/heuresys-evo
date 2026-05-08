import * as React from 'react';

export type ProfileBadgeKind = 'role' | 'dept' | 'tenure';

export interface ProfileBadge {
  kind: ProfileBadgeKind;
  label: string;
}

export interface ProfileStat {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
}

export interface BrandProfileHeroProps {
  name: string;
  sub?: string;
  initials?: string;
  badges?: ProfileBadge[];
  stats?: ProfileStat[];
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/**
 * BrandProfileHero — employee profile hero mockup-fedele.
 * Layout: .profile-hero (3-col grid: avatar 96px · meta · stats) >
 *   .profile-avatar (initials) + .profile-meta (.profile-name + .profile-sub + .profile-badges > .pbadge.pbadge-${kind}*)
 *   + .profile-stats > .profile-stat (.stat-num + .stat-lbl)*.
 */
export function BrandProfileHero({
  name,
  sub,
  initials,
  badges = [],
  stats = [],
}: BrandProfileHeroProps) {
  const avatarText = initials ?? deriveInitials(name);
  return (
    <section className="profile-hero">
      <div className="profile-avatar" aria-hidden="true">
        {avatarText}
      </div>
      <div className="profile-meta">
        <div className="profile-name">{name}</div>
        {sub ? <div className="profile-sub">{sub}</div> : null}
        {badges.length > 0 ? (
          <div className="profile-badges">
            {badges.map((b, i) => (
              <span key={i} className={`pbadge pbadge-${b.kind}`}>
                {b.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {stats.length > 0 ? (
        <div className="profile-stats">
          {stats.map((s) => (
            <div key={s.id} className="profile-stat">
              <div className="stat-num">
                {s.value}
                {s.unit ? <span className="unit">{s.unit}</span> : null}
              </div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
