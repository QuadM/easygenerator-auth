import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HttpClient } from '../domain/httpClient';
import { signupSchema, signinSchema } from '../domain/schemas';
import type { z } from 'zod';
import type { ProfileResponse, SignupResponse, SigninResponse } from '../domain/types';
import {  useNavigate } from '@tanstack/react-router';

/**
 * Auth Service
 * Application layer service that orchestrates authentication operations
 * Follows DDD principles by depending on domain abstractions
 */
export class AuthService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async signup(payload: unknown): Promise<SignupResponse> {
    /* 
      The backend expects "username", but the frontend uses "email".
    */
    const data = signupSchema.parse(payload);
    
    return this.httpClient.fetchJson<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signin(payload: unknown): Promise<SigninResponse> {
    /* 
      The backend expects "username", but the frontend uses "email".
      We map email -> username here to match the backend DTO.
    */
    const data = signinSchema.parse(payload);
    
    const response = await this.httpClient.fetchJson<SigninResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data), 
    });

    // Token is now set via HttpOnly cookie
    // if (response.access_token) {
    //   this.httpClient.setAuthToken(response.access_token);
    // }

    return response;
  }

  async signout(): Promise<void> {
    await this.httpClient.fetchJson<void>("/api/auth/logout", { method: "POST" });
    // this.httpClient.clearAuthToken();
  }

  async me(): Promise<ProfileResponse> {
    return this.httpClient.fetchJson<ProfileResponse>("/api/auth/profile", { method: "GET" });
  }
}

/**
 * React Query keys for auth operations
 * Centralized query key management
 */
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Hook to get the current user profile
 * Uses React Query for caching and automatic refetching
 */
export function useProfile(authService: AuthService) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for user signup
 */
export function useSignup(authService: AuthService) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof signupSchema>) => authService.signup(payload),
    onSuccess: () => {
      // Invalidate and refetch profile after successful signup
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for user signin
 */
export function useSignin(authService: AuthService) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (payload: z.infer<typeof signinSchema>) => authService.signin(payload),
    onSuccess: () => {
      // Invalidate and refetch profile after successful signin
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      navigate({ to: '/me' }); 
    },
  });
}

/**
 * Hook for user signout
 */
export function useSignout(authService: AuthService) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.signout(),
    onSuccess: () => {
      // Clear all auth-related queries after signout
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
