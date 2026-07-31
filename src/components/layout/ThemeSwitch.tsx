import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeMode } from '../../types';
import { cn } from '../../shared/lib/utils';

export const ThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className="flex items-center bg-black/30 dark:bg-black/50 p-1 rounded-lg border border-white/10 text-xs font-mono select-none">
      {themes.map(({ mode, label, icon: Icon }) => {
        const isActive = theme === mode;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer',
              isActive
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            )}
            title={`Switch to ${label} theme`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
