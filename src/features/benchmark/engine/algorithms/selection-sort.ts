/**
 * Selection Sort — finds the minimum element and places it at the beginning.
 *
 * Divides the array into sorted and unsorted regions. In each iteration,
 * finds the minimum from the unsorted region and swaps it into position.
 * Always O(n²) regardless of input order.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

export const selectionSort: SortingAlgorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'comparison',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  description:
    'Repeatedly selects the minimum element from the unsorted portion and places it at the correct position. Simple but always quadratic.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        if (collector.compare(arr[j]!, arr[minIdx]!) < 0) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        collector.swap(arr, i, minIdx);
      }
    }

    return arr;
  },
};
