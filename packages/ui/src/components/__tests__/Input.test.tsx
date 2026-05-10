import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('<Input />', () => {
  it('renders an <input> with default type=text', () => {
    render(<Input data-testid="i" />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe('text');
  });

  it('respects an explicit type prop', () => {
    render(<Input type="email" data-testid="i" />);
    expect((screen.getByTestId('i') as HTMLInputElement).type).toBe('email');
  });

  it('applies error variant class when variant=error', () => {
    render(<Input variant="error" data-testid="i" />);
    expect(screen.getByTestId('i').className).toContain('border-destructive');
  });

  it('applies inputSize=lg class with AAA touch target h-12 (48px ≥ 44px)', () => {
    render(<Input inputSize="lg" data-testid="i" />);
    expect(screen.getByTestId('i').className).toContain('h-12');
  });

  it('default inputSize=md meets AAA touch target h-11 (44px ≥ 44px)', () => {
    render(<Input data-testid="i" />);
    expect(screen.getByTestId('i').className).toContain('h-11');
  });

  it('renders label when provided and links via htmlFor/id', () => {
    render(<Input label="Email aziendale" data-testid="i" />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    const label = screen.getByText('Email aziendale') as HTMLLabelElement;
    expect(label.htmlFor).toBe(input.id);
    expect(input.id.length).toBeGreaterThan(0);
  });

  it('renders errorText with role=alert and aria-invalid on input', () => {
    render(<Input errorText="Required" data-testid="i" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Required');
    expect(screen.getByTestId('i')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards placeholder prop', () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('becomes disabled when disabled prop set', () => {
    render(<Input disabled data-testid="i" />);
    expect(screen.getByTestId('i')).toBeDisabled();
  });

  it('dispatches onChange when typed into', () => {
    let captured = '';
    render(
      <Input
        data-testid="i"
        onChange={(e) => {
          captured = e.target.value;
        }}
      />
    );
    fireEvent.change(screen.getByTestId('i'), { target: { value: 'hello' } });
    expect(captured).toBe('hello');
  });
});
