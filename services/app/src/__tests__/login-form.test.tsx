import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { LoginForm } from '../app/login/login-form';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn().mockResolvedValue({ ok: true, url: '/dashboard', error: null }),
}));

describe('LoginForm', () => {
  it('renders username + password fields (aurora IT labels)', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email aziendale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument();
  });

  it('renders initial error if provided', () => {
    render(<LoginForm initialError="CredentialsSignin" />);
    expect(screen.getByText(/Accesso fallito: CredentialsSignin/i)).toBeInTheDocument();
  });

  it('calls signIn on submit', async () => {
    const { signIn } = await import('next-auth/react');
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email aziendale/i), 'sysadmin');
    await user.type(screen.getByLabelText(/password/i), 'Heuresys2026!');
    await user.click(screen.getByRole('button', { name: /accedi/i }));
    expect(signIn).toHaveBeenCalledWith('credentials', {
      username: 'sysadmin',
      password: 'Heuresys2026!',
      redirect: false,
      callbackUrl: '/dashboard',
    });
  });

  it('has no a11y violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
