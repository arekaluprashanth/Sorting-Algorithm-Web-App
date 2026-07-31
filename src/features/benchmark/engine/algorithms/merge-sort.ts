/**
 * Merge Sort — the classic divide-and-conquer O(n log n) algorithm.
 *
 * Recursively splits the array in half, sorts each half, then merges them.
 * Guaranteed O(n log n) in all cases but requires O(n) auxiliary space.
 * Stable sort.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/** Merges two sorted subarrays arr[left..mid] and arr[mid+1..right]. */
function merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  collector: MetricsCollector,
): void {
  const leftLen = mid - left + 1;
  const rightLen = right - mid;

  // Create temporary arrays
  const leftArr = new Array<number>(leftLen);
  const rightArr = new Array<number>(rightLen);
  collector.allocate(leftLen + rightLen);

  for (let i = 0; i < leftLen; i++) leftArr[i] = arr[left + i]!;
  for (let j = 0; j < rightLen; j++) rightArr[j] = arr[mid + 1 + j]!;

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftLen && j < rightLen) {
    if (collector.compare(leftArr[i]!, rightArr[j]!) <= 0) {
      arr[k] = leftArr[i]!;
      i++;
    } else {
      arr[k] = rightArr[j]!;
      j++;
    }
    k++;
  }

  while (i < leftLen) {
    arr[k] = leftArr[i]!;
    i++;
    k++;
  }

  while (j < rightLen) {
    arr[k] = rightArr[j]!;
    j++;
    k++;
  }
}

/** Recursive merge sort implementation. */
function mergeSortRecursive(
  arr: number[],
  left: number,
  right: number,
  collector: MetricsCollector,
): void {
  if (left >= right) return;

  collector.pushRecursion();

  const mid = Math.floor((left + right) / 2);
  mergeSortRecursive(arr, left, mid, collector);
  mergeSortRecursive(arr, mid + 1, right, collector);
  merge(arr, left, mid, right, collector);

  collector.popRecursion();
}

export const mergeSort: SortingAlgorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'comparison',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'Divides the array in half, recursively sorts each half, and merges them. Guaranteed O(n log n) but requires additional memory.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    if (arr.length <= 1) return arr;
    mergeSortRecursive(arr, 0, arr.length - 1, collector);
    return arr;
  },
};
