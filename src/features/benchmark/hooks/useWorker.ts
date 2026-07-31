import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkerManager } from '../services/WorkerManager';
import type { WorkerStatus, WorkerProgressPayload } from '../types/worker.types';
import type { BenchmarkConfig } from '../engine/types';

export function useWorker(workerId: string = 'worker-1') {
  const managerRef = useRef<WorkerManager | null>(null);
  const [status, setStatus] = useState<WorkerStatus>({
    id: workerId,
    state: 'IDLE',
    activeJobId: null,
    tasksCompleted: 0,
    lastPingTimestamp: 0,
    latencyMs: 0,
  });
  const [progress, setProgress] = useState<WorkerProgressPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const manager = new WorkerManager(workerId);
    managerRef.current = manager;

    manager.setListeners({
      onStatusChange: (newStatus) => setStatus(newStatus),
      onProgress: (newProgress) => setProgress(newProgress),
      onError: (err) => setError(err),
      onComplete: () => setProgress(null),
      onCancel: () => setProgress(null),
    });

    manager.initialize();

    return () => {
      manager.terminate();
    };
  }, [workerId]);

  const runJob = useCallback((jobId: string, config: BenchmarkConfig) => {
    setError(null);
    setProgress(null);
    managerRef.current?.runJob(jobId, config);
  }, []);

  const cancelJob = useCallback((jobId: string) => {
    managerRef.current?.cancelJob(jobId);
  }, []);

  const ping = useCallback(() => {
    managerRef.current?.ping();
  }, []);

  return {
    status,
    progress,
    error,
    runJob,
    cancelJob,
    ping,
  };
}
