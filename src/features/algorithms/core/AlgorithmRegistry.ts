import type { AlgorithmId, AlgorithmInformation, SortingConfiguration, SortingResult } from '../types';
import type { BaseAlgorithm } from './BaseAlgorithm';
import {
  BubbleSort,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  HeapSort,
  ShellSort,
  CountingSort,
  RadixSort,
} from '../implementations';

/**
 * Central registry and factory for all sorting algorithms.
 * Allows instantiation, execution by ID, and listing all metadata.
 */
export class AlgorithmRegistry {
  private static algorithmsMap: Map<AlgorithmId, BaseAlgorithm> = new Map<AlgorithmId, BaseAlgorithm>([
    ['bubble', new BubbleSort()],
    ['selection', new SelectionSort()],
    ['insertion', new InsertionSort()],
    ['merge', new MergeSort()],
    ['quick', new QuickSort()],
    ['heap', new HeapSort()],
    ['shell', new ShellSort()],
    ['counting', new CountingSort()],
    ['radix', new RadixSort()],
  ]);

  /**
   * Retrieves an algorithm instance by its unique identifier.
   *
   * @param id - Algorithm ID.
   * @returns BaseAlgorithm instance or throws if invalid ID.
   */
  public static getAlgorithm(id: AlgorithmId): BaseAlgorithm {
    const algorithm = this.algorithmsMap.get(id);
    if (!algorithm) {
      throw new Error(`Algorithm '${id}' is not registered in the AlgorithmRegistry.`);
    }
    return algorithm;
  }

  /**
   * Directly executes a sorting algorithm by ID.
   *
   * @param id - Algorithm ID.
   * @param data - Input array to sort (cloned internally to guarantee immutability).
   * @param config - Optional configuration (order, pivot strategy, etc.).
   */
  public static run(
    id: AlgorithmId,
    data: number[],
    config?: SortingConfiguration
  ): SortingResult {
    return this.getAlgorithm(id).sort(data, config);
  }

  /**
   * Returns metadata for all registered algorithms.
   */
  public static getAllMetadata(): AlgorithmInformation[] {
    return Array.from(this.algorithmsMap.values()).map((alg) => alg.info);
  }

  /**
   * Returns all supported algorithm IDs.
   */
  public static getAllIds(): AlgorithmId[] {
    return Array.from(this.algorithmsMap.keys());
  }
}
