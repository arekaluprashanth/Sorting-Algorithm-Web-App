import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BenchmarkProvider } from '../../src/features/benchmark/context/benchmark-context';
import { BenchmarkPage } from '../../src/features/benchmark/pages/BenchmarkPage';

describe('Benchmark Studio Workflow Integration', () => {
  it('should render dataset studio controls, algorithm selectors, and action controls', () => {
    render(
      <MemoryRouter>
        <BenchmarkProvider>
          <BenchmarkPage />
        </BenchmarkProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Algorithm Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Engine Performance & Resource Estimates/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Benchmark/i })).toBeInTheDocument();
  });
});
