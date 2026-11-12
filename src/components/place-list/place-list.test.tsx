import {screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {renderWithProviders, testOffer} from '../../test-utils';
import PlaceList from './place-list';

describe('PlaceList', () => {
  it('renders one card for every offer', () => {
    const offers = [testOffer, {...testOffer, id: 'offer-2', title: 'Another apartment'}];
    renderWithProviders(<PlaceList offers={offers} onOfferHover={vi.fn()} />);

    expect(screen.getByRole('heading', {name: testOffer.title})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Another apartment'})).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
