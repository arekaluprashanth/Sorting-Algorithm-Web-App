import type { BenchmarkConfiguration } from '../types';

export const DEFAULT_BENCHMARK_CONFIG: Partial<BenchmarkConfiguration> = {
  warmUpRuns: 3,
  measuredRuns: 10,
  delayBetweenRunsMs: 10, // Small yield to main thread
  timeoutMs: 5000, // 5 seconds per algorithm by default
  maxExecutionTimeMs: 60000, // 60 seconds total session max
  useWebWorker: false,
};

export const BENCHMARK_ERROR_MESSAGES = {
  NO_ALGORITHMS: 'No algorithms selected for benchmarking.',
  EMPTY_DATASET: 'Dataset is empty or invalid.',
  TIMEOUT: 'Algorithm execution exceeded maximum allowed time.',
  ABORTED: 'Benchmark session was aborted by the user.',
};
