import {StrictMode} from 'react';
import {Provider} from 'react-redux';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ApiOffer} from '../../types/offer';
import api, {TOKEN_KEY} from '../../services/api';
import {checkAuth, fetchOffers} from '../../store/action';
import {createTestStore} from '../../test-utils';
import App from './app';

vi.mock('../map/map', () => ({default: () => <div data-testid="map" />}));

const cityLocation = {latitude: 48.85661, longitude: 2.351499, zoom: 12};
const offerLocation = {latitude: 48.85861, longitude: 2.350499, zoom: 16};

const parisOffer: ApiOffer = {
  id: 'paris-offer',
  city: {name: 'Paris', location: cityLocation},
  location: offerLocation,
  previewImage: '/img/paris.jpg',
  images: ['/img/paris.jpg'],
  price: 120,
  title: 'Paris apartment',
  type: 'apartment',
  rating: 4.5,
  bedrooms: 2,
  maxAdults: 3,
  description: 'A pleasant apartment in Paris.',
  goods: ['Wi-Fi'],
  host: {name: 'Alex', avatarUrl: '/img/avatar.jpg', isPro: true},
  isPremium: false,
  isFavorite: false,
};

const amsterdamOffer: ApiOffer = {
  ...parisOffer,
  id: 'amsterdam-offer',
  city: {name: 'Amsterdam', location: cityLocation},
  title: 'Amsterdam apartment',
};

describe('App integration', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  it('loads the main page, changes city and opens a real offer route', async () => {
    mockApi
      .onGet('/offers').reply(200, [parisOffer, amsterdamOffer])
      .onGet('/login').reply(401)
      .onGet('/offers/amsterdam-offer').reply(200, amsterdamOffer)
      .onGet('/offers/amsterdam-offer/nearby').reply(200, [])
      .onGet('/comments/amsterdam-offer').reply(200, []);

    const store = createTestStore();
    store.dispatch(fetchOffers());
    store.dispatch(checkAuth());

    render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>
    );

    expect(await screen.findByRole('heading', {name: 'Paris apartment'})).toBeInTheDocument();
    expect(screen.getByText('1 place to stay in Paris')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');

    fireEvent.click(screen.getByRole('link', {name: 'Amsterdam'}));
    expect(await screen.findByText('1 place to stay in Amsterdam')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Amsterdam apartment'})).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', {name: 'Amsterdam apartment'}));
    expect(await screen.findByRole('heading', {name: 'Amsterdam apartment'})).toBeInTheDocument();
    expect(await screen.findByText('A pleasant apartment in Paris.')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockApi.history.get.some((request) => request.url === '/offers/amsterdam-offer')).toBe(true);
    });
  });

  it('signs in, opens favorites and signs out through the shared header', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/login');
    mockApi
      .onGet('/login').reply(401)
      .onPost('/login', {email: 'guest@example.com', password: 'pass123'})
      .reply(200, {email: 'guest@example.com', token: 'test-token'})
      .onGet('/favorite').reply(200, [{...parisOffer, isFavorite: true}])
      .onPost('/favorite/paris-offer/0').reply(200, {...parisOffer, isFavorite: false})
      .onDelete('/logout').reply(200);

    const store = createTestStore();
    await store.dispatch(checkAuth());
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await user.type(screen.getByLabelText('E-mail'), 'guest@example.com');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByRole('button', {name: 'Sign in'}));

    expect(await screen.findByText('guest@example.com')).toBeInTheDocument();
    expect(await screen.findByText('1')).toHaveClass('header__favorite-count');
    await user.click(screen.getByRole('link', {name: /guest@example.com/}));
    expect(await screen.findByRole('heading', {name: 'Saved listing'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Paris apartment'})).toBeInTheDocument();
    await user.click(screen.getByRole('button', {name: 'In bookmarks'}));
    expect(await screen.findByText('Nothing yet saved.')).toBeInTheDocument();
    expect(await screen.findByText('0')).toHaveClass('header__favorite-count');

    await user.click(screen.getByRole('button', {name: 'Sign out'}));
    expect(await screen.findByRole('heading', {name: 'Sign in'})).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(store.getState().favorites.favoriteOffers).toEqual([]);
  });
});
