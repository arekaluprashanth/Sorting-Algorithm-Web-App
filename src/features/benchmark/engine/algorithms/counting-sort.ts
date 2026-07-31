/**
 * Counting Sort — non-comparison integer sorting by counting occurrences.
 *
 * Creates a count array for each possible value, then reconstructs the
 * sorted output. Extremely fast when the range of values (k) is small
 * relative to the number of elements (n).
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

export const countingSort: SortingAlgorithm = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'non-comparison',
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
  },
  spaceComplexity: 'O(n + k)',
  stable: true,
  description:
    'Counts occurrences of each value and reconstructs the sorted array. Extremely fast when the range of values (k) is small.',

  sort(arr: number[], collector: MetricsCollector): number[] {
    if (arr.length <= 1) return arr;

    // Find range
    let min = arr[0]!;
    let max = arr[0]!;

    for (let i = 1; i < arr.length; i++) {
      if (collector.compare(arr[i]!, max) > 0) max = arr[i]!;
      if (collector.compare(arr[i]!, min) < 0) min = arr[i]!;
    }

    const range = max - min + 1;
    const count = new Array<number>(range).fill(0);
    const output = new Array<number>(arr.length);
    collector.allocate(range + arr.length);

    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]! - min]!++;
    }

    // Transform to cumulative counts (for stability)
    for (let i = 1; i < range; i++) {
      count[i]! += count[i - 1]!;
    }

    // Build output (right-to-left for stability)
    for (let i = arr.length - 1; i >= 0; i--) {
      const idx = arr[i]! - min;
      count[idx]!--;
      output[count[idx]!] = arr[i]!;
    }

    // Copy back
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i]!;
    }

    return arr;
  },
};
