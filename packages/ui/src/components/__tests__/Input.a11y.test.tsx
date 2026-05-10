/**
 * Input A11y unit tests via static DOM check (S28-bis Wave 9 H16 extension).
 *
 * Verifica le proprietà a11y del componente Input post-refactor Wave 2:
 * - label-input htmlFor/id pairing
 * - aria-invalid + aria-describedby quando errorText
 * - role=alert su errorText
 * - AAA touch target h-11 (44px)
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('<Input /> a11y form-field', () => {
  it('without label: standalone input has correct h-11 touch target', () => {
    const { container } = render(<Input placeholder="Search…" data-testid="i" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('h-11');
  });

  it('with label: htmlFor matches input id (programmatic association)', () => {
    render(<Input label="Email" data-testid="i" />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    const label = screen.getByText('Email') as HTMLLabelElement;
    expect(label.htmlFor).toBe(input.id);
    expect(input.id.length).toBeGreaterThan(0);
  });

  it('errorText: input has aria-invalid + aria-describedby + alert role', () => {
    render(<Input label="Email" errorText="Email is required" data-testid="i" />);
    const input = screen.getByTestId('i');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Email is required');
    expect(alert.id).toBe(helperId);
  });

  it('helperText (no error): aria-describedby points to helper, no aria-invalid', () => {
    render(<Input label="Username" helperText="3-30 alphanumeric chars" data-testid="i" />);
    const input = screen.getByTestId('i');
    expect(input).not.toHaveAttribute('aria-invalid');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helper = screen.getByText('3-30 alphanumeric chars');
    expect(helper.id).toBe(helperId);
  });

  it('error variant CSS class is applied when errorText is set', () => {
    render(<Input errorText="Required" data-testid="i" />);
    const input = screen.getByTestId('i');
    expect(input.className).toContain('border-destructive');
  });

  it('disabled state has disabled attr and opacity-50 class', () => {
    render(<Input disabled data-testid="i" />);
    const input = screen.getByTestId('i');
    expect(input).toBeDisabled();
    expect(input.className).toContain('disabled:opacity-50');
  });
});
