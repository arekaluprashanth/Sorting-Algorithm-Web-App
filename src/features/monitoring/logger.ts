export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private static isDev = import.meta.env.DEV;

  public static debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  public static info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  public static warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  public static error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  private static log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (this.isDev) {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, context || '');
    }
  }
}
