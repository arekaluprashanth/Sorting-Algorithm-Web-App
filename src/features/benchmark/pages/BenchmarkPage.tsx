import React from 'react';
import { useBenchmark } from '../hooks/use-benchmark';
import { DatasetConfigComponent } from '../../dataset/components/DatasetConfig';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { BenchmarkControls } from '../components/BenchmarkControls';
import { ResultsPanel } from '../components/ResultsPanel';

export const BenchmarkPage: React.FC = () => {
  const {
    selectedAlgorithms,
    setSelectedAlgorithms,
    setDataset,
    setDatasetConfig,
    currentSession,
  } = useBenchmark();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Step 1: Dataset Generation */}
      <DatasetConfigComponent
        onDatasetGenerated={(newDataset, config) => {
          setDataset(newDataset);
          setDatasetConfig(config);
        }}
      />

      {/* Step 2: Algorithm Selection */}
      <AlgorithmSelector
        selectedIds={selectedAlgorithms}
        onChange={setSelectedAlgorithms}
      />

      {/* Step 3: Run Action Controls */}
      <BenchmarkControls />

      {/* Step 4: Results Display */}
      <ResultsPanel session={currentSession} />
    </div>
  );
};
