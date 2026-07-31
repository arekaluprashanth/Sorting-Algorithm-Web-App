/**
 * Radix Sort — non-comparison integer sorting using digit-by-digit processing.
 *
 * Sorts integers by processing individual digits from least significant
 * to most significant (LSD radix sort). Uses counting sort as a stable
 * subroutine. Linear time O(d × (n + k)) where d is digit count and k is base.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/** Gets the maximum value in the array to determine digit count. */
function getMax(arr: number[], collector: MetricsCollector): number {
  let max = arr[0]!;
  for (let i = 1; i < arr.length; i++) {
    if (collector.compare(arr[i]!, max) > 0) {
      max = arr[i]!;
    }
  }
  return max;
}

/**
 * Counting sort subroutine that sorts by a specific digit position.
 * @param exp - The digit position (1 for ones, 10 for tens, etc.)
 */
function countingSortByDigit(
  arr: number[],
  exp: number,
  collector: MetricsCollector,
): void {
  const n = arr.length;
  const output = new Array<number>(n);
  const count = new Array<number>(10).fill(0);
  collector.allocate(n + 10);

  // Count occurrences of each digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i]! / exp) % 10;
    count[digit]!++;
  }

  // Transform count to actual positions
  for (let i = 1; i < 10; i++) {
    count[i]! += count[i - 1]!;
  }

  // Build output array (traverse right-to-left for stability)
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i]! / exp) % 10;
    count[digit]!--;
    output[count[digit]!] = arr[i]!;
  }

  // Copy back to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i]!;
  }
}

export const radixSort: SortingAlgorithm = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'non-comparison',
  timeComplexity: {
    best: 'O(nk)',
    average: 'O(nk)',
    worst: 'O(nk)',
  },
  spaceComplexity: 'O(n + k)',
  stable: true,
  description:
    'Sorts integers digit by digit from least to most significant using counting sort as a subroutine. Linear time for fixed-width integers.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    if (arr.length <= 1) return arr;

    const max = getMax(arr, collector);

    // Process each digit position
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countingSortByDigit(arr, exp, collector);
    }

    return arr;
  },
};
