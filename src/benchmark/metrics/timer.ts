/**
 * Wrapper for high precision time tracking used outside of the individual algorithm metrics.
 */
export class BenchmarkTimer {
  private startTime = 0;

  /** Start the timer */
  public start(): void {
    this.startTime = performance.now();
  }

  /** Stop the timer and get elapsed milliseconds */
  public stop(): number {
    return performance.now() - this.startTime;
  }
}
