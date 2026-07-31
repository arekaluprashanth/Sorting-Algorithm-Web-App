import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gauge,
  Cpu,
  ArrowRight,
  Sparkles,
  BookOpen,
  Settings,
  History,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatisticCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/error/EmptyState';
import { ROUTES } from '../constants';
import { ContentContainer } from '../components/layout/ContentContainer';

export const DashboardPage: React.FC = () => {
  return (
    <ContentContainer>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Welcome & Hero Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-transparent border border-white/10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Developer Benchmarking Platform</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Sorting Algorithm <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Performance Benchmark
              </span>
            </h1>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              High-performance developer platform designed to benchmark execution time, comparisons, swaps, memory footprint, and recursion depth across sorting algorithms.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to={ROUTES.BENCHMARK}>
                <Button leftIcon={<Gauge className="w-4 h-4" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Launch Benchmark Studio
                </Button>
              </Link>
              <Link to={ROUTES.ALGORITHMS}>
                <Button variant="outline" leftIcon={<Cpu className="w-4 h-4" />}>
                  Explore Algorithms
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            title="System Status"
            value="Production"
            subtitle="High-Performance Engine"
            icon={ShieldCheck}
            trend="Active"
          />
          <StatisticCard
            title="Design System Primitives"
            value="24"
            subtitle="Reusable UI Components"
            icon={Zap}
            trend="Ready"
          />
          <StatisticCard
            title="Supported Theme Modes"
            value="3"
            subtitle="Dark, Light & System Mode"
            icon={Settings}
          />
          <StatisticCard
            title="Lazy Loaded Routes"
            value="8"
            subtitle="Code-split pages"
            icon={BookOpen}
          />
        </div>

        {/* Two Column Layout: Algorithms Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Algorithms Overview Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">Algorithms Catalog Overview</h3>
                <p className="text-xs text-neutral-400">Supported algorithm categories & theoretical specifications</p>
              </div>
              <Link to={ROUTES.ALGORITHMS} className="text-xs font-mono text-blue-400 hover:underline">
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <Badge variant="info">Comparison</Badge>
                  <CardTitle className="pt-1 text-sm font-bold">Comparison Sorts</CardTitle>
                  <CardDescription>Bubble, Selection, Insertion, Merge, Quick, Heap, Shell Sort</CardDescription>
                </CardHeader>
                <CardContent className="text-xs font-mono text-neutral-400">
                  Optimal Lower Bound: <span className="text-indigo-400 font-bold">O(n log n)</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="success">Non-Comparison</Badge>
                  <CardTitle className="pt-1 text-sm font-bold">Non-Comparison</CardTitle>
                  <CardDescription>Radix Sort (LSD), Counting Sort</CardDescription>
                </CardHeader>
                <CardContent className="text-xs font-mono text-neutral-400">
                  Linear Bounds: <span className="text-emerald-400 font-bold">O(n + k)</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="warning">Hybrid</Badge>
                  <CardTitle className="pt-1 text-sm font-bold">Hybrid Algorithms</CardTitle>
                  <CardDescription>Tim Sort (Insertion + Merge Sort)</CardDescription>
                </CardHeader>
                <CardContent className="text-xs font-mono text-neutral-400">
                  Real-World Bounds: <span className="text-amber-400 font-bold">O(n) best</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white tracking-tight">Recent Benchmark Runs</h3>
            </div>

            <EmptyState
              title="No Benchmark History"
              description="Your historical benchmark runs will appear here after executing tests in the Benchmark Studio."
              icon={History}
            />
          </div>
        </div>

        {/* Performance Tips */}
        <div className="grid grid-cols-1 gap-6">
          {/* Performance & Optimization Tips */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <CardTitle>Performance & Benchmarking Tips</CardTitle>
              </div>
              <CardDescription>Best practices for accurate algorithm measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-neutral-300 font-mono">
              <div className="flex items-start gap-2 p-2.5 rounded bg-black/30 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Always execute JIT warm-up runs to eliminate JS engine compilation noise.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded bg-black/30 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Use seeded PRNGs for exact reproducible dataset runs across different algorithms.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded bg-black/30 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Test reversed & nearly-sorted distributions to evaluate best vs worst-case behaviors.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </ContentContainer>
  );
};
