import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsDashboard } from './ResultsDashboard';
import { mockSubmissions } from '../../resultsDashboardMockData';

describe('ResultsDashboard component', () => {
  const onAnalyze = jest.fn();

  it('renders fallback when there are no submissions', () => {
    render(<ResultsDashboard submissions={[]} onAnalyze={onAnalyze} />);
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share your funnel/i })).toBeInTheDocument();
  });

  it('renders submissions list and pagination controls', () => {
    // create 7 submissions by duplicating mock data
    const manySubmissions = Array.from({ length: 7 }, (_, i) => ({
      ...mockSubmissions[i % mockSubmissions.length],
      id: `sub-${i + 1}`,
    }));

    render(<ResultsDashboard submissions={manySubmissions} onAnalyze={onAnalyze} />);

    // first page should show first submission name
    const nameElements = screen.getAllByText(manySubmissions[0].contactInfo.name);
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
    expect(nameElements[0]).toBeInTheDocument();
    // pagination controls should be visible
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    // after clicking next, page 2 should be displayed
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
    // second page should contain the 6th submission (index 5)
    expect(screen.getByText(manySubmissions[5].contactInfo.name)).toBeInTheDocument();
  });
});
