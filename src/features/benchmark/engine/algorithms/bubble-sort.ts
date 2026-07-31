/**
 * Bubble Sort — the simplest comparison-based sorting algorithm.
 *
 * Repeatedly steps through the list, compares adjacent elements, and swaps
 * them if they are in the wrong order. Optimized with an early-exit flag
 * when no swaps occur in a pass (best case O(n) for sorted input).
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

export const bubbleSort: SortingAlgorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'comparison',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Repeatedly swaps adjacent elements that are out of order. Simple but inefficient for large datasets. Optimized with early termination when no swaps occur.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (collector.compare(arr[j]!, arr[j + 1]!) > 0) {
          collector.swap(arr, j, j + 1);
          swapped = true;
        }
      }

      // Early exit: array is sorted
      if (!swapped) break;
    }

    return arr;
  },
};
