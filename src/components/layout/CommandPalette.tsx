import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gauge, LayoutDashboard, Cpu, BookOpen, Settings, History, BarChart3, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ROUTES } from '../../constants';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', route: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { id: 'benchmark', label: 'Go to Benchmark Studio', route: ROUTES.BENCHMARK, icon: Gauge },
  { id: 'algorithms', label: 'Go to Algorithms Catalog', route: ROUTES.ALGORITHMS, icon: Cpu },
  { id: 'complexity', label: 'Go to Complexity Explorer', route: ROUTES.COMPLEXITY, icon: BookOpen },
  { id: 'history', label: 'Go to Run History', route: ROUTES.HISTORY, icon: History },
  { id: 'reports', label: 'Go to Reports & Analytics', route: ROUTES.REPORTS, icon: BarChart3 },
  { id: 'settings', label: 'Go to Settings', route: ROUTES.SETTINGS, icon: Settings },
  { id: 'about', label: 'Go to About & Specs', route: ROUTES.ABOUT, icon: Info },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    navigate(route);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all font-mono text-xs cursor-pointer select-none"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Quick Command...</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] border border-white/10">
          ⌘K
        </kbd>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="p-4 max-w-md">
        <div className="space-y-3 font-mono">
          <div className="relative flex items-center border-b border-white/10 pb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full pl-8 pr-4 py-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.route)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{cmd.label}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-xs text-neutral-500 py-4 text-center">No commands found</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
