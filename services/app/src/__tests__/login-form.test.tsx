import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { LoginForm } from '../app/login/login-form';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn().mockResolvedValue({ ok: true, url: '/dashboard', error: null }),
}));

describe('LoginForm', () => {
  it('renders username + password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders initial error if provided', () => {
    render(<LoginForm initialError="CredentialsSignin" />);
    expect(screen.getByText(/Sign-in failed: CredentialsSignin/i)).toBeInTheDocument();
  });

  it('calls signIn on submit', async () => {
    const { signIn } = await import('next-auth/react');
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/username/i), 'evo.dev');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(signIn).toHaveBeenCalledWith('credentials', {
      username: 'evo.dev',
      password: 'admin123',
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
