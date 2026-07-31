import { useMemo } from 'react';
import type { BenchmarkSession } from '../../benchmark/engine/types';

export const useChartData = (session: BenchmarkSession | null) => {
  return useMemo(() => {
    if (!session || !session.results.length) {
      return {
        executionTimeData: [],
        operationsData: [],
        radarData: [],
        timelineData: [], // Timeline not supported by current engine output
      };
    }

    // Sort by execution time to make charts look ordered (fastest to slowest)
    const sortedResults = [...session.results].sort((a, b) => a.executionTimeMs - b.executionTimeMs);

    // 1. Execution Time Data (Bar/Area)
    const executionTimeData = sortedResults.map((res) => ({
      name: res.algorithmName,
      'Time (ms)': res.executionTimeMs,
      fill: `var(--color-${res.algorithmId.toLowerCase()})`,
    }));

    // 2. Operations Data (Bar)
    const operationsData = sortedResults.map((res) => ({
      name: res.algorithmName,
      Comparisons: res.comparisons,
      Swaps: res.swaps,
    }));

    // 3. Radar Data (Normalized for multi-dimensional comparison)
    const maxTime = Math.max(...sortedResults.map(r => r.executionTimeMs)) || 1;
    const maxComps = Math.max(...sortedResults.map(r => r.comparisons)) || 1;
    const maxSwaps = Math.max(...sortedResults.map(r => r.swaps)) || 1;
    const maxMemory = Math.max(...sortedResults.map(r => r.memoryEstimateBytes)) || 1;

    const radarData = sortedResults.map((res) => ({
      name: res.algorithmName,
      'Time (Normalized)': (res.executionTimeMs / maxTime) * 100,
      'Comparisons (Normalized)': (res.comparisons / maxComps) * 100,
      'Swaps (Normalized)': (res.swaps / maxSwaps) * 100,
      'Memory (Normalized)': (res.memoryEstimateBytes / maxMemory) * 100,
    }));

    return {
      executionTimeData,
      operationsData,
      radarData,
      timelineData: [], // Not supported
      sortedResults,
    };
  }, [session]);
};
