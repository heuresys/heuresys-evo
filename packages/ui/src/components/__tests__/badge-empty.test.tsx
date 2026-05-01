import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from '../badge';
import { EmptyState } from '../empty-state';
import { Skeleton, Spinner } from '../skeleton';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });
  it('applies destructive variant class', () => {
    const { container } = render(<Badge variant="destructive">DEL</Badge>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });
});

describe('EmptyState', () => {
  it('renders title + description + action', () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Add your first item to begin."
        action={<button>Add</button>}
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText(/Add your first item/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<EmptyState title="Nothing" description="-" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Skeleton + Spinner', () => {
  it('Skeleton has role=status and aria-label', () => {
    render(<Skeleton className="h-4 w-32" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });
  it('Spinner exposes loading status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
