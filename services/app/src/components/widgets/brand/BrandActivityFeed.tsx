import * as React from 'react';

export interface ActivityFeedItem {
  id: string;
  when: string;
  what: React.ReactNode;
  who?: string;
}

export interface HolidayPreview {
  id: string;
  date: string; // ISO yyyy-mm-dd
  name: string;
  region?: string | null;
}

export interface BrandActivityFeedProps {
  items: ActivityFeedItem[];
  title?: string;
  live?: boolean;
  /** S39 W6.5 — Optional upcoming-holidays preview row (rendered after activity items). */
  holidays?: HolidayPreview[];
}

/**
 * BrandActivityFeed — live activity feed mockup-fedele.
 * Layout: .activity chrome + activity-head (title + live dot) + activity-list.
 *
 * S39 W6.5: extended with optional `holidays` prop. When provided, renders a
 * pinned "Upcoming holidays" section above the activity feed showing the next
 * 3-5 holidays (date + name + region badge if regional). Source data:
 * /api/holidays?year=&country=&region= (ITLAB phase18d).
 */
export function BrandActivityFeed({
  items,
  title = 'Activity',
  live = true,
  holidays,
}: BrandActivityFeedProps) {
  const upcomingHolidays = React.useMemo(() => {
    if (!holidays || holidays.length === 0) return [];
    const now = Date.now();
    return holidays.filter((h) => new Date(h.date).getTime() >= now).slice(0, 5);
  }, [holidays]);

  return (
    <section className="activity">
      {/* Title is rendered by parent LayoutPanel (data.title="Activity feed"). */}
      {live ? (
        <header
          className="activity-head"
          style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 8px' }}
        >
          <span className="live">live</span>
        </header>
      ) : null}

      {upcomingHolidays.length > 0 ? (
        <div
          className="activity-list"
          style={{
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: '1px solid var(--rule)',
          }}
          aria-label="Upcoming holidays"
        >
          {upcomingHolidays.map((h) => (
            <div key={h.id} className="activity-item">
              <div className="when" style={{ fontWeight: 600 }}>
                {h.date}
              </div>
              <div className="what">
                <strong>📅 {h.name}</strong>
              </div>
              {h.region ? <div className="who">{h.region}</div> : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="activity-list">
        {items.length === 0 ? (
          <div
            className="activity-item"
            style={{ color: 'var(--ink-muted)', textAlign: 'center', padding: 20 }}
          >
            No recent activity
          </div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="activity-item">
              <div className="when">{it.when}</div>
              <div className="what">{it.what}</div>
              {it.who ? <div className="who">{it.who}</div> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
