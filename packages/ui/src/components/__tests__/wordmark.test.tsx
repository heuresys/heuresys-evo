import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeuresysWordmark } from '../wordmark';

describe('<HeuresysWordmark />', () => {
  it('renders the canonical "heuresys" lowercase wordmark', () => {
    render(<HeuresysWordmark />);
    const el = screen.getByRole('img', { name: 'heuresys' });
    expect(el.textContent).toBe('heuresys');
  });

  it('isolates the "y" letter in a styled span', () => {
    const { container } = render(<HeuresysWordmark />);
    const y = container.querySelector('.wm-y');
    expect(y).not.toBeNull();
    expect(y?.textContent).toBe('y');
  });

  it('applies default variant (Inter, ink color)', () => {
    const { container } = render(<HeuresysWordmark variant="default" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.color).toContain('var(--ink)');
    expect(root.style.fontFamily).toContain('Inter');
  });

  it('applies brand variant (Exo 2, brand-blue color)', () => {
    const { container } = render(<HeuresysWordmark variant="brand" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.color).toContain('var(--brand-blue)');
    expect(root.style.fontFamily).toContain('Exo 2');
  });

  it('applies relative variant (themed body color via --logo-body)', () => {
    const { container } = render(<HeuresysWordmark variant="relative" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.color).toContain('var(--logo-body');
  });

  it('respects size keyword "hero" (60px)', () => {
    const { container } = render(<HeuresysWordmark size="hero" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.fontSize).toBe('60px');
  });

  it('accepts arbitrary numeric size', () => {
    const { container } = render(<HeuresysWordmark size={42} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.fontSize).toBe('42px');
  });

  it('renders as the requested element via "as" prop', () => {
    const { container } = render(<HeuresysWordmark as="h1" />);
    expect(container.firstElementChild?.tagName).toBe('H1');
  });

  it('forwards a custom aria-label', () => {
    render(<HeuresysWordmark aria-label="heuresys.com" />);
    expect(screen.getByRole('img', { name: 'heuresys.com' })).toBeInTheDocument();
  });

  it('the "y" inherits accent color', () => {
    const { container } = render(<HeuresysWordmark />);
    const y = container.querySelector('.wm-y') as HTMLElement;
    expect(y.style.color).toContain('var(--accent)');
  });
});
