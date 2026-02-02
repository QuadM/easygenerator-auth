/**
 * Legacy API file
 * @deprecated Use AxiosHttpClient from './axiosHttpClient' instead
 * 
 * This file is kept for backward compatibility only.
 * All new code should use the axios-based implementation.
 */

export { AxiosHttpClient as FetchHttpClient } from './axiosHttpClient';
export type { HttpClient } from '../domain/httpClient';
export { HttpError } from '../domain/httpClient';

/**
 * Legacy fetchJson function for backward compatibility
 * @deprecated Use AxiosHttpClient instance instead
 */
export async function fetchJson(path: string, opts: RequestInit = {}) {
  const { AxiosHttpClient } = await import('./axiosHttpClient');
  const { createAuthConfig } = await import('../domain/config');
  
  const config = createAuthConfig();
  const client = new AxiosHttpClient(config);
  return client.fetchJson(path, opts);
}
