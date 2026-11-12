import {describe, expect, it} from 'vitest';
import type {Offer} from '../../types/offer';
import type {Review} from '../../types/review';
import {
  addReview,
  changeCity,
  clearFavorites,
  loadFavoriteOffers,
  loadOfferData,
  loadOffers,
  setAuthorizationError,
  setAuthorizationStatus,
  setFavoriteError,
  setFavoritesError,
  setFavoritesLoading,
  setOfferDataError,
  setOfferDataLoading,
  setOffersDataLoading,
  setOffersLoadingError,
  setReviewSending,
  setReviewSendingError,
  setUserEmail,
  updateFavoriteOffer,
} from '../action';
import {AuthorizationStatus} from '../authorization-status';
import favoritesReducer from './favorites-reducer';
import mainReducer from './main-reducer';
import offerReducer from './offer-reducer';
import userReducer from './user-reducer';

const offer: Offer = {
  id: 'offer-1',
  city: 'Paris',
  cityLocation: {latitude: 48.85661, longitude: 2.351499, zoom: 12},
  location: {latitude: 48.85661, longitude: 2.351499, zoom: 10},
  image: '/img/room.jpg',
  images: ['/img/room.jpg'],
  price: 120,
  title: 'Quiet apartment',
  type: 'apartment',
  rating: 4.5,
  isPremium: false,
  isFavorite: false,
};

const secondOffer: Offer = {...offer, id: 'offer-2', isFavorite: true};

const review: Review = {
  id: 'review-1',
  date: '2024-01-01T00:00:00.000Z',
  user: {name: 'Alex', avatarUrl: '/img/avatar.jpg', isPro: false},
  comment: 'A pleasant stay.',
  rating: 5,
};

describe('mainReducer', () => {
  it('returns the initial state', () => {
    expect(mainReducer(undefined, {type: 'unknown'})).toEqual({
      city: 'Paris',
      offers: [],
      isOffersDataLoading: false,
      offersLoadingError: null,
    });
  });

  it('handles city, offers, loading and error actions', () => {
    let state = mainReducer(undefined, {type: 'unknown'});
    state = mainReducer(state, changeCity('Amsterdam'));
    state = mainReducer(state, loadOffers([offer]));
    state = mainReducer(state, setOffersDataLoading(true));
    state = mainReducer(state, setOffersLoadingError('Network error'));

    expect(state).toEqual({
      city: 'Amsterdam',
      offers: [offer],
      isOffersDataLoading: true,
      offersLoadingError: 'Network error',
    });
    expect(mainReducer(state, setOffersLoadingError(null)).offersLoadingError).toBeNull();
    expect(mainReducer(state, setOffersDataLoading(false)).isOffersDataLoading).toBe(false);
  });
});

describe('userReducer', () => {
  it('returns the initial state', () => {
    expect(userReducer(undefined, {type: 'unknown'})).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: null,
      authorizationError: null,
    });
  });

  it('handles authorization, email and authorization error actions', () => {
    let state = userReducer(undefined, {type: 'unknown'});
    state = userReducer(state, setAuthorizationStatus(AuthorizationStatus.Auth));
    state = userReducer(state, setUserEmail('guest@example.com'));
    state = userReducer(state, setAuthorizationError('Login failed'));

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'guest@example.com',
      authorizationError: 'Login failed',
    });
    expect(userReducer(state, setAuthorizationStatus(AuthorizationStatus.NoAuth)).authorizationStatus)
      .toBe(AuthorizationStatus.NoAuth);
    expect(userReducer(state, setUserEmail(null)).userEmail).toBeNull();
    expect(userReducer(state, setAuthorizationError(null)).authorizationError).toBeNull();
  });
});

