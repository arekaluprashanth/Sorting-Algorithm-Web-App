import { useMemo } from 'react';
import type { BenchmarkSession } from '../../benchmark/engine/types';

export const useInsights = (session: BenchmarkSession | null) => {
  return useMemo(() => {
    if (!session || session.results.length === 0) return [];

    const insights: string[] = [];
    const results = session.results;

    // Find the max dataset size benchmarked
    const maxDatasetSize = Math.max(...results.map(r => r.datasetSize));
    
    // Get results only for the max dataset size
    const maxResults = results.filter(r => r.datasetSize === maxDatasetSize);

    if (maxResults.length > 0) {
      // 1. Identify Fastest (at max size)
      const fastest = maxResults.reduce((prev, curr) => curr.executionTimeMs < prev.executionTimeMs ? curr : prev);
      insights.push(`🚀 **${fastest.algorithmName}** was the fastest algorithm at N=${maxDatasetSize.toLocaleString()}, completing in ${fastest.executionTimeMs.toFixed(2)}ms.`);

      // 2. Identify Slowest
      if (maxResults.length > 1) {
        const slowest = maxResults.reduce((prev, curr) => curr.executionTimeMs > prev.executionTimeMs ? curr : prev);
        const ratio = fastest.executionTimeMs > 0 ? (slowest.executionTimeMs / fastest.executionTimeMs).toFixed(1) : '∞';
        insights.push(`🐢 **${slowest.algorithmName}** was the slowest at max size, taking ${ratio}x longer than ${fastest.algorithmName}.`);
      }

      // 3. Memory insights
      const mostMemoryEfficient = maxResults.reduce((prev, curr) => curr.memoryEstimateBytes < prev.memoryEstimateBytes ? curr : prev);
      insights.push(`🧠 **${mostMemoryEfficient.algorithmName}** was the most memory efficient with a footprint of ${mostMemoryEfficient.memoryEstimateBytes} bytes.`);
    }

    // 4. Dataset specific insights
    const config = session.config;
    if (config.datasetType === 'sorted' || config.datasetType === 'nearly-sorted') {
      insights.push(`💡 For **${config.datasetType}** datasets, algorithms with O(N) best-case bounds (like Insertion Sort or Bubble Sort with early exit) often outperform O(N log N) algorithms.`);
    } else if (config.datasetType === 'reverse') {
      insights.push(`⚠️ **Reversed** datasets trigger the worst-case O(N²) behavior in standard Insertion Sort and Bubble Sort.`);
    }

    // 5. Theory vs Measured scaling (If we have multiple sizes)
    const uniqueSizes = Array.from(new Set(results.map(r => r.datasetSize))).sort((a, b) => a - b);
    if (uniqueSizes.length > 1) {
      const minSize = uniqueSizes[0] ?? 0;
      const maxSize = uniqueSizes[uniqueSizes.length - 1] ?? 0;
      const scaleFactor = maxSize / minSize;
      
      insights.push(`📈 **Complexity Check**: The dataset grew by ${scaleFactor.toFixed(1)}x from min to max size. Expected time increase is ~${scaleFactor.toFixed(1)}x for O(N), ~${(scaleFactor * Math.log2(scaleFactor)).toFixed(1)}x for O(N log N), and ~${(scaleFactor * scaleFactor).toFixed(1)}x for O(N²). Check the graphs to see which algorithms match their theory!`);
    }

    return insights;
  }, [session]);
};
