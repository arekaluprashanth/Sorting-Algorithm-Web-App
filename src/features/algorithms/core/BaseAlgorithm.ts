import type {
  AlgorithmInformation,
  SortingAlgorithm,
  SortingConfiguration,
  SortingResult,
} from '../types';
import { MetricsCollector } from '../metrics/MetricsCollector';
import { validateArrayInput } from '../validators/algorithm.validator';
import { cloneArray } from '../helpers';

/**
 * Abstract BaseAlgorithm class enforcing the standard algorithm contract, input immutability,
 * error handling, and metric collection across all algorithm implementations.
 */
export abstract class BaseAlgorithm implements SortingAlgorithm {
  abstract readonly info: AlgorithmInformation;

  /**
   * Abstract execution implementation overridden by each specific sorting subclass.
   *
   * @param data - The cloned mutable working array copy.
   * @param metrics - Collector tracking performance metrics.
   * @param config - Options configuration.
   */
  protected abstract executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void;

  /**
   * Standard public entry point executing the algorithm.
   * Clones input data to preserve immutability and returns a standardized `SortingResult`.
   */
  public sort(data: number[], config: SortingConfiguration = {}): SortingResult {
    const validation = validateArrayInput(data);
    if (!validation.isValid) {
      const emptyMetrics = new MetricsCollector(0).snapshot(0);
      return {
        success: false,
        data: [],
        metrics: emptyMetrics,
        info: this.info,
        error: validation.error,
      };
    }

    // Preserve immutability by creating a internal working copy
    const workingArray = cloneArray(data);
    const metrics = new MetricsCollector(workingArray.length);

    // Handle trivial 0 or 1 element edge cases immediately
    if (workingArray.length <= 1) {
      metrics.start();
      metrics.stop();
      return {
        success: true,
        data: workingArray,
        metrics: metrics.snapshot(workingArray.length),
        info: this.info,
      };
    }

    try {
      metrics.start();
      this.executeSort(workingArray, metrics, config);
      metrics.stop();

      return {
        success: true,
        data: workingArray,
        metrics: metrics.snapshot(workingArray.length),
        info: this.info,
      };
    } catch (error) {
      metrics.stop();
      const errorMsg = error instanceof Error ? error.message : 'Unknown sorting execution error';
      return {
        success: false,
        data: [],
        metrics: metrics.snapshot(0),
        info: this.info,
        error: errorMsg,
      };
    }
  }
}
