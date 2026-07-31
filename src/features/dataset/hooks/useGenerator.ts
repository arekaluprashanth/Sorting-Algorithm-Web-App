import { useState, useCallback } from 'react';
import type { DatasetOptions, GenerationResult } from '../types';
import { DatasetGenerator } from '../generators';
import { toast } from '../../../components/ui/Toast';

/**
 * Custom hook isolating generation business logic, loading states, and user notifications.
 */
export function useGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<GenerationResult | null>(null);

  const generate = useCallback(async (options: DatasetOptions): Promise<GenerationResult> => {
    setIsGenerating(true);

    try {
      // Yield to UI thread to allow spinner rendering
      await new Promise((resolve) => setTimeout(resolve, 30));

      const result = DatasetGenerator.generate(options);
      setLastResult(result);

      if (result.success) {
        toast.success(
          `Generated ${result.data.length.toLocaleString()} elements in ${result.statistics.generationDurationMs.toFixed(1)}ms`
        );
      } else {
        toast.error(result.error || 'Dataset generation failed.');
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unexpected generation error';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generate,
    isGenerating,
    lastResult,
  };
}
