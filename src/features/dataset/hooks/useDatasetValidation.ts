import { useMemo } from 'react';
import type { DatasetOptions, ValidationResult } from '../types';
import { validateDatasetOptions } from '../validators/dataset.validator';

/**
 * Custom hook providing real-time validation of dataset options.
 */
export function useDatasetValidation(options: DatasetOptions): ValidationResult {
  return useMemo(() => validateDatasetOptions(options), [options]);
}
