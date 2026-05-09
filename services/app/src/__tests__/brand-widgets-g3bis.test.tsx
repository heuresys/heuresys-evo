/**
 * G3-bis-completion — unit tests per i 5 BrandWidget mockup-fedele:
 * BrandTenantCard · BrandMetricCard · BrandSectionHead · BrandIntRow · BrandAuditRow.
 *
 * Copre: classi CSS canoniche · varianti · contenuto live · slot opzionali.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandTenantCard } from '@/components/widgets/brand/BrandTenantCard';
import { BrandMetricCard } from '@/components/widgets/brand/BrandMetricCard';
import { BrandSectionHead } from '@/components/widgets/brand/BrandSectionHead';
import { BrandIntRow } from '@/components/widgets/brand/BrandIntRow';
import { BrandAuditRow } from '@/components/widgets/brand/BrandAuditRow';

describe('BrandTenantCard', () => {
  it('renders tenant variant by default with rows + health', () => {
    const { container } = render(
      <BrandTenantCard
        name="RTL Bank"
        tid="rtl-bank · 270 employees"
        rows={[
          { label: 'INDUSTRY', value: 'Banking' },
          { label: 'STATUS', value: 'active', success: true },
        ]}
        health={{ label: 'all systems healthy', strong: 'OK', tone: 'ok' }}
      />
    );
    const card = container.querySelector('article.tenant-card');
    expect(card).toBeTruthy();
    expect(card?.classList.contains('platform')).toBe(false);
    expect(container.querySelector('.tag-tenant')).toBeTruthy();
    expect(container.querySelector('.tid')?.textContent).toBe('rtl-bank · 270 employees');
    expect(container.querySelectorAll('.row')).toHaveLength(2);
    expect(container.querySelector('.row .val.success')?.textContent).toBe('active');
    const healthDot = container.querySelector('.health .dot');
    expect(healthDot).toBeTruthy();
    expect(healthDot?.classList.contains('warn')).toBe(false);
    expect(container.querySelector('.health .lbl strong')?.textContent).toBe('OK');
  });

  it('applies platform variant chrome and tag', () => {
    const { container } = render(
      <BrandTenantCard name="Heuresys System" kind="platform" tid="platform · landlord" />
    );
    expect(container.querySelector('article.tenant-card.platform')).toBeTruthy();
    expect(container.querySelector('.tag-platform')?.textContent).toBe('PLATFORM');
  });

  it('applies warn dot tone on health', () => {
    const { container } = render(
      <BrandTenantCard
        name="EcoNova"
        health={{ label: 'degraded', strong: 'WARN', tone: 'warn' }}
      />
    );
    expect(container.querySelector('.health .dot.warn')).toBeTruthy();
  });
});

describe('BrandMetricCard', () => {
  it('renders label/value/unit and a sparkline polyline when samples provided', () => {
    const { container } = render(
      <BrandMetricCard label="DB SIZE" value={24.6} unit="GB" sparkline={[10, 30, 60, 80]} />
    );
    expect(container.querySelector('.metric-card .lbl')?.textContent).toBe('DB SIZE');
    const val = container.querySelector('.metric-card .val');
    expect(val?.textContent).toContain('24.6');
    expect(val?.querySelector('.unit')?.textContent).toBe('GB');
    const svg = container.querySelector('svg.sparkline');
    expect(svg).toBeTruthy();
    expect(svg?.querySelector('polyline')).toBeTruthy();
  });

  it('omits sparkline when samples missing or too short', () => {
    const { container } = render(<BrandMetricCard label="CPU" value="—" />);
    expect(container.querySelector('svg.sparkline')).toBeNull();
  });
});

describe('BrandSectionHead', () => {
  it('auto-accents the last word in title', () => {
    const { container } = render(<BrandSectionHead title="Skill matrix" meta="LIVE" />);
    expect(container.querySelector('h2 em')?.textContent).toBe('matrix');
    expect(container.querySelector('.meta')?.textContent).toBe('LIVE');
  });

  it('renders single-word title fully accented', () => {
    const { container } = render(<BrandSectionHead title="Activity" />);
    expect(container.querySelector('h2 em')?.textContent).toBe('Activity');
  });

  it('honours explicit accent override', () => {
    const { container } = render(<BrandSectionHead title="Capability radar" accent="radar" />);
    expect(container.querySelector('h2 em')?.textContent).toBe('radar');
  });

  it('omits meta when not provided', () => {
    const { container } = render(<BrandSectionHead title="Activity feed" />);
    expect(container.querySelector('.meta')).toBeNull();
  });
});

describe('BrandIntRow', () => {
  it('renders int-row chrome with default ok pill', () => {
    const { container } = render(<BrandIntRow name="SAP HCM" meta="last sync · 2 min ago" />);
    expect(container.querySelector('.int-row .icon svg')).toBeTruthy();
    expect(container.querySelector('.info .name')?.textContent).toBe('SAP HCM');
    expect(container.querySelector('.info .meta')?.textContent).toBe('last sync · 2 min ago');
    const pill = container.querySelector('.pill');
    expect(pill?.classList.contains('pill-ok')).toBe(true);
    expect(pill?.textContent).toBe('OK');
  });

  it('honours tone + status override', () => {
    const { container } = render(<BrandIntRow name="Workday" tone="warn" status="DEGRADED" />);
    const pill = container.querySelector('.pill.pill-warn');
    expect(pill).toBeTruthy();
    expect(pill?.textContent).toBe('DEGRADED');
  });

  it('renders custom icon node when provided', () => {
    const { container } = render(
      <BrandIntRow name="Custom" icon={<i data-testid="custom-icon" />} />
    );
    expect(screen.getByTestId('custom-icon')).toBeTruthy();
    expect(container.querySelector('.icon i[data-testid="custom-icon"]')).toBeTruthy();
  });
});

describe('BrandAuditRow', () => {
  it('renders ts/what/actor in audit-row grid', () => {
    const { container } = render(
      <BrandAuditRow ts="14:32:08" what="Role assignment updated" actor="sysadmin" />
    );
    const row = container.querySelector('.audit-row');
    expect(row).toBeTruthy();
    expect(row?.querySelector('.ts')?.textContent).toBe('14:32:08');
    expect(row?.querySelector('.what')?.textContent).toBe('Role assignment updated');
    expect(row?.querySelector('.actor')?.textContent).toBe('sysadmin');
  });

  it('omits actor slot when not provided', () => {
    const { container } = render(<BrandAuditRow ts="14:32:08" what="System startup" />);
    expect(container.querySelector('.audit-row .actor')).toBeNull();
  });

  it('supports rich React content in `what`', () => {
    const { container } = render(
      <BrandAuditRow
        ts="14:32:08"
        what={
          <>
            <strong>UPDATE</strong> <span className="accent">user.role</span>
          </>
        }
      />
    );
    expect(container.querySelector('.what strong')?.textContent).toBe('UPDATE');
    expect(container.querySelector('.what .accent')?.textContent).toBe('user.role');
  });
});
