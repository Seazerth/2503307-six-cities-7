import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import EmptyOffers from './empty-offers';

describe('EmptyOffers', () => {
  it('shows the empty state for the selected city', () => {
    render(<EmptyOffers city="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/in Paris/)).toBeInTheDocument();
  });
});
