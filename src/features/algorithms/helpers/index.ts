/**
 * Common low-level helper functions for array operations, comparison tracking, and memory estimation.
 */

/**
 * Swaps two elements in an array in-place.
 */
export function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i]!;
  arr[i] = arr[j]!;
  arr[j] = temp;
}

/**
 * Compares two values `a` and `b` according to the requested order direction.
 *
 * @returns `-1` if `a` comes before `b`, `1` if `a` comes after `b`, `0` if equal.
 */
export function compare(a: number, b: number, order: 'ascending' | 'descending' = 'ascending'): number {
  if (a === b) return 0;
  if (order === 'ascending') {
    return a < b ? -1 : 1;
  }
  return a > b ? -1 : 1;
}

/**
 * Clones a numerical array efficiently using slice.
 */
export function cloneArray(arr: number[]): number[] {
  return arr.slice();
}

/**
 * Estimates memory footprint in bytes for a number array (8 bytes per JS Float64 number).
 */
export function estimateMemory(elementCount: number): number {
  return elementCount * 8;
}
