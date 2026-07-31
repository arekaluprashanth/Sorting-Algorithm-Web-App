import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/error/EmptyState';

export const HistoryPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Execution Run History</h1>
            <Badge variant="info">Phase 1 Shell</Badge>
          </div>
          <p className="text-xs text-neutral-400">
            Historical benchmark run logs, comparisons, and export logs container
          </p>
        </div>
      </div>

      <EmptyState
        title="No Saved Runs Yet"
        description="Historical benchmark session persistence will store and compare previous benchmark runs in local storage and remote backend services."
        icon={History}
      />
    </motion.div>
  );
};
