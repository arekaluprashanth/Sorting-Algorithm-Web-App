import { useSyncExternalStore } from 'react';
import { BenchmarkService } from '../services/BenchmarkService';

/**
 * Hook to access real-time benchmark execution progress.
 */
export const useBenchmarkProgress = () => {
  const progress = useSyncExternalStore(
    (callback) => BenchmarkService.subscribeProgress(callback),
    () => BenchmarkService.getProgress()
  );

  return progress;
};
