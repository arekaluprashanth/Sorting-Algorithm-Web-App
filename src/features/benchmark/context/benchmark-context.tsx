import React, { createContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { BenchmarkSession } from '../engine/types';
import { runBenchmarkSession } from '../engine/benchmark-runner';
import type { DatasetConfig } from '../../dataset';
import { generateDataset } from '../../dataset';
import { HistoryService } from '../../history/services/history-service';
import { LocalStorageAdapter } from '../../history/storage/local-storage-adapter';
import { SessionRepository } from '../../history/storage/session-repository';
import { WorkerManager } from '../services/WorkerManager';
import type { WorkerProgressPayload } from '../types/worker.types';

interface BenchmarkContextType {
  selectedAlgorithms: string[];
  setSelectedAlgorithms: React.Dispatch<React.SetStateAction<string[]>>;
  datasetConfig: DatasetConfig;
  setDatasetConfig: React.Dispatch<React.SetStateAction<DatasetConfig>>;
  datasetSizes: number[];
  setDatasetSizes: React.Dispatch<React.SetStateAction<number[]>>;
  dataset: number[];
  setDataset: React.Dispatch<React.SetStateAction<number[]>>;
  currentSession: BenchmarkSession | null;
  isRunning: boolean;
  warmupIterations: number;
  setWarmupIterations: React.Dispatch<React.SetStateAction<number>>;
  progress: WorkerProgressPayload | null;
  runCurrentBenchmark: () => Promise<BenchmarkSession | null>;
  cancelBenchmark: () => void;
  clearSession: () => void;
}

export const BenchmarkContext = createContext<BenchmarkContextType | null>(null);

const DEFAULT_DATASET_CONFIG: DatasetConfig = {
  size: 1000,
  type: 'random',
  min: 1,
  max: 10000,
};

export const BenchmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    'quick-sort',
    'merge-sort',
    'heap-sort',
    'tim-sort',
  ]);
  const [datasetConfig, setDatasetConfig] = useState<DatasetConfig>(DEFAULT_DATASET_CONFIG);
  const [datasetSizes, setDatasetSizes] = useState<number[]>([1000]);
  const [dataset, setDataset] = useState<number[]>(() => generateDataset(DEFAULT_DATASET_CONFIG));
  const [currentSession, setCurrentSession] = useState<BenchmarkSession | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [warmupIterations, setWarmupIterations] = useState<number>(1);
  const [progress, setProgress] = useState<WorkerProgressPayload | null>(null);

  const workerManagerRef = useRef<WorkerManager | null>(null);

  // Lazily initialise the history service for auto-save
  const historyServiceRef = useRef<HistoryService | null>(null);
  if (!historyServiceRef.current) {
    historyServiceRef.current = new HistoryService(
      new SessionRepository(new LocalStorageAdapter()),
    );
  }

  useEffect(() => {
    try {
      const wm = new WorkerManager('context-worker');
      wm.initialize();
      workerManagerRef.current = wm;
    } catch (e) {
      console.warn('[BenchmarkContext] Web Worker initialization failed, falling back to sync:', e);
    }

    return () => {
      workerManagerRef.current?.terminate();
    };
  }, []);

  const cancelBenchmark = useCallback(() => {
    if (workerManagerRef.current) {
      workerManagerRef.current.cancelJob('current-job');
    }
    setIsRunning(false);
    setProgress(null);
  }, []);

  const runCurrentBenchmark = useCallback(async (): Promise<BenchmarkSession | null> => {
    if (selectedAlgorithms.length === 0 || datasetSizes.length === 0) return null;

    setIsRunning(true);
    setProgress(null);

    const startedAt = Date.now();
    const config = {
      algorithmIds: selectedAlgorithms,
      datasetSizes,
      datasetType: datasetConfig.type,
      datasetOptions: datasetConfig,
      warmupIterations,
    };

    // Try executing in Web Worker asynchronously
    if (workerManagerRef.current) {
      return new Promise<BenchmarkSession | null>((resolve) => {
        const jobId = `job-${Date.now()}`;

        workerManagerRef.current?.setListeners({
          onProgress: (p) => setProgress(p),
          onComplete: (results, _durationMs) => {
            const completedAt = Date.now();
            const session: BenchmarkSession = {
              id: `bench-${Date.now().toString(36)}`,
              results,
              config: {
                ...config,
              },
              startedAt,
              completedAt,
            };

            setCurrentSession(session);
            setIsRunning(false);
            setProgress(null);

            try {
              historyServiceRef.current?.saveSession(session);
            } catch (e) {
              console.warn('[BenchmarkContext] Failed to auto-save session:', e);
            }

            resolve(session);
          },
          onError: (error) => {
            console.error('Worker benchmark failed:', error);
            setIsRunning(false);
            setProgress(null);
            resolve(null);
          },
          onCancel: () => {
            setIsRunning(false);
            setProgress(null);
            resolve(null);
          },
        });

        workerManagerRef.current?.runJob(jobId, config);
      });
    }

    // Fallback sync execution if Web Worker unavailable
    try {
      await new Promise((res) => setTimeout(res, 50));
      const session = runBenchmarkSession(config);
      setCurrentSession(session);

      try {
        historyServiceRef.current?.saveSession(session);
      } catch (e) {
        console.warn('[BenchmarkContext] Failed to auto-save session:', e);
      }
      return session;
    } catch (error) {
      console.error('Benchmark run failed:', error);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [selectedAlgorithms, datasetSizes, datasetConfig, warmupIterations]);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedAlgorithms,
      setSelectedAlgorithms,
      datasetConfig,
      setDatasetConfig,
      datasetSizes,
      setDatasetSizes,
      dataset,
      setDataset,
      currentSession,
      isRunning,
      warmupIterations,
      setWarmupIterations,
      progress,
      runCurrentBenchmark,
      cancelBenchmark,
      clearSession,
    }),
    [
      selectedAlgorithms,
      datasetConfig,
      datasetSizes,
      dataset,
      currentSession,
      isRunning,
      warmupIterations,
      progress,
      runCurrentBenchmark,
      cancelBenchmark,
      clearSession,
    ]
  );

  return <BenchmarkContext.Provider value={value}>{children}</BenchmarkContext.Provider>;
};
