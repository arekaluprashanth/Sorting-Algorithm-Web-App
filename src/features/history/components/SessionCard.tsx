import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Copy, Trash2, Eye, MoreVertical, Pencil } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { formatDuration } from '../../../shared/lib/utils';
import type { HistorySession } from '../types';

interface SessionCardProps {
  entry: HistorySession;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  entry,
  isSelected,
  isComparing,
  onSelect,
  onViewDetails,
  onRename,
  onFavorite,
  onDuplicate,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(entry.name);

  const { session } = entry;
  const fastest = session.results.reduce(
    (prev, curr) => (curr.executionTimeMs < prev.executionTimeMs ? curr : prev),
    session.results[0]!,
  );
  const duration = session.completedAt - session.startedAt;
  const date = new Date(entry.createdAt);

  const handleRename = () => {
    if (editName.trim() && editName !== entry.name) {
      onRename(session.id, editName);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`glass-panel rounded-xl border p-4 transition-all group ${
        isSelected
          ? 'border-blue-500/60 bg-blue-500/5 ring-1 ring-blue-500/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top row: checkbox/name + star + menu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Selection checkbox (visible in compare mode or bulk mode) */}
          {isComparing && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(session.id)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 accent-blue-500 cursor-pointer"
              aria-label={`Select ${entry.name}`}
            />
          )}

          {/* Name */}
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <h4
                className="text-sm font-semibold text-white truncate cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => onViewDetails(session.id)}
                title={entry.name}
              >
                {entry.name}
              </h4>
            )}
            <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-500">
              <span>{date.toLocaleDateString()}</span>
              <span>•</span>
              <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Star + Menu */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onFavorite(session.id)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              entry.favorite ? 'text-amber-400' : 'text-neutral-600 hover:text-amber-400'
            }`}
            aria-label={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className="w-4 h-4" fill={entry.favorite ? 'currentColor' : 'none'} />
          </button>

          {/* Dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Session actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-50 w-40 glass-panel border border-white/10 rounded-lg shadow-xl py-1 text-xs">
                  <button onClick={() => { onViewDetails(session.id); setShowMenu(false); }} className="w-full px-3 py-2 text-left hover:bg-white/10 text-neutral-300 flex items-center gap-2 cursor-pointer">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full px-3 py-2 text-left hover:bg-white/10 text-neutral-300 flex items-center gap-2 cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" /> Rename
                  </button>
                  <button onClick={() => { onDuplicate(session.id); setShowMenu(false); }} className="w-full px-3 py-2 text-left hover:bg-white/10 text-neutral-300 flex items-center gap-2 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <div className="border-t border-white/5 my-1" />
                  <button onClick={() => { onDelete(session.id); setShowMenu(false); }} className="w-full px-3 py-2 text-left hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info row: dataset + algorithms */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="info">{session.config.datasetType}</Badge>
        <Badge variant="default">{session.config.datasetSizes.length > 1 ? 'Multiple sizes' : `${(session.config.datasetSizes[0] ?? 0).toLocaleString()} items`}</Badge>
        <span className="text-[10px] text-neutral-500">•</span>
        {session.results.slice(0, 3).map((r) => (
          <Badge key={r.algorithmId} variant="default">{r.algorithmName}</Badge>
        ))}
        {session.results.length > 3 && (
          <Badge variant="default">+{session.results.length - 3}</Badge>
        )}
      </div>

      {/* Metrics row */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-neutral-500">Fastest: </span>
            <span className="text-blue-400 font-bold">{formatDuration(fastest.executionTimeMs)}</span>
          </div>
          <div>
            <span className="text-neutral-500">Duration: </span>
            <span className="text-neutral-300">{formatDuration(duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {fastest.correct ? (
            <Badge variant="success">Valid</Badge>
          ) : (
            <Badge variant="error">Failed</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};
