import React, { useEffect, useState } from 'react';
import { UnifiedSortingDashboard } from './components/UnifiedSortingDashboard';
import { ArrowUp, BarChart3, Cpu, Binary, Code2 } from 'lucide-react';
import { AnimatedLogo } from './components/AnimatedLogo';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) return;

    const frames = [
      [12, 21, 32],
      [18, 14, 25],
      [25, 18, 14],
      [16, 28, 20],
    ];
    let frameIndex = 0;
    const updateFavicon = () => {
      const heights = frames[frameIndex];
      const bars = heights.map((height, index) => {
        const x = 12 + index * 15;
        const width = 10;
        const y = 52 - height;
        const colors = ['#38bdf8', '#34d399', '#fbbf24'];
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2" fill="${colors[index]}"/>`;
      }).join('');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0f172a"/>${bars}<path d="M12 53h40M43 13h9l-4 4" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      frameIndex = (frameIndex + 1) % frames.length;
    };

    updateFavicon();
    const timer = window.setInterval(updateFavicon, 420);
    return () => {
      window.clearInterval(timer);
      favicon.href = '/assets/favicon.svg';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 480);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/90 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white min-w-0">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white flex-shrink-0">
        <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs tracking-tight border border-slate-800 shadow-sm shrink-0">
              <AnimatedLogo className="h-full w-full rounded-xl" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-bold text-sm sm:text-[15px] tracking-tight text-slate-900 truncate">
                  Sorting Algorithm Web App
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-full font-semibold shrink-0">
                  15 Algorithms
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <a href="#algorithm-input-header" className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-indigo-500" />
              <span>Input</span>
            </a>
            <a href="#simulation-section" className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Visualizer</span>
            </a>
            <a href="#complexity-section" className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Metrics</span>
            </a>
            <a href="#source-code" className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Code</span>
            </a>
          </nav>

        </div>
      </header>

      <main className="flex-1 w-full min-w-0 pt-14 sm:pt-16">
        <div className="mx-auto w-full max-w-[1800px] min-h-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <UnifiedSortingDashboard />
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-3 sm:py-4 text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
        <div className="mx-auto max-w-[1800px] w-full px-3 sm:px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
            <span className="font-semibold text-slate-800">Sorting Algorithm Web App</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500">
            <span>Interactive visualizer</span>
            <span>•</span>
            <span>Tracking</span>
            <span>•</span>
            <span>C++ / Python / Java</span>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed bottom-5 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-white/20 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:bottom-7 sm:right-7"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

