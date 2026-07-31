import type {
  WorkerRequestMessage,
  WorkerResponseMessage,
  WorkerStatus,
  WorkerState,
  WorkerProgressPayload,
} from '../types/worker.types';
import type { BenchmarkConfig, BenchmarkResult } from '../engine/types';

export interface WorkerManagerListeners {
  onProgress?: (progress: WorkerProgressPayload) => void;
  onResult?: (algorithmId: string, result: BenchmarkResult) => void;
  onComplete?: (results: BenchmarkResult[], durationMs: number) => void;
  onError?: (error: string, stack?: string) => void;
  onCancel?: () => void;
  onStatusChange?: (status: WorkerStatus) => void;
}

export class WorkerManager {
  private worker: Worker | null = null;
  private id: string;
  private state: WorkerState = 'IDLE';
  private activeJobId: string | null = null;
  private tasksCompleted = 0;
  private lastPingTimestamp = 0;
  private latencyMs = 0;
  private listeners: WorkerManagerListeners = {};

  constructor(id: string = 'worker-1') {
    this.id = id;
  }

  public getStatus(): WorkerStatus {
    return {
      id: this.id,
      state: this.state,
      activeJobId: this.activeJobId,
      tasksCompleted: this.tasksCompleted,
      lastPingTimestamp: this.lastPingTimestamp,
      latencyMs: this.latencyMs,
    };
  }

  public setListeners(listeners: WorkerManagerListeners): void {
    this.listeners = listeners;
  }

  public initialize(): void {
    if (this.worker) return;

    this.setState('INITIALIZING');
    try {
      this.worker = new Worker(
        new URL('../../../workers/benchmark.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error: ErrorEvent) => {
        this.setState('ERROR');
        this.listeners.onError?.(error.message || 'Worker thread error');
      };

      this.setState('IDLE');
    } catch (e) {
      this.setState('ERROR');
      const msg = e instanceof Error ? e.message : 'Failed to instantiate Web Worker';
      this.listeners.onError?.(msg);
    }
  }

  public runJob(jobId: string, config: BenchmarkConfig): void {
    if (!this.worker) {
      this.initialize();
    }
    if (!this.worker) {
      throw new Error('Worker thread is not available');
    }

    this.activeJobId = jobId;
    this.setState('RUNNING');

    const message: WorkerRequestMessage = {
      type: 'RUN',
      payload: { jobId, config },
    };

    this.worker.postMessage(message);
  }

  public cancelJob(jobId: string): void {
    if (!this.worker || this.activeJobId !== jobId) return;

    const message: WorkerRequestMessage = {
      type: 'CANCEL',
      payload: { jobId },
    };

    this.worker.postMessage(message);
  }

  public ping(): void {
    if (!this.worker) return;
    const now = Date.now();
    this.lastPingTimestamp = now;
    const message: WorkerRequestMessage = {
      type: 'PING',
      payload: { timestamp: now },
    };
    this.worker.postMessage(message);
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.activeJobId = null;
    this.setState('TERMINATED');
  }

  private handleWorkerMessage(message: WorkerResponseMessage): void {
    if (!message || !message.type) return;

    switch (message.type) {
      case 'PONG': {
        if (message.payload?.timestamp) {
          this.latencyMs = Date.now() - message.payload.timestamp;
          this.notifyStatusChange();
        }
        break;
      }
      case 'PROGRESS': {
        this.listeners.onProgress?.(message.payload);
        break;
      }
      case 'RESULT': {
        this.listeners.onResult?.(message.payload.algorithmId, message.payload.result);
        break;
      }
      case 'COMPLETE': {
        this.tasksCompleted++;
        this.activeJobId = null;
        this.setState('IDLE');
        this.listeners.onComplete?.(message.payload.results, message.payload.totalDurationMs);
        break;
      }
      case 'CANCEL': {
        this.activeJobId = null;
        this.setState('IDLE');
        this.listeners.onCancel?.();
        break;
      }
      case 'ERROR': {
        this.activeJobId = null;
        this.setState('ERROR');
        this.listeners.onError?.(message.payload.error, message.payload.stack);
        break;
      }
    }
  }

  private setState(state: WorkerState): void {
    this.state = state;
    this.notifyStatusChange();
  }

  private notifyStatusChange(): void {
    this.listeners.onStatusChange?.(this.getStatus());
  }
}
