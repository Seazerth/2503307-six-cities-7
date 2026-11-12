import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {loadFavoriteOffers} from '../../store/action';
import {createTestStore, renderWithProviders, testOffer} from '../../test-utils';
import FavoritesPage from './favorites-page';

describe('FavoritesPage', () => {
  it('renders the empty favorites state', () => {
    renderWithProviders(<FavoritesPage />);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByText(/Save properties to narrow down search/)).toBeInTheDocument();
  });

  it('groups saved offers by city and links back to the selected city', () => {
    const store = createTestStore();
    store.dispatch(loadFavoriteOffers([
      {...testOffer, isFavorite: true},
      {...testOffer, id: 'offer-2', title: 'Amsterdam apartment', city: 'Amsterdam', isFavorite: true},
    ]));
    renderWithProviders(<FavoritesPage />, {store});

    expect(screen.getByRole('heading', {name: 'Saved listing'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Paris'})).toHaveAttribute('href', '/?city=Paris');
    expect(screen.getByRole('link', {name: 'Amsterdam'})).toHaveAttribute('href', '/?city=Amsterdam');
    expect(screen.getByRole('heading', {name: testOffer.title})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Amsterdam apartment'})).toBeInTheDocument();
  });
});
