import React from 'react';
import { siteConfig } from '../../config/site.config';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 glass-panel py-6 px-8 mt-auto text-xs text-neutral-400 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-white">{siteConfig.name}</span> v{siteConfig.version} — {siteConfig.description}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </span>
          <span>API: {siteConfig.apiUrl}</span>
        </div>
      </div>
    </footer>
  );
};
