import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/ui/Toast';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { BenchmarkProvider } from './BenchmarkProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <BenchmarkProvider>
            {children}
            <ToastProvider />
          </BenchmarkProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
