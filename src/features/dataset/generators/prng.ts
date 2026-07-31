/**
 * Seeded Pseudo-Random Number Generator (PRNG).
 *
 * Uses the Mulberry32 algorithm for deterministic random number generation.
 * Ensures benchmark reproducibility when a seed is provided.
 */

/**
 * Creates a seeded PRNG using the Mulberry32 algorithm.
 * Returns a function that produces values in [0, 1).
 *
 * @param seed - The seed value. Same seed = same sequence.
 */
export function createSeededRandom(seed: number): () => number {
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
 */
export function randomInt(
  random: () => number,
  min: number,
  max: number,
): number {
  return Math.floor(random() * (max - min + 1)) + min;
}
