import type { NavItem } from '../types';

/** Application Metadata */
export const APP_NAME = 'SortBench';
export const APP_VERSION = '1.0.0';
export const IS_DEV = import.meta.env.DEV;

/** Storage Keys */
export const STORAGE_KEYS = {
  THEME: 'sortbench_theme_mode',
  SIDEBAR_COLLAPSED: 'sortbench_sidebar_collapsed',
  RECENT_RUNS: 'sortbench_recent_runs',
  PREFERENCES: 'sortbench_user_preferences',
} as const;

/** Theme Modes */
export const THEME_MODES = ['dark', 'light', 'system'] as const;

/** Chart Color Palette */
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
];

/** Animation Timings (in milliseconds) */
export const ANIMATION_TIMING = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
} as const;

/** Benchmark Hardware Limits */
export const BENCHMARK_LIMITS = {
  MIN_DATASET_SIZE: 10,
  MAX_DATASET_SIZE: 100000,
  DEFAULT_DATASET_SIZE: 1000,
  MAX_WARMUP_RUNS: 5,
} as const;

/** Future Backend API Endpoints */
export const API_ENDPOINTS = {
  HEALTH: '/api/v1/health',
  BENCHMARKS: '/api/v1/benchmarks',
  ALGORITHMS: '/api/v1/algorithms',
  REPORTS: '/api/v1/reports',
} as const;

/** Route Paths */
export const ROUTES = {
  DASHBOARD: '/',
  BENCHMARK: '/benchmark',
  ALGORITHMS: '/algorithms',
  COMPLEXITY: '/complexity',
  LEARNING: '/learning',
  HISTORY: '/history',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ABOUT: '/about',
} as const;

/** Navigation Sidebar & Drawer Items */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    iconName: 'LayoutDashboard',
    description: 'System overview & high-level indicators',
  },
  {
    id: 'benchmark',
    label: 'Benchmark Studio',
    path: ROUTES.BENCHMARK,
    iconName: 'Gauge',
    description: 'Configure and execute algorithm benchmark runs',
  },
  {
    id: 'algorithms',
    label: 'Algorithms',
    path: ROUTES.ALGORITHMS,
    iconName: 'Cpu',
    description: 'Catalog of sorting algorithms and specifications',
  },
  {
    id: 'complexity',
    label: 'Complexity Explorer',
    path: ROUTES.COMPLEXITY,
    iconName: 'BookOpen',
    description: 'Big-O theoretical and empirical algorithm analysis',
  },
  {
    id: 'learning',
    label: 'Learning Center',
    path: ROUTES.LEARNING,
    iconName: 'GraduationCap',
    description: 'Interactive visualization and algorithm study guide',
  },
  {
    id: 'history',
    label: 'Run History',
    path: ROUTES.HISTORY,
    iconName: 'History',
    description: 'Historical benchmark comparisons and saved logs',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: ROUTES.REPORTS,
    iconName: 'BarChart3',
    description: 'Detailed analytics and export reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.SETTINGS,
    iconName: 'Settings',
    description: 'Customize application preferences & appearance',
  },
  {
    id: 'about',
    label: 'About',
    path: ROUTES.ABOUT,
    iconName: 'Info',
    description: 'Architecture & technical implementation details',
  },
];
