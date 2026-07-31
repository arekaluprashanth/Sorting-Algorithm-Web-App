/**
 * Log levels for the structured logger.
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * Structured logger for the Benchmark Engine.
 * Replaces console.log with a centralized, predictable logging mechanism.
 */
class BenchmarkLogger {
  private currentLevel: LogLevel = LogLevel.INFO;

  /**
   * Sets the minimum log level to output.
   */
  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private formatMessage(level: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    let suffix = '';
    
    if (data !== undefined) {
      try {
        suffix = ` | Data: ${JSON.stringify(data)}`;
      } catch {
        suffix = ` | Data: [Unserializable Object]`;
      }
    }
    
    return `[${timestamp}] [BENCHMARK_ENGINE] [${level}] ${message}${suffix}`;
  }

  public debug(message: string, data?: unknown): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug(this.formatMessage('DEBUG', message, data));
      }
    }
  }

  public info(message: string, data?: unknown): void {
    if (this.currentLevel <= LogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage('INFO', message, data));
    }
  }

  public warn(message: string, data?: unknown): void {
    if (this.currentLevel <= LogLevel.WARNING) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage('WARNING', message, data));
    }
  }

  public error(message: string, error?: unknown): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      // eslint-disable-next-line no-console
      console.error(this.formatMessage('ERROR', message), error);
    }
  }
}

// Export singleton instance
export const logger = new BenchmarkLogger();
