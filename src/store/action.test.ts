import {configureStore} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {ApiOffer, Offer} from '../types/offer';
import type {Review} from '../types/review';
import api, {TOKEN_KEY} from '../services/api';
import reducer from './reducer';
import {
  checkAuth,
  fetchFavoriteOffers,
  fetchOfferData,
  fetchOffers,
  login,
  logout,
  loadFavoriteOffers,
  loadOffers,
  loadOfferData,
  setFavoriteError,
  setAuthorizationStatus,
  setOfferDataLoading,
  toggleFavorite,
  updateFavoriteOffer,
  postReview,
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

const review: Review = {
  id: 'review-1',
  date: '2024-01-01T00:00:00.000Z',
  user: {name: 'Alex', avatarUrl: '/img/avatar.jpg', isPro: false},
  comment: 'A pleasant stay.',
  rating: 5,
};

const createStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {extraArgument: api},
  }),
});

const mockApi = new MockAdapter(api);

describe('favorite offer actions', () => {
  beforeEach(() => {
    mockApi.reset();
  });

  describe('authorization actions', () => {
    beforeEach(() => {
      mockApi.reset();
      localStorage.clear();
    });

    afterEach(() => {
      mockApi.reset();
      localStorage.clear();
    });

    it('checks the current session and stores the returned credentials', async () => {
      const store = createStore();
      mockApi
        .onGet('/login').reply(200, {email: 'guest@example.com', token: 'session-token'})
        .onGet('/favorite').reply(200, []);

      await store.dispatch(checkAuth());

      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(store.getState().user.userEmail).toBe('guest@example.com');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('session-token');
    });

    it('reports an authorization check failure without breaking the guest state', async () => {
      const store = createStore();
      mockApi.onGet('/login').reply(500, {message: 'Server unavailable'});

      await store.dispatch(checkAuth());

      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(store.getState().user.authorizationError).toBe('Server unavailable');
    });

    it('logs in and loads favorites after successful authentication', async () => {
      const store = createStore();
      mockApi
        .onPost('/login', {email: 'guest@example.com', password: 'pass123'})
        .reply(200, {email: 'guest@example.com', token: 'session-token'})
        .onGet('/favorite').reply(200, [favoriteResponse]);

      await store.dispatch(login({email: 'guest@example.com', password: 'pass123'}));

      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(store.getState().user.userEmail).toBe('guest@example.com');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('session-token');
    });

    it('clears the session and favorite data after logout', async () => {
      const store = createStore();
      store.dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      store.dispatch(loadFavoriteOffers([{...detailedOffer, isFavorite: true}]));
      localStorage.setItem(TOKEN_KEY, 'session-token');
      mockApi.onDelete('/logout').reply(200);

      await store.dispatch(logout());

      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(store.getState().favorites.favoriteOffers).toEqual([]);
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
  });

  afterEach(() => {
    mockApi.reset();
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

  describe('server data actions', () => {
    beforeEach(() => {
      mockApi.reset();
    });

    afterEach(() => {
      mockApi.reset();
    });

    it('loads offers and adapts server city and image fields', async () => {
      const store = createStore();
      mockApi.onGet('/offers').reply(200, [favoriteResponse]);

      await store.dispatch(fetchOffers());

      expect(store.getState().main.isOffersDataLoading).toBe(false);
      expect(store.getState().main.offers).toHaveLength(1);
      expect(store.getState().main.offers[0]).toMatchObject({
        city: 'Paris',
        cityLocation,
        image: '/img/room.jpg',
        images: ['/img/room.jpg'],
      });
    });

    it('stores the offers loading error and ends loading after a failed request', async () => {
      const store = createStore();
      mockApi.onGet('/offers').reply(500, {message: 'Server unavailable'});

      await store.dispatch(fetchOffers());

      expect(store.getState().main.isOffersDataLoading).toBe(false);
      expect(store.getState().main.offersLoadingError).toBe('Request failed with status code 500');
    });

    it('loads offer details, nearby offers and reviews together', async () => {
      const store = createStore();
      mockApi
        .onGet(`/offers/${detailedOffer.id}`).reply(200, favoriteResponse)
        .onGet(`/offers/${detailedOffer.id}/nearby`).reply(200, [favoriteResponse])
        .onGet(`/comments/${detailedOffer.id}`).reply(200, [review]);

      await store.dispatch(fetchOfferData(detailedOffer.id));

      expect(store.getState().offer.isOfferDataLoading).toBe(false);
      expect(store.getState().offer.offerDataId).toBe(detailedOffer.id);
      expect(store.getState().offer.activeOffer?.city).toBe('Paris');
      expect(store.getState().offer.nearbyOffers).toHaveLength(1);
      expect(store.getState().offer.reviews).toEqual([review]);
    });

    it('submits a review and clears the sending state on success', async () => {
      const store = createStore();
      store.dispatch(setOfferDataLoading(detailedOffer.id));
      mockApi.onPost(`/comments/${detailedOffer.id}`, {comment: review.comment, rating: review.rating}).reply(200, review);

      const result = await store.dispatch(postReview({
        offerId: detailedOffer.id,
        comment: review.comment,
        rating: review.rating,
      }));

      expect(result).toBe(true);
      expect(store.getState().offer.reviews).toEqual([review]);
      expect(store.getState().offer.isReviewSending).toBe(false);
      expect(store.getState().offer.reviewSendingError).toBeNull();
    });

    it('records a review error and clears the sending state on failure', async () => {
      const store = createStore();
      store.dispatch(setOfferDataLoading(detailedOffer.id));
      mockApi.onPost(`/comments/${detailedOffer.id}`).reply(400, {message: 'Invalid review'});

      const result = await store.dispatch(postReview({
        offerId: detailedOffer.id,
        comment: review.comment,
        rating: review.rating,
      }));

      expect(result).toBe(false);
      expect(store.getState().offer.reviews).toEqual([]);
      expect(store.getState().offer.isReviewSending).toBe(false);
      expect(store.getState().offer.reviewSendingError).toBe('Invalid review');
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
