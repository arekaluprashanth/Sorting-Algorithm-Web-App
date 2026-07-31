import { useMemo } from 'react';
import type { BenchmarkSession } from '../../benchmark/engine/types';

export const useInsights = (session: BenchmarkSession | null) => {
  return useMemo(() => {
    if (!session || session.results.length === 0) return [];

    const insights: string[] = [];
    const results = session.results;

    // 1. Identify Fastest
    const fastest = results.reduce((prev, curr) => curr.executionTimeMs < prev.executionTimeMs ? curr : prev);
    insights.push(`🚀 **${fastest.algorithmName}** was the fastest algorithm, completing in ${fastest.executionTimeMs.toFixed(2)}ms.`);

    // 2. Identify Slowest
    if (results.length > 1) {
      const slowest = results.reduce((prev, curr) => curr.executionTimeMs > prev.executionTimeMs ? curr : prev);
      const ratio = (slowest.executionTimeMs / fastest.executionTimeMs).toFixed(1);
      insights.push(`🐢 **${slowest.algorithmName}** was the slowest, taking ${ratio}x longer than ${fastest.algorithmName}.`);
    }

    // 3. Memory insights
    const mostMemoryEfficient = results.reduce((prev, curr) => curr.memoryEstimateBytes < prev.memoryEstimateBytes ? curr : prev);
    insights.push(`🧠 **${mostMemoryEfficient.algorithmName}** was the most memory efficient with a footprint of ${mostMemoryEfficient.memoryEstimateBytes} bytes.`);

    // 4. Swaps insight
    const mostSwaps = results.reduce((prev, curr) => curr.swaps > prev.swaps ? curr : prev);
    if (mostSwaps.swaps > 0) {
      insights.push(`🔄 **${mostSwaps.algorithmName}** performed the highest number of array swaps (${mostSwaps.swaps.toLocaleString()}).`);
    }

    // 5. Dataset specific insights
    const config = session.config;
    if (config.datasetType === 'sorted' || config.datasetType === 'nearly-sorted') {
      insights.push(`💡 For **${config.datasetType}** datasets, algorithms with O(N) best-case bounds (like Insertion Sort or Bubble Sort with early exit) often outperform O(N log N) algorithms.`);
    } else if (config.datasetType === 'reverse') {
      insights.push(`⚠️ **Reversed** datasets trigger the worst-case O(N²) behavior in standard Insertion Sort and Bubble Sort.`);
    }

    return insights;
  }, [session]);
};
