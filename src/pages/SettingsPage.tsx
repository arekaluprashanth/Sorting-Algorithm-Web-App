import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { ThemeSwitch } from '../components/layout/ThemeSwitch';
import { siteConfig } from '../config/site.config';

export const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          </div>
          <p className="text-xs text-neutral-400">
            Customize application theme preferences and environment variables
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Appearance & Color Theme</span>
            </CardTitle>
            <CardDescription>
              Toggle between Dark Mode, Light Mode, or automatic System preference matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10">
              <span className="text-xs font-mono text-neutral-300">Active Theme Mode:</span>
              <ThemeSwitch />
            </div>
          </CardContent>
        </Card>

        {/* Environment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>API Endpoint Configuration</span>
            </CardTitle>
            <CardDescription>
              Configured via environment variable <code className="text-blue-400">VITE_API_URL</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 font-mono text-xs text-neutral-300 space-y-1">
              <div className="text-neutral-500 text-[11px]">VITE_API_URL:</div>
              <div className="text-blue-400 font-bold">{siteConfig.apiUrl}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
