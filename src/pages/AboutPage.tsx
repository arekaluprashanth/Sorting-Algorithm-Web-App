import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { siteConfig } from '../config/site.config';

export const AboutPage: React.FC = () => {
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
            <h1 className="text-2xl font-bold text-white tracking-tight">About {siteConfig.name}</h1>
            <Badge variant="success">Production Foundation</Badge>
          </div>
          <p className="text-xs text-neutral-400">
            System architecture, tech stack specifications, and development rules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Technology Stack</span>
            </CardTitle>
            <CardDescription>Core frameworks & libraries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-mono text-neutral-300">
            <div className="flex justify-between p-2 rounded bg-black/30">
              <span>Framework:</span>
              <span className="text-blue-400 font-bold">React 19</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-black/30">
              <span>Build Tool:</span>
              <span className="text-indigo-400 font-bold">Vite</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-black/30">
              <span>Language:</span>
              <span className="text-purple-400 font-bold">TypeScript (Strict)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-black/30">
              <span>Styling:</span>
              <span className="text-emerald-400 font-bold">Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-black/30">
              <span>Routing:</span>
              <span className="text-amber-400 font-bold">React Router v7</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Architecture Best Practices</span>
            </CardTitle>
            <CardDescription>Deployment & code standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs font-mono text-neutral-300">
            <div className="p-2.5 rounded bg-black/30 border border-white/10">
              <span className="text-emerald-400 font-bold">✓ Vercel Deployment Ready</span>
              <p className="text-[11px] text-neutral-400 mt-1">Direct static build deployment without SSR.</p>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/10">
              <span className="text-blue-400 font-bold">✓ Strict TypeScript Rules</span>
              <p className="text-[11px] text-neutral-400 mt-1">No any types, component length &lt;300 lines.</p>
            </div>
            <div className="p-2.5 rounded bg-black/30 border border-white/10">
              <span className="text-purple-400 font-bold">✓ Modular Component Architecture</span>
              <p className="text-[11px] text-neutral-400 mt-1">Feature-first folder separation for scalability.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
