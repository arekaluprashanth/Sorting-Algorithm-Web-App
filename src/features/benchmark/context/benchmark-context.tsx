import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { BenchmarkSession } from '../engine/types';
import { runBenchmarkSession } from '../engine/benchmark-runner';
import type { DatasetConfig } from '../../dataset';
import { generateDataset } from '../../dataset';

interface BenchmarkContextType {
  selectedAlgorithms: string[];
  setSelectedAlgorithms: React.Dispatch<React.SetStateAction<string[]>>;
  datasetConfig: DatasetConfig;
  setDatasetConfig: React.Dispatch<React.SetStateAction<DatasetConfig>>;
  dataset: number[];
  setDataset: React.Dispatch<React.SetStateAction<number[]>>;
  currentSession: BenchmarkSession | null;
  isRunning: boolean;
  warmupIterations: number;
  setWarmupIterations: React.Dispatch<React.SetStateAction<number>>;
  runCurrentBenchmark: () => Promise<BenchmarkSession | null>;
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
  const [dataset, setDataset] = useState<number[]>(() => generateDataset(DEFAULT_DATASET_CONFIG));
  const [currentSession, setCurrentSession] = useState<BenchmarkSession | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [warmupIterations, setWarmupIterations] = useState<number>(1);

  const runCurrentBenchmark = useCallback(async (): Promise<BenchmarkSession | null> => {
    if (selectedAlgorithms.length === 0 || dataset.length === 0) return null;

    setIsRunning(true);
    try {
      // Small timeout to allow UI loading spinner to render smoothly
      await new Promise((res) => setTimeout(res, 50));

      const session = runBenchmarkSession({
        algorithmIds: selectedAlgorithms,
        dataset,
        datasetType: datasetConfig.type,
        warmupIterations,
      });

      setCurrentSession(session);
      return session;
    } catch (error) {
      console.error('Benchmark run failed:', error);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [selectedAlgorithms, dataset, datasetConfig.type, warmupIterations]);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedAlgorithms,
      setSelectedAlgorithms,
      datasetConfig,
      setDatasetConfig,
      dataset,
      setDataset,
      currentSession,
      isRunning,
      warmupIterations,
      setWarmupIterations,
      runCurrentBenchmark,
      clearSession,
    }),
    [
      selectedAlgorithms,
      datasetConfig,
      dataset,
      currentSession,
      isRunning,
      warmupIterations,
      runCurrentBenchmark,
      clearSession,
    ]
  );

  return <BenchmarkContext.Provider value={value}>{children}</BenchmarkContext.Provider>;
};
