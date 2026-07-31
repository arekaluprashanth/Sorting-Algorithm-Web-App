import type { DatasetStatistics } from '../types';
import { calculateAverage, calculateMedian, estimateMemoryUsage } from '../utils/math';

/**
 * Automatically computes statistical indicators for a generated dataset.
 *
 * @param arr - The numerical dataset array.
 * @param durationMs - Time taken to generate the dataset.
 * @returns Complete DatasetStatistics payload.
 */
export function calculateDatasetStatistics(
  arr: number[],
  durationMs = 0
): DatasetStatistics {
  const length = arr.length;

  if (length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      range: 0,
      uniqueCount: 0,
      duplicateCount: 0,
      duplicatePercentage: 0,
      length: 0,
      estimatedMemoryBytes: 0,
      generationDurationMs: durationMs,
    };
  }

  let min = arr[0]!;
  let max = arr[0]!;
  const uniqueSet = new Set<number>();

  for (let i = 0; i < length; i++) {
    const val = arr[i]!;
    if (val < min) min = val;
    if (val > max) max = val;
    uniqueSet.add(val);
  }

  const uniqueCount = uniqueSet.size;
  const duplicateCount = length - uniqueCount;
  const duplicatePercentage = (duplicateCount / length) * 100;
  const range = max - min;
  const average = calculateAverage(arr);

  // Compute median for moderate arrays; sample for huge arrays (>100,000) to keep UI fast
  let median = 0;
  if (length <= 100000) {
    median = calculateMedian(arr);
  } else {
    // Sample 5,000 elements for ultra-fast median estimation on huge arrays
    const step = Math.floor(length / 5000);
    const sample: number[] = [];
    for (let i = 0; i < length; i += step) {
      sample.push(arr[i]!);
    }
    median = calculateMedian(sample);
  }

  return {
    min,
    max,
    average,
    median,
    range,
    uniqueCount,
    duplicateCount,
    duplicatePercentage,
    length,
    estimatedMemoryBytes: estimateMemoryUsage(length),
    generationDurationMs: durationMs,
  };
}
