import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronRight, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import { ThemeSwitch } from './ThemeSwitch';
import { CommandPalette } from './CommandPalette';

export interface NavbarProps {
  onMenuClick: () => void;
}

export const TopNavbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname) || {
    label: 'Platform Engine',
    description: 'High performance benchmarking',
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 glass-panel px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono mb-0.5">
            <span>SortBench</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-blue-400">{currentNav.label}</span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-tight">
            {currentNav.label}
          </h2>
        </div>
      </div>

      {/* Command Palette & Actions */}
      <div className="flex items-center gap-3">
        <CommandPalette />

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vite Engine</span>
        </div>

        <ThemeSwitch />
      </div>
    </header>
  );
};

export const Navbar = TopNavbar;
