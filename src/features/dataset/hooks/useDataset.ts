import { useState, useCallback } from 'react';
import type { DatasetOptions } from '../types';
import { DEFAULT_DATASET_OPTIONS } from '../constants';
import { useGenerator } from './useGenerator';
import { useDatasetValidation } from './useDatasetValidation';

/**
 * Main orchestrator hook for dataset generation state, settings options, and preview payload.
 */
export function useDataset(initialOptions: DatasetOptions = DEFAULT_DATASET_OPTIONS) {
  const [options, setOptions] = useState<DatasetOptions>(initialOptions);
  const { generate, isGenerating, lastResult } = useGenerator();
  const validation = useDatasetValidation(options);

  const handleGenerate = useCallback(async () => {
    return await generate(options);
  }, [generate, options]);

  const handleReset = useCallback(() => {
    setOptions(DEFAULT_DATASET_OPTIONS);
  }, []);

  const randomizeSeed = useCallback(() => {
    setOptions((prev: DatasetOptions) => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000),
    }));
  }, []);

  return {
    options,
    setOptions,
    validation,
    handleGenerate,
    handleReset,
    randomizeSeed,
    isGenerating,
    lastResult,
    dataset: lastResult?.data || [],
    statistics: lastResult?.statistics || null,
  };
}
