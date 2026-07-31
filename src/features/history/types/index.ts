/**
 * History & Session Management Type Definitions.
 *
 * These types power the entire history system: storage, filtering,
 * sorting, comparison, and UI state. They are the single source of
 * truth consumed by the storage layer, services, hooks, and components.
 */

import type { BenchmarkSession, BenchmarkResult } from '../../benchmark/engine/types';

// ─── Session Metadata ──────────────────────────────────────────────────────────

/** A persisted benchmark session enriched with user-facing metadata. */
export interface HistorySession {
  /** The original benchmark session data (results, config, timing). */
  session: BenchmarkSession;
  /** User-assigned display name (defaults to auto-generated). */
  name: string;
  /** Whether the user has starred this session. */
  favorite: boolean;
  /** Free-form notes the user can attach to the session. */
  notes: string;
  /** User-assigned tags for categorization. */
  tags: string[];
  /** Application version at the time of the benchmark. */
  appVersion: string;
  /** ISO-8601 date string when this history entry was created. */
  createdAt: string;
  /** ISO-8601 date string of the last modification (rename, notes, etc.). */
  updatedAt: string;
}

// ─── Filtering ─────────────────────────────────────────────────────────────────

/** Filter criteria for the history list. */
export interface HistoryFilter {
  /** Only show sessions that used at least one of these algorithms. */
  algorithmIds: string[];
  /** Only show sessions with this dataset distribution type. */
  datasetType: string;
  /** Only show sessions with dataset size in [min, max]. */
  sizeRange: [number, number] | null;
  /** Only show sessions created within this date range [start, end]. */
  dateRange: [string, string] | null;
  /** Only show favorite sessions. */
  favoriteOnly: boolean;
  /** Free-text search query (matches name, notes, algorithm names). */
  searchQuery: string;
}

/** Creates a blank filter with no restrictions applied. */
export function createEmptyFilter(): HistoryFilter {
  return {
    algorithmIds: [],
    datasetType: '',
    sizeRange: null,
    dateRange: null,
    favoriteOnly: false,
    searchQuery: '',
  };
}

// ─── Sorting ───────────────────────────────────────────────────────────────────

/** Fields that the history list can be sorted by. */
export type HistorySortField =
  | 'date'
  | 'name'
  | 'datasetSize'
  | 'executionTime'
  | 'algorithmCount';

/** Sort direction. */
export type HistorySortDirection = 'asc' | 'desc';

/** Complete sort configuration. */
export interface HistorySort {
  field: HistorySortField;
  direction: HistorySortDirection;
}

/** Default sort: newest first. */
export const DEFAULT_SORT: HistorySort = { field: 'date', direction: 'desc' };

// ─── Comparison ────────────────────────────────────────────────────────────────

/** Per-algorithm metric delta when comparing two sessions. */
export interface AlgorithmComparison {
  algorithmId: string;
  algorithmName: string;
  /** Metrics from session A. */
  sessionA: BenchmarkResult | null;
  /** Metrics from session B. */
  sessionB: BenchmarkResult | null;
  /** Positive = session B was slower/worse; Negative = session B was faster/better. */
  timeDeltaMs: number;
  comparisonsDelta: number;
  swapsDelta: number;
  memoryDeltaBytes: number;
}

/** Full comparison result between two history sessions. */
export interface ComparisonResult {
  sessionA: HistorySession;
  sessionB: HistorySession;
  /** Per-algorithm comparisons (union of algorithms from both sessions). */
  algorithms: AlgorithmComparison[];
  /** Overall summary: which session was faster on average. */
  winner: 'A' | 'B' | 'tie';
}

// ─── Storage ───────────────────────────────────────────────────────────────────

/** Storage usage statistics. */
export interface StorageStats {
  /** Bytes currently used by history data. */
  usedBytes: number;
  /** Estimated total quota in bytes (browser-dependent). */
  estimatedQuotaBytes: number;
  /** Percentage of quota used (0-100). */
  usagePercent: number;
  /** Total number of saved sessions. */
  sessionCount: number;
  /** Date of the oldest session, or null if empty. */
  oldestSessionDate: string | null;
  /** Date of the newest session, or null if empty. */
  newestSessionDate: string | null;
}
