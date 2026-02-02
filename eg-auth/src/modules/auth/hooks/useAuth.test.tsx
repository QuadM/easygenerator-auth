import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { ReactNode } from 'react';

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  it('should return auth operations', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('profile');
    expect(result.current).toHaveProperty('signup');
    expect(result.current).toHaveProperty('signin');
    expect(result.current).toHaveProperty('signout');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('should initialize with not authenticated state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide mutation objects with correct properties', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.signup).toHaveProperty('mutate');
    expect(result.current.signup).toHaveProperty('isPending');
    expect(result.current.signin).toHaveProperty('mutate');
    expect(result.current.signin).toHaveProperty('isPending');
    expect(result.current.signout).toHaveProperty('mutate');
    expect(result.current.signout).toHaveProperty('isPending');
  });

  it('should return consistent results on rerender', () => {
    const { result, rerender } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    const firstProfile = result.current.profile;
    const firstSignin = result.current.signin;
    
    rerender();
    
    const secondProfile = result.current.profile;
    const secondSignin = result.current.signin;

    // The hooks should return the same query/mutation instances
    expect(firstProfile.status).toBe(secondProfile.status);
    expect(firstSignin.status).toBe(secondSignin.status);
  });
});
