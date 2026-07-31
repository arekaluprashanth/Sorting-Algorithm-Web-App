import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare, swap } from '../helpers';

export class BubbleSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.bubble;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const n = data.length;
    const order = config.order ?? 'ascending';

    for (let i = 0; i < n - 1; i++) {
      metrics.iterate();
      let swappedInPass = false;

      for (let j = 0; j < n - 1 - i; j++) {
        metrics.iterate();
        metrics.read(2);
        metrics.compare();

        if (compare(data[j]!, data[j + 1]!, order) > 0) {
          swap(data, j, j + 1);
          metrics.swap();
          swappedInPass = true;
        }
      }

      // Early break optimization if array is already sorted
      if (!swappedInPass) {
        break;
      }
    }
  }
}
