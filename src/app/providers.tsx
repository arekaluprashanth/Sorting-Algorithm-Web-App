import React from 'react';
import { BenchmarkProvider } from '../features/benchmark';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BenchmarkProvider>{children}</BenchmarkProvider>;
};
