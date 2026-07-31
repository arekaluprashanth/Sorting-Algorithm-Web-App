/**
 * BenchmarkRunner — orchestrates sorting algorithm benchmarks.
 *
 * Handles dataset cloning, JIT warm-up iterations, timing with
 * performance.now(), correctness validation, and metrics collection.
 * This is the primary entry point for running benchmarks.
 */

import type { BenchmarkConfig, BenchmarkResult, BenchmarkSession } from './types';
import { getAlgorithm } from './algorithms';
import { createMetricsCollector } from './metrics-collector';

/** Bytes per number element (Float64 in JS). */
const BYTES_PER_ELEMENT = 8;

/**
 * Generates a unique session ID.
 * Uses timestamp + random suffix for uniqueness without external deps.
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `bench-${timestamp}-${random}`;
}

/**
 * Validates that an array is correctly sorted in ascending order.
 */
function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i]! < arr[i - 1]!) return false;
  }
  return true;
}

/**
 * Run a single algorithm benchmark with warm-up and measurement.
 *
 * @param algorithmId - ID of the algorithm to benchmark.
 * @param dataset - The original dataset (will be cloned, not mutated).
 * @param datasetType - Label describing the dataset distribution.
 * @param warmupIterations - Number of warm-up runs before measurement.
 * @returns The benchmark result with all metrics.
 */
function runSingleBenchmark(
  algorithmId: string,
  dataset: number[],
  datasetType: string,
  warmupIterations: number,
): BenchmarkResult {
  const algorithm = getAlgorithm(algorithmId);

  // JIT warm-up: run the algorithm without recording metrics
  // to let the JS engine optimize the hot paths.
  for (let i = 0; i < warmupIterations; i++) {
    const warmupData = [...dataset];
    const warmupCollector = createMetricsCollector();
    algorithm.sort(warmupData, warmupCollector);
  }

  // Actual measurement
  const data = [...dataset];
  const collector = createMetricsCollector();

  const startTime = performance.now();
  const sorted = algorithm.sort(data, collector);
  const endTime = performance.now();

  const metrics = collector.getMetrics();
  const correct = isSorted(sorted);

  return {
    algorithmId: algorithm.id,
    algorithmName: algorithm.name,
    datasetSize: dataset.length,
    datasetType,
    executionTimeMs: endTime - startTime,
    comparisons: metrics.comparisons,
    swaps: metrics.swaps,
    memoryEstimateBytes: metrics.peakMemoryElements * BYTES_PER_ELEMENT,
    maxRecursionDepth: metrics.maxRecursionDepth,
    correct,
    timestamp: Date.now(),
  };
}

/**
 * Run a complete benchmark session across multiple algorithms.
 *
 * Each algorithm receives an identical clone of the dataset for fair comparison.
 * Results are collected sequentially to avoid measurement interference.
 *
 * @param config - Benchmark configuration (algorithms, dataset, options).
 * @returns A complete benchmark session with all results.
 */
export function runBenchmarkSession(config: BenchmarkConfig): BenchmarkSession {
  const sessionId = generateSessionId();
  const startedAt = Date.now();

  const results: BenchmarkResult[] = config.algorithmIds.map((algorithmId) =>
    runSingleBenchmark(
      algorithmId,
      config.dataset,
      config.datasetType,
      config.warmupIterations,
    ),
  );

  const completedAt = Date.now();

  return {
    id: sessionId,
    results,
    config: {
      algorithmIds: config.algorithmIds,
      datasetType: config.datasetType,
      warmupIterations: config.warmupIterations,
      datasetSize: config.dataset.length,
    },
    startedAt,
    completedAt,
  };
}
