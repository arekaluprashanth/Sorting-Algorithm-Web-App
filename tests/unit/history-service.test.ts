import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryService } from '../../src/features/history/services/history-service';
import { SessionRepository } from '../../src/features/history/storage/session-repository';
import { MockStorage } from '../mocks/storage.mock';
import type { BenchmarkSession } from '../../src/features/benchmark/engine/types';

describe('HistoryService and Storage', () => {
  let historyService: HistoryService;
  let mockStorage: MockStorage;

  const sampleSession: BenchmarkSession = {
    id: 'test-session-1',
    startedAt: 1000,
    completedAt: 2000,
    config: {
      algorithmIds: ['quick-sort'],
      datasetSize: 100,
      datasetType: 'random',
      warmupIterations: 1,
    },
    results: [
      {
        algorithmId: 'quick-sort',
        algorithmName: 'Quick Sort',
        datasetSize: 100,
        datasetType: 'random',
        executionTimeMs: 1.5,
        comparisons: 500,
        swaps: 200,
        memoryEstimateBytes: 800,
        maxRecursionDepth: 10,
        correct: true,
        timestamp: 1000,
      },
    ],
  };

  beforeEach(() => {
    mockStorage = new MockStorage();
    const repo = new SessionRepository(mockStorage);
    historyService = new HistoryService(repo);
  });

  it('should save and retrieve a session', () => {
    historyService.saveSession(sampleSession);
    const sessions = historyService.loadSessions();

    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.session.id).toBe('test-session-1');
  });

  it('should delete a session by id', () => {
    historyService.saveSession(sampleSession);
    expect(historyService.loadSessions()).toHaveLength(1);

    const deleted = historyService.deleteSession('test-session-1');
    expect(deleted).toBe(true);
    expect(historyService.loadSessions()).toHaveLength(0);
  });

  it('should clear all sessions', () => {
    historyService.saveSession(sampleSession);
    historyService.clearHistory();
    expect(historyService.loadSessions()).toHaveLength(0);
  });
});
