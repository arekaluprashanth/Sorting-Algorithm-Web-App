import { generateSortedArray } from './sorted.generator';
import { seededRandom } from '../utils/prng';
import { swap } from '../utils/array';

export function generateNearlySortedArray(
  size: number,
  min: number,
  max: number,
  swapPercentage = 5,
  seed?: number
): number[] {
  const arr = generateSortedArray(size, min, max);
  const random = seededRandom(seed ?? Date.now());

  // Number of elements to swap
  const swapCount = Math.max(1, Math.floor((size * (swapPercentage / 100)) / 2));
  const maxOffset = Math.max(1, Math.floor(size * 0.05));

  for (let s = 0; s < swapCount; s++) {
    const idx1 = Math.floor(random() * size);
    const offset = Math.floor(random() * maxOffset * 2) - maxOffset;
    const idx2 = Math.max(0, Math.min(size - 1, idx1 + offset));
    swap(arr, idx1, idx2);
  }

  return arr;
}
