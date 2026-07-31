/**
 * Algorithm Registry — central catalog of all available sorting algorithms.
 *
 * Provides lookup by ID, listing all algorithms, and filtering by category.
 * To add a new algorithm, simply import it and add it to the `algorithms` array.
 */

import type { AlgorithmCategory, SortingAlgorithm } from '../types';
import { bubbleSort } from './bubble-sort';
import { countingSort } from './counting-sort';
import { heapSort } from './heap-sort';
import { insertionSort } from './insertion-sort';
import { mergeSort } from './merge-sort';
import { quickSort } from './quick-sort';
import { radixSort } from './radix-sort';
import { selectionSort } from './selection-sort';
import { shellSort } from './shell-sort';
import { timSort } from './tim-sort';

/** Master list of all registered algorithms. Add new ones here. */
const algorithms: SortingAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  shellSort,
  timSort,
  radixSort,
  countingSort,
];

/** Map for O(1) lookup by algorithm ID. */
const ALGORITHM_MAP = new Map<string, SortingAlgorithm>(
  algorithms.map((algo) => [algo.id, algo]),
);

/**
 * Retrieve a sorting algorithm by its unique ID.
 * @throws Error if the algorithm ID is not found.
 */
export function getAlgorithm(id: string): SortingAlgorithm {
  const algo = ALGORITHM_MAP.get(id);
  if (!algo) {
    throw new Error(`Algorithm not found: "${id}". Available: ${getAllAlgorithmIds().join(', ')}`);
  }
  return algo;
}

/** Get all registered algorithms. */
export function getAllAlgorithms(): SortingAlgorithm[] {
  return [...algorithms];
}

/** Get all registered algorithm IDs. */
export function getAllAlgorithmIds(): string[] {
  return algorithms.map((a) => a.id);
}

/** Get algorithms filtered by category. */
export function getAlgorithmsByCategory(
  category: AlgorithmCategory,
): SortingAlgorithm[] {
  return algorithms.filter((a) => a.category === category);
}

/** Get the total number of registered algorithms. */
export function getAlgorithmCount(): number {
  return algorithms.length;
}
