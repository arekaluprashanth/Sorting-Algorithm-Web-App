import type { MetricsCollector, CollectedMetrics } from '../../benchmark/engine/types';
import type { TraceOperation, VisualizationTrace } from '../types';

/**
 * A collector that records every operation to a chronological trace 
 * instead of just counting them. This allows step-by-step playback.
 */
class TraceCollector implements MetricsCollector {
  private trace: TraceOperation[] = [];
  private currentArray: number[];
  
  private metrics: CollectedMetrics = {
    comparisons: 0,
    swaps: 0,
    memoryAllocations: 0,
    peakMemoryElements: 0,
    maxRecursionDepth: 0,
  };

  private currentRecursionDepth = 0;

  constructor(initialArray: number[]) {
    this.currentArray = [...initialArray];
  }

  compare(a: number, b: number): number {
    this.metrics.comparisons++;
    
    // In our simplified trace, we just record the indices.
    // However, the interface signature is `compare(valA, valB)`, not indices. 
    // This is tricky for visualizing *where* the compare happens unless we find the index.
    // Assuming standard benchmark implementation, we might not always have indices passed.
    // We will do a best-effort index lookup to highlight them.
    const i = this.currentArray.indexOf(a);
    const j = this.currentArray.lastIndexOf(b);

    this.trace.push({
      type: 'compare',
      i: i !== -1 ? i : undefined,
      j: j !== -1 ? j : undefined,
      description: `Comparing elements ${a} and ${b}`
    });

    return a - b;
  }

  swap(arr: number[], i: number, j: number): void {
    this.metrics.swaps++;
    
    // Perform actual swap
    const temp = arr[i] as number;
    arr[i] = arr[j] as number;
    arr[j] = temp;

    // Sync state
    this.currentArray = [...arr];

    // Record swap
    this.trace.push({
      type: 'swap',
      i,
      j,
      state: [...this.currentArray],
      description: `Swapped elements at index ${i} and ${j}`
    });
  }

  allocate(size: number): void {
    this.metrics.memoryAllocations++;
    this.metrics.peakMemoryElements += size;
    
    this.trace.push({
      type: 'allocate',
      size,
      description: `Allocated auxiliary memory of size ${size}`
    });
  }

  pushRecursion(): void {
    this.currentRecursionDepth++;
    if (this.currentRecursionDepth > this.metrics.maxRecursionDepth) {
      this.metrics.maxRecursionDepth = this.currentRecursionDepth;
    }
  }

  popRecursion(): void {
    this.currentRecursionDepth--;
  }

  getMetrics(): CollectedMetrics {
    return this.metrics;
  }

  getTrace(): TraceOperation[] {
    return this.trace;
  }
}

export class VisualizationEngine {
  /**
   * Runs the given algorithm on a small array and generates a visualization trace.
   */
  generateTrace(algorithm: any, initialArray: number[]): VisualizationTrace {
    const collector = new TraceCollector(initialArray);
    
    // We must clone the array so we don't mutate the initial one passed in
    const arrayToSort = [...initialArray];
    
    // Run the algorithm
    algorithm.sort(arrayToSort, collector);

    // Append a final state marker
    const trace = collector.getTrace();
    trace.push({
      type: 'state',
      state: [...arrayToSort],
      description: 'Sorting complete.'
    });

    return {
      algorithmId: algorithm.id,
      initialState: [...initialArray],
      operations: trace,
    };
  }
}

export const visualizationEngine = new VisualizationEngine();
