import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithProviders, testOffer} from '../../test-utils';
import NearbyOfferList from './nearby-offer-list';

describe('NearbyOfferList', () => {
  it('renders nearby offer cards', () => {
    renderWithProviders(<NearbyOfferList offers={[testOffer]} />);

    expect(screen.getByRole('heading', {name: testOffer.title})).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('near-places__card');
  });
});
