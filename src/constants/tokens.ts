/**
 * Central design system tokens for consistent component styling across themes.
 */

export const COLOR_TOKENS = {
  primary: 'blue',
  secondary: 'slate',
  accent: 'indigo',
  success: 'emerald',
  warning: 'amber',
  danger: 'rose',
  info: 'sky',
} as const;

export const SPACING_TOKENS = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
} as const;

export const RADIUS_TOKENS = {
  none: '0',
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  full: '9999px',
} as const;

export const SHADOW_TOKENS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
} as const;

export const ANIMATION_TOKENS = {
  durationFast: 0.15,
  durationNormal: 0.25,
  durationSlow: 0.35,
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;
