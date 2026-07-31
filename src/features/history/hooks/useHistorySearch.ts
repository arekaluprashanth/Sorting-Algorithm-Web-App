/**
 * useHistorySearch — memoized full-text search over history sessions.
 */
import { useMemo } from 'react';
import type { HistorySession } from '../types';

export function useHistorySearch(sessions: HistorySession[], query: string): HistorySession[] {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return sessions;

    return sessions.filter((h) => {
      const searchable = [
        h.name,
        h.notes,
        h.session.config.datasetType,
        ...h.session.results.map((r) => r.algorithmName),
        ...h.tags,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(trimmed);
    });
  }, [sessions, query]);
}
