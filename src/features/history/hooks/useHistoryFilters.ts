/**
 * useHistoryFilters — filter and sort history sessions.
 */
import { useMemo, useState, useCallback } from 'react';
import type { HistorySession, HistoryFilter, HistorySort } from '../types';
import { createEmptyFilter, DEFAULT_SORT } from '../types';

function applyFilters(sessions: HistorySession[], filter: HistoryFilter): HistorySession[] {
  return sessions.filter((h) => {
    // Favorite filter
    if (filter.favoriteOnly && !h.favorite) return false;

    // Algorithm filter
    if (filter.algorithmIds.length > 0) {
      const sessionAlgoIds = h.session.results.map((r) => r.algorithmId);
      const hasMatch = filter.algorithmIds.some((id) => sessionAlgoIds.includes(id));
      if (!hasMatch) return false;
    }

    // Dataset type filter
    if (filter.datasetType && h.session.config.datasetType !== filter.datasetType) return false;

    // Size range filter
    if (filter.sizeRange) {
      const size = Math.max(...h.session.config.datasetSizes);
      if (size < filter.sizeRange[0] || size > filter.sizeRange[1]) return false;
    }

    // Date range filter
    if (filter.dateRange) {
      const created = new Date(h.createdAt).getTime();
      const start = new Date(filter.dateRange[0]).getTime();
      const end = new Date(filter.dateRange[1]).getTime();
      if (created < start || created > end) return false;
    }

    return true;
  });
}

function applySort(sessions: HistorySession[], sort: HistorySort): HistorySession[] {
  const sorted = [...sessions];
  const dir = sort.direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case 'date':
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'datasetSize':
        cmp = Math.max(...a.session.config.datasetSizes) - Math.max(...b.session.config.datasetSizes);
        break;
      case 'executionTime': {
        const avgA = a.session.results.reduce((s, r) => s + r.executionTimeMs, 0) / (a.session.results.length || 1);
        const avgB = b.session.results.reduce((s, r) => s + r.executionTimeMs, 0) / (b.session.results.length || 1);
        cmp = avgA - avgB;
        break;
      }
      case 'algorithmCount':
        cmp = a.session.results.length - b.session.results.length;
        break;
    }
    // Favorites always float to the top regardless of sort direction
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return cmp * dir;
  });

  return sorted;
}

export function useHistoryFilters(sessions: HistorySession[]) {
  const [filter, setFilter] = useState<HistoryFilter>(createEmptyFilter());
  const [sort, setSort] = useState<HistorySort>(DEFAULT_SORT);

  const resetFilters = useCallback(() => setFilter(createEmptyFilter()), []);

  const filteredSessions = useMemo(() => {
    const filtered = applyFilters(sessions, filter);
    return applySort(filtered, sort);
  }, [sessions, filter, sort]);

  return {
    filter,
    setFilter,
    resetFilters,
    sort,
    setSort,
    filteredSessions,
  };
}
