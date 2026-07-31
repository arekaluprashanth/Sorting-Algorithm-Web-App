import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLearningCatalog } from '../features/learning/hooks/useLearningCatalog';
import { useVisualization } from '../features/learning/hooks/useVisualization';
import { PseudoCodePanel, Visualizer } from '../features/learning/components';
import { visualizationEngine } from '../features/learning/services/visualization-engine';
import { AlgorithmRegistry } from '../features/algorithms';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { VisualizationTrace } from '../features/learning/types';

export const AlgorithmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAlgorithmById } = useLearningCatalog();
  
  const algorithmMeta = getAlgorithmById(id || '');
  const [trace, setTrace] = useState<VisualizationTrace | null>(null);
  const [datasetSize, setDatasetSize] = useState(15);
  
  const { state: visState, play, pause, stepForward, stepBackward, reset, setSpeed } = useVisualization(trace);

  // Generate trace when clicking "Generate New Dataset"
  const handleGenerate = () => {
    if (!id) return;
    const sortingAlgo = AlgorithmRegistry.getAlgorithm(id as any);
    if (!sortingAlgo) return;

    // Generate random array
    const arr = Array.from({ length: datasetSize }, () => Math.floor(Math.random() * 100) + 1);
    const newTrace = visualizationEngine.generateTrace(sortingAlgo, arr);
    setTrace(newTrace);
  };

  // Initialize on mount
  useEffect(() => {
    if (algorithmMeta) {
      handleGenerate();
    }
  }, [algorithmMeta]);

  if (!algorithmMeta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-white mb-4">Algorithm not found</h2>
        <Button onClick={() => navigate('/learning')}>Back to Learning Center</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/learning')}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            {algorithmMeta.name}
            <Badge variant="info" className="text-sm font-normal">{algorithmMeta.category}</Badge>
          </h1>
          <p className="text-neutral-400 mt-1">Invented by {algorithmMeta.inventor} ({algorithmMeta.year})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info & Complexity */}
        <div className="lg:col-span-1 space-y-8">
          <section className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Overview</h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {algorithmMeta.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant={algorithmMeta.isStable ? 'success' : 'warning'}>
                {algorithmMeta.isStable ? 'Stable' : 'Unstable'}
              </Badge>
              <Badge variant={algorithmMeta.isInPlace ? 'success' : 'default'}>
                {algorithmMeta.isInPlace ? 'In-Place' : 'O(n) Memory'}
              </Badge>
              {algorithmMeta.isRecursive && <Badge variant="info">Recursive</Badge>}
            </div>
          </section>

          <section className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Complexity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">Best Case</span>
                <span className="font-mono text-emerald-400">{algorithmMeta.complexity.best}</span>
              </div>
              <div>
                <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">Average Case</span>
                <span className="font-mono text-amber-400">{algorithmMeta.complexity.average}</span>
              </div>
              <div>
                <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">Worst Case</span>
                <span className="font-mono text-rose-400">{algorithmMeta.complexity.worst}</span>
              </div>
              <div>
                <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">Space</span>
                <span className="font-mono text-purple-400">{algorithmMeta.complexity.space}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <PseudoCodePanel code={algorithmMeta.pseudoCode} />
          </section>
        </div>

        {/* Right Column: Visualization & Playground */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-white">Interactive Playground</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm text-neutral-400">Array Size:</label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={datasetSize} 
                  onChange={(e) => setDatasetSize(Number(e.target.value))}
                  className="w-24 accent-blue-500"
                />
                <span className="text-sm font-mono text-white w-6">{datasetSize}</span>
                <Button variant="outline" size="sm" onClick={handleGenerate}>
                  Generate New
                </Button>
              </div>
            </div>

            <Visualizer 
              state={visState}
              onPlay={play}
              onPause={pause}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={reset}
              onSpeedChange={setSpeed}
            />

            {/* Current Step Description (Optional enhancement) */}
            {trace && visState.currentStep > 0 && visState.currentStep <= trace.operations.length && (
              <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5 text-sm text-neutral-300 text-center">
                {trace.operations[visState.currentStep - 1]?.description || 'Initializing...'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3">Advantages</h3>
              <ul className="list-disc list-inside text-sm text-emerald-400 space-y-2">
                {algorithmMeta.advantages.map((adv, i) => (
                  <li key={i}><span className="text-neutral-300">{adv}</span></li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3">Disadvantages</h3>
              <ul className="list-disc list-inside text-sm text-rose-400 space-y-2">
                {algorithmMeta.disadvantages.map((dis, i) => (
                  <li key={i}><span className="text-neutral-300">{dis}</span></li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
