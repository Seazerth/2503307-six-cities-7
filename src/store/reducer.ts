import {createReducer} from '@reduxjs/toolkit';
import {
  changeCity,
  addReview,
  loadOffers,
  loadOfferData,
  setOfferDataError,
  setOfferDataLoading,
  setReviewSending,
  setReviewSendingError,
  setAuthorizationError,
  setAuthorizationStatus,
  setOffersDataLoading,
  setOffersLoadingError,
  setUserEmail
} from './action';
import type {Offer} from '../types/offer';
import type {Review} from '../types/review';
import {AuthorizationStatus} from './authorization-status';

export type AppState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  offersLoadingError: string | null;
  authorizationStatus: AuthorizationStatus;
  userEmail: string | null;
  authorizationError: string | null;
  activeOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  offerDataId: string | null;
  isOfferDataLoading: boolean;
  offerDataError: string | null;
  isOfferNotFound: boolean;
  isReviewSending: boolean;
  reviewSendingError: string | null;
};

const initialState: AppState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
  offersLoadingError: null,
  authorizationStatus: AuthorizationStatus.Unknown,
  userEmail: null,
  authorizationError: null,
  activeOffer: null,
  nearbyOffers: [],
  reviews: [],
  offerDataId: null,
  isOfferDataLoading: false,
  offerDataError: null,
  isOfferNotFound: false,
  isReviewSending: false,
  reviewSendingError: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
  builder
    .addCase(setOffersDataLoading, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(setOffersLoadingError, (state, action) => {
      state.offersLoadingError = action.payload;
    })
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserEmail, (state, action) => {
      state.userEmail = action.payload;
    })
    .addCase(setAuthorizationError, (state, action) => {
      state.authorizationError = action.payload;
    })
    .addCase(setOfferDataLoading, (state, action) => {
      state.offerDataId = action.payload;
      state.activeOffer = null;
      state.nearbyOffers = [];
      state.reviews = [];
      state.isOfferDataLoading = true;
      state.offerDataError = null;
      state.isOfferNotFound = false;
      state.isReviewSending = false;
      state.reviewSendingError = null;
    })
    .addCase(loadOfferData, (state, action) => {
      if (state.offerDataId !== action.payload.offerId) {
        return;
      }

      state.activeOffer = action.payload.offer;
      state.nearbyOffers = action.payload.nearbyOffers;
      state.reviews = action.payload.reviews;
      state.isOfferDataLoading = false;
    })
    .addCase(setOfferDataError, (state, action) => {
      if (state.offerDataId !== action.payload.offerId) {
        return;
      }

      state.isOfferDataLoading = false;
      state.offerDataError = action.payload.error;
      state.isOfferNotFound = action.payload.isNotFound;
    })
    .addCase(setReviewSending, (state, action) => {
      if (state.offerDataId === action.payload.offerId) {
        state.isReviewSending = action.payload.isSending;
      }
    })
    .addCase(setReviewSendingError, (state, action) => {
      if (state.offerDataId === action.payload.offerId) {
        state.reviewSendingError = action.payload.error;
      }
    })
    .addCase(addReview, (state, action) => {
      if (state.offerDataId === action.payload.offerId) {
        state.reviews.push(action.payload.review);
        state.reviews.sort((firstReview, secondReview) => Date.parse(secondReview.date) - Date.parse(firstReview.date));
      }
    });
});

export default reducer;
