import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, buttonVariants } from '../Button';

describe('<Button />', () => {
  it('renders children inside a <button>', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('applies the default variant class when no variant prop given', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-primary');
  });

  it.each(['secondary', 'outline', 'ghost', 'destructive', 'link'] as const)(
    'applies the %s variant class',
    (variant) => {
      render(<Button variant={variant}>X</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toEqual(expect.stringContaining(buttonVariants({ variant })));
    }
  );

  it('applies the requested size class (lg) — AAA touch target h-12 (48px ≥ 44px)', () => {
    render(<Button size="lg">X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-12');
  });

  it('default size=md meets AAA touch target h-11 (44px ≥ 44px)', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-11');
  });

  it('size=icon meets AAA touch target h-11 w-11 (44×44px)', () => {
    render(
      <Button size="icon" aria-label="close">
        X
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-11');
    expect(btn.className).toContain('w-11');
  });

  it('merges custom className onto the variant class', () => {
    render(<Button className="custom-foo">X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('custom-foo');
    expect(btn.className).toContain('bg-primary');
  });

  it('forwards arbitrary native button props (disabled)', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards aria-label for accessibility', () => {
    render(<Button aria-label="close dialog">X</Button>);
    expect(screen.getByRole('button', { name: 'close dialog' })).toBeInTheDocument();
  });

  it('when asChild=true renders the child element instead of <button>', () => {
    render(
      <Button asChild>
        <a href="/dashboard" data-testid="anchor">
          Go
        </a>
      </Button>
    );
    const link = screen.getByTestId('anchor');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link.className).toContain('bg-primary');
  });
});
