import type { AlgorithmId, AlgorithmInformation, SortingMetrics } from '../../features/algorithms/types';

/**
 * Configuration for a benchmark session.
 */
export interface BenchmarkConfiguration {
  /** The algorithms selected to be benchmarked */
  algorithms: AlgorithmId[];
  /** The master dataset to sort (will be cloned for each execution) */
  dataset: number[];
  /** Number of warm-up iterations to run (results discarded) */
  warmUpRuns: number;
  /** Number of actual measured iterations to run */
  measuredRuns: number;
  /** Milliseconds to delay between runs to prevent UI freezing */
  delayBetweenRunsMs: number;
  /** Maximum execution time per algorithm in milliseconds */
  timeoutMs: number;
  /** Global timeout for the entire benchmark session */
  maxExecutionTimeMs: number;
  /** Abort signal to cancel the benchmark */
  abortSignal?: AbortSignal;
  /** Should execution run in a Web Worker? (Phase 6) */
  useWebWorker: boolean;
}

/**
 * Statistical summary of metric properties across multiple runs.
 */
export interface BenchmarkStatistics {
  averageTimeMs: number;
  medianTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  standardDeviationTimeMs: number;
  varianceTimeMs: number;
  /** How many sorting operations of this dataset size can be done in 1 second */
  operationsPerSecond: number;
}

/**
 * Overall benchmark result for a single algorithm after all iterations complete.
 */
export interface BenchmarkResult {
  algorithmId: AlgorithmId;
  algorithmInfo: AlgorithmInformation;
  success: boolean;
  /** Overall statistics calculated from all measured runs */
  statistics?: BenchmarkStatistics;
  /** Aggregated/average metrics from the runs */
  metrics?: SortingMetrics;
  /** Array of metrics for every single measured run (for raw data analysis) */
  runMetrics: SortingMetrics[];
  /** Execution error if the algorithm failed */
  error?: string;
  /** Total elapsed time for this algorithm (including warm-ups) */
  totalElapsedMs: number;
}

/**
 * Progress update structure for the UI.
 */
export interface BenchmarkProgress {
  status: ExecutionStatus;
  currentAlgorithmId?: AlgorithmId;
  currentIteration: number;
  totalIterations: number;
  completedAlgorithms: number;
  totalAlgorithms: number;
  percentageComplete: number;
  estimatedRemainingTimeMs?: number;
}

/**
 * Complete snapshot of a benchmark session.
 */
export interface BenchmarkSession {
  sessionId: string;
  status: ExecutionStatus;
  configuration: BenchmarkConfiguration;
  results: BenchmarkResult[];
  progress: BenchmarkProgress;
  startTime: number;
  endTime?: number;
  error?: string;
}

export type ExecutionStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ABORTED' | 'ERROR';

export interface ExecutionError extends Error {
  algorithmId?: AlgorithmId;
  fatal: boolean;
}

/**
 * Interface representing an executable job in the benchmark queue.
 */
export interface BenchmarkJob {
  algorithmId: AlgorithmId;
  dataset: number[];
  configuration: BenchmarkConfiguration;
}

/**
 * Events that the benchmark engine will emit.
 */
export interface BenchmarkEngineEvents {
  onProgress?: (progress: BenchmarkProgress) => void;
  onAlgorithmComplete?: (result: BenchmarkResult) => void;
  onComplete?: (session: BenchmarkSession) => void;
  onError?: (error: Error) => void;
}
