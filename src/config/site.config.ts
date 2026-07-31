/**
 * Application configuration & environment settings.
 */

export const siteConfig = {
  name: 'SortBench',
  version: '1.0.0',
  description: 'Production-ready Sorting Algorithm Benchmark Platform',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  githubUrl: 'https://github.com/example/sorting-benchmark',
  defaultTheme: 'dark' as const,
  maxDatasetSize: 100000,
  minDatasetSize: 10,
};
