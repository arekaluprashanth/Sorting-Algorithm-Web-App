/**
 * High-performance array manipulation utilities.
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
 * Fisher-Yates array shuffle algorithm using the provided PRNG.
 */
export function shuffle(arr: number[], random: () => number): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    swap(arr, i, j);
  }
  return arr;
}

/**
 * Clones a numerical array using slice for maximum performance.
 */
export function cloneArray(arr: number[]): number[] {
  return arr.slice();
}
