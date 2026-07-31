/**
 * HistoryService — stateless business logic for benchmark history.
 *
 * Orchestrates SessionRepository calls, generates default session names,
 * handles comparison logic, and exposes the public developer API
 * consumed by hooks and contexts.
 */
import type { BenchmarkSession } from '../../benchmark/engine/types';
import type { HistorySession, ComparisonResult, AlgorithmComparison, StorageStats } from '../types';
import { SessionRepository } from '../storage/session-repository';

const APP_VERSION = '1.0.0';

/**
 * Generate a human-readable default session name.
 * Example: "Quick Sort, Merge Sort — 10,000 random — Jul 31, 2026"
 */
function generateSessionName(session: BenchmarkSession): string {
  const algoNames = session.results
    .map((r) => r.algorithmName)
    .slice(0, 3)
    .join(', ');
  const suffix = session.results.length > 3 ? ` +${session.results.length - 3}` : '';
  const size = session.config.datasetSize.toLocaleString();
  const type = session.config.datasetType;
  const date = new Date(session.startedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${algoNames}${suffix} — ${size} ${type} — ${date}`;
}

export class HistoryService {
  private readonly repository: SessionRepository;

  constructor(repository: SessionRepository) {
    this.repository = repository;
  }

  // ── Create ────────────────────────────────────────────────────────────────

  /** Persist a completed benchmark session with auto-generated metadata. */
  saveSession(session: BenchmarkSession): HistorySession {
    const now = new Date().toISOString();
    const entry: HistorySession = {
      session,
      name: generateSessionName(session),
      favorite: false,
      notes: '',
      tags: [],
      appVersion: APP_VERSION,
      createdAt: now,
      updatedAt: now,
    };
    this.repository.save(entry);
    return entry;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  /** Load all persisted history sessions. */
  loadSessions(): HistorySession[] {
    return this.repository.getAll();
  }

  /** Load a single session by benchmark session ID. */
  getSession(sessionId: string): HistorySession | null {
    return this.repository.getById(sessionId);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  /** Rename a session. */
  renameSession(sessionId: string, newName: string): HistorySession | null {
    return this.repository.update(sessionId, (entry) => ({
      ...entry,
      name: newName.trim() || entry.name,
      updatedAt: new Date().toISOString(),
    }));
  }

  /** Toggle the favorite flag on a session. */
  favoriteSession(sessionId: string): HistorySession | null {
    return this.repository.update(sessionId, (entry) => ({
      ...entry,
      favorite: !entry.favorite,
      updatedAt: new Date().toISOString(),
    }));
  }

  /** Update session notes. */
  updateNotes(sessionId: string, notes: string): HistorySession | null {
    return this.repository.update(sessionId, (entry) => ({
      ...entry,
      notes,
      updatedAt: new Date().toISOString(),
    }));
  }

  // ── Duplicate ─────────────────────────────────────────────────────────────

  /** Create a copy of an existing session with a new ID and name. */
  duplicateSession(sessionId: string): HistorySession | null {
    const original = this.repository.getById(sessionId);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicated: HistorySession = {
      ...original,
      session: {
        ...original.session,
        id: `${original.session.id}-copy-${Date.now().toString(36)}`,
      },
      name: `${original.name} (Copy)`,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };
    this.repository.save(duplicated);
    return duplicated;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  /** Delete a single session. Returns true if found and removed. */
  deleteSession(sessionId: string): boolean {
    return this.repository.delete(sessionId);
  }

  /** Delete multiple sessions. Returns the number of sessions deleted. */
  deleteSessions(sessionIds: string[]): number {
    return this.repository.deleteMany(sessionIds);
  }

  /** Remove all sessions from history. */
  clearHistory(): void {
    this.repository.clear();
  }

  // ── Compare ───────────────────────────────────────────────────────────────

  /** Compare two sessions side by side. */
  compareSessions(idA: string, idB: string): ComparisonResult | null {
    const sessionA = this.repository.getById(idA);
    const sessionB = this.repository.getById(idB);
    if (!sessionA || !sessionB) return null;

    // Build a union of all algorithm IDs from both sessions.
    const allAlgorithmIds = new Set<string>();
    sessionA.session.results.forEach((r) => allAlgorithmIds.add(r.algorithmId));
    sessionB.session.results.forEach((r) => allAlgorithmIds.add(r.algorithmId));

    const algorithms: AlgorithmComparison[] = [...allAlgorithmIds].map((algoId) => {
      const resultA = sessionA.session.results.find((r) => r.algorithmId === algoId) ?? null;
      const resultB = sessionB.session.results.find((r) => r.algorithmId === algoId) ?? null;

      return {
        algorithmId: algoId,
        algorithmName: resultA?.algorithmName ?? resultB?.algorithmName ?? algoId,
        sessionA: resultA,
        sessionB: resultB,
        timeDeltaMs: (resultB?.executionTimeMs ?? 0) - (resultA?.executionTimeMs ?? 0),
        comparisonsDelta: (resultB?.comparisons ?? 0) - (resultA?.comparisons ?? 0),
        swapsDelta: (resultB?.swaps ?? 0) - (resultA?.swaps ?? 0),
        memoryDeltaBytes: (resultB?.memoryEstimateBytes ?? 0) - (resultA?.memoryEstimateBytes ?? 0),
      };
    });

    // Overall winner: session with lower average execution time.
    const avgA =
      sessionA.session.results.reduce((sum, r) => sum + r.executionTimeMs, 0) /
      (sessionA.session.results.length || 1);
    const avgB =
      sessionB.session.results.reduce((sum, r) => sum + r.executionTimeMs, 0) /
      (sessionB.session.results.length || 1);

    const winner: 'A' | 'B' | 'tie' = avgA < avgB ? 'A' : avgB < avgA ? 'B' : 'tie';

    return { sessionA, sessionB, algorithms, winner };
  }

  // ── Storage ───────────────────────────────────────────────────────────────

  /** Get storage usage statistics. */
  getStorageStats(): StorageStats {
    return this.repository.getStorageStats();
  }
}
