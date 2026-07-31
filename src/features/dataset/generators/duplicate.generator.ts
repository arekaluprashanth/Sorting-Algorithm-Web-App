import { seededRandom, randomInteger } from '../utils/prng';

/**
 * Generate a dataset with only √n distinct unique values.
 */
export function generateFewUniqueArray(
  size: number,
  min: number,
  max: number,
  seed?: number
): number[] {
  const random = seededRandom(seed ?? Date.now());
  const uniqueCount = Math.max(2, Math.floor(Math.sqrt(size)));

  const pool = new Array<number>(uniqueCount);
  for (let i = 0; i < uniqueCount; i++) {
    pool[i] = randomInteger(random, min, max);
  }

  const arr = new Array<number>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = pool[Math.floor(random() * uniqueCount)]!;
  }

  return arr;
}

/**
 * Generate a dataset with high density of duplicated values (configurable ratio).
 */
export function generateDuplicateHeavyArray(
  size: number,
  min: number,
  max: number,
  duplicateRatio = 0.1,
  seed?: number
): number[] {
  const random = seededRandom(seed ?? Date.now());
  const uniqueCount = Math.max(2, Math.floor(size * Math.min(0.9, Math.max(0.01, duplicateRatio))));

  const pool = new Array<number>(uniqueCount);
  for (let i = 0; i < uniqueCount; i++) {
    pool[i] = randomInteger(random, min, max);
  }

  const arr = new Array<number>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = pool[Math.floor(random() * uniqueCount)]!;
  }

  return arr;
}
