import React from 'react';
import { useDataset } from '../hooks/useDataset';
import { DatasetGenerationPanel } from './DatasetGenerationPanel';
import { DatasetPreviewCard } from './DatasetPreviewCard';
import { DatasetStatsDisplay } from './DatasetStatsDisplay';
import { ContentContainer } from '../../../components/layout/ContentContainer';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Badge } from '../../../components/ui/Badge';

export const DatasetStudio: React.FC = () => {
  const {
    options,
    setOptions,
    handleGenerate,
    handleReset,
    randomizeSeed,
    isGenerating,
    dataset,
    statistics,
  } = useDataset();

  return (
    <ContentContainer>
      <PageHeader
        title="Dataset Generation Engine"
        subtitle="Generate, validate, and analyze benchmark datasets up to 1,000,000 elements across 7 distribution strategies."
        action={<Badge variant="success">Engine Ready</Badge>}
      />

      <div className="space-y-6">
        {/* Controls Panel */}
        <DatasetGenerationPanel
          options={options}
          onChange={setOptions}
          onGenerate={handleGenerate}
          onReset={handleReset}
          onRandomizeSeed={randomizeSeed}
          isGenerating={isGenerating}
        />

        {/* Real-time Statistics Cards */}
        <DatasetStatsDisplay stats={statistics} />

        {/* Array Elements Preview Card & Modal */}
        <DatasetPreviewCard data={dataset} />
      </div>
    </ContentContainer>
  );
};
