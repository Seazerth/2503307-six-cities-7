import {createSelector} from '@reduxjs/toolkit';
import type {AppState} from './reducer';

export const selectCity = (state: AppState) => state.city;
export const selectOffers = (state: AppState) => state.offers;
export const selectIsOffersDataLoading = (state: AppState) => state.isOffersDataLoading;
export const selectOffersLoadingError = (state: AppState) => state.offersLoadingError;
export const selectAuthorizationStatus = (state: AppState) => state.authorizationStatus;
export const selectUserEmail = (state: AppState) => state.userEmail;
export const selectAuthorizationError = (state: AppState) => state.authorizationError;
export const selectActiveOffer = (state: AppState) => state.activeOffer;
export const selectNearbyOffers = (state: AppState) => state.nearbyOffers;
export const selectReviews = (state: AppState) => state.reviews;
export const selectOfferDataId = (state: AppState) => state.offerDataId;
export const selectIsOfferDataLoading = (state: AppState) => state.isOfferDataLoading;
export const selectOfferDataError = (state: AppState) => state.offerDataError;
export const selectIsOfferNotFound = (state: AppState) => state.isOfferNotFound;
export const selectIsReviewSending = (state: AppState) => state.isReviewSending;
export const selectReviewSendingError = (state: AppState) => state.reviewSendingError;

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city)
);

export const selectFavoriteOffers = createSelector(
  [selectOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);
