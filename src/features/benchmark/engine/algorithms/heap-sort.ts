/**
 * Heap Sort — uses a binary heap data structure for in-place sorting.
 *
 * Builds a max-heap from the array, then repeatedly extracts the maximum
 * element and places it at the end. Guaranteed O(n log n) with O(1) space.
 * Not stable.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/**
 * Maintains the max-heap property for the subtree rooted at index `i`.
 * Assumes subtrees of `i` are already valid max-heaps.
 */
function heapify(
  arr: number[],
  heapSize: number,
  i: number,
  collector: MetricsCollector,
): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < heapSize && collector.compare(arr[left]!, arr[largest]!) > 0) {
    largest = left;
  }

  if (right < heapSize && collector.compare(arr[right]!, arr[largest]!) > 0) {
    largest = right;
  }

  if (largest !== i) {
    collector.swap(arr, i, largest);
    heapify(arr, heapSize, largest, collector);
  }
}

export const heapSort: SortingAlgorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'comparison',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  description:
    'Builds a max-heap and repeatedly extracts the maximum element. Guaranteed O(n log n) with O(1) extra space, but not stable.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;

    // Build max heap (bottom-up)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, collector);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      collector.swap(arr, 0, i);
      heapify(arr, i, 0, collector);
    }

    return arr;
  },
};
