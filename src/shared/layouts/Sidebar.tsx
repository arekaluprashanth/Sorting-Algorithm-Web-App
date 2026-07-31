import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gauge, BarChart2, History, BookOpen, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Benchmark', to: '/benchmark', icon: Gauge },
  { name: 'Results', to: '/results', icon: BarChart2, badge: 'Phase 2' },
  { name: 'History', to: '/history', icon: History, badge: 'Phase 3' },
  { name: 'Complexity Study', to: '/complexity', icon: BookOpen, badge: 'Phase 4' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col glass-panel border-r border-white/10 z-30 select-none">
      {/* App Brand Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            SortBench <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">v1.0</span>
          </h1>
          <p className="text-xs text-neutral-400">Algorithm Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 border border-white/10">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 text-xs text-neutral-500 flex items-center justify-between font-mono">
        <span>React 19 + Vite</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Ready
        </span>
      </div>
    </aside>
  );
};
