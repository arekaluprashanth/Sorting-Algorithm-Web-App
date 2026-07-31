/**
 * SessionRepository — CRUD operations for HistorySession[] persistence.
 *
 * Sits on top of a StorageAdapter and provides typed, high-level
 * operations. All reads/writes go through a single "benchmark-history"
 * key containing the full session array (atomic reads & writes).
 */
import type { StorageAdapter } from './storage-adapter';
import type { HistorySession, StorageStats } from '../types';

const HISTORY_KEY = 'benchmark-history';

/** Estimated browser LocalStorage quota (5 MB is common). */
const ESTIMATED_QUOTA_BYTES = 5 * 1024 * 1024;

export class SessionRepository {
  private readonly adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  /** Load all persisted sessions, returning [] on error. */
  getAll(): HistorySession[] {
    const raw = this.adapter.getItem(HISTORY_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as HistorySession[];
    } catch {
      console.warn('[SessionRepository] Corrupted history data. Returning empty.');
      return [];
    }
  }

  /** Find a single session by its benchmark session ID. */
  getById(sessionId: string): HistorySession | null {
    return this.getAll().find((h) => h.session.id === sessionId) ?? null;
  }

  /** Persist a new session. Appends to the front of the list. */
  save(entry: HistorySession): void {
    const all = this.getAll();
    // Deduplicate by session ID
    const filtered = all.filter((h) => h.session.id !== entry.session.id);
    filtered.unshift(entry);
    this.writeAll(filtered);
  }

  /** Update an existing session in-place. */
  update(sessionId: string, updater: (entry: HistorySession) => HistorySession): HistorySession | null {
    const all = this.getAll();
    const index = all.findIndex((h) => h.session.id === sessionId);
    if (index === -1) return null;

    const updated = updater(all[index]!);
    all[index] = updated;
    this.writeAll(all);
    return updated;
  }

  /** Delete a single session by ID. */
  delete(sessionId: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((h) => h.session.id !== sessionId);
    if (filtered.length === all.length) return false;
    this.writeAll(filtered);
    return true;
  }

  /** Delete multiple sessions by ID. */
  deleteMany(sessionIds: string[]): number {
    const idSet = new Set(sessionIds);
    const all = this.getAll();
    const filtered = all.filter((h) => !idSet.has(h.session.id));
    const deletedCount = all.length - filtered.length;
    if (deletedCount > 0) this.writeAll(filtered);
    return deletedCount;
  }

  /** Remove all sessions. */
  clear(): void {
    this.adapter.removeItem(HISTORY_KEY);
  }

  /** Get storage usage statistics. */
  getStorageStats(): StorageStats {
    const sessions = this.getAll();
    const usedBytes = this.adapter.getUsedBytes();
    const dates = sessions.map((s) => s.createdAt).sort();

    return {
      usedBytes,
      estimatedQuotaBytes: ESTIMATED_QUOTA_BYTES,
      usagePercent: ESTIMATED_QUOTA_BYTES > 0 ? Math.round((usedBytes / ESTIMATED_QUOTA_BYTES) * 100) : 0,
      sessionCount: sessions.length,
      oldestSessionDate: dates[0] ?? null,
      newestSessionDate: dates[dates.length - 1] ?? null,
    };
  }

  /** Internal: serialize and persist the full array. */
  private writeAll(sessions: HistorySession[]): void {
    this.adapter.setItem(HISTORY_KEY, JSON.stringify(sessions));
  }
}
