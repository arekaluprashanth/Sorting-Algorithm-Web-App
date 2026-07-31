import { siteConfig } from '../config/site.config';
import type { ApiResponse } from '../types';

/**
 * Service API client shell for future backend synchronization.
 * Uses environment variable `VITE_API_URL` dynamically.
 */
export class ApiService {
  private static baseUrl = siteConfig.apiUrl;

  /**
   * Universal fetch helper with standardized error handling and typing.
   */
  public static async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      return {
        success: true,
        data,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network error',
        },
        timestamp: Date.now(),
      };
    }
  }
}
