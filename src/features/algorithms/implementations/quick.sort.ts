import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration, QuickSortPivotStrategy } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare, swap } from '../helpers';

export class QuickSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.quick;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const order = config.order ?? 'ascending';
    const pivotStrategy = config.pivotStrategy ?? 'median-of-three';

    this.quickSortRecursive(data, 0, data.length - 1, order, pivotStrategy, metrics);
  }

  private quickSortRecursive(
    data: number[],
    low: number,
    high: number,
    order: 'ascending' | 'descending',
    pivotStrategy: QuickSortPivotStrategy,
    metrics: MetricsCollector
  ): void {
    metrics.enterRecursion();

    if (low < high) {
      const pIdx = this.partition(data, low, high, order, pivotStrategy, metrics);
      this.quickSortRecursive(data, low, pIdx - 1, order, pivotStrategy, metrics);
      this.quickSortRecursive(data, pIdx + 1, high, order, pivotStrategy, metrics);
    }

    metrics.exitRecursion();
  }

  private selectPivotIndex(
    data: number[],
    low: number,
    high: number,
    order: 'ascending' | 'descending',
    strategy: QuickSortPivotStrategy,
    metrics: MetricsCollector
  ): number {
    if (strategy === 'first') return low;
    if (strategy === 'last') return high;
    if (strategy === 'middle') return Math.floor((low + high) / 2);
    if (strategy === 'random') return Math.floor(Math.random() * (high - low + 1)) + low;

    // Median-of-three default strategy
    const mid = Math.floor((low + high) / 2);
    metrics.read(3);
    metrics.compare(3);

    const a = data[low]!;
    const b = data[mid]!;
    const c = data[high]!;

    if (compare(a, b, order) <= 0) {
      if (compare(b, c, order) <= 0) return mid;
      return compare(a, c, order) <= 0 ? high : low;
    } else {
      if (compare(a, c, order) <= 0) return low;
      return compare(b, c, order) <= 0 ? high : mid;
    }
  }

  private partition(
    data: number[],
    low: number,
    high: number,
    order: 'ascending' | 'descending',
    strategy: QuickSortPivotStrategy,
    metrics: MetricsCollector
  ): number {
    const pivotIdx = this.selectPivotIndex(data, low, high, order, strategy, metrics);
    if (pivotIdx !== high) {
      swap(data, pivotIdx, high);
      metrics.swap();
    }

    const pivot = data[high]!;
    metrics.read(1);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      metrics.iterate();
      metrics.read(1);
      metrics.compare();

      if (compare(data[j]!, pivot, order) <= 0) {
        i++;
        if (i !== j) {
          swap(data, i, j);
          metrics.swap();
        }
      }
    }

    if (i + 1 !== high) {
      swap(data, i + 1, high);
      metrics.swap();
    }

    return i + 1;
  }
}
