/**
 * Insertion Sort — builds the sorted array one element at a time.
 *
 * Efficient for small or nearly-sorted datasets. Each element is inserted
 * into its correct position in the already-sorted prefix. Used as the
 * base case in many hybrid algorithms (e.g., Tim Sort).
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

export const insertionSort: SortingAlgorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'comparison',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  description:
    'Builds a sorted portion one element at a time by inserting each element into its correct position. Excellent for small or nearly-sorted arrays.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i]!;
      let j = i - 1;

      while (j >= 0 && collector.compare(arr[j]!, key) > 0) {
        arr[j + 1] = arr[j]!;
        collector.swap(arr, j, j + 1); // counted as a swap for metrics
        j--;
      }

      arr[j + 1] = key;
    }

    return arr;
  },
};
