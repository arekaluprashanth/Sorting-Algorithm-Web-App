/**
 * MetricsCollector implementation for instrumenting sorting algorithms.
 *
 * This class provides a transparent instrumentation layer that algorithms
 * use instead of raw array operations. It tracks comparisons, swaps,
 * memory allocations, and recursion depth without affecting algorithm logic.
 */

import type { CollectedMetrics, MetricsCollector } from './types';

/**
 * Creates a new MetricsCollector instance.
 *
 * Usage:
 * ```ts
 * const collector = createMetricsCollector();
 * algorithm.sort(data, collector);
 * const metrics = collector.getMetrics();
 * ```
 */
export function createMetricsCollector(): MetricsCollector {
  let comparisons = 0;
  let swaps = 0;
  let memoryAllocations = 0;
  let totalAllocatedElements = 0;
  let peakMemoryElements = 0;
  let currentRecursionDepth = 0;
  let maxRecursionDepth = 0;

  return {
    compare(a: number, b: number): number {
      comparisons++;
      return a - b;
    },

    swap(arr: number[], i: number, j: number): void {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[j]!;
      arr[j] = temp!;
    },

    allocate(size: number): void {
      memoryAllocations++;
      totalAllocatedElements += size;
      if (totalAllocatedElements > peakMemoryElements) {
        peakMemoryElements = totalAllocatedElements;
      }
    },

    pushRecursion(): void {
      currentRecursionDepth++;
      if (currentRecursionDepth > maxRecursionDepth) {
        maxRecursionDepth = currentRecursionDepth;
      }
    },

    popRecursion(): void {
      currentRecursionDepth = Math.max(0, currentRecursionDepth - 1);
    },

    getMetrics(): CollectedMetrics {
      return {
        comparisons,
        swaps,
        memoryAllocations,
        peakMemoryElements,
        maxRecursionDepth,
      };
    },
  };
}
