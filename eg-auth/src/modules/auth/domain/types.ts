/**
 * User entity
 * Domain model representing an authenticated user
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
}

/**
 * Authentication response types
 */
export interface SignupResponse {
  user: User;
  message?: string;
}

export interface SigninResponse {
  user: User;
  access_token: string;
  message?: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name?: string;
  username?: string;
}
