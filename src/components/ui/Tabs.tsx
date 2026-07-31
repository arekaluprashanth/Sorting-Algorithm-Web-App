import React, { useState } from 'react';
import { cn } from '../../shared/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
  icon?: React.ElementType;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId: externalActiveId,
  onChange,
  className,
}) => {
  const [internalActiveId, setInternalActiveId] = useState(tabs[0]?.id || '');
  const activeId = externalActiveId ?? internalActiveId;

  const handleTabClick = (id: string) => {
    setInternalActiveId(id);
    onChange?.(id);
  };

  return (
    <div className={cn('flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono select-none overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
