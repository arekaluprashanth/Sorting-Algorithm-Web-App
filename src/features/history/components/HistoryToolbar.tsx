import React from 'react';
import { Search, GitCompare, Trash2, X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import type { HistoryFilter, HistorySort, HistorySortField } from '../types';

interface HistoryToolbarProps {
  filter: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
  sort: HistorySort;
  onSortChange: (sort: HistorySort) => void;
  onResetFilters: () => void;
  selectedCount: number;
  isComparing: boolean;
  canCompare: boolean;
  onEnterCompare: () => void;
  onExitCompare: () => void;
  onCompare: () => void;
  onDeleteSelected: () => void;
  totalCount: number;
  filteredCount: number;
}

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'executionTime-asc', label: 'Fastest' },
  { value: 'executionTime-desc', label: 'Slowest' },
  { value: 'datasetSize-desc', label: 'Largest Dataset' },
  { value: 'name-asc', label: 'A → Z' },
  { value: 'name-desc', label: 'Z → A' },
];

const DATASET_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'random', label: 'Random' },
  { value: 'sorted', label: 'Sorted' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'nearly-sorted', label: 'Nearly Sorted' },
  { value: 'few-unique', label: 'Few Unique' },
];

export const HistoryToolbar: React.FC<HistoryToolbarProps> = ({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onResetFilters,
  selectedCount,
  isComparing,
  canCompare,
  onEnterCompare,
  onExitCompare,
  onCompare,
  onDeleteSelected,
  totalCount,
  filteredCount,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-') as [HistorySortField, 'asc' | 'desc'];
    onSortChange({ field, direction });
  };

  const hasActiveFilters = filter.searchQuery || filter.datasetType || filter.favoriteOnly;

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Sort + Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search sessions..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="pl-9 h-9 bg-black/40 border-white/10 text-sm"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        {/* Dataset Type Filter */}
        <Select
          options={DATASET_TYPE_OPTIONS}
          value={filter.datasetType}
          onChange={(e) => onFilterChange({ ...filter, datasetType: e.target.value })}
          className="w-full sm:w-40 h-9"
        />

        {/* Sort */}
        <Select
          options={SORT_OPTIONS}
          value={`${sort.field}-${sort.direction}`}
          onChange={handleSortChange}
          className="w-full sm:w-44 h-9"
        />

        {/* Actions */}
        <div className="flex gap-2">
          {!isComparing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEnterCompare}
              disabled={totalCount < 2}
              className="gap-1.5 whitespace-nowrap"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={onCompare}
                disabled={!canCompare}
                className="gap-1.5 whitespace-nowrap"
              >
                <GitCompare className="w-3.5 h-3.5" />
                Compare ({selectedCount}/2)
              </Button>
              <Button variant="ghost" size="sm" onClick={onExitCompare}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          {selectedCount > 0 && !isComparing && (
            <Button variant="danger" size="sm" onClick={onDeleteSelected} className="gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: Filters summary */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-3">
          <span>
            Showing {filteredCount} of {totalCount} sessions
          </span>
          {/* Favorite toggle */}
          <button
            onClick={() => onFilterChange({ ...filter, favoriteOnly: !filter.favoriteOnly })}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              filter.favoriteOnly
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            ★ Favorites
          </button>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
