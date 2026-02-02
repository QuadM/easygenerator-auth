import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { HttpClient } from '../domain/httpClient';
import { HttpError } from '../domain/httpClient';
import type { AuthConfig } from '../domain/config';

/**
 * CSRF Token Manager
 * Handles CSRF token retrieval and caching
 * Single Responsibility Principle (SOLID)
 */
class CsrfTokenManager {
  private getCookie(name: string): string | null {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  }

  getToken(): string | null {
    // Try to get from cookies first
    let csrf = this.getCookie("psifi.x-csrf-token");
    // Fallback to __Host- prefixed cookie if locally absent or production
    if (!csrf) csrf = this.getCookie("__Host-psifi.x-csrf-token");
    return csrf;
  }

  async fetchToken(backendUrl: string): Promise<string | null> {
    try {
      // Must use withCredentials to ensure the Set-Cookie header is respected
      const tokenRes = await axios.get(`${backendUrl}/api/csrf/token`, {
        withCredentials: true,
      });
      return tokenRes.data?.csrfToken || null;
    } catch (e) {
      console.error("Failed to fetch CSRF token", e);
      return null;
    }
  }

  shouldIncludeToken(method: string): boolean {
    return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
  }
}

/**
 * Axios-based HTTP Client Implementation
 * Implements the HttpClient interface from the domain layer
 * Infrastructure layer implementation (DDD)
 * 
 * This class follows SOLID principles:
 * - Single Responsibility: Only handles HTTP communication
 * - Open/Closed: Can be extended without modification
 * - Liskov Substitution: Implements HttpClient interface
 * - Interface Segregation: HttpClient interface is minimal
 * - Dependency Inversion: Depends on AuthConfig abstraction
 */
export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;
  private csrfManager: CsrfTokenManager;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
    this.csrfManager = new CsrfTokenManager();
    
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: config.backendUrl || "http://localhost:3000",
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup request interceptor for CSRF tokens
    this.setupRequestInterceptor();
    
    // Setup response interceptor for error handling
    this.setupResponseInterceptor();
  }

  /**
   * Setup request interceptor to add CSRF tokens
   */
  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const method = config.method?.toUpperCase() || 'GET';

        // NOTE: We no longer manually attach the Bearer token.
        // The backend uses an HttpOnly cookie for authentication.
        
        if (this.csrfManager.shouldIncludeToken(method)) {
          let csrf = this.csrfManager.getToken();
          
          // If no token in cookies, try to fetch it
          if (!csrf) {
            csrf = await this.csrfManager.fetchToken(this.config.backendUrl);
          }
          
          if (csrf && config.headers) {
            config.headers['x-csrf-token'] = csrf;
          }
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Setup response interceptor for consistent error handling
   */
  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status || 500;
          const message = error.response?.data?.message || error.response?.data?.error || error.message;
          const data = error.response?.data;
          
          throw new HttpError(message, status, data);
        }
        throw error;
      }
    );
  }

  /**
   * Fetch JSON data from the API
   * @param path - API endpoint path (relative to base URL)
   * @param options - Request options (method, headers, body, etc.)
   * @returns Promise with the parsed JSON response
   */
  async fetchJson<T = unknown>(path: string, options?: RequestInit): Promise<T> {
    const axiosConfig: AxiosRequestConfig = {
      url: path,
      method: (options?.method as AxiosRequestConfig['method']) || 'GET',
      headers: options?.headers as Record<string, string>,
      data: options?.body,
    };

    const response = await this.axiosInstance.request<T>(axiosConfig);
    return response.data;
  }



  /**
   * Get the underlying axios instance for advanced use cases
   * This allows consumers to use axios-specific features if needed
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
