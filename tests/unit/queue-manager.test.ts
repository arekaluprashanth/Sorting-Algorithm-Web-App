import { describe, it, expect, beforeEach } from 'vitest';
import { QueueManager } from '../../src/features/benchmark/services/QueueManager';
import type { BenchmarkConfig } from '../../src/features/benchmark/engine/types';

describe('QueueManager Service', () => {
  let queueManager: QueueManager;

  const sampleConfig: BenchmarkConfig = {
    algorithmIds: ['quick-sort'],
    dataset: [1, 2, 3],
    datasetType: 'random',
    warmupIterations: 0,
  };

  beforeEach(() => {
    queueManager = new QueueManager();
  });

  it('should add a job to the queue', () => {
    const job = queueManager.addJob('Test Job', sampleConfig);

    expect(job.name).toBe('Test Job');
    expect(job.status).toBe('PENDING');
    expect(queueManager.getJobs()).toHaveLength(1);
  });

  it('should mark job status transitions correctly', () => {
    const job = queueManager.addJob('Test Job', sampleConfig);

    queueManager.markJobStarted(job.id);
    expect(queueManager.getJobs()[0]?.status).toBe('RUNNING');

    queueManager.markJobCompleted(job.id, []);
    expect(queueManager.getJobs()[0]?.status).toBe('COMPLETED');
  });

  it('should remove a job from queue', () => {
    const job = queueManager.addJob('Test Job', sampleConfig);
    expect(queueManager.getJobs()).toHaveLength(1);

    queueManager.removeJob(job.id);
    expect(queueManager.getJobs()).toHaveLength(0);
  });

  it('should retry a failed job', () => {
    const job = queueManager.addJob('Failed Job', sampleConfig);
    queueManager.markJobFailed(job.id, 'Test Error');
    expect(queueManager.getJobs()[0]?.status).toBe('FAILED');

    queueManager.retryJob(job.id);
    expect(queueManager.getJobs()[0]?.status).toBe('PENDING');
  });
});
