import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { PageHeader } from '../page-header';
import { Breadcrumbs } from '../breadcrumbs';
import { Stepper } from '../stepper';
import { Pagination } from '../pagination';
import { FAB } from '../fab';
import { MobileBottomNav } from '../mobile-nav';
import { Plus } from 'lucide-react';
import { Banner } from '../banner';
import { StatsCard } from '../stats-card';
import { AchievementBadge } from '../achievement-badge';

describe('PageHeader', () => {
  it('renders title + description + actions', () => {
    render(
      <PageHeader title="Employees" description="Manage your team" actions={<button>Add</button>} />
    );
    expect(screen.getByRole('heading', { name: /employees/i })).toBeInTheDocument();
    expect(screen.getByText(/manage your team/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
  it('a11y clean', async () => {
    const { container } = render(<PageHeader title="Test" description="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Breadcrumbs', () => {
  it('renders nav with last item as current', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings' },
          { label: 'Profile' },
        ]}
      />
    );
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  });
  it('collapses overflow when items > maxItems', () => {
    const items = Array.from({ length: 8 }, (_, i) => ({ label: `Item ${i + 1}`, href: `#${i}` }));
    render(<Breadcrumbs items={items} maxItems={4} />);
    expect(screen.getByLabelText(/show.*hidden/i)).toBeInTheDocument();
  });
});

describe('Stepper', () => {
  it('renders all steps and marks current', () => {
    render(
      <Stepper
        steps={[
          { id: 'a', label: 'Account' },
          { id: 'b', label: 'Plan' },
          { id: 'c', label: 'Confirm' },
        ]}
        current={1}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
  });
});

describe('Pagination', () => {
  it('disables prev on first page and emits onPageChange', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    await user.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

describe('FAB', () => {
  it('renders accessible button with label', () => {
    render(<FAB label="Add new" icon={<Plus />} />);
    expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument();
  });
});

describe('MobileBottomNav', () => {
  it('renders up to 5 items and respects active', () => {
    render(
      <MobileBottomNav
        items={[
          { id: 'home', label: 'Home', icon: <span>H</span>, active: true },
          { id: 'team', label: 'Team', icon: <span>T</span> },
          { id: 'inbox', label: 'Inbox', icon: <span>I</span>, badge: 3 },
        ]}
      />
    );
    expect(screen.getByText('Home').closest('button')).toHaveAttribute('aria-current', 'page');
  });
});

describe('Banner', () => {
  it('renders with title + content', () => {
    render(
      <Banner title="Heads up" tone="warning">
        Maintenance soon
      </Banner>
    );
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText(/maintenance soon/i)).toBeInTheDocument();
  });
});

describe('StatsCard', () => {
  it('renders label + value + trend direction', () => {
    render(
      <StatsCard
        label="Revenue"
        value={1234}
        unit="USD"
        trend={5.2}
        trendDirection="up"
        animate={false}
      />
    );
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText(/5.2%/)).toBeInTheDocument();
  });
});

describe('AchievementBadge', () => {
  it('exposes locked vs unlocked aria label', () => {
    const { rerender } = render(<AchievementBadge title="First win" tier="gold" unlocked />);
    expect(screen.getByLabelText(/unlocked.*gold.*first win/i)).toBeInTheDocument();
    rerender(<AchievementBadge title="First win" tier="gold" unlocked={false} />);
    expect(screen.getByLabelText(/locked.*gold.*first win/i)).toBeInTheDocument();
  });
});
