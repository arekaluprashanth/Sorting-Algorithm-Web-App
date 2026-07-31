import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare, swap } from '../helpers';

export class HeapSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.heap;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const n = data.length;
    const order = config.order ?? 'ascending';

    // Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      metrics.iterate();
      this.heapify(data, n, i, order, metrics);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      metrics.iterate();
      swap(data, 0, i);
      metrics.swap();
      this.heapify(data, i, 0, order, metrics);
    }
  }

  private heapify(
    data: number[],
    n: number,
    i: number,
    order: 'ascending' | 'descending',
    metrics: MetricsCollector
  ): void {
    let target = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      metrics.read(2);
      metrics.compare();
      if (compare(data[left]!, data[target]!, order) > 0) {
        target = left;
      }
    }

    if (right < n) {
      metrics.read(2);
      metrics.compare();
      if (compare(data[right]!, data[target]!, order) > 0) {
        target = right;
      }
    }

    if (target !== i) {
      swap(data, i, target);
      metrics.swap();
      this.heapify(data, n, target, order, metrics);
    }
  }
}
