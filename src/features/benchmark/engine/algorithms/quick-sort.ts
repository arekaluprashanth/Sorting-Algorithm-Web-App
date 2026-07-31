/**
 * Quick Sort — the most widely used comparison-based sorting algorithm.
 *
 * Uses a pivot element to partition the array into two halves:
 * elements less than the pivot and elements greater than the pivot.
 * Median-of-three pivot selection reduces worst-case probability.
 * Average O(n log n) but worst case O(n²) on pathological inputs.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/**
 * Median-of-three pivot selection to avoid worst-case on sorted inputs.
 * Selects the median of the first, middle, and last elements.
 */
function medianOfThree(
  arr: number[],
  low: number,
  high: number,
  collector: MetricsCollector,
): number {
  const mid = Math.floor((low + high) / 2);

  if (collector.compare(arr[low]!, arr[mid]!) > 0) {
    collector.swap(arr, low, mid);
  }
  if (collector.compare(arr[low]!, arr[high]!) > 0) {
    collector.swap(arr, low, high);
  }
  if (collector.compare(arr[mid]!, arr[high]!) > 0) {
    collector.swap(arr, mid, high);
  }

  // Place pivot at high - 1 position
  collector.swap(arr, mid, high);
  return arr[high]!;
}

/**
 * Lomuto-style partition using median-of-three pivot.
 * Returns the final position of the pivot.
 */
function partition(
  arr: number[],
  low: number,
  high: number,
  collector: MetricsCollector,
): number {
  const pivot = medianOfThree(arr, low, high, collector);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (collector.compare(arr[j]!, pivot) <= 0) {
      i++;
      if (i !== j) {
        collector.swap(arr, i, j);
      }
    }
  }

  collector.swap(arr, i + 1, high);
  return i + 1;
}

/** Recursive quicksort implementation. */
function quickSortRecursive(
  arr: number[],
  low: number,
  high: number,
  collector: MetricsCollector,
): void {
  if (low >= high) return;

  collector.pushRecursion();

  const pivotIdx = partition(arr, low, high, collector);
  quickSortRecursive(arr, low, pivotIdx - 1, collector);
  quickSortRecursive(arr, pivotIdx + 1, high, collector);

  collector.popRecursion();
}

export const quickSort: SortingAlgorithm = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'comparison',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  description:
    'Partitions the array around a pivot element and recursively sorts the partitions. Uses median-of-three pivot selection for improved performance.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    if (arr.length <= 1) return arr;
    quickSortRecursive(arr, 0, arr.length - 1, collector);
    return arr;
  },
};
