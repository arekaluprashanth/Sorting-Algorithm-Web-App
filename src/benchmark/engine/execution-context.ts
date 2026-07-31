import type { ExecutionStatus } from '../types';

/**
 * ExecutionContext manages the abort state and running state of a benchmark session.
 */
export class ExecutionContext {
  private status: ExecutionStatus = 'IDLE';
  private abortController: AbortController;

  constructor(externalSignal?: AbortSignal) {
    this.abortController = new AbortController();
    
    // Link external signal if provided
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => this.abort(), { once: true });
      if (externalSignal.aborted) {
        this.abort();
      }
    }
  }

  public get isAborted(): boolean {
    return this.abortController.signal.aborted;
  }

  public get signal(): AbortSignal {
    return this.abortController.signal;
  }

  public get currentStatus(): ExecutionStatus {
    return this.status;
  }

  public setStatus(status: ExecutionStatus): void {
    if (this.status === 'ABORTED' && status !== 'IDLE') {
      return; // Can't transition out of aborted unless fully resetting to IDLE
    }
    this.status = status;
  }

  public abort(): void {
    if (!this.isAborted) {
      this.abortController.abort();
      this.setStatus('ABORTED');
    }
  }

  /**
   * Small async delay wrapper that responds to aborts to yield back to the main thread.
   * Useful for keeping UI responsive during heavy benchmark execution.
   */
  public async yieldThread(ms = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isAborted) return reject(new Error('Aborted'));
      
      const timeoutId = setTimeout(() => {
        if (this.isAborted) {
          reject(new Error('Aborted'));
        } else {
          resolve();
        }
      }, ms);

      this.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Aborted'));
      }, { once: true });
    });
  }
}
