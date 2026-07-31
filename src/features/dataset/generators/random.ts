/**
 * Random dataset generator — uniformly distributed random values.
 */

import { createSeededRandom, randomInt } from './prng';

export function generateRandom(
  size: number,
  min: number,
  max: number,
  seed?: number,
): number[] {
  const random = createSeededRandom(seed ?? Date.now());
  const arr = new Array<number>(size);

  for (let i = 0; i < size; i++) {
    arr[i] = randomInt(random, min, max);
  }

  return arr;
}
