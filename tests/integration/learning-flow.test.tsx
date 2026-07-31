import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearningDashboardPage } from '../../src/pages/LearningDashboardPage';

describe('Learning Center Integration', () => {
  it('should render learning center catalog and comparison table', { timeout: 15000 }, () => {
    render(
      <MemoryRouter>
        <LearningDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Learning Center')).toBeInTheDocument();
    expect(screen.getByText('Algorithm Catalog')).toBeInTheDocument();
    expect(screen.getByText('Theoretical Complexity Comparison')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search algorithms/i)).toBeInTheDocument();
  });
});
