import React from 'react';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { NAV_ITEMS, STORAGE_KEYS } from '../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SidebarItem, SidebarGroup } from './SidebarItem';
import { LayoutDashboard, Gauge, History, Cpu, BookOpen, BarChart3, Settings, Info } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Gauge,
  History,
  Cpu,
  BookOpen,
  BarChart3,
  Settings,
  Info,
};

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>(
    STORAGE_KEYS.SIDEBAR_COLLAPSED,
    false
  );

  return (
    <aside
      className={`h-screen sticky top-0 hidden lg:flex flex-col glass-panel border-r border-white/10 z-30 select-none transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                SortBench <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">v1.0</span>
              </h1>
              <p className="text-xs text-neutral-400 whitespace-nowrap">Platform Engine</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        <SidebarGroup title="Core Features" isCollapsed={isCollapsed}>
          {NAV_ITEMS.slice(0, 3).map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={ICON_MAP[item.iconName] || LayoutDashboard}
              isCollapsed={isCollapsed}
              badge={item.badge}
            />
          ))}
        </SidebarGroup>

        <SidebarGroup title="Theory & Analytics" isCollapsed={isCollapsed}>
          {NAV_ITEMS.slice(3, 6).map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={ICON_MAP[item.iconName] || LayoutDashboard}
              isCollapsed={isCollapsed}
              badge={item.badge}
            />
          ))}
        </SidebarGroup>

        <SidebarGroup title="System" isCollapsed={isCollapsed}>
          {NAV_ITEMS.slice(6).map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={ICON_MAP[item.iconName] || LayoutDashboard}
              isCollapsed={isCollapsed}
              badge={item.badge}
            />
          ))}
        </SidebarGroup>
      </nav>

      {/* Sidebar Footer Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 text-xs text-neutral-500 flex items-center justify-between font-mono">
          <span>React 19 + Vite</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ready
          </span>
        </div>
      )}
    </aside>
  );
};
