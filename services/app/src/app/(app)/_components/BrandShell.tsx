'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleSwitcher } from '@/lib/i18n';
import type { NavSection } from '@/lib/navigation/types';
import type { PaletteId, ThemeMode } from '@/lib/theme-framework/palettes';
import { NavIcon } from './nav-icons';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { PaletteSwitcher } from './PaletteSwitcher';

/** P6 W#6 (L74): roleLevel optional per render '{role} · level {N}' user-card. */
export interface BrandShellUser {
  username: string;
  role: string;
  /** P6 W#6 (L74): canonical role level (-1=SUPERUSER, 0=TENANT_OWNER, ..., 6=EMPLOYEE).
   * Null per ruoli non mappati. Render `{role} · level {N}` user-card quando presente. */
  roleLevel?: number | null;
  displayName: string;
  initials: string;
}

export interface BrandShellTenant {
  name: string;
  meta?: string;
  initials: string;
  shortId?: string;
}

export interface BrandShellProps {
  /** Role-driven NavSection[] from getNavForUser(session). */
  sections: NavSection[];
  user: BrandShellUser;
  tenant: BrandShellTenant;
  envLabel?: string;
  buildHash?: string;
  /** Resolved user palette (server-side via resolveUserPalette) for chrome switcher. */
  initialPalette: PaletteId;
  initialTheme: ThemeMode;
  /** P6 W#7-bis (L75 CF#5): footer brand metrics live (cycle period + reviews completion %). */
  footerMetrics?: { cycle: string; reviewsPct: number | null };
  children: React.ReactNode;
}

const SIDEBAR_COLLAPSED_KEY = 'heuresys.sidebar.collapsed';
const SECTION_COLLAPSED_PREFIX = 'heuresys.sidebar.section.';

/**
 * BrandShell — μ-architect-legacy direction app shell, brand-fedele al mockup
 * (.ux-design/06-mockups/dashboards/*.html).
 *
 * Struttura:
 *   - .dashboard-shell wrapper (flex column 100vh, overflow hidden)
 *     - <nav class="nav-bar">  topbar fissa con wordmark + locale + theme + user menu
 *     - <div class="app">      grid 240px sidebar + 1fr workspace
 *       - <aside class="sidebar">  toggle + tenant-mini + sections + user-card
 *       - <main class="workspace"> children (page content)
 *     - <footer class="app-footer">  copyright + socials + ctx-items dinamici
 *
 * Sidebar collapse persistito in localStorage. Sezioni collapse persistite per id.
 */
