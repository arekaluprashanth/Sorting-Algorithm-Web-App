import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/ui/Toast';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { BenchmarkProvider } from './BenchmarkProvider';
import { HistoryProvider } from '../features/history/context';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <HistoryProvider>
            <BenchmarkProvider>
              {children}
              <ToastProvider />
            </BenchmarkProvider>
          </HistoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
