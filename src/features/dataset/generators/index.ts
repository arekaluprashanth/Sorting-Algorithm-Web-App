import type { DatasetOptions, GenerationResult } from '../types';
import { validateDatasetOptions } from '../validators/dataset.validator';
import { generateRandomArray } from './random.generator';
import { generateSortedArray } from './sorted.generator';
import { generateReverseSortedArray } from './reverse.generator';
import { generateNearlySortedArray } from './nearly-sorted.generator';
import { generateFewUniqueArray, generateDuplicateHeavyArray } from './duplicate.generator';
import { parseCustomDataset } from './custom.generator';
import { calculateDatasetStatistics } from '../statistics/statistics.calculator';
import { generateUUID } from '../../../utils/helpers';

/**
 * DatasetGenerator — Unified service for generating datasets.
 */
export class DatasetGenerator {
  /**
   * Generates a dataset payload according to the provided configuration options.
   * Measures generation duration and automatically computes dataset statistics.
   *
   * @param options - Dataset generation configuration options.
   * @returns GenerationResult containing output array, statistics, metadata, and validation info.
   */
  public static generate(options: DatasetOptions): GenerationResult {
    const startTime = performance.now();
    const validation = validateDatasetOptions(options);

    if (!validation.isValid) {
      return {
        success: false,
        data: [],
        statistics: {
          min: 0,
          max: 0,
          average: 0,
          median: 0,
          range: 0,
          uniqueCount: 0,
          duplicateCount: 0,
          duplicatePercentage: 0,
          length: 0,
          estimatedMemoryBytes: 0,
          generationDurationMs: 0,
        },
        metadata: {
          id: generateUUID(),
          type: options.type,
          size: options.size,
          seed: options.seed,
          generatedAt: Date.now(),
          options,
        },
        validation,
        error: validation.errors[0] || 'Invalid dataset configuration options.',
      };
    }

    let data: number[] = [];

    switch (options.type) {
      case 'random':
        data = generateRandomArray(options.size, options.min, options.max, options.seed);
        break;
      case 'sorted':
        data = generateSortedArray(options.size, options.min, options.max);
        break;
      case 'reverse-sorted':
      case 'reversed' as unknown as string:
        data = generateReverseSortedArray(options.size, options.min, options.max);
        break;
      case 'nearly-sorted':
        data = generateNearlySortedArray(
          options.size,
          options.min,
          options.max,
          options.nearlySortedPercentage ?? 5,
          options.seed
        );
        break;
      case 'few-unique':
        data = generateFewUniqueArray(options.size, options.min, options.max, options.seed);
        break;
      case 'many-duplicates':
        data = generateDuplicateHeavyArray(
          options.size,
          options.min,
          options.max,
          options.duplicateRatio ?? 0.1,
          options.seed
        );
        break;
      case 'custom':
        data = parseCustomDataset(options.customInput);
        break;
      default:
        data = generateRandomArray(options.size, options.min, options.max, options.seed);
        break;
    }

    const endTime = performance.now();
    const durationMs = endTime - startTime;
    const statistics = calculateDatasetStatistics(data, durationMs);

    return {
      success: true,
      data,
      statistics,
      metadata: {
        id: generateUUID(),
        type: options.type,
        size: data.length,
        seed: options.seed,
        generatedAt: Date.now(),
        options,
      },
      validation,
    };
  }
}

/**
 * Backward compatibility helper for legacy generateDataset invocations.
 */
export function generateDataset(options: DatasetOptions): number[] {
  return DatasetGenerator.generate(options).data;
}

export * from './random.generator';
export * from './sorted.generator';
export * from './reverse.generator';
export * from './nearly-sorted.generator';
export * from './duplicate.generator';
export * from './custom.generator';
