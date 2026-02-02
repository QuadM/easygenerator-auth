/**
 * Domain configuration interface
 * Defines the contract for application configuration
 */
export interface AuthConfig {
  readonly backendUrl: string;
}

/**
 * Default configuration implementation
 * Uses Vite's environment variables
 */
export const createAuthConfig = (): AuthConfig => {
  const backendUrl = import.meta.env.VITE_API_URL || '';
  
  return {
    backendUrl,
  };
};
