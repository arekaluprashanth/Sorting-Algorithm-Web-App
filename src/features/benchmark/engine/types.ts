/**
 * Core type definitions for the sorting benchmark engine.
 *
 * These interfaces define the contract that all sorting algorithms,
 * the metrics collector, and the benchmark runner must follow.
 * This is the single source of truth for the engine's type system.
 */

// ─── Algorithm Metadata ────────────────────────────────────────────────────────

/** Classification of sorting algorithms by their comparison strategy. */
export type AlgorithmCategory = 'comparison' | 'non-comparison' | 'hybrid';

/** Big-O complexity notation for best, average, and worst cases. */
export interface ComplexityProfile {
  best: string;
  average: string;
  worst: string;
}

/**
 * Describes a sorting algorithm's identity and theoretical characteristics.
 * Every algorithm in the registry must provide this metadata.
 */
export interface AlgorithmInfo {
  /** Unique identifier (kebab-case, e.g. "bubble-sort"). */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Algorithm classification. */
  category: AlgorithmCategory;
  /** Time complexity profile. */
  timeComplexity: ComplexityProfile;
  /** Space complexity (Big-O notation). */
  spaceComplexity: string;
  /** Whether the algorithm preserves relative order of equal elements. */
  stable: boolean;
  /** Short description of how the algorithm works. */
  description: string;
}

// ─── Metrics Collection ────────────────────────────────────────────────────────

/**
 * Instrumentation interface injected into sorting algorithms.
 *
 * Algorithms call these methods instead of raw array operations so that
 * comparisons, swaps, memory allocations, and recursion depth are tracked
 * transparently without polluting the algorithm logic.
 */
export interface MetricsCollector {
  /**
   * Record and perform a comparison between two values.
   * Returns a negative number if a < b, 0 if equal, positive if a > b.
   */
  compare(a: number, b: number): number;

  /**
   * Record and perform a swap of two elements in the array.
   */
  swap(arr: number[], i: number, j: number): void;

  /**
   * Record a memory allocation of the given size (in elements).
   * Call this when creating auxiliary arrays (e.g., merge sort temp arrays).
   */
  allocate(size: number): void;

  /**
   * Record entering a new level of recursion.
   * Call at the start of recursive function bodies.
   */
  pushRecursion(): void;

  /**
   * Record leaving a level of recursion.
   * Call before returning from recursive function bodies.
   */
  popRecursion(): void;

  /** Retrieve the collected metrics snapshot. */
  getMetrics(): CollectedMetrics;
}

/** Raw metrics collected during algorithm execution. */
export interface CollectedMetrics {
  comparisons: number;
  swaps: number;
  memoryAllocations: number;
  peakMemoryElements: number;
  maxRecursionDepth: number;
}

// ─── Sorting Algorithm Contract ────────────────────────────────────────────────

/**
 * The Strategy interface for sorting algorithms.
 *
 * Every algorithm must implement this interface. The `sort` method receives
 * a mutable array and a `MetricsCollector` for instrumentation.
 * It must return the sorted array (which may be the same reference).
 */
export interface SortingAlgorithm extends AlgorithmInfo {
  /**
   * Sort the given array in ascending order.
   *
   * @param arr - The array to sort (may be mutated in-place).
   * @param collector - Metrics instrumentation interface.
   * @returns The sorted array.
   */
  sort(arr: number[], collector: MetricsCollector): number[];
}

// ─── Benchmark Results ─────────────────────────────────────────────────────────

/** Complete result of a single benchmark run for one algorithm. */
export interface BenchmarkResult {
  /** Which algorithm was benchmarked. */
  algorithmId: string;
  /** Human-readable algorithm name. */
  algorithmName: string;
  /** Number of elements in the dataset. */
  datasetSize: number;
  /** Type of dataset distribution used. */
  datasetType: string;
  /** Wall-clock execution time in milliseconds. */
  executionTimeMs: number;
  /** Total number of element comparisons. */
  comparisons: number;
  /** Total number of element swaps. */
  swaps: number;
  /** Estimated peak memory usage in bytes. */
  memoryEstimateBytes: number;
  /** Maximum recursion depth reached. */
  maxRecursionDepth: number;
  /** Whether the algorithm produced a correctly sorted output. */
  correct: boolean;
  /** Unix timestamp of the benchmark run. */
  timestamp: number;
}

/** Configuration for a benchmark run. */
export interface BenchmarkConfig {
  /** IDs of algorithms to benchmark. */
  algorithmIds: string[];
  /** The dataset to sort. */
  dataset: number[];
  /** Metadata about the dataset. */
  datasetType: string;
  /** Number of warm-up iterations before measurement. */
  warmupIterations: number;
}

/** Result of a complete benchmark session (multiple algorithms). */
export interface BenchmarkSession {
  /** Unique session identifier. */
  id: string;
  /** Results for each algorithm. */
  results: BenchmarkResult[];
  /** Session configuration. */
  config: Omit<BenchmarkConfig, 'dataset'> & { datasetSize: number };
  /** When the session started. */
  startedAt: number;
  /** When the session completed. */
  completedAt: number;
}