export function BrandShell({
  sections,
  user,
  tenant,
  envLabel,
  buildHash,
  initialPalette,
  initialTheme,
  footerMetrics,
  children,
}: BrandShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Hydrate persisted state
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const sb = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (sb === '1') setCollapsed(true);
    const sectionsCollapsed = new Set<string>();
    for (const s of sections) {
      if (window.localStorage.getItem(SECTION_COLLAPSED_PREFIX + s.id) === '1') {
        sectionsCollapsed.add(s.id);
      }
    }
    setCollapsedSections(sectionsCollapsed);
    setHydrated(true);
  }, [sections]);

  // Persist sidebar collapsed
  React.useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
  }, [collapsed, hydrated]);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SECTION_COLLAPSED_PREFIX + id, '0');
        }
      } else {
        next.add(id);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SECTION_COLLAPSED_PREFIX + id, '1');
        }
      }
      return next;
    });
  };

  const isActive = (href?: string): boolean => {
    if (!href || !pathname) return false;
    const cleanHref = href.split('?')[0]!.split('#')[0]!;
    if (cleanHref === '/') return pathname === '/';
    return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
  };

  return (
    <div className="dashboard-shell" data-sidebar={collapsed ? 'collapsed' : ''}>
      {/* ============== Top nav-bar ============== */}
      <nav className="nav-bar" aria-label="Top navigation">
        <div className="nav-left">
          <Link href="/dashboard" className="wordmark-sm" aria-label="Heuresys home">
            heures<span className="y">y</span>s
          </Link>
          <span className="label-pill">
            <span className="accent">DASHBOARD</span>
          </span>
        </div>
        <div className="nav-right">
          <LocaleSwitcher />
          <PaletteSwitcher initialPalette={initialPalette} initialTheme={initialTheme} />
          <ThemeToggle />
          <UserMenu username={user.username} role={user.role} />
        </div>
      </nav>

      {/* ============== App grid (sidebar + workspace) ============== */}
      <div className="app">
        <aside className="sidebar" aria-label="Primary navigation">
          {/* Top: toggle + tenant-mini */}
          <div className="sidebar-top">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 9,3 L 5,7 L 9,11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="tenant-mini" title={tenant.name}>
              <div className="t-avatar bordered">{tenant.initials}</div>
              <div className="t-info">
                <div className="t-name">{tenant.name}</div>
                {tenant.meta ? <div className="t-meta">{tenant.meta}</div> : null}
              </div>
            </div>
          </div>

          {/* Nav sections */}
          {sections.map((section) => (
            <div
              key={section.id}
              className={`sidebar-section${collapsedSections.has(section.id) ? ' collapsed' : ''}`}
            >
              <h4>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={!collapsedSections.has(section.id)}
                  aria-controls={`sidebar-section-${section.id}`}
                  className="sidebar-section-toggle"
                >
                  <span>{section.title}</span>
                  <span className="chev" aria-hidden="true">
                    ▼
                  </span>
                </button>
              </h4>
              {section.items
                .filter((it) => !it.hidden)
                .map((it) => (
                  <Link
                    key={it.id}
                    href={it.href ?? '#'}
                    className={`sidebar-link${isActive(it.href) ? ' active' : ''}`}
                    aria-current={isActive(it.href) ? 'page' : undefined}
                  >
                    {it.icon ? (
                      <span className="glyph">
                        <NavIcon name={it.icon} />
                      </span>
                    ) : (
                      <span className="glyph" aria-hidden />
                    )}
                    <span>{it.label}</span>
                    {it.badge ? <span className="num">{it.badge}</span> : null}
                  </Link>
                ))}
            </div>
          ))}

          {/* User card bottom (P6 W#6 L74: full name primary + role · level secondary) */}
          <div className="user-card" title={user.username}>
            <div className="avatar bordered-inverse">{user.initials}</div>
            <div className="info">
              <div className="name">{user.displayName}</div>
              <div className="role">
                {user.role}
                {typeof user.roleLevel === 'number' ? ` · level ${user.roleLevel}` : null}
              </div>
            </div>
          </div>
        </aside>

        <main className="workspace" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* ============== App footer ============== */}
      <footer className="app-footer">
        <div className="ft-static">
          <span className="copyright">
            © 2026{' '}
            <Link href="/" aria-label="heuresys.com">
              <span className="wordmark-foot" aria-hidden="true">
                heures<span className="y">y</span>s.com
              </span>
            </Link>
          </span>
          <div className="socials" aria-label="Social links">
            <a
              href="https://www.linkedin.com/company/heuresys"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://github.com/heuresys"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://x.com/heuresys"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="ft-dynamic">
          {/* Cycle 2 Phase 0 T0.8: ENV/TENANT/ROLE/BUILD chip gated behind
              NEXT_PUBLIC_SHOW_DEV_FOOTER flag (default false in prod).
              CYCLE + REVIEWS preserved as brand metric live P6 W#7-bis (L75 CF#5):
              cycle TS-derived da NOW(), reviewsPct via SQL aggregator
              review_cycle_participants completion %. Hide entrambi se
              footerMetrics non passato (es. platform users senza tenantId). */}
          {process.env.NEXT_PUBLIC_SHOW_DEV_FOOTER === '1' ? (
            <>
              <span className="ctx-item">
                <span className="ft-dot ok" aria-hidden />
                ENV <strong>{envLabel ?? 'DEV'}</strong>
              </span>
              {tenant.shortId ? (
                <span className="ctx-item">
                  <span className="ft-dot info" aria-hidden />
                  TENANT <strong>{tenant.shortId}</strong>
                </span>
              ) : (
                <span className="ctx-item">
                  <span className="ft-dot warn" aria-hidden />
                  PLATFORM
                </span>
              )}
              <span className="ctx-item">
                <span className="ft-dot info" aria-hidden />
                ROLE <strong>{user.role}</strong>
              </span>
              {buildHash ? (
                <span className="ctx-item">
                  <span className="ft-dot warn" aria-hidden />
                  BUILD <strong>{buildHash}</strong>
                </span>
              ) : null}
            </>
          ) : null}
          {footerMetrics ? (
            <>
              <span className="ctx-item">
                <span className="ft-dot ok" aria-hidden />
                CYCLE <strong>{footerMetrics.cycle}</strong>
              </span>
              {footerMetrics.reviewsPct !== null ? (
                <span className="ctx-item">
                  <span className="ft-dot ok" aria-hidden />
                  REVIEWS <strong>{footerMetrics.reviewsPct}%</strong>
                </span>
              ) : null}
            </>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
