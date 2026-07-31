import { useMemo } from 'react';
import { PerformanceMonitor } from '../services/PerformanceMonitor';
import type { PerformanceMetricsSnapshot } from '../services/PerformanceMonitor';

export function usePerformanceMonitor(datasetSize: number, spaceComplexity: string = 'O(1)'): PerformanceMetricsSnapshot {
  return useMemo(() => {
    return PerformanceMonitor.estimateMemory(datasetSize, spaceComplexity);
  }, [datasetSize, spaceComplexity]);
}
