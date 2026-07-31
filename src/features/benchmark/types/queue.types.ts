import type { BenchmarkConfig, BenchmarkResult } from '../engine/types';

export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface BenchmarkJob {
  id: string;
  name: string;
  config: BenchmarkConfig;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  progress: number; // 0 to 100
  currentAlgorithm?: string;
  results?: BenchmarkResult[];
  error?: string;
}

export type QueueStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'DRAINING';

export interface QueueConfig {
  maxConcurrentJobs: number;
  autoStart: boolean;
}
