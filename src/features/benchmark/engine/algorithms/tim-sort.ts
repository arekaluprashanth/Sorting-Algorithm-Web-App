/**
 * Tim Sort — a hybrid sorting algorithm combining merge sort and insertion sort.
 *
 * Inspired by Python's built-in sort and Java's Arrays.sort().
 * Divides the array into small "runs", sorts each with insertion sort,
 * then merges runs with a modified merge sort. Designed to take advantage
 * of naturally occurring runs in real-world data.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/** Minimum run length. Tim Sort uses 32-64 as the typical range. */
const MIN_RUN = 32;

/**
 * Calculates the minimum run length.
 * Ensures that n/minRun is a power of 2 or close to it.
 */
function calcMinRun(n: number): number {
  let r = 0;
  let remaining = n;
  while (remaining >= MIN_RUN) {
    r |= remaining & 1;
    remaining >>= 1;
  }
  return remaining + r;
}

/**
 * Insertion sort on a subarray arr[left..right].
 * Used for sorting individual runs.
 */
function insertionSortRange(
  arr: number[],
  left: number,
  right: number,
  collector: MetricsCollector,
): void {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i]!;
    let j = i - 1;

    while (j >= left && collector.compare(arr[j]!, key) > 0) {
      arr[j + 1] = arr[j]!;
      collector.swap(arr, j, j + 1);
      j--;
    }

    arr[j + 1] = key;
  }
}

/**
 * Merges two sorted runs: arr[left..mid] and arr[mid+1..right].
 */
function mergeRuns(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  collector: MetricsCollector,
): void {
  const leftLen = mid - left + 1;
  const rightLen = right - mid;

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

export const timSort: SortingAlgorithm = {
  id: 'tim-sort',
  name: 'Tim Sort',
  category: 'hybrid',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  description:
    'Hybrid algorithm combining insertion sort for small runs with merge sort for combining them. Optimized for real-world data with natural runs. Used by Python and Java.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;
    if (n <= 1) return arr;

    const minRun = calcMinRun(n);

    // Sort individual runs with insertion sort
    for (let start = 0; start < n; start += minRun) {
      const end = Math.min(start + minRun - 1, n - 1);
      insertionSortRange(arr, start, end, collector);
    }

    // Merge runs, doubling size each iteration
    for (let size = minRun; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);

        if (mid < right) {
          collector.pushRecursion();
          mergeRuns(arr, left, mid, right, collector);
          collector.popRecursion();
        }
      }
    }

    return arr;
  },
};
