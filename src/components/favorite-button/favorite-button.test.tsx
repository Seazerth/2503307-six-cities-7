import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {ApiOffer} from '../../types/offer';
import api from '../../services/api';
import {AuthorizationStatus} from '../../store/authorization-status';
import {loadOffers, setAuthorizationStatus} from '../../store/action';
import {createTestStore, testOffer} from '../../test-utils';
import FavoriteButton from './favorite-button';

function CurrentPath() {
  const location = useLocation();
  return <p>Current path: {location.pathname}</p>;
}

describe('FavoriteButton', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('redirects a guest to login when the bookmark is selected', async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={(
                <>
                  <FavoriteButton
                    offerId={testOffer.id}
                    isFavorite={false}
                    className="bookmark"
                    iconClassName="bookmark-icon"
                    iconWidth={18}
                    iconHeight={19}
                  />
                  <CurrentPath />
                </>
              )}
            />
            <Route path="/login" element={<><h1>Login</h1><CurrentPath /></>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByRole('button', {name: 'To bookmarks'}));

    expect(screen.getByRole('heading', {name: 'Login'})).toBeInTheDocument();
    expect(screen.getByText('Current path: /login')).toBeInTheDocument();
  });

  it('shows the active bookmark state when the offer is saved', () => {
    render(
      <MemoryRouter>
        <Provider store={createTestStore()}>
          <FavoriteButton
            offerId={testOffer.id}
            isFavorite
            className="bookmark"
            iconClassName="bookmark-icon"
            iconWidth={18}
            iconHeight={19}
          />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', {name: 'In bookmarks'})).toHaveAttribute('aria-pressed', 'true');
  });

  it('sends an add-to-favorites request for an authorized user', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    const apiOffer: ApiOffer = {
      id: testOffer.id,
      city: {name: testOffer.city, location: testOffer.cityLocation},
      location: testOffer.location,
      previewImage: testOffer.image,
      price: testOffer.price,
      title: testOffer.title,
      type: testOffer.type,
      rating: testOffer.rating,
      isPremium: testOffer.isPremium,
      isFavorite: true,
    };
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    store.dispatch(loadOffers([testOffer]));
    mockApi.onPost(`/favorite/${testOffer.id}/1`).reply(200, apiOffer);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteButton
            offerId={testOffer.id}
            isFavorite={false}
            className="bookmark"
            iconClassName="bookmark-icon"
            iconWidth={18}
            iconHeight={19}
          />
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByRole('button', {name: 'To bookmarks'}));

    await waitFor(() => {
      expect(store.getState().favorites.favoriteOffers).toHaveLength(1);
    });
  });
});
