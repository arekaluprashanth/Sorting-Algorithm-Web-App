/**
 * Type definitions for the Dataset Generation Engine.
 */

/** Supported dataset distribution strategy types. */
export type DatasetType =
  | 'random'
  | 'sorted'
  | 'reverse-sorted'
  | 'nearly-sorted'
  | 'few-unique'
  | 'many-duplicates'
  | 'custom';

/** UI Display metadata for dataset types. */
export interface DatasetTypeDescriptor {
  id: DatasetType;
  name: string;
  description: string;
  iconName: string;
  defaultDuplicateRatio?: number;
  defaultNearlySortedPct?: number;
}

/** Options for dataset generation. */
export interface DatasetOptions {
  /** Distribution strategy type. */
  type: DatasetType;
  /** Number of elements to generate (10 to 1,000,000). */
  size: number;
  /** Minimum element value (inclusive). */
  min: number;
  /** Maximum element value (inclusive). */
  max: number;
  /** Optional integer seed for deterministic PRNG generation. */
  seed?: number;
  /** Percentage of elements swapped in nearly-sorted mode (1-50%). Default: 5%. */
  nearlySortedPercentage?: number;
  /** Ratio of unique values to size in duplicate-heavy mode (0.01-0.9). Default: 0.1. */
  duplicateRatio?: number;
  /** Raw string input when type is 'custom' (comma, space, or newline separated). */
  customInput?: string;
}

/** Backward compatibility type alias for DatasetOptions */
export type DatasetConfig = DatasetOptions;

/** Computed statistics for a dataset. */
export interface DatasetStatistics {
  min: number;
  max: number;
  average: number;
  median: number;
  range: number;
  uniqueCount: number;
  duplicateCount: number;
  duplicatePercentage: number;
  length: number;
  estimatedMemoryBytes: number;
  generationDurationMs: number;
}

/** Snapshot metadata describing a generated dataset. */
export interface DatasetMetadata {
  id: string;
  type: DatasetType;
  size: number;
  seed?: number;
  generatedAt: number;
  options: DatasetOptions;
}

/** Validation check result. */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/** Complete result payload from the dataset generator engine. */
export interface GenerationResult {
  success: boolean;
  data: number[];
  statistics: DatasetStatistics;
  metadata: DatasetMetadata;
  validation: ValidationResult;
  error?: string;
}
