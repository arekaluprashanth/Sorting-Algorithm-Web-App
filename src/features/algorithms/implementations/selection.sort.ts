import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare, swap } from '../helpers';

export class SelectionSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.selection;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const n = data.length;
    const order = config.order ?? 'ascending';

    for (let i = 0; i < n - 1; i++) {
      metrics.iterate();
      let targetIdx = i;

      for (let j = i + 1; j < n; j++) {
        metrics.iterate();
        metrics.read(2);
        metrics.compare();

        if (compare(data[j]!, data[targetIdx]!, order) < 0) {
          targetIdx = j;
        }
      }

      if (targetIdx !== i) {
        swap(data, i, targetIdx);
        metrics.swap();
      }
    }
  }
}
