import { useMemo } from 'react';
import type { BenchmarkSession } from '../../benchmark/engine/types';

export const useChartData = (session: BenchmarkSession | null) => {
  return useMemo(() => {
    if (!session || !session.results.length) {
      return {
        executionTimeData: [],
        operationsData: [],
        memoryData: [],
        swapsData: [],
        radarData: [],
        timelineData: [], // Timeline not supported by current engine output
        lines: [],
        sortedResults: [],
      };
    }

    // Sort by execution time to make charts look ordered (fastest to slowest)
    const sortedResults = [...session.results].sort((a, b) => a.executionTimeMs - b.executionTimeMs);

    // Group results by datasetSize for Line Charts
    const sizesMap = new Map<number, any>();
    
    // We also need to extract all unique algorithms for the chart lines
    const uniqueAlgorithms = new Map<string, { id: string, name: string, color: string }>();

    session.results.forEach(res => {
      uniqueAlgorithms.set(res.algorithmName, {
        id: res.algorithmId,
        name: res.algorithmName,
        color: `var(--color-${res.algorithmId.toLowerCase()})`,
      });

      if (!sizesMap.has(res.datasetSize)) {
        sizesMap.set(res.datasetSize, {
          datasetSize: res.datasetSize,
          formattedSize: res.datasetSize.toLocaleString(),
        });
      }
      const point = sizesMap.get(res.datasetSize);
      
      // We prefix with specific keys if needed, but for LineChart, using the algorithm name is best
      point[`${res.algorithmName}_time`] = res.executionTimeMs;
      point[`${res.algorithmName}_comparisons`] = res.comparisons;
      point[`${res.algorithmName}_swaps`] = res.swaps;
      point[`${res.algorithmName}_memory`] = res.memoryEstimateBytes;
    });

    const sizesArray = Array.from(sizesMap.values()).sort((a, b) => a.datasetSize - b.datasetSize);
    const lines = Array.from(uniqueAlgorithms.values());

    // Radar Data (Normalized for multi-dimensional comparison across ALL results)
    const maxTime = Math.max(...sortedResults.map(r => r.executionTimeMs)) || 1;
    const maxComps = Math.max(...sortedResults.map(r => r.comparisons)) || 1;
    const maxSwaps = Math.max(...sortedResults.map(r => r.swaps)) || 1;
    const maxMemory = Math.max(...sortedResults.map(r => r.memoryEstimateBytes)) || 1;

    // We can aggregate radar data based on averages across all sizes, or just take the max sizes.
    // Let's aggregate by algorithm (average across all sizes)
    const algoAverages = new Map<string, any>();
    session.results.forEach(res => {
      if (!algoAverages.has(res.algorithmName)) {
        algoAverages.set(res.algorithmName, { name: res.algorithmName, time: 0, comps: 0, swaps: 0, mem: 0, count: 0 });
      }
      const cur = algoAverages.get(res.algorithmName);
      cur.time += res.executionTimeMs;
      cur.comps += res.comparisons;
      cur.swaps += res.swaps;
      cur.mem += res.memoryEstimateBytes;
      cur.count += 1;
    });

    const radarData = Array.from(algoAverages.values()).map(cur => ({
      name: cur.name,
      'Time (Normalized)': ((cur.time / cur.count) / maxTime) * 100,
      'Comparisons (Normalized)': ((cur.comps / cur.count) / maxComps) * 100,
      'Swaps (Normalized)': ((cur.swaps / cur.count) / maxSwaps) * 100,
      'Memory (Normalized)': ((cur.mem / cur.count) / maxMemory) * 100,
    }));

    return {
      sizesData: sizesArray, // Used for Time, Memory, Comps, Swaps vs Input Size
      radarData,
      lines,
      sortedResults,
      executionTimeData: [], // Obsolete, keep for backward compat until components update
      operationsData: [], // Obsolete
      timelineData: [],
    };
  }, [session]);
};
