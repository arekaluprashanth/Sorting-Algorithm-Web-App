import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { validateIntegerArray } from '../validators/algorithm.validator';

export class CountingSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.counting;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    // Validate integer inputs
    const integerValidation = validateIntegerArray(data);
    if (!integerValidation.isValid) {
      throw new Error(integerValidation.error);
    }

    const n = data.length;
    let min = data[0]!;
    let max = data[0]!;
    metrics.read(1);

    for (let i = 1; i < n; i++) {
      metrics.iterate();
      metrics.read(1);
      if (data[i]! < min) min = data[i]!;
      if (data[i]! > max) max = data[i]!;
    }

    const range = max - min + 1;
    // Memory cap check to prevent giant allocation crashes
    if (range > 10000000) {
      throw new Error(`Range too large for Counting Sort (${range.toLocaleString()}). Use Quick or Merge Sort.`);
    }

    const count = new Array<number>(range).fill(0);
    const output = new Array<number>(n);
    metrics.addMemoryForArrayLength(range + n);

    for (let i = 0; i < n; i++) {
      metrics.iterate();
      metrics.read(1);
      const val = data[i]!;
      const idx = val - min;
      count[idx] = (count[idx] ?? 0) + 1;
    }

    const order = config.order ?? 'ascending';

    if (order === 'ascending') {
      for (let i = 1; i < range; i++) {
        metrics.iterate();
        count[i] = (count[i] ?? 0) + (count[i - 1] ?? 0);
      }

      for (let i = n - 1; i >= 0; i--) {
        metrics.iterate();
        metrics.read(1);
        const val = data[i]!;
        const idx = val - min;
        const pos = (count[idx] ?? 1) - 1;
        output[pos] = val;
        count[idx] = (count[idx] ?? 1) - 1;
        metrics.write(1);
      }
    } else {
      for (let i = range - 2; i >= 0; i--) {
        metrics.iterate();
        count[i] = (count[i] ?? 0) + (count[i + 1] ?? 0);
      }

      for (let i = 0; i < n; i++) {
        metrics.iterate();
        metrics.read(1);
        const val = data[i]!;
        const idx = val - min;
        const pos = (count[idx] ?? 1) - 1;
        output[pos] = val;
        count[idx] = (count[idx] ?? 1) - 1;
        metrics.write(1);
      }
    }

    for (let i = 0; i < n; i++) {
      metrics.iterate();
      data[i] = output[i]!;
      metrics.write(1);
    }
  }
}
