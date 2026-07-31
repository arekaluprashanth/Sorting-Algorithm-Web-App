/**
 * Shell Sort — an extension of insertion sort with diminishing gap sequences.
 *
 * Sorts elements at various gap intervals, progressively reducing the gap
 * until it becomes 1 (standard insertion sort). The gap sequence significantly
 * affects performance. Uses Marcin Ciura's gap sequence for optimal average case.
 */

import type { MetricsCollector, SortingAlgorithm } from '../types';

/**
 * Ciura's gap sequence — empirically determined optimal gaps.
 * Extended with the 2.25x formula for larger arrays.
 */
function generateGaps(n: number): number[] {
  const ciuraGaps = [701, 301, 132, 57, 23, 10, 4, 1];
  const gaps: number[] = [];

  // Extend for large arrays using 2.25x multiplier
  let gap = ciuraGaps[0]!;
  while (gap < n) {
    gaps.unshift(gap);
    gap = Math.floor(gap * 2.25);
  }

  // Add Ciura's sequence
  for (const g of ciuraGaps) {
    if (g < n && !gaps.includes(g)) {
      gaps.push(g);
    }
  }

  // Sort descending and ensure 1 is included
  gaps.sort((a, b) => b - a);
  if (!gaps.includes(1)) gaps.push(1);

  return gaps;
}

export const shellSort: SortingAlgorithm = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: 'comparison',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n^(4/3))',
    worst: 'O(n^(3/2))',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  description:
    "Generalization of insertion sort using diminishing gap sequences. Uses Ciura's empirically optimal gap sequence for best average-case performance.",

  sort(arr: number[], collector: MetricsCollector): number[] {
    const n = arr.length;
    const gaps = generateGaps(n);

    for (const gap of gaps) {
      // Gapped insertion sort
      for (let i = gap; i < n; i++) {
        const temp = arr[i]!;
        let j = i;

        while (j >= gap && collector.compare(arr[j - gap]!, temp) > 0) {
          arr[j] = arr[j - gap]!;
          collector.swap(arr, j, j - gap);
          j -= gap;
        }

        arr[j] = temp;
      }
    }

    return arr;
  },
};
