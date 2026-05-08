import * as React from 'react';

export interface ActivityFeedItem {
  id: string;
  when: string;
  what: React.ReactNode;
  who?: string;
}

export interface BrandActivityFeedProps {
  items: ActivityFeedItem[];
  title?: string;
  live?: boolean;
}

/**
 * BrandActivityFeed — live activity feed mockup-fedele.
 * Layout: .activity chrome + activity-head (title + live dot) + activity-list.
 */
export function BrandActivityFeed({
  items,
  title = 'Activity',
  live = true,
}: BrandActivityFeedProps) {
  return (
    <section className="activity">
      <header className="activity-head">
        <h2>
          {title.split(' ').slice(0, -1).join(' ') || ''}{' '}
          {title.split(' ').length > 1 ? (
            <em style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 600 }}>
              {title.split(' ').slice(-1)[0]}
            </em>
          ) : (
            title
          )}
        </h2>
        {live ? <span className="live">live</span> : null}
      </header>
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
