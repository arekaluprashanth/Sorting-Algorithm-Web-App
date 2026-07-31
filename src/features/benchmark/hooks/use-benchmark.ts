import { useContext } from 'react';
import { BenchmarkContext } from '../context/benchmark-context';

export function useBenchmark() {
  const context = useContext(BenchmarkContext);
  if (!context) {
    throw new Error('useBenchmark must be used within a BenchmarkProvider');
  }
  return context;
}
