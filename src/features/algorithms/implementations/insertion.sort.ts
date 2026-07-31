import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare } from '../helpers';

export class InsertionSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.insertion;

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const n = data.length;
    const order = config.order ?? 'ascending';

    for (let i = 1; i < n; i++) {
      metrics.iterate();
      const current = data[i]!;
      metrics.read(1);
      let j = i - 1;

      while (j >= 0) {
        metrics.iterate();
        metrics.read(1);
        metrics.compare();

        if (compare(data[j]!, current, order) > 0) {
          data[j + 1] = data[j]!;
          metrics.write(1);
          j--;
        } else {
          break;
        }
      }

      data[j + 1] = current;
      metrics.write(1);
    }
  }
}
