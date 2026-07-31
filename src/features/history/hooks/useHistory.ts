/**
 * useHistory — primary hook for history state management.
 *
 * Provides the full in-memory session list synced to LocalStorage
 * and all mutation functions. Used by the HistoryContext provider.
 */
import { useState, useCallback, useRef } from 'react';
import type { BenchmarkSession } from '../../benchmark/engine/types';
import type { HistorySession, StorageStats } from '../types';
import { HistoryService } from '../services/history-service';
import { LocalStorageAdapter } from '../storage/local-storage-adapter';
import { SessionRepository } from '../storage/session-repository';

/** Lazily initialise the service singleton. */
function createService(): HistoryService {
  const adapter = new LocalStorageAdapter();
  const repository = new SessionRepository(adapter);
  return new HistoryService(repository);
}

export function useHistory() {
  const serviceRef = useRef<HistoryService | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = createService();
  }
  const service = serviceRef.current;

  const [sessions, setSessions] = useState<HistorySession[]>(() => service.loadSessions());
  const [storageStats, setStorageStats] = useState<StorageStats>(() => service.getStorageStats());

  /** Refresh in-memory state from storage. */
  const reload = useCallback(() => {
    setSessions(service.loadSessions());
    setStorageStats(service.getStorageStats());
  }, [service]);

  /** Save a new benchmark session (called by BenchmarkContext). */
  const saveSession = useCallback(
    (benchmarkSession: BenchmarkSession): HistorySession => {
      const entry = service.saveSession(benchmarkSession);
      reload();
      return entry;
    },
    [service, reload],
  );

  /** Rename a session. */
  const renameSession = useCallback(
    (sessionId: string, newName: string) => {
      service.renameSession(sessionId, newName);
      reload();
    },
    [service, reload],
  );

  /** Toggle favorite. */
  const favoriteSession = useCallback(
    (sessionId: string) => {
      service.favoriteSession(sessionId);
      reload();
    },
    [service, reload],
  );

  /** Update notes. */
  const updateNotes = useCallback(
    (sessionId: string, notes: string) => {
      service.updateNotes(sessionId, notes);
      reload();
    },
    [service, reload],
  );

  /** Duplicate a session. */
  const duplicateSession = useCallback(
    (sessionId: string) => {
      service.duplicateSession(sessionId);
      reload();
    },
    [service, reload],
  );

  /** Delete a single session. Returns deleted entries for undo. */
  const deleteSession = useCallback(
    (sessionId: string) => {
      service.deleteSession(sessionId);
      reload();
    },
    [service, reload],
  );

  /** Delete multiple sessions. */
  const deleteSessions = useCallback(
    (sessionIds: string[]) => {
      service.deleteSessions(sessionIds);
      reload();
    },
    [service, reload],
  );

  /** Clear all history. */
  const clearHistory = useCallback(() => {
    service.clearHistory();
    reload();
  }, [service, reload]);

  /** Get a single session by ID. */
  const getSession = useCallback(
    (sessionId: string) => service.getSession(sessionId),
    [service],
  );

  /** Compare two sessions. */
  const compareSessions = useCallback(
    (idA: string, idB: string) => service.compareSessions(idA, idB),
    [service],
  );

  return {
    sessions,
    storageStats,
    saveSession,
    renameSession,
    favoriteSession,
    updateNotes,
    duplicateSession,
    deleteSession,
    deleteSessions,
    clearHistory,
    getSession,
    compareSessions,
    reload,
  };
}
