/**
 * useComparison — manages comparison mode selection state.
 */
import { useState, useCallback } from 'react';

export function useComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const toggleSelection = useCallback((sessionId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      }
      // Max 2 sessions for comparison
      if (prev.length >= 2) {
        return [prev[1]!, sessionId];
      }
      return [...prev, sessionId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setIsComparing(false);
  }, []);

  const enterComparisonMode = useCallback(() => setIsComparing(true), []);
  const exitComparisonMode = useCallback(() => {
    setIsComparing(false);
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    isComparing,
    toggleSelection,
    clearSelection,
    enterComparisonMode,
    exitComparisonMode,
    canCompare: selectedIds.length === 2,
  };
}
