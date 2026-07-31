import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useHistoryContext } from '../features/history/context';
import { useHistorySearch } from '../features/history/hooks/useHistorySearch';
import { useHistoryFilters } from '../features/history/hooks/useHistoryFilters';
import { useComparison } from '../features/history/hooks/useComparison';
import { HistoryDashboard } from '../features/history/components/HistoryDashboard';
import { HistoryToolbar } from '../features/history/components/HistoryToolbar';
import { HistoryList } from '../features/history/components/HistoryList';
import { SessionDetailModal } from '../features/history/components/SessionDetailModal';
import { ComparisonView } from '../features/history/components/ComparisonView';
import { DeleteConfirmDialog } from '../features/history/components/DeleteConfirmDialog';

export const HistoryPage: React.FC = () => {
  const {
    sessions,
    storageStats,
    renameSession,
    favoriteSession,
    updateNotes,
    duplicateSession,
    deleteSessions,
    clearHistory,
    compareSessions,
  } = useHistoryContext();

  // Search + Filter + Sort
  const { filter, setFilter, resetFilters, sort, setSort, filteredSessions } = useHistoryFilters(sessions);
  const searchedSessions = useHistorySearch(filteredSessions, filter.searchQuery);

  // Comparison
  const comparison = useComparison();

  // Detail modal
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null);
  const detailEntry = detailSessionId ? sessions.find((s) => s.session.id === detailSessionId) ?? null : null;

  // Comparison modal
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; isClearAll: boolean } | null>(null);

  // Bulk selection for delete (non-compare mode)
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  const handleViewDetails = useCallback((id: string) => setDetailSessionId(id), []);
  const handleCloseDetails = useCallback(() => setDetailSessionId(null), []);

  const handleDelete = useCallback((id: string) => {
    setDeleteTarget({ ids: [id], isClearAll: false });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (comparison.isComparing && comparison.selectedIds.length > 0) {
      setDeleteTarget({ ids: [...comparison.selectedIds], isClearAll: false });
    } else if (bulkSelected.length > 0) {
      setDeleteTarget({ ids: [...bulkSelected], isClearAll: false });
    }
  }, [comparison, bulkSelected]);

  const handleClearAll = useCallback(() => {
    setDeleteTarget({ ids: [], isClearAll: true });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.isClearAll) {
      clearHistory();
    } else {
      deleteSessions(deleteTarget.ids);
    }
    setDeleteTarget(null);
    comparison.clearSelection();
    setBulkSelected([]);
  }, [deleteTarget, clearHistory, deleteSessions, comparison]);

  const handleCompare = useCallback(() => {
    if (comparison.selectedIds.length === 2) {
      const result = compareSessions(comparison.selectedIds[0]!, comparison.selectedIds[1]!);
      if (result) {
        setComparisonResult(result);
        setShowComparison(true);
      }
    }
  }, [comparison.selectedIds, compareSessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Benchmark History</h1>
            <Badge variant="success">Live</Badge>
          </div>
          <p className="text-xs text-neutral-400">
            View, compare, and manage your saved benchmark sessions.
          </p>
        </div>
        {sessions.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="gap-1.5 text-neutral-400 hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Dashboard Stats */}
      {sessions.length > 0 && (
        <HistoryDashboard sessions={sessions} storageStats={storageStats} />
      )}

      {/* Toolbar */}
      {sessions.length > 0 && (
        <HistoryToolbar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          selectedCount={comparison.isComparing ? comparison.selectedIds.length : bulkSelected.length}
          isComparing={comparison.isComparing}
          canCompare={comparison.canCompare}
          onEnterCompare={comparison.enterComparisonMode}
          onExitCompare={comparison.exitComparisonMode}
          onCompare={handleCompare}
          onDeleteSelected={handleDeleteSelected}
          totalCount={sessions.length}
          filteredCount={searchedSessions.length}
        />
      )}

      {/* Session List */}
      <HistoryList
        sessions={searchedSessions}
        selectedIds={comparison.isComparing ? comparison.selectedIds : bulkSelected}
        isComparing={comparison.isComparing}
        onSelect={comparison.isComparing ? comparison.toggleSelection : (id) => {
          setBulkSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
          );
        }}
        onViewDetails={handleViewDetails}
        onRename={renameSession}
        onFavorite={favoriteSession}
        onDuplicate={duplicateSession}
        onDelete={handleDelete}
      />

      {/* Detail Modal */}
      <SessionDetailModal
        entry={detailEntry}
        isOpen={!!detailSessionId}
        onClose={handleCloseDetails}
        onUpdateNotes={updateNotes}
      />

      {/* Comparison Modal */}
      <ComparisonView
        result={comparisonResult}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        count={deleteTarget?.ids.length ?? 0}
        isClearAll={deleteTarget?.isClearAll}
      />
    </motion.div>
  );
};
