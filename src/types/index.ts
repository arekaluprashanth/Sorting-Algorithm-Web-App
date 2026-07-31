/**
 * Global TypeScript type definitions for the application foundation.
 */

/** Theme modes supported by the application. */
export type ThemeMode = 'dark' | 'light' | 'system';

/** Resolved theme (dark or light). */
export type ResolvedTheme = 'dark' | 'light';

/** Navigation link item structure. */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string;
  description?: string;
}

/** Base API Response wrapper for future backend integration. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}
