/**
 * Auth Module Public API
 * 
 * This is the main entry point for the auth module.
 * It exports only the necessary public interfaces following the
 * Dependency Inversion and Interface Segregation principles (SOLID).
 */

// Hooks - Primary interface for React components
export { useAuth } from './hooks/useAuth';

// Providers - Required for app setup
export { QueryProvider } from './providers/QueryProvider';

// Domain types - For TypeScript consumers
export type { AuthConfig } from './domain/config';
export type { HttpClient } from './domain/httpClient';
export { HttpError } from './domain/httpClient';
export type { User, ProfileResponse, SignupResponse, SigninResponse } from './domain/types';

// Schemas - For form validation
export { signupSchema, signinSchema } from './domain/schemas';
