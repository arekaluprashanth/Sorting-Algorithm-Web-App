import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../components/error/EmptyState';
import { PageHeader } from '../components/layout/PageHeader';
import { ContentContainer } from '../components/layout/ContentContainer';

export const ReportsPage: React.FC = () => {
  return (
    <ContentContainer>
      <PageHeader
        title="Reports & Export Analytics"
        subtitle="Generate, format, and export performance reports."
      />

      <EmptyState
        title="No Reports Generated"
        description="Detailed analytics reports, CSV/JSON/PDF export features, and comparative chart summaries will appear here after benchmark runs."
        icon={BarChart3}
      />
    </ContentContainer>
  );
};
