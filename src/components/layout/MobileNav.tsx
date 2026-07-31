import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, LayoutDashboard, Gauge, History, Cpu, BookOpen, Settings, Info } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import { cn } from '../../shared/lib/utils';
import { ThemeSwitch } from './ThemeSwitch';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Gauge,
  History,
  Cpu,
  BookOpen,
  Settings,
  Info,
};

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 w-4/5 max-w-xs h-full glass-panel border-r border-white/10 flex flex-col p-6 space-y-6"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base text-white">SortBench</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Drawer Footer Theme Toggle */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs font-mono text-neutral-400">Appearance Mode</div>
              <ThemeSwitch />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ResponsiveDrawer = MobileNav;
