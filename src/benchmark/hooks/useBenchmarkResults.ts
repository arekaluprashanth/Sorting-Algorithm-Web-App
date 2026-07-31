import { useSyncExternalStore } from 'react';
import { BenchmarkService } from '../services/BenchmarkService';

/**
 * Hook to access the completed benchmark results array.
 */
export const useBenchmarkResults = () => {
  const session = useSyncExternalStore(
    (callback) => BenchmarkService.subscribeSession(callback),
    () => BenchmarkService.getSession()
  );

  return session?.results ?? [];
};
