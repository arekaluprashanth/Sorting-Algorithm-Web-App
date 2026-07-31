import { BaseAlgorithm } from '../core/BaseAlgorithm';
import { ALGORITHM_CATALOG } from '../constants/catalog';
import type { AlgorithmInformation, SortingConfiguration } from '../types';
import type { MetricsCollector } from '../metrics/MetricsCollector';
import { compare } from '../helpers';

export class ShellSort extends BaseAlgorithm {
  public readonly info: AlgorithmInformation = ALGORITHM_CATALOG.shell;

  // Ciura gap sequence for optimal performance
  private readonly gaps = [701, 301, 132, 57, 23, 10, 4, 1];

  protected executeSort(
    data: number[],
    metrics: MetricsCollector,
    config: SortingConfiguration
  ): void {
    const n = data.length;
    const order = config.order ?? 'ascending';

    for (const gap of this.gaps) {
      if (gap >= n) continue;
      metrics.iterate();

      for (let i = gap; i < n; i++) {
        metrics.iterate();
        const temp = data[i]!;
        metrics.read(1);
        let j = i;

        while (j >= gap) {
          metrics.iterate();
          metrics.read(1);
          metrics.compare();

          if (compare(data[j - gap]!, temp, order) > 0) {
            data[j] = data[j - gap]!;
            metrics.write(1);
            j -= gap;
          } else {
            break;
          }
        }

        data[j] = temp;
        metrics.write(1);
      }
    }
  }
}
