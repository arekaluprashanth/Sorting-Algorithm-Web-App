import React, { createContext, useContext, useMemo } from 'react';

interface BenchmarkContextType {
  isBenchmarkReady: boolean;
}

export const BenchmarkContext = createContext<BenchmarkContextType>({
  isBenchmarkReady: false,
});

export const BenchmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ isBenchmarkReady: false }), []);
  return <BenchmarkContext.Provider value={value}>{children}</BenchmarkContext.Provider>;
};

export function useBenchmarkState() {
  return useContext(BenchmarkContext);
}
