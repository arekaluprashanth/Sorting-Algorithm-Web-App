import { useState, useMemo } from 'react';
import { ALGORITHM_CONTENT } from '../data/algorithm-content';
import type { AlgorithmMetadata } from '../types';

export function useLearningCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const allAlgorithms = useMemo(() => Object.values(ALGORITHM_CONTENT), []);

  const filteredAlgorithms = useMemo(() => {
    return allAlgorithms.filter(algo => {
      const matchesSearch = algo.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
                         || algo.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || algo.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allAlgorithms, searchQuery, filterCategory]);

  const getAlgorithmById = (id: string): AlgorithmMetadata | undefined => {
    return ALGORITHM_CONTENT[id];
  };

  const getRecommendations = (): AlgorithmMetadata[] => {
    // A simple recommendation engine. Could be expanded to use history data.
    return [
      ALGORITHM_CONTENT['quick-sort'],
      ALGORITHM_CONTENT['merge-sort'],
      ALGORITHM_CONTENT['insertion-sort'],
    ].filter(Boolean) as AlgorithmMetadata[];
  };

  return {
    allAlgorithms,
    filteredAlgorithms,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    getAlgorithmById,
    getRecommendations,
  };
}
