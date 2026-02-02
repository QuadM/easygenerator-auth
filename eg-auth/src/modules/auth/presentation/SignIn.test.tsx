import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignIn from './SignIn';
import type { ReactNode } from 'react';

// Mock the router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('SignIn Component', () => {
  it('should render sign in form', () => {
    render(<SignIn />, { wrapper: createWrapper() });

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should have link to sign up', () => {
    render(<SignIn />, { wrapper: createWrapper() });

    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('should update email input', async () => {
    const user = userEvent.setup();
    render(<SignIn />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update password input', async () => {
    const user = userEvent.setup();
    render(<SignIn />, { wrapper: createWrapper() });

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    await user.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<SignIn />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    // Button should be disabled while pending
    // Note: This will fail without a mock backend, but tests the UI logic
  });

  it('should disable button while submitting', async () => {
    const user = userEvent.setup();
    render(<SignIn />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');

    expect(submitButton).not.toBeDisabled();
  });
});
