import {createReducer} from '@reduxjs/toolkit';
import {
  addReview,
  loadOfferData,
  setOfferDataError,
  setOfferDataLoading,
  setReviewSending,
  setReviewSendingError,
} from '../action';
import type {Offer} from '../../types/offer';
import type {Review} from '../../types/review';

export type OfferState = {
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

const initialState: OfferState = {
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

const offerReducer = createReducer(initialState, (builder) => {
  builder
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
      }
    });
});

export default offerReducer;
