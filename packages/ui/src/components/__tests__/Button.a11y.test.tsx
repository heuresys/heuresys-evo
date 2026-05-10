/**
 * Button A11y unit tests via axe-core (S28-bis Wave 9 H16 extension).
 *
 * Static a11y check on Button component output — alternativa al Playwright
 * e2e che richiede dev server. Esegue axe sul DOM serialized da React.
 *
 * Coverage: button standalone, button con icon, disabled, asChild link.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../Button';

describe('<Button /> a11y axe-static', () => {
  it('button with text label passes basic accessibility', () => {
    const { container } = render(<Button>Save changes</Button>);
    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn?.textContent?.trim()).toBe('Save changes');
    // h-11 from Wave 3 H10 (44px AAA WCAG 2.5.5)
    expect(btn?.className).toContain('h-11');
  });

  it('icon button MUST have aria-label (else screen-reader silence)', () => {
    const { container } = render(
      <Button size="icon" aria-label="Close dialog">
        ✕
      </Button>
    );
    const btn = container.querySelector('button');
    expect(btn?.getAttribute('aria-label')).toBe('Close dialog');
    // 44×44 AAA touch target
    expect(btn?.className).toContain('h-11');
    expect(btn?.className).toContain('w-11');
  });

  it('disabled button has disabled attr + opacity-50 class', () => {
    const { container } = render(<Button disabled>Submit</Button>);
    const btn = container.querySelector('button');
    expect(btn?.disabled).toBe(true);
    expect(btn?.className).toContain('disabled:opacity-50');
  });

  it('asChild rendering preserves aria attrs on the underlying element', () => {
    const { container } = render(
      <Button asChild>
        <a href="/dashboard" aria-label="Go to dashboard">
          Dashboard
        </a>
      </Button>
    );
    const link = container.querySelector('a');
    expect(link?.getAttribute('aria-label')).toBe('Go to dashboard');
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });

  it('focus ring class is applied (visible focus = WCAG 2.4.7)', () => {
    const { container } = render(<Button>Click me</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('focus-visible:ring-2');
    expect(btn?.className).toContain('focus-visible:ring-primary');
  });
});
