import { seededRandom, randomInteger } from '../utils/prng';

export function generateRandomArray(
  size: number,
  min: number,
  max: number,
  seed?: number
): number[] {
  const random = seededRandom(seed ?? Date.now());
  const arr = new Array<number>(size);

  for (let i = 0; i < size; i++) {
    arr[i] = randomInteger(random, min, max);
  }

  return arr;
}
