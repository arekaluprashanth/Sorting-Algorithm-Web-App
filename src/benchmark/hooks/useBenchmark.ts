import { useSyncExternalStore, useCallback } from 'react';
import { BenchmarkService } from '../services/BenchmarkService';
import type { BenchmarkConfiguration } from '../types';

/**
 * Hook to access the current benchmark session state and core controls.
 */
export const useBenchmark = () => {
  const session = useSyncExternalStore(
    (callback) => BenchmarkService.subscribeSession(callback),
    () => BenchmarkService.getSession()
  );

  const status = useSyncExternalStore(
    (callback) => BenchmarkService.subscribeProgress(callback),
    () => BenchmarkService.getStatus()
  );

  const runBenchmark = useCallback(async (config: Partial<BenchmarkConfiguration>) => {
    return BenchmarkService.runBenchmark(config);
  }, []);

  const cancelBenchmark = useCallback(() => {
    BenchmarkService.cancelBenchmark();
  }, []);

  const resetBenchmark = useCallback(() => {
    BenchmarkService.resetBenchmark();
  }, []);

  return {
    session,
    status,
    isRunning: status === 'RUNNING',
    isCompleted: status === 'COMPLETED',
    isAborted: status === 'ABORTED',
    isError: status === 'ERROR',
    isIdle: status === 'IDLE',
    runBenchmark,
    cancelBenchmark,
    resetBenchmark
  };
};
