import { WorkerManager } from './WorkerManager';
import type { WorkerManagerListeners } from './WorkerManager';
import type { WorkerStatus } from '../types/worker.types';

export class WorkerPool {
  private workers: WorkerManager[] = [];
  private poolSize: number;

  constructor(poolSize: number = 1) {
    this.poolSize = poolSize;
    this.initializePool();
  }

  private initializePool(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new WorkerManager(`worker-${i + 1}`);
      this.workers.push(worker);
    }
  }

  public getWorker(index: number = 0): WorkerManager {
    const worker = this.workers[index];
    if (!worker) {
      throw new Error(`Worker at index ${index} does not exist in pool.`);
    }
    return worker;
  }

  public getPrimaryWorker(): WorkerManager {
    return this.getWorker(0);
  }

  public getAllStatuses(): WorkerStatus[] {
    return this.workers.map(w => w.getStatus());
  }

  public setGlobalListeners(listeners: WorkerManagerListeners): void {
    this.workers.forEach(w => w.setListeners(listeners));
  }

  public terminateAll(): void {
    this.workers.forEach(w => w.terminate());
  }
}
