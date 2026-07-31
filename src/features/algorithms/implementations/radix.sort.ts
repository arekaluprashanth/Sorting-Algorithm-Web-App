import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { validateNonNegativeIntegerArray } from '../validators/algorithm.validator';

export class RadixSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.radix;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const validation = validateNonNegativeIntegerArray(data);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const n = data.length;
    let max = data[0]!;
    metrics.read(1);

    for (let i = 1; i < n; i++) {
      metrics.iterate();
      metrics.read(1);
      if (data[i]! > max) max = data[i]!;
    }

    // Do counting sort for every digit position (1, 10, 100...)
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      metrics.iterate();
      this.countSortForDigit(data, exp, config.order ?? 'ascending', metrics);
    }
  }

  private countSortForDigit(
    data: number[],
    exp: number,
    order: 'ascending' | 'descending',
    metrics: MetricsCollector
  ): void {
    const n = data.length;
    const output = new Array<number>(n);
    const count = new Array<number>(10).fill(0);
    metrics.addMemoryForArrayLength(n + 10);

    for (let i = 0; i < n; i++) {
      metrics.iterate();
      metrics.read(1);
      const digit = Math.floor(data[i]! / exp) % 10;
      count[digit] = (count[digit] ?? 0) + 1;
    }

    if (order === 'ascending') {
      for (let i = 1; i < 10; i++) {
        metrics.iterate();
        count[i] = (count[i] ?? 0) + (count[i - 1] ?? 0);
      }

      for (let i = n - 1; i >= 0; i--) {
        metrics.iterate();
        metrics.read(1);
        const digit = Math.floor(data[i]! / exp) % 10;
        const pos = (count[digit] ?? 1) - 1;
        output[pos] = data[i]!;
        count[digit] = (count[digit] ?? 1) - 1;
        metrics.write(1);
      }
    } else {
      for (let i = 8; i >= 0; i--) {
        metrics.iterate();
        count[i] = (count[i] ?? 0) + (count[i + 1] ?? 0);
      }

      for (let i = 0; i < n; i++) {
        metrics.iterate();
        metrics.read(1);
        const digit = Math.floor(data[i]! / exp) % 10;
        const pos = (count[digit] ?? 1) - 1;
        output[pos] = data[i]!;
        count[digit] = (count[digit] ?? 1) - 1;
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
