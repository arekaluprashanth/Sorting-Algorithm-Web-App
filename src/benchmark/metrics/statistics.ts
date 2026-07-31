import type { BenchmarkStatistics } from '../types';
import type { SortingMetrics } from '../../features/algorithms/types';

/**
 * Calculates benchmark statistical aggregates from a list of runs.
 *
 * @param runMetrics - The collection of metrics gathered across iterations.
 * @returns Computed BenchmarkStatistics or a default payload if metrics is empty.
 */
export const calculateStatistics = (runMetrics: SortingMetrics[]): BenchmarkStatistics => {
  if (!runMetrics.length) {
    return {
      averageTimeMs: 0,
      medianTimeMs: 0,
      minTimeMs: 0,
      maxTimeMs: 0,
      standardDeviationTimeMs: 0,
      varianceTimeMs: 0,
      operationsPerSecond: 0,
    };
  }

  const times = runMetrics.map((r) => r.executionTimeMs).sort((a, b) => a - b);
  const n = times.length;
  
  const minTimeMs = times[0] ?? 0;
  const maxTimeMs = times[n - 1] ?? 0;
  
  // Calculate Mean
  const sum = times.reduce((acc, val) => acc + val, 0);
  const averageTimeMs = sum / n;
  
  // Calculate Median
  const mid = Math.floor(n / 2);
  const medianTimeMs = n % 2 === 0 ? ((times[mid - 1] ?? 0) + (times[mid] ?? 0)) / 2 : (times[mid] ?? 0);
  
  // Calculate Variance & StdDev
  const squaredDiffs = times.map((t) => Math.pow(t - averageTimeMs, 2));
  const varianceTimeMs = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
  const standardDeviationTimeMs = Math.sqrt(varianceTimeMs);
  
  // Operations per second (using average time)
  // ops = 1000 / avgMs
  const operationsPerSecond = averageTimeMs > 0 ? 1000 / averageTimeMs : 0;

  return {
    averageTimeMs,
    medianTimeMs,
    minTimeMs,
    maxTimeMs,
    standardDeviationTimeMs,
    varianceTimeMs,
    operationsPerSecond,
  };
};

/**
 * Averages out metrics such as comparisons, swaps, memory across all iterations.
 *
 * @param runMetrics - Metrics from all iterations.
 * @returns A synthesized SortingMetrics object representing average behavior.
 */
export const calculateAverageMetrics = (runMetrics: SortingMetrics[]): SortingMetrics => {
  if (!runMetrics.length) {
    throw new Error('Cannot calculate average metrics on empty dataset.');
  }

  const n = runMetrics.length;
  const base = runMetrics[0];
  if (!base) {
    throw new Error('Empty metrics');
  }
  // Deep copy the first one to form the base
  const avg: SortingMetrics = { ...base };

  // For metrics that vary, we average them. Memory and recursion depth usually stay same.
  let totalTime = 0, totalComps = 0, totalSwaps = 0, totalWrites = 0, totalReads = 0, totalIters = 0, totalCalls = 0;
  
  for (const m of runMetrics) {
    totalTime += m.executionTimeMs;
    totalComps += m.comparisons;
    totalSwaps += m.swaps;
    totalWrites += m.writes;
    totalReads += m.reads;
    totalIters += m.iterations;
    totalCalls += m.recursiveCalls;
  }

  avg.executionTimeMs = totalTime / n;
  avg.comparisons = Math.round(totalComps / n);
  avg.swaps = Math.round(totalSwaps / n);
  avg.writes = Math.round(totalWrites / n);
  avg.reads = Math.round(totalReads / n);
  avg.iterations = Math.round(totalIters / n);
  avg.recursiveCalls = Math.round(totalCalls / n);
  
  // maxRecursionDepth, estimatedMemoryBytes, inputSize, outputSize should be uniform, so the base handles it.

  return avg;
};
