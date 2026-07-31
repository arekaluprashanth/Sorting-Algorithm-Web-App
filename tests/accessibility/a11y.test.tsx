import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BenchmarkProvider } from '../../src/features/benchmark/context/benchmark-context';
import { BenchmarkPage } from '../../src/features/benchmark/pages/BenchmarkPage';

describe('Accessibility & Keyboard Navigation Tests', () => {
  it('should provide accessible buttons and role attributes', () => {
    render(
      <MemoryRouter>
        <BenchmarkProvider>
          <BenchmarkPage />
        </BenchmarkProvider>
      </MemoryRouter>
    );

    const runBtn = screen.getByRole('button', { name: /Run Benchmark/i });
    expect(runBtn).toBeInTheDocument();
    expect(runBtn).not.toBeDisabled();
  });
});
