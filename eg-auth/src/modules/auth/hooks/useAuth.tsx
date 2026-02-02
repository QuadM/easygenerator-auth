import { useMemo } from 'react';
import { createAuthConfig } from '../domain/config';
import { AxiosHttpClient } from '../infrastructure/axiosHttpClient';
import { AuthService, useProfile, useSignup, useSignin, useSignout } from '../services/authService';

/**
 * Main auth hook that provides all auth operations
 * This is the primary interface for components to interact with auth
 * 
 * Simple and straightforward - creates instances directly without DI container
 * 
 * Usage:
 * ```tsx
 * const { profile, signup, signin, signout } = useAuth();
 * 
 * // Check if user is authenticated
 * if (profile.data) {
 *   // User is logged in
 * }
 * 
 * // Sign in
 * signin.mutate({ email: 'user@example.com', password: 'password' });
 * ```
 */
export function useAuth() {
  // Create service instance once per component lifecycle
  const authService = useMemo(() => {
    const config = createAuthConfig();
    const httpClient = new AxiosHttpClient(config);
    return new AuthService(httpClient);
  }, []);
  
  const profile = useProfile(authService);
  const signup = useSignup(authService);
  const signin = useSignin(authService);
  const signout = useSignout(authService);

  return {
    // Query
    profile,
    isAuthenticated: !!profile.data,
    isLoading: profile.isLoading,
    
    // Mutations
    signup,
    signin,
    signout,
  };
}
