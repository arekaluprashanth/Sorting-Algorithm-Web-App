/**
 * Nearly-sorted dataset generator.
 *
 * Creates a sorted array, then randomly displaces ~5% of elements
 * by swapping them to nearby positions. Useful for testing algorithms
 * that perform well on partially-sorted data (e.g., Insertion Sort, Tim Sort).
 */

import { createSeededRandom } from './prng';

export function generateNearlySorted(
  size: number,
  min: number,
  max: number,
  seed?: number,
): number[] {
  const random = createSeededRandom(seed ?? Date.now());

  // Start with a sorted array of evenly spaced values
  const arr = new Array<number>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(min + (i / (size - 1 || 1)) * (max - min));
  }

  // Displace ~5% of elements
  const displacements = Math.max(1, Math.floor(size * 0.05));
  const maxDisplacement = Math.max(1, Math.floor(size * 0.05));

  for (let d = 0; d < displacements; d++) {
    const idx = Math.floor(random() * size);
    const offset =
      Math.floor(random() * maxDisplacement * 2) - maxDisplacement;
    const targetIdx = Math.max(0, Math.min(size - 1, idx + offset));

    // Swap
    const temp = arr[idx]!;
    arr[idx] = arr[targetIdx]!;
    arr[targetIdx] = temp;
  }

  return arr;
}
