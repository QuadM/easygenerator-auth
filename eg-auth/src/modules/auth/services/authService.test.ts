import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './authService';
import type { HttpClient } from '../domain/httpClient';
import type { ProfileResponse, SignupResponse, SigninResponse } from '../domain/types';

describe('AuthService', () => {
  let mockHttpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    mockHttpClient = {
      fetchJson: vi.fn(),
    };
    authService = new AuthService(mockHttpClient);
  });

  describe('signup', () => {
    it('should call httpClient with correct parameters', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'Password@123',
        username: 'testuser',
      };

      const mockResponse: SignupResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
        },
      };

      vi.mocked(mockHttpClient.fetchJson).mockResolvedValue(mockResponse);

      const result = await authService.signup(signupData);

      expect(mockHttpClient.fetchJson).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('signin', () => {
    it('should call httpClient and store token', async () => {
      const signinData = {
        email: 'test@example.com',
        password: 'Password@123',
      };

      const mockResponse: SigninResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
        },
        access_token: 'valid-jwt-token',
      };

      vi.mocked(mockHttpClient.fetchJson).mockResolvedValue(mockResponse);

      const result = await authService.signin(signinData);

      expect(mockHttpClient.fetchJson).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(signinData),
      });
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signout', () => {
    it('should call httpClient and clear token', async () => {
      vi.mocked(mockHttpClient.fetchJson).mockResolvedValue(undefined);

      await authService.signout();

      expect(mockHttpClient.fetchJson).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      });

    });
  });

  describe('me', () => {
    it('should call httpClient and return profile', async () => {
      const mockProfile: ProfileResponse = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      vi.mocked(mockHttpClient.fetchJson).mockResolvedValue(mockProfile);

      const result = await authService.me();

      expect(mockHttpClient.fetchJson).toHaveBeenCalledWith('/api/auth/profile', {
        method: 'GET',
      });

      expect(result).toEqual(mockProfile);
    });
  });
});
