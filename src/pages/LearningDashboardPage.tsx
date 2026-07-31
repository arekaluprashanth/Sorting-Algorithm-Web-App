import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Search, Sparkles } from 'lucide-react';
import { useLearningCatalog } from '../features/learning/hooks/useLearningCatalog';
import { AlgorithmCard, ComparisonTable } from '../features/learning/components';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { motion } from 'framer-motion';

export const LearningDashboardPage: React.FC = () => {
  const {
    filteredAlgorithms,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    getRecommendations
  } = useLearningCatalog();

  const recommendations = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <PageHeader
        title="Learning Center"
        subtitle="Explore sorting algorithms, understand their complexity, and visualize how they work step-by-step."
      />

      {/* Recommendations Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Recommended Starting Points
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((algo, i) => (
            <motion.div key={algo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <AlgorithmCard algorithm={algo} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Catalog & Search */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-white">Algorithm Catalog</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'comparison', label: 'Comparison' },
                { value: 'non-comparison', label: 'Non-Comparison' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {filteredAlgorithms.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl border border-white/5">
            <p className="text-neutral-400">No algorithms found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlgorithms.map(algo => (
              <AlgorithmCard key={algo.id} algorithm={algo} />
            ))}
          </div>
        )}
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Theoretical Complexity Comparison</h2>
        <ComparisonTable algorithms={filteredAlgorithms} />
      </section>
    </div>
  );
};
