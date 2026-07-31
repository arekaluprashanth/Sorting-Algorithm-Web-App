import { useSyncExternalStore, useCallback } from 'react';
import { BenchmarkService } from '../services/BenchmarkService';
import type { BenchmarkConfiguration } from '../types';

/**
 * Hook to access and update the global benchmark configuration.
 */
export const useBenchmarkConfiguration = () => {
  const config = useSyncExternalStore(
    (callback) => BenchmarkService.subscribeConfig(callback),
    () => BenchmarkService.getConfiguration()
  );

  const updateConfig = useCallback((newConfig: Partial<BenchmarkConfiguration>) => {
    BenchmarkService.updateConfiguration(newConfig);
  }, []);

  return {
    config,
    updateConfig
  };
};
