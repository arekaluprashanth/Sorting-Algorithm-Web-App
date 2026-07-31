import type { BenchmarkConfiguration } from '../types';
import { isDatasetValid } from '../utils/dataset';
import { BENCHMARK_ERROR_MESSAGES } from '../constants';

export class BenchmarkConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BenchmarkConfigurationError';
  }
}

/**
 * Validates the full BenchmarkConfiguration object before a benchmark session starts.
 * Throws BenchmarkConfigurationError if any configuration is strictly invalid.
 *
 * @param config - The benchmark configuration to validate.
 */
export const validateBenchmarkConfiguration = (config: BenchmarkConfiguration): void => {
  if (!config.algorithms || config.algorithms.length === 0) {
    throw new BenchmarkConfigurationError(BENCHMARK_ERROR_MESSAGES.NO_ALGORITHMS);
  }

  if (!isDatasetValid(config.dataset)) {
    throw new BenchmarkConfigurationError(BENCHMARK_ERROR_MESSAGES.EMPTY_DATASET);
  }

  if (config.warmUpRuns < 0) {
    throw new BenchmarkConfigurationError('warmUpRuns cannot be negative.');
  }

  if (config.measuredRuns <= 0) {
    throw new BenchmarkConfigurationError('measuredRuns must be strictly greater than 0.');
  }

  if (config.timeoutMs <= 0) {
    throw new BenchmarkConfigurationError('timeoutMs must be positive.');
  }

  if (config.maxExecutionTimeMs <= 0 || config.maxExecutionTimeMs < config.timeoutMs) {
    throw new BenchmarkConfigurationError('maxExecutionTimeMs must be greater than timeoutMs and positive.');
  }
};
