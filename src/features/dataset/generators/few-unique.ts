/**
 * Few-unique dataset generator — only √n unique values.
 *
 * Creates a dataset with many duplicate values to test how algorithms
 * handle repeated elements. Useful for evaluating algorithms with
 * three-way partitioning (e.g., Dutch National Flag variant of Quick Sort).
 */

import { createSeededRandom } from './prng';

export function generateFewUnique(
  size: number,
  min: number,
  max: number,
  seed?: number,
): number[] {
  const random = createSeededRandom(seed ?? Date.now());
  const uniqueCount = Math.max(2, Math.floor(Math.sqrt(size)));

  // Generate √n unique values evenly spaced across [min, max]
  const uniqueValues = new Array<number>(uniqueCount);
  for (let i = 0; i < uniqueCount; i++) {
    uniqueValues[i] = Math.floor(
      min + (i / (uniqueCount - 1 || 1)) * (max - min),
    );
  }

  // Fill the array by randomly picking from the unique values
  const arr = new Array<number>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = uniqueValues[Math.floor(random() * uniqueCount)]!;
  }

  return arr;
}
