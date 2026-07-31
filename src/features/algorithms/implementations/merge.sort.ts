import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare } from '../helpers';

export class MergeSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.merge;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const order = config.order ?? 'ascending';
    const tempBuffer = new Array<number>(data.length);
    metrics.addMemoryForArrayLength(data.length);

    this.mergeSortRecursive(data, tempBuffer, 0, data.length - 1, order, metrics);
  }

  private mergeSortRecursive(
    data: number[],
    temp: number[],
    left: number,
    right: number,
    order: 'ascending' | 'descending',
    metrics: MetricsCollector
  ): void {
    metrics.enterRecursion();

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      this.mergeSortRecursive(data, temp, left, mid, order, metrics);
      this.mergeSortRecursive(data, temp, mid + 1, right, order, metrics);
      this.merge(data, temp, left, mid, right, order, metrics);
    }

    metrics.exitRecursion();
  }

  private merge(
    data: number[],
    temp: number[],
    left: number,
    mid: number,
    right: number,
    order: 'ascending' | 'descending',
    metrics: MetricsCollector
  ): void {
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      metrics.iterate();
      metrics.read(2);
      metrics.compare();

      if (compare(data[i]!, data[j]!, order) <= 0) {
        temp[k++] = data[i++]!;
        metrics.write(1);
      } else {
        temp[k++] = data[j++]!;
        metrics.write(1);
      }
    }

    while (i <= mid) {
      metrics.iterate();
      metrics.read(1);
      temp[k++] = data[i++]!;
      metrics.write(1);
    }

    while (j <= right) {
      metrics.iterate();
      metrics.read(1);
      temp[k++] = data[j++]!;
      metrics.write(1);
    }

    for (let idx = left; idx <= right; idx++) {
      metrics.iterate();
      metrics.read(1);
      data[idx] = temp[idx]!;
      metrics.write(1);
    }
  }
}
