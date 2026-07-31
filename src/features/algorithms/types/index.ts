/**
 * Comprehensive TypeScript Type Definitions for the Sorting Algorithm Engine.
 */

/** Identifier union of all supported sorting algorithms. */
export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'shell'
  | 'counting'
  | 'radix';

/** Category classification of sorting algorithms. */
export type AlgorithmCategory = 'comparison' | 'non-comparison' | 'hybrid';

/** Pivot selection strategies for Quick Sort. */
export type QuickSortPivotStrategy = 'first' | 'last' | 'middle' | 'random' | 'median-of-three';

/** Configuration options passed to sorting algorithms. */
export interface SortingConfiguration {
  /** Sort order direction. Default: 'ascending'. */
  order?: 'ascending' | 'descending';
  /** Pivot strategy for Quick Sort. Default: 'median-of-three'. */
  pivotStrategy?: QuickSortPivotStrategy;
  /** Allow custom threshold for hybrid algorithms (e.g. Insertion sort cutoff in Merge/Quick). */
  threshold?: number;
}

/** Quantitative metrics collected during an algorithm execution run. */
export interface SortingMetrics {
  /** Execution time in milliseconds (sub-millisecond precision via performance.now()). */
  executionTimeMs: number;
  /** Number of element comparisons made. */
  comparisons: number;
  /** Number of element swaps performed. */
  swaps: number;
  /** Number of array element writes. */
  writes: number;
  /** Number of array element reads. */
  reads: number;
  /** Number of main loop iterations executed. */
  iterations: number;
  /** Total number of recursive function calls invoked. */
  recursiveCalls: number;
  /** Maximum recursion call stack depth reached. */
  maxRecursionDepth: number;
  /** Estimated auxiliary memory footprint in bytes. */
  estimatedMemoryBytes: number;
  /** Length of the input array. */
  inputSize: number;
  /** Length of the output sorted array. */
  outputSize: number;
  /** Timestamp when the execution completed. */
  timestamp: number;
}

/** Asymptotic time complexity definitions. */
export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

/** Complete theoretical metadata describing a sorting algorithm. */
export interface AlgorithmInformation {
  id: AlgorithmId;
  name: string;
  description: string;
  category: AlgorithmCategory;
  isStable: boolean;
  isInPlace: boolean;
  isRecursive: boolean;
  complexity: AlgorithmComplexity;
  suitableDatasetSizes: string;
  advantages: string[];
  disadvantages: string[];
}

/** Complete result output returned by any sorting algorithm. */
export interface SortingResult {
  /** Whether the algorithm executed and produced a valid sorted array. */
  success: boolean;
  /** The sorted array payload (cloned, original array remains unmutated). */
  data: number[];
  /** Detailed performance metrics collected during the run. */
  metrics: SortingMetrics;
  /** Theoretical metadata describing the algorithm. */
  info: AlgorithmInformation;
  /** Error message if sorting failed. */
  error?: string;
}

/** Contract interface that every sorting algorithm class must implement. */
export interface SortingAlgorithm {
  readonly info: AlgorithmInformation;
  sort(data: number[], config?: SortingConfiguration): SortingResult;
}
