import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {ApiOffer, Offer} from '../types/offer';
import api from '../services/api';
import reducer from './reducer';
import {
  fetchFavoriteOffers,
  loadOffers,
  loadOfferData,
  setFavoriteError,
  setAuthorizationStatus,
  setOfferDataLoading,
  toggleFavorite,
  updateFavoriteOffer,
} from './action';
import {AuthorizationStatus} from './authorization-status';
import {selectActiveOffer, selectFavoriteCount, selectOffersForCity, selectRawOffersForCity} from './selectors';

const cityLocation = {latitude: 48.85661, longitude: 2.351499, zoom: 12};
const location = {latitude: 48.85661, longitude: 2.351499, zoom: 10};

const detailedOffer: Offer = {
  id: 'offer-1',
  city: 'Paris',
  cityLocation,
  location,
  image: '/img/room.jpg',
  images: ['/img/room.jpg', '/img/kitchen.jpg'],
  price: 120,
  title: 'Quiet apartment',
  type: 'apartment',
  rating: 4.5,
  bedrooms: 2,
  maxAdults: 3,
  description: 'A complete description that must survive a favorite update.',
  goods: ['Wi-Fi'],
  host: {name: 'Alex', avatarUrl: '/img/host.jpg', isPro: true},
  isPremium: false,
  isFavorite: false,
};

const favoriteResponse: ApiOffer = {
  id: detailedOffer.id,
  city: {name: detailedOffer.city, location: cityLocation},
  location,
  previewImage: '/img/room.jpg',
  price: detailedOffer.price,
  title: detailedOffer.title,
  type: detailedOffer.type,
  rating: detailedOffer.rating,
  isPremium: detailedOffer.isPremium,
  isFavorite: true,
};

const unfavoriteResponse: ApiOffer = {
  ...favoriteResponse,
  isFavorite: false,
};

const createStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {extraArgument: api},
  }),
});

describe('favorite offer actions', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  afterEach(() => {
    mockApi.reset();
    localStorage.clear();
  });

  it('preserves detailed offer data when the favorite endpoint returns a summary', async () => {
    const store = createStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    store.dispatch(setOfferDataLoading(detailedOffer.id));
    store.dispatch(loadOfferData({
      offerId: detailedOffer.id,
      offer: detailedOffer,
      nearbyOffers: [],
      reviews: [],
    }));
    mockApi.onPost(`/favorite/${detailedOffer.id}/1`).reply(200, favoriteResponse);

    await store.dispatch(toggleFavorite(detailedOffer.id));

    expect(selectActiveOffer(store.getState())).toMatchObject({
      description: detailedOffer.description,
      images: detailedOffer.images,
      goods: detailedOffer.goods,
      host: detailedOffer.host,
      isFavorite: true,
    });
  });

  it('does not restore favorites from a response that arrives after logout', async () => {
    const store = createStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    let resolveResponse: ((response: [number, ApiOffer[]]) => void) | undefined;
    let notifyRequestStarted: (() => void) | undefined;
    const requestStarted = new Promise<void>((resolve) => {
      notifyRequestStarted = resolve;
    });
    mockApi.onGet('/favorite').reply(() => new Promise((resolve) => {
      resolveResponse = resolve;
      notifyRequestStarted?.();
    }));

    const request = store.dispatch(fetchFavoriteOffers());
    await requestStarted;
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    if (!resolveResponse) {
      throw new Error('Favorite request did not start.');
    }
    resolveResponse([200, [favoriteResponse]]);
    await request;
    expect(store.getState().favorites.favoriteOffers).toEqual([]);
  });

  it('memoizes city offers and preserves unaffected offer references after a favorite changes', () => {
    const store = createStore();
    const secondOffer = {...detailedOffer, id: 'offer-2'};
    store.dispatch(loadOffers([detailedOffer, secondOffer]));
    const firstSelection = selectOffersForCity(store.getState());
    const rawSelection = selectRawOffersForCity(store.getState());

    store.dispatch(setFavoriteError(null));
    expect(selectOffersForCity(store.getState())).toBe(firstSelection);

    store.dispatch(updateFavoriteOffer({...detailedOffer, isFavorite: true}));
    const updatedSelection = selectOffersForCity(store.getState());

    expect(updatedSelection).not.toBe(firstSelection);
    expect(updatedSelection[0]).not.toBe(firstSelection[0]);
    expect(updatedSelection[0].isFavorite).toBe(true);
    expect(updatedSelection[1]).toBe(firstSelection[1]);
    expect(selectRawOffersForCity(store.getState())).toBe(rawSelection);
  });

  it('adds and removes an offer from favorites and updates the favorite count', async () => {
    const store = createStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    store.dispatch(loadOffers([detailedOffer]));
    mockApi
      .onPost(`/favorite/${detailedOffer.id}/1`).reply(200, favoriteResponse)
      .onPost(`/favorite/${detailedOffer.id}/0`).reply(200, unfavoriteResponse);

    await store.dispatch(toggleFavorite(detailedOffer.id));
    expect(store.getState().favorites.favoriteOffers).toHaveLength(1);
    expect(selectFavoriteCount(store.getState())).toBe(1);
    expect(selectOffersForCity(store.getState())[0].isFavorite).toBe(true);

    await store.dispatch(toggleFavorite(detailedOffer.id));
    expect(store.getState().favorites.favoriteOffers).toHaveLength(0);
    expect(selectFavoriteCount(store.getState())).toBe(0);
    expect(selectOffersForCity(store.getState())[0].isFavorite).toBe(false);
  });

  it('loads the authorized user favorites from the server', async () => {
    const store = createStore();
    store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    mockApi.onGet('/favorite').reply(200, [favoriteResponse]);

    await store.dispatch(fetchFavoriteOffers());

    expect(store.getState().favorites.favoriteOffers).toHaveLength(1);
    expect(store.getState().favorites.favoriteOffers[0].id).toBe(detailedOffer.id);
    expect(selectFavoriteCount(store.getState())).toBe(1);
  });
});
