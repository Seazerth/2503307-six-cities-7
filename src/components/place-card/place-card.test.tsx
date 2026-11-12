import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {renderWithProviders, testOffer} from '../../test-utils';
import PlaceCard from './place-card';

describe('PlaceCard', () => {
  it('renders offer details, premium mark and bookmark state', () => {
    renderWithProviders(<PlaceCard offer={testOffer} />);

    expect(screen.getByRole('heading', {name: testOffer.title})).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'To bookmarks'})).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('link', {name: 'Place image'})).toHaveAttribute('href', `/offer/${testOffer.id}`);
  });

  it('activates and clears the hovered offer', async () => {
    const user = userEvent.setup();
    const onOfferHover = vi.fn();
    renderWithProviders(<PlaceCard offer={testOffer} onOfferHover={onOfferHover} />);

    await user.hover(screen.getByRole('article'));
    expect(onOfferHover).toHaveBeenLastCalledWith(testOffer.id);

    await user.unhover(screen.getByRole('article'));
    expect(onOfferHover).toHaveBeenLastCalledWith(null);
  });
});
