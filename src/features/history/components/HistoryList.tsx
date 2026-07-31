import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { History } from 'lucide-react';
import { EmptyState } from '../../../components/error/EmptyState';
import { SessionCard } from './SessionCard';
import type { HistorySession } from '../types';

interface HistoryListProps {
  sessions: HistorySession[];
  selectedIds: string[];
  isComparing: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  sessions,
  selectedIds,
  isComparing,
  onSelect,
  onViewDetails,
  onRename,
  onFavorite,
  onDuplicate,
  onDelete,
}) => {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No Sessions Found"
        description="Run a benchmark to see your session history here, or adjust your search and filter criteria."
        icon={History}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {sessions.map((entry) => (
          <SessionCard
            key={entry.session.id}
            entry={entry}
            isSelected={selectedIds.includes(entry.session.id)}
            isComparing={isComparing}
            onSelect={onSelect}
            onViewDetails={onViewDetails}
            onRename={onRename}
            onFavorite={onFavorite}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
