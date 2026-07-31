/**
 * Mulberry32 Seeded Pseudo-Random Number Generator (PRNG).
 *
 * Provides fast 32-bit deterministic random number generation.
 * Guarantees that the same seed value yields 100% identical outputs.
 */

/**
 * Creates a seeded PRNG function using the Mulberry32 algorithm.
 *
 * @param seed - The integer seed.
 * @returns Function returning pseudo-random float in [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let state = seed | 0;

  return (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random integer in [min, max] using the provided PRNG.
 *
 * @param random - PRNG function returning floats in [0, 1).
 * @param min - Minimum bound (inclusive).
 * @param max - Maximum bound (inclusive).
 */
export function randomInteger(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}
