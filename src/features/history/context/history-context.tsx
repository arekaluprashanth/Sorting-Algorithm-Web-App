/**
 * HistoryContext — React context sharing history state across the app.
 *
 * Wraps useHistory so that the BenchmarkPage (auto-save) and HistoryPage
 * (list/manage) share the same in-memory session list.
 */
import React, { createContext, useContext } from 'react';
import { useHistory } from '../hooks/useHistory';

type HistoryContextType = ReturnType<typeof useHistory>;

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const history = useHistory();
  return <HistoryContext.Provider value={history}>{children}</HistoryContext.Provider>;
};

export function useHistoryContext(): HistoryContextType {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return ctx;
}
