import {createSelector} from '@reduxjs/toolkit';
import type {AppState} from './reducer';

export const selectCity = (state: AppState) => state.city;
export const selectOffers = (state: AppState) => state.offers;
export const selectIsOffersDataLoading = (state: AppState) => state.isOffersDataLoading;
export const selectOffersLoadingError = (state: AppState) => state.offersLoadingError;
export const selectAuthorizationStatus = (state: AppState) => state.authorizationStatus;
export const selectUserEmail = (state: AppState) => state.userEmail;
export const selectAuthorizationError = (state: AppState) => state.authorizationError;

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city === city)
);

export const selectFavoriteOffers = createSelector(
  [selectOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);
