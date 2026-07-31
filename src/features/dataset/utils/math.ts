/**
 * Mathematical & Statistical helper utilities for dataset analysis.
 */

/**
 * Calculates the exact median value of a numerical array.
 */
export function calculateMedian(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

/**
 * Calculates the arithmetic average of a numerical array.
 */
export function calculateAverage(arr: number[]): number {
  if (arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]!;
  }
  return sum / arr.length;
}

/**
 * Calculates the range (max - min) of a numerical array.
 */
export function calculateRange(min: number, max: number): number {
  return max - min;
}

/**
 * Estimates peak memory footprint in bytes for a number array (8 bytes per JS Float64 element).
 */
export function estimateMemoryUsage(elementCount: number): number {
  return elementCount * 8;
}
