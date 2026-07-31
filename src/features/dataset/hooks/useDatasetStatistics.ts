import { useMemo } from 'react';
import type { DatasetStatistics } from '../types';
import { calculateDatasetStatistics } from '../statistics/statistics.calculator';

/**
 * Custom hook providing memoized calculation of dataset statistics.
 */
export function useDatasetStatistics(data: number[], durationMs = 0): DatasetStatistics {
  return useMemo(
    () => calculateDatasetStatistics(data, durationMs),
    [data, durationMs]
  );
}