describe('offerReducer', () => {
  it('returns the initial state', () => {
    expect(offerReducer(undefined, {type: 'unknown'})).toEqual({
      activeOffer: null,
      nearbyOffers: [],
      reviews: [],
      offerDataId: null,
      isOfferDataLoading: false,
      offerDataError: null,
      isOfferNotFound: false,
      isReviewSending: false,
      reviewSendingError: null,
    });
  });

  it('resets offer data when loading a different offer', () => {
    const state = offerReducer(undefined, setOfferDataLoading('offer-1'));

    expect(state.offerDataId).toBe('offer-1');
    expect(state.isOfferDataLoading).toBe(true);
    expect(state.activeOffer).toBeNull();
    expect(state.nearbyOffers).toEqual([]);
    expect(state.reviews).toEqual([]);
    expect(state.offerDataError).toBeNull();
    expect(state.isOfferNotFound).toBe(false);
    expect(state.isReviewSending).toBe(false);
    expect(state.reviewSendingError).toBeNull();
  });

  it('loads the matching offer data and ignores stale responses', () => {
    const payload = {
      offerId: 'offer-1',
      offer,
      nearbyOffers: [secondOffer],
      reviews: [review],
    };
    const loadingState = offerReducer(undefined, setOfferDataLoading('offer-1'));
    const loadedState = offerReducer(loadingState, loadOfferData(payload));

    expect(loadedState.activeOffer).toEqual(offer);
    expect(loadedState.nearbyOffers).toEqual([secondOffer]);
    expect(loadedState.reviews).toEqual([review]);
    expect(loadedState.isOfferDataLoading).toBe(false);
    expect(offerReducer(loadingState, loadOfferData({...payload, offerId: 'stale'}))).toBe(loadingState);
  });

  it('sets only matching offer errors and distinguishes not-found responses', () => {
    const loadingState = offerReducer(undefined, setOfferDataLoading('offer-1'));
    const notFoundState = offerReducer(loadingState, setOfferDataError({
      offerId: 'offer-1',
      error: 'Not found',
      isNotFound: true,
    }));

    expect(notFoundState.isOfferDataLoading).toBe(false);
    expect(notFoundState.offerDataError).toBe('Not found');
    expect(notFoundState.isOfferNotFound).toBe(true);
    expect(offerReducer(loadingState, setOfferDataError({
      offerId: 'stale',
      error: 'Stale error',
      isNotFound: false,
    }))).toBe(loadingState);
  });

  it('tracks review sending, errors and submitted reviews for the active offer', () => {
    const loadingState = offerReducer(undefined, setOfferDataLoading('offer-1'));
    const sendingState = offerReducer(loadingState, setReviewSending({offerId: 'offer-1', isSending: true}));
    const errorState = offerReducer(sendingState, setReviewSendingError({offerId: 'offer-1', error: 'Failed'}));
    const submittedState = offerReducer(errorState, addReview({offerId: 'offer-1', review}));

    expect(sendingState.isReviewSending).toBe(true);
    expect(errorState.reviewSendingError).toBe('Failed');
    expect(submittedState.reviews).toEqual([review]);
    expect(offerReducer(loadingState, addReview({offerId: 'stale', review}))).toBe(loadingState);
  });
});

describe('favoritesReducer', () => {
  it('returns the initial state', () => {
    expect(favoritesReducer(undefined, {type: 'unknown'})).toEqual({
      favoriteOffers: [],
      isFavoritesLoading: false,
      favoritesError: null,
      favoriteError: null,
    });
  });

  it('loads favorites and updates loading and error states', () => {
    let state = favoritesReducer(undefined, setFavoritesLoading(true));
    state = favoritesReducer(state, setFavoritesError('Request failed'));
    state = favoritesReducer(state, loadFavoriteOffers([offer]));

    expect(state.favoriteOffers).toEqual([offer]);
    expect(state.favoritesError).toBeNull();
    expect(favoritesReducer(state, setFavoritesLoading(false)).isFavoritesLoading).toBe(false);
    expect(favoritesReducer(state, setFavoriteError('Update failed')).favoriteError).toBe('Update failed');
  });

  it('adds or removes an updated offer and clears favorite state', () => {
    const loadedState = favoritesReducer(undefined, loadFavoriteOffers([offer]));
    const addedState = favoritesReducer(loadedState, updateFavoriteOffer(secondOffer));
    const removedState = favoritesReducer(addedState, updateFavoriteOffer({...secondOffer, isFavorite: false}));
    const errorState = favoritesReducer(removedState, setFavoriteError('Error'));
    const clearedState = favoritesReducer(errorState, clearFavorites());

    expect(addedState.favoriteOffers).toEqual([offer, secondOffer]);
    expect(removedState.favoriteOffers).toEqual([offer]);
    expect(clearedState.favoriteOffers).toEqual([]);
    expect(clearedState.favoritesError).toBeNull();
    expect(clearedState.favoriteError).toBeNull();
  });
});
