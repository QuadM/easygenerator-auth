/**
 * HTTP Client interface
 * Defines the contract for making HTTP requests
 * This follows the Dependency Inversion Principle (SOLID)
 */
export interface HttpClient {
  /**
   * Fetch JSON data from the API
   * @param path - API endpoint path (relative to base URL)
   * @param options - Fetch options (method, headers, body, etc.)
   * @returns Promise with the parsed JSON response
   */
  fetchJson<T = unknown>(path: string, options?: RequestInit): Promise<T>;
}

/**
 * HTTP Error with additional context
 */
export class HttpError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}
