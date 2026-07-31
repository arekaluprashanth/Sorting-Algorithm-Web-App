import { useState, useEffect, useCallback } from 'react';
import { QueueManager } from '../services/QueueManager';
import { WorkerPool } from '../services/WorkerPool';
import { BenchmarkScheduler } from '../services/BenchmarkScheduler';
import type { BenchmarkJob, QueueStatus } from '../types/queue.types';
import type { BenchmarkConfig } from '../engine/types';

const globalQueueManager = new QueueManager();
const globalWorkerPool = new WorkerPool(1);
const globalScheduler = new BenchmarkScheduler(globalQueueManager, globalWorkerPool);

export function useBenchmarkQueue() {
  const [jobs, setJobs] = useState<BenchmarkJob[]>(() => globalQueueManager.getJobs());
  const [status, setStatus] = useState<QueueStatus>(() => globalQueueManager.getStatus());

  useEffect(() => {
    return globalQueueManager.subscribe((newJobs, newStatus) => {
      setJobs(newJobs);
      setStatus(newStatus);
    });
  }, []);

  const addJob = useCallback((name: string, config: BenchmarkConfig) => {
    const job = globalQueueManager.addJob(name, config);
    if (globalQueueManager.getStatus() === 'IDLE') {
      globalScheduler.start();
    }
    return job;
  }, []);

  const removeJob = useCallback((jobId: string) => {
    globalQueueManager.removeJob(jobId);
  }, []);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    globalQueueManager.reorderQueue(startIndex, endIndex);
  }, []);

  const pauseQueue = useCallback(() => {
    globalScheduler.pause();
  }, []);

  const resumeQueue = useCallback(() => {
    globalScheduler.start();
  }, []);

  const cancelCurrentJob = useCallback(() => {
    globalScheduler.cancelCurrentJob();
  }, []);

  const retryJob = useCallback((jobId: string) => {
    globalQueueManager.retryJob(jobId);
    if (globalQueueManager.getStatus() === 'IDLE') {
      globalScheduler.start();
    }
  }, []);

  const clearQueue = useCallback(() => {
    globalQueueManager.clearQueue();
  }, []);

  return {
    jobs,
    status,
    addJob,
    removeJob,
    reorderQueue,
    pauseQueue,
    resumeQueue,
    cancelCurrentJob,
    retryJob,
    clearQueue,
  };
}
