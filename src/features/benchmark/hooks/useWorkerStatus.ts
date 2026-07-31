import { useState, useEffect } from 'react';
import { WorkerPool } from '../services/WorkerPool';
import type { WorkerStatus } from '../types/worker.types';

export function useWorkerStatus(pool?: WorkerPool): WorkerStatus[] {
  const [statuses, setStatuses] = useState<WorkerStatus[]>([]);

  useEffect(() => {
    if (!pool) return;
    setStatuses(pool.getAllStatuses());

    const interval = setInterval(() => {
      setStatuses(pool.getAllStatuses());
    }, 1000);

    return () => clearInterval(interval);
  }, [pool]);

  return statuses;
}
